import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';

const NoteScreen = ({ route }) => {
  const { note } = route.params;
  const [isEditable, setIsEditable] = useState(false);
  const [title, setTitle] = useState(note.title);
  const [subtitle, setSubtitle] = useState(note.subtitle);
  const [text, setText] = useState(note.text.replace(/<\/?div[^>]*>/g, ''));

  const handleSave = async () => {
    const userId = auth().currentUser.uid;
    await firestore()
      .collection('users')
      .doc(userId)
      .collection('notes')
      .doc(note.key)
      .update({
        title: title,
        subtitle: subtitle,
        text: text,
      });
    setIsEditable(false);
  };

  return (
    <View style={styles.container}>
      <ScrollView>
        {isEditable ? (
          <View style={styles.inputContainer}>
            <TextInput
              value={title}
              onChangeText={setTitle}
              style={styles.title}
            />
          </View>
        ) : (
          <Text style={styles.title}>{title}</Text>
        )}
        {isEditable ? (
          <View style={styles.inputContainer}>
            <TextInput
              value={subtitle}
              onChangeText={setSubtitle}
              style={styles.subtitle}
            />
          </View>
        ) : (
          <Text style={styles.subtitle}>{subtitle}</Text>
        )}
        {isEditable ? (
          <View style={styles.inputContainer}>
            <TextInput
              value={text}
              onChangeText={setText}
              style={styles.text}
              multiline
            />
          </View>
        ) : (
          <Text style={styles.text}>{text}</Text>
        )}
      </ScrollView>
      <TouchableOpacity style={styles.button} onPress={isEditable ? handleSave : () => setIsEditable(true)}>
        <Text style={styles.buttonText}>{isEditable ? 'Save' : 'Edit'}</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  inputContainer: {
    borderColor: 'gray',
    borderWidth: 0.4,
    borderRadius: 25,
    marginBottom: 10,
    padding: 5,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color:'#434343'
  },
  subtitle: {
    fontSize: 20,
    color:'#434343'
  },
  text: {
    fontSize: 16,
    color:'#434343'
  },
  button: {
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf:'center',
    borderRadius: 25,
    backgroundColor: 'blue',
    position: 'absolute',
    bottom: 15,
    width: '50%',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default NoteScreen;
