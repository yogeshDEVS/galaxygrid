import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, PermissionsAndroid, StyleSheet, Modal, FlatList, TextInput,  ScrollView, KeyboardAvoidingView,Linking } from 'react-native';
import Contacts from 'react-native-contacts';
import firestore from '@react-native-firebase/firestore';
import { useNavigation } from '@react-navigation/native';
import auth from '@react-native-firebase/auth';


const ImportContactsScreen = () => {
  const [importedContacts, setImportedContacts] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedContacts, setSelectedContacts] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [name, setName] = useState('');
  const navigation = useNavigation();
  const [phoneNumber, setPhoneNumber] = useState('');

  const requestContactsPermission = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.READ_CONTACTS,
        {
          title: 'Contacts',
          message: 'This app would like to view your contacts.',
          buttonPositive: 'Allow',
        },
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        console.log('You can now access the contacts');
        importContacts();
      } else {
        console.log('Contacts permission denied');
      }
    } catch (err) {
      console.warn(err);
    }
  };

  const [teamCreated, setTeamCreated] = useState(false);

  const createTeam = () => {
    const user = auth().currentUser;
    
    // Check if the user's information is available
    if (user.displayName && user.phoneNumber) {
      // Add the currently signed-in user to the team
      const newContact = {
        givenName: user.displayName,
        phoneNumbers: [{ number: user.phoneNumber }],
      };
      setSelectedContacts([...selectedContacts, newContact]);
    }
    
    firestore()
      .collection('Teams')
      .add({
        members: selectedContacts,
        userId: user.uid,  // Set the userId field
      })
      .then((docRef) => {
        setTeamCreated(true);
        setTimeout(() => {
          setTeamCreated(false);
          navigation.navigate('CreateMeetings', { teamId: docRef.id });
          // Send SMS notifications to all team members
          selectedContacts.forEach(contact => {
            const phoneNumber = contact.phoneNumbers[0].number;
            const message = `A new meeting has been created. Please check the app for details.`;
            fetch('http://192.168.1.48:3000/send-sms', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                phoneNumber,
                message,
              }),
            });
          });
        }, 3000);
      });
  };
  const addContact = () => {
    const newContact = {
      givenName: name,
      familyName: '',
      phoneNumbers: [{ number: phoneNumber }],
    };
    setSelectedContacts([...selectedContacts, newContact]);
    firestore()
      .collection('TeamMembers')
      .add({
        name: name,
        phoneNumbers: [phoneNumber],
      })
      .then(() => {
        console.log('User added!');
      });
    setName('');
    setPhoneNumber('');
  };

  const importContacts = async () => {
    try {
      const contacts = await Contacts.getAll();
      setImportedContacts(contacts);
      setModalVisible(true); // Set modalVisible to true here
    } catch (err) {
      console.error(err);
    }
  };

  const selectContact = (contact) => {
    setSelectedContacts([...selectedContacts, contact]);
    setModalVisible(false);
    firestore()
      .collection('TeamMembers')
      .add({
        name: `${contact.givenName} ${contact.familyName}`,
        phoneNumbers: contact.phoneNumbers.map((phoneNumber) => phoneNumber.number),
      })
      .then(() => {
        console.log('User added!');
      });
  };

  const filteredContacts = importedContacts.filter(
    (contact) =>
      contact.givenName.toLowerCase().includes(searchText.toLowerCase()) ||
      contact.familyName.toLowerCase().includes(searchText.toLowerCase()) ||
      contact.phoneNumbers.some((phoneNumber) =>
        phoneNumber.number.includes(searchText)
      )
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Add Team Members</Text>
      <TouchableOpacity style={styles.button} onPress={requestContactsPermission}>
        <Text style={styles.buttonText}>Select from your contacts</Text>
      </TouchableOpacity>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
  <View style={styles.formContainer}>
    <Text style={styles.title}>Add Manually</Text>
    <TextInput
      style={styles.input}
      placeholder="Name"
      value={name}
      onChangeText={(text) => setName(text)}
    />
    <TextInput
      style={styles.input}
      placeholder="Phone Number"
      value={phoneNumber}
      onChangeText={(text) => setPhoneNumber(text)}
      keyboardType="phone-pad"
    />
    <TouchableOpacity style={styles.button} onPress={addContact}>
      <Text style={styles.buttonText}>Add</Text>
    </TouchableOpacity>
  </View>
</KeyboardAvoidingView>
      <ScrollView>
      <Text style={styles.title}>Team Members</Text>
      {selectedContacts.length > 0 ? (
        selectedContacts.map((contact, index) => (
          <View key={index} style={styles.contactContainer}>
            <Text>{contact.givenName} {contact.familyName}</Text>
            {contact.phoneNumbers.map((phoneNumber, index) => (
              <Text key={index}>{phoneNumber.number}</Text>
            ))}
          </View>
        ))
      ) : (
        <Text>No contact selected or added. Please select contact or add one.</Text>
      )}
     
      </ScrollView>
      <TouchableOpacity style={styles.button} onPress={createTeam}>
  <Text style={styles.buttonText}>Create Team</Text>
</TouchableOpacity>

<Text style={[styles.prompt, teamCreated ? styles.visible : styles.invisible]}>
  Team has been created!
</Text>


      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <TextInput
              style={styles.searchInput}
              placeholder="Search..."
              onChangeText={(text) => setSearchText(text)}
            />
            <FlatList
              data={filteredContacts}
              keyExtractor={(item) => item.recordID}
              renderItem={({ item }) => (
                <TouchableOpacity onPress={() => selectContact(item)} style={styles.contactContainer}>
                  <Text>{item.givenName} {item.familyName}</Text>
                </TouchableOpacity>
              )}
            />
          </View>
        </View>
      </Modal>
   

    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#FFF',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  button: {
    backgroundColor: 'blue',
    padding: 10,
    borderRadius: 5,
    marginBottom: 20,
  },
  buttonText: {
    color: '#fff',
    textAlign: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  contactContainer: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  searchInput: {
    width: 200,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    padding: 10,
    marginBottom: 20,
    color:'black'
  },
  formContainer: {
   
    borderColor: '#ddd',
    borderRadius: 5,
    padding: 10,
    
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
    color:'black'
  },
  prompt: {
    color: 'blue',
    textAlign: 'center',
    marginTop: 10,
  },
  visible: {
    opacity: 1,
  },
  invisible: {
    opacity: 0,
  },
  
  
  
});

export default ImportContactsScreen;



// const sendSMSNotification = (phoneNumber, message) => {
//   SendSMS.send(
//     {
//       body: message,
//       recipients: [phoneNumber],
//       successTypes: ['sent', 'queued'],
//     },
//     (completed, cancelled, error) => {
//       console.log('SMS Callback: completed: ' + completed + ' cancelled: ' + cancelled + 'error: ' + error);
//     }
//   );
// };

  // const createTeam = () => {
  //   const user = auth().currentUser;
  
  //   // Check if the user's information is available
  //   if (user.displayName && user.phoneNumber) {
  //     // Add the currently signed-in user to the team
  //     const newContact = {
  //       givenName: user.displayName,
  //       phoneNumbers: [{ number: user.phoneNumber }],
  //     };
  //     setSelectedContacts([...selectedContacts, newContact]);
  //   }
  
  //   firestore()
  //     .collection('Teams')
  //     .add({
  //       members: selectedContacts,
  //       userId: user.uid,  // Set the userId field
  //     })
  //     .then((docRef) => {
  //       setTeamCreated(true);
  //       setTimeout(() => {
  //         setTeamCreated(false);
  //         navigation.navigate('CreateMeetings', { teamId: docRef.id });
  //       }, 3000);
  //     });
  // };