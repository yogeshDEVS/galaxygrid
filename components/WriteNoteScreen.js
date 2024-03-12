import React, { useRef, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions ,TextInput, Animated, Easing, KeyboardAvoidingView, Platform, ScrollView} from 'react-native';
import { RichEditor, RichToolbar } from 'react-native-pell-rich-editor';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import { useNavigation } from '@react-navigation/native';

const { width, height } = Dimensions.get('window');

const WriteNoteScreen = () => {
  const richText = useRef(); // Reference to the RichEditor
  const [title, setTitle] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const navigation = useNavigation();

  const [isSaved, setIsSaved] = useState(false);
  const [fadeAnim] = useState(new Animated.Value(0)); // Initial value for opacity: 0
  const handleSaveNote = async () => {
    const text = await richText.current.getContentHtml(); // Get the rich text content
    const userId = auth().currentUser.uid;
    firestore()
  .collection('users')
  .doc(userId)
  .collection('notes')
  .add({
    title: title,
    subtitle: subtitle,
    text: text,
    createdAt: firestore.FieldValue.serverTimestamp(),
  })
  .then((noteRef) => {
    console.log('Note added!');
    setIsSaved(true);
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 3000,
      easing: Easing.linear,
      useNativeDriver: true,
    }).start(() => {
      setTimeout(() => {
        setIsSaved(false);
        fadeAnim.setValue(0);
        // Add a delay before navigating to the SavedNote screen
        setTimeout(() => {
          noteRef.get().then((noteSnapshot) => {
            const noteData = noteSnapshot.data();
            navigation.navigate('CollectionScreen', { title, subtitle, text, noteId: noteRef.id, createdAt: noteData.createdAt });
          });
        }, 1000);  // Delay for 1 second
      }, 2000);
    });
  });

    
  };
  

  return (
    <KeyboardAvoidingView 
    style={styles.container}
    behavior={Platform.OS === "ios" ? "padding" : "height"}
  >
    <ScrollView>
      <Text style={styles.header}>Write Note</Text>
      <Text style={styles.label}>Title</Text>
      <TextInput style={styles.input} placeholder="Enter title" value={title} onChangeText={setTitle} />
      <Text style={styles.label}>Subtitle</Text>
      <TextInput style={styles.input} placeholder="Enter subtitle" value={subtitle} onChangeText={setSubtitle} />
      <Text style={styles.label}>Text</Text>
      <View style={styles.richInputContainer}>
        <RichEditor
          style={{color:'black'}}
          ref={richText}
          placeholder="Type here..."
        />
      </View>
      <RichToolbar editor={richText} /> 
      <TouchableOpacity style={styles.saveButton} onPress={handleSaveNote}>
        <Text style={styles.saveButtonText}>SAVE NOTE</Text>
      </TouchableOpacity>
      
    </ScrollView>
    {isSaved && 
        <Animated.View style={{...styles.promptContainer, opacity: fadeAnim}}>
          <Text style={styles.promptText}>Your note is added in collection, visit collection to see the note.</Text>
        </Animated.View>
      }
  </KeyboardAvoidingView>

  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: width * 0.05, // 5% of screen width
    backgroundColor: '#fff',
  },
 
  header: {
    fontSize: width * 0.049, // 4.25% of screen width
    alignSelf: 'center',
    color: '#434343',
    marginBottom: height * 0.02, // 26% of screen height
  },
  label: {
    fontSize: width * 0.045, // 4.5% of screen width
    marginBottom: height * 0.01, // 1% of screen height
    color: '#434343',
  },
  input: {
    height: height * 0.05, // 5% of screen height
    borderBottomWidth: 2, // Increased border width
    borderColor: 'darkblue', // Changed border color to dark blue
    marginBottom: height * 0.02, // 2% of screen height
    paddingLeft: width * 0.025, // 2.5% of screen width
    color:'black'
  },
  saveButton: {
    height: height * 0.05, // 5% of screen height
    width: width * 0.85,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 25,
    backgroundColor: 'darkblue', // Changed to dark blue
    alignSelf:'center',
    marginTop: height * 0.02,
    shadowColor: '#000', // Added shadow
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    
  },
  saveButtonText: {
    color: '#fff',
    fontSize: width * 0.04, // 4% of screen width
    fontWeight: '600',
  },
  headerTitle: {
    fontSize: width * 0.043, 
    alignSelf:'center',
    color:'#434343',
    marginRight: width * 0.305,
  },
  richInputContainer: {
    height: height * 0.32, // 80% of screen height
    borderBottomWidth: 2, // Increased border width
    borderColor: 'darkblue', // Changed border color to dark blue
    marginBottom: height * 0.02, // 2% of screen height
    paddingLeft: width * 0.025, // 2.5% of screen width
  },
  promptContainer: {
    position: 'absolute',
    top: height * 0.85,
     // 15% from the bottom
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center'
  },
  promptText: {
    fontSize: width * 0.04, // 3% of screen width
    color: 'black',
  },
  
});

export default WriteNoteScreen;
