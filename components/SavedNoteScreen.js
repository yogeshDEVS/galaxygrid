import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, TextInput } from 'react-native';
import { useNavigation } from '@react-navigation/native'; 
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';

const SavedNoteScreen = ({ route }) => {
  const { title: initialTitle, subtitle: initialSubtitle, text: initialText, createdAt } = route.params;
  const [title, setTitle] = useState(initialTitle);
  const [subtitle, setSubtitle] = useState(initialSubtitle);
  const [text, setText] = useState(initialText.replace(/<\/?div>/g, ''));
  const [isEditing, setIsEditing] = useState(false);
  const navigation = useNavigation(); 

  const handleSave = async () => {
    const userId = auth().currentUser.uid;
    // Assuming you have the noteId passed in route.params
    const { noteId } = route.params;
    await firestore()
      .collection('users')
      .doc(userId)
      .collection('notes')
      .doc(noteId)
      .update({
        title,
        subtitle,
        text,
      });
    setIsEditing(false);
  };

  return (
    <View style={styles.container}>
      <View style={styles.noteContainer}>
        {isEditing ? (
          <>
            <TextInput style={styles.title} value={title} onChangeText={setTitle} />
            <TextInput style={styles.subtitle} value={subtitle} onChangeText={setSubtitle} />
            <TextInput style={styles.text} value={text} onChangeText={setText} multiline />
          </>
        ) : (
          <>
            <Text style={styles.title}>{title}</Text>
            <Text style={styles.subtitle}>{subtitle}</Text>
            <Text style={styles.text}>{text}</Text>
            <Text style={styles.date}>{createdAt ? createdAt.toDate().toLocaleDateString() : 'No date'}</Text>

          </>
        )}
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={isEditing ? handleSave : () => setIsEditing(true)}>
          <Text style={styles.buttonText}>{isEditing ? 'Save Note' : 'Edit Note'}</Text>
        </TouchableOpacity>

        <View style={styles.iconContainer}>
          <TouchableOpacity onPress={() => navigation.navigate('CollectionScreen')}>
            <Image source={require('../assets/collection.png')} style={styles.icon} />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#F0F0F0',
  },
  noteContainer: {  
    backgroundColor: 'white',
    borderRadius: 5,
    padding: 16,
    marginBottom: 16,
  },
  date:{
   color:'black'
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  subtitle: {
    fontSize:14,
    color:'#666',
    marginBottom:16,
   },
   text:{
     fontSize :14,
     color:'#333',
     marginBottom :16
   },
   buttonContainer:{
       flexDirection:'row',
       justifyContent:'space-between',
       alignItems: 'center',
       
       borderRadius: 5,
       padding: 10,
   },
   button:{
       backgroundColor: '#1976D2',
       paddingHorizontal: 20,
       paddingVertical: 10,
       borderRadius: 5,
   },
   buttonText:{
     color:'white',
     fontSize :16 
   },
   iconContainer:{
    flexDirection:'row',
    },
    icon: {
        width: 25,
        height: 25,
        marginLeft: 10,
      },
});

export default SavedNoteScreen;
