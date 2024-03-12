import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Image, Dimensions, Button } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import DateTimePicker from '@react-native-community/datetimepicker';


// Get the screen's width and height
const { width, height } = Dimensions.get('window');

const CollectionScreen = () => {
  const icons = {
    search: require('../assets/search.png'), // assuming you have a search icon
  };
  const [selectedCard, setSelectedCard] = useState(null);
  const [notes, setNotes] = useState([]);
  const [isLoading, setIsLoading] = useState(true); // Add this line
  const [selectedDeleteIcon, setSelectedDeleteIcon] = useState(null);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [datePickerVisible, setDatePickerVisible] = useState(false);
  const [isDateFiltered, setIsDateFiltered] = useState(false);



  const handleCardPress = (note) => {
    setSelectedCard(note.key);
    setSelectedDeleteIcon(note.key);
    navigation.navigate('NotesScreen', { note: note });
  };

  const navigation = useNavigation();

  // useEffect(() => {
  //   const userId = auth().currentUser.uid;
  
  //   const subscriber = firestore()
  //     .collection('users')
  //     .doc(userId)
  //     .collection('notes')
  //     .orderBy('createdAt', 'desc') // Order the notes by creation time
  //     .onSnapshot(querySnapshot => {
  //       const notes = [];
  
  //       querySnapshot.forEach(documentSnapshot => {
  //         notes.push({
  //           ...documentSnapshot.data(),
  //           key: documentSnapshot.id,
  //         });
  //       });
  
  //       setNotes(notes);
  //       setIsLoading(false);
  //     });
  
  //   // Unsubscribe from events when no longer in use
  //   return () => subscriber();
  // }, []);

  useEffect(() => {
    const userId = auth().currentUser.uid;
  
    const subscriber = firestore()
      .collection('users')
      .doc(userId)
      .collection('notes')
      .orderBy('createdAt', 'desc') // Order the notes by creation time
      .onSnapshot(querySnapshot => {
        const notes = [];
  
        querySnapshot.forEach(documentSnapshot => {
          const note = {
            ...documentSnapshot.data(),
            key: documentSnapshot.id,
          };
  
          // Convert the note's createdAt timestamp to a date
          const noteDate = note.createdAt.toDate();
          // Check if the note's date matches the selected date
          if (noteDate.getFullYear() === selectedDate.getFullYear() &&
              noteDate.getMonth() === selectedDate.getMonth() &&
              noteDate.getDate() === selectedDate.getDate()) {
            notes.push(note);
          }
        });
  
        setNotes(notes);
        setIsLoading(false);
      });
  
    // Unsubscribe from events when no longer in use
    return () => subscriber();
  }, [selectedDate]); // Add selectedDate to the dependency array
  
  
  const handleDeletePress = (noteKey) => {
    const userId = auth().currentUser.uid;
    firestore()
      .collection('users')
      .doc(userId)
      .collection('notes')
      .doc(noteKey)
      .delete()
      .then(() => {
        console.log("Note successfully deleted!");
  
        // Check if there are any notes left
        firestore()
          .collection('users')
          .doc(userId)
          .collection('notes')
          .get()
          .then((querySnapshot) => {
            if (querySnapshot.empty) {
              // If there are no notes left, reset isDateFiltered
              setIsDateFiltered(false);
            }
          });
      })
      .catch((error) => {
        console.error("Error removing note: ", error);
      });
  };
  

  return (
    <View style={styles.container}>
      <Text style={styles.header}>COLLECTION</Text>
      <View style={styles.searchBar}>
        <Image source={icons.search} style={styles.searchIcon} />
        <TextInput style={styles.searchInput} placeholder="Search" />
      </View>
      <TouchableOpacity 
  style={styles.filterButton} 
  onPress={() => setDatePickerVisible(true)}
>
  <Text style={styles.filterButtonText}>Filter by date</Text>
</TouchableOpacity>

      {datePickerVisible && (
   <DateTimePicker
   value={selectedDate}
   mode="date"
   display="default"
   onChange={(event, date) => {
     setSelectedDate(date || selectedDate);
     setDatePickerVisible(false);  // Hide the date picker after a date is selected
     setIsDateFiltered(true);  // Set isDateFiltered to true
   }}
 />
 
)}
      <ScrollView>
      <View style={styles.cardsContainer}>
      {isLoading ? (
        <Text>Notes are Loading...</Text>
      ) : notes.length > 0 ? (
        notes.map((note) => (
          <View key={note.key} style={styles.noteCardContainer}>
            <TouchableOpacity
              style={[
                styles.noteCard,
                selectedCard === note.key ? styles.selectedCard : null,
              ]}
              onPress={() => handleCardPress(note)}
            >
              <View>
                <Text style={[styles.noteTitle, selectedCard === note.key ? styles.selectedCardText : styles.unselectedCardText]} numberOfLines={2}>{note.title}</Text>
                <Text style={[styles.noteSubtitle, selectedCard === note.key ? styles.selectedCardText : styles.unselectedCardText]} numberOfLines={2}>{note.subtitle}</Text>
                <Text style={[styles.noteContent, selectedCard === note.key ? styles.selectedCardText : styles.unselectedCardText]} numberOfLines={7}>
                  {note.text.replace(/<[^>]*>?/gm, '')} 
                </Text>
              </View>
              <Text style={[styles.noteDate, selectedCard === note.key ? styles.selectedCardText : null]}>{note.createdAt.toDate().toLocaleDateString()}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.deleteIcon} onPress={() => handleDeletePress(note.key)}>
            <Image source={selectedDeleteIcon === note.key ? require('../assets/delete_white.png') : require('../assets/delete.png')} /> 
            </TouchableOpacity>
          </View>
        ))
      ) : (
        <View style={styles.emptyNotes}>
          <Text style={styles.emptyNotesText}>{isDateFiltered ? 'No saved notes found for this date.' : 'Nothing to show for now, please create a note and save it to see the collection.'}</Text>
        </View>
      )}
      </View>
      </ScrollView>
      <TouchableOpacity style={styles.newNoteButton} onPress={() => navigation.navigate('WriteNote')}>
        <Text style={styles.newNoteButtonText}>+ New Note</Text>
      </TouchableOpacity>
    </View>
  );
  
};




const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: width * 0.05,
    backgroundColor: '#fff',
  },
  header: {
    fontSize: width * 0.045,
    alignSelf:'center',
    marginBottom: height * 0.05,
    color:'#434343'
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    width: width * 0.92,
    height: height * 0.054,
    borderRadius: 20,
    marginBottom: height * 0.02,
    paddingLeft: width * 0.05,
    alignSelf: 'center',
    backgroundColor: 'white',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  searchIcon: {
    width: width * 0.04,
    height: height * 0.02,
    marginRight: width * 0.02,
  },
  searchInput: {
    flex: 1,
    color: 'black'
  },
  cardsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  noteCard: {
    width: width * 0.43,
    height: height * 0.3,
    padding: width * 0.025,
    borderRadius: 10,
    marginBottom: height * 0.02,
    backgroundColor: 'white',
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  noteTitle: {
    fontSize: width * 0.0425,
    fontWeight: '700',
    color: 'black'
  },
  noteSubtitle: {
    fontSize: width * 0.035,
    color: 'gray',
  },
  noteContent: {
    fontSize: width * 0.04,
    color: 'black',
  },
  newNoteButton: {
    width: width * 0.4,
    height: height * 0.048,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,
    backgroundColor: 'darkblue',
    position: 'absolute',
    bottom: height * 0.04,
    left: width * 0.32,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  newNoteButtonText: {
    color: '#fff',
    fontSize: width * 0.04,
    fontWeight: '600',
  },
  selectedCard: {
    backgroundColor: 'darkblue',
  },
  selectedCardText: {
    color: 'white',
  },
  unselectedCardText: {
    color: 'black',
  },
  emptyNotes: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyNotesText: {
    fontWeight: 'bold',
    fontSize: 16,
    textAlign: 'center',
    color:'#7a7776'
  },
  noteCardContainer: {
    position: 'relative',
  },
  deleteIcon: {
    position: 'absolute',
    top: height * 0.010,
    right: width * 0.010,
    width: 24,
    height:24
  },
  noteDate:{
    marginBottom:0,
    color:'#7a7776'
  },
  filterButton: {
    backgroundColor: 'darkblue',
    padding: 7,
    borderRadius: 20,
    marginBottom: 20,
    alignItems: 'center',
    width: width * 0.4,
    height: height * 0.048,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  filterButtonText: {
    color: 'white',
    fontSize: width * 0.04,
  },
});



export default CollectionScreen;