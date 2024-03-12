import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, Modal, FlatList, StyleSheet } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import firestore from '@react-native-firebase/firestore';
import { useNavigation } from '@react-navigation/native'; 
import auth from '@react-native-firebase/auth';

const CreateMeetingScreen = ({ route }) => {
  const [title, setTitle] = useState('');
  const [date, setDate] = useState(new Date());
  const [mode, setMode] = useState('date');
  const [show, setShow] = useState(false);
  const [description, setDescription] = useState('');
  const [team, setTeam] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const navigation = useNavigation();

  const [promptVisible, setPromptVisible] = useState(false);
  const [promptText, setPromptText] = useState('');

  // Get the initial date and time from the navigation parameters
  const initialDate = route.params?.date ? new Date(route.params.date) : new Date();
  const initialTime = route.params?.time || '12:00 AM';


  useEffect(() => {
    // Get the current user
    const user = auth().currentUser;
  
    const unsubscribe = firestore()
      .collection('Users')
      .doc(user.uid)
      .collection('Clients')
      .onSnapshot((querySnapshot) => {
        const clients = querySnapshot.docs.map((documentSnapshot) => {
          return {
            ...documentSnapshot.data(),
            key: documentSnapshot.id, // required for FlatList
          };
        });
  
        setTeam(clients);
      });
  
    // Unsubscribe from events when no longer in use
    return () => unsubscribe();
  }, []);
  
  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setShow(Platform.OS === 'ios');
    setDate(currentDate);
  };

  const handleCreateMeeting = () => {
    // Send confirmation SMS to all clients
    team.forEach((client) => {
      fetch('http://192.168.43.235:3000/send-sms', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          body: 'Confirmation message: Meeting has been created by Karan.',
          to: client.mobile, // the phone number of the client
        }),
      })
      .then((response) => response.json())
      .then((json) => {
        if (json.success) {
          console.log(`Confirmation SMS sent successfully to ${client.name}!`);
          // Show the prompt text
          setPromptText(`Confirmation SMS sent successfully to clients!`);
          setPromptVisible(true);
          // Hide the prompt text after 3 seconds
          setTimeout(() => {
            setPromptVisible(false);
          }, 3000);
        } else {
          console.log(`Failed to send confirmation SMS to ${client.name}.`);
        }
      })
      .catch((error) => {
        console.error(error);
        console.log(`Failed to send confirmation SMS to ${client.name}.`);
      });
    });
  }

  

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Create Meeting</Text>
      <Text style={styles.label}>Meeting Title</Text>
      <TextInput style={styles.input} placeholder="Enter meeting title" onChangeText={setTitle} />

      <Text style={styles.label}>Select Date</Text>
      <TouchableOpacity onPress={() => setShow(true)} style={styles.dateInput}>
  <Text>{`${initialDate.toDateString()} ${initialTime}`}</Text>
</TouchableOpacity>

      {show && (
        <DateTimePicker
          testID="dateTimePicker"
          value={date}
          mode={mode}
          is24Hour={true}
          display="default"
          onChange={onChange}
        />
      )}

      <Text style={styles.label}>Team Members</Text>
      <View style={styles.teamContainer}>
  <TouchableOpacity onPress={() => setModalVisible(true)}>
    {team.length > 0 ? (
      <Text>
        {team[0].name} and {team.length - 1} others
      </Text>
    ) : (
      <Text>Add team members</Text>
    )}
  </TouchableOpacity>
  <TouchableOpacity style={styles.addButton} onPress={() => navigation.navigate('AddClient')}>
    <Text style={styles.addText}>+</Text>
  </TouchableOpacity>
</View>
      <Text style={styles.label1}>Add Description</Text>
      <TextInput style={styles.descriptionInput} multiline placeholder="Type here..." onChangeText={setDescription} />

      <TouchableOpacity style={styles.createButton} onPress={handleCreateMeeting}>
        <Text style={styles.createButtonText}>CREATE</Text>
      </TouchableOpacity>
      {promptVisible && <Text style={styles.promptText}>{promptText}</Text>}


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
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setModalVisible(!modalVisible)}
            >
              <Text style={styles.closeText}>X</Text>  
            </TouchableOpacity>
            <Text style={styles.modalTitle}>Clients</Text>
            {team.map((member, index) => (
  <View key={index} style={styles.memberContainer}>
    <Text style={styles.memberName}>{member.name}</Text>
    <Text style={styles.memberPhone}>{member.mobile}</Text>
    <TouchableOpacity
      style={{
        height: 22,
        width: 22,
        borderRadius: 15,
        borderWidth: 1,
        borderColor: 'darkblue',
        alignItems: 'center',
        justifyContent: 'center',
        marginLeft: 'auto',
      }}
      onPress={async () => {
        // Get the current user
        const user = auth().currentUser;
      
        // Delete the client from Firestore
        await firestore()
          .collection('Users')
          .doc(user.uid)
          .collection('Clients')
          .doc(member.key)
          .delete();
      
        // Remove the client from the local state
        const newTeam = [...team];
        newTeam.splice(index, 1);
        setTeam(newTeam);
      }}
      
    >
      <Text style={{ color: 'darkblue',fontSize: 25, lineHeight: 25
      }}>-</Text>
    </TouchableOpacity>
  </View>
))}

          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  
  header: {
    fontSize: 24,
    color: '#000',
    fontWeight: 'bold',
    marginBottom: 20,
  },

  label: {
    fontSize: 18,
    color: '#000',
    marginBottom: 10,
  },
  label1: {
    fontSize: 18,
    color: '#000',
    marginBottom: 0,
    marginTop: 10,
    marginBottom: -25
  },

  input: {
    borderWidth: 0,
    borderBottomWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginBottom: 20,
    fontSize: 15,
    color:'black'
  },

  dateInput: {
    borderWidth: 0,
    borderBottomWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginBottom: 20,
    color:'black'
  },

  

  descriptionInput: {
    borderWidth: 0,
    borderBottomWidth: 1,
    borderColor: '#ccc',
    padding: 8,
    marginBottom: 20,
    fontSize: 15,
    minHeight: 160,
    color:'black'
  },

  createButton: {
    backgroundColor: 'darkblue',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 10,
    
  },

  createButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
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
  memberContainer: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  },
  teamContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    paddingTop: 15,
    paddingBottom: 30, 
    marginBottom: 20,
  },
  
  addButton: {
    backgroundColor: 'darkblue',
    width: 30,
    height: 30,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  
  addText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '600',
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
  closeButton: {
    position: 'absolute',
    right: 10,
    top: 10,
  },
  closeText: {
    fontSize: 18,
    fontWeight: 'bold',
    color:'black',
    marginRight: 7
  },
  modalTitle: {
    fontSize: 20,
    color: '#000',
    fontWeight: 'bold',
    marginBottom: 20,
  },
  memberContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginBottom: 20,
    width: '100%',
  },
  memberName: {
    fontSize: 16,
    color: '#000',
    fontWeight: 'bold',
  },
  memberPhone: {
    fontSize: 10,
    color: '#888',
    marginLeft: 10,
    marginTop:5
  },
  promptText: {
    textAlign: 'center',
    color: '#101f30',
    fontSize: 14,
    marginTop: 10,
  },
  
});

export default CreateMeetingScreen;




 
  
// const teamId = route.params ? route.params.teamId : null;
// const [team, setTeam] = useState(null);
// useEffect(() => {
//   const fetchTeam = async () => {
//     const user = auth().currentUser;
//     const teamSnapshot = await firestore()
//       .collection('Teams')
//       .where('userId', '==', user.uid)
//       .get();

//     // Fetch the currently signed-in user's information
//     const userSnapshot = await firestore()
//       .collection('users')
//       .doc(user.uid)
//       .get();

//     const userData = userSnapshot.data();

//     teamSnapshot.forEach((doc) => {
//       if (doc.id === teamId) {
//         const teamData = doc.data();
//         // Add the currently signed-in user to the team members
//         teamData.members.push({
//           givenName: userData.firstName,
//           phoneNumbers: [{ number: userData.phoneNumber }],
//         });
//         setTeam(teamData);
//       }
//     });
//   };

//   fetchTeam();  // Call the function here
// }, [teamId]);



// useEffect(() => {
//   const fetchTeamMembers = async () => {
//     const teamRef = firestore().collection('Teams').doc(teamId);
//     const teamDoc = await teamRef.get();

//     if (teamDoc.exists) {
//       setTeam(teamDoc.data());
//       const members = await Promise.all(
//         teamDoc.data().members.map((memberId) =>
//           firestore().collection('TeamMembers').doc(memberId).get()
//         )
//       );
//       setTeamMembers(members.map((memberDoc) => memberDoc.data()));
//     }
//   };

//   fetchTeamMembers();
// }, []);

//   const onChange = (event, selectedDate) => {
//     const currentDate = selectedDate || date;
//     setShow(Platform.OS === 'ios');
//     setDate(currentDate);
//   };

//   const showMode = (currentMode) => {
//     setShow(true);
//     setMode(currentMode);
//   };

//   const showDatepicker = () => {
//     showMode('date');
//   };


//   const handleUserImagePress = (user) => {
//     setSelectedUser(user);
//     setModalVisible(true);
//   };

//   // const [group, setGroup] = useState(null);
//   const [group, setGroup] = useState({ members: [] });
//   // CreateMeetingScreen
//   useEffect(() => {
//     setLoading(true);
//     let fetchGroup;
//     if (route.params && route.params.groupId) {  // Check if route.params and route.params.groupId are defined
//       fetchGroup = firestore().collection('groups').doc(route.params.groupId)
//         .onSnapshot(async doc => {
//           if (doc.exists) {
//             const groupData = doc.data();
//             const membersData = await Promise.all(groupData.memberIds.map(id => firestore().collection('users').doc(id).get()));
//             setGroup({
//               ...groupData,
//               members: membersData.map(doc => ({ id: doc.id, ...doc.data() })),
//             });
//           } else {
//             setGroup(null);
//           }
//           setLoading(false);
//         });
//     } else {
//       fetchGroup = firestore().collection('groups').where('memberIds', 'array-contains', auth().currentUser.uid).orderBy('timestamp', 'desc').limit(1)
//         .onSnapshot(async snapshot => {
//           if (snapshot && snapshot.docs.length > 0) {
//             const groupData = snapshot.docs[0].data();
//             const membersData = await Promise.all(groupData.memberIds.map(id => firestore().collection('users').doc(id).get()));
//             setGroup({
//               ...groupData,
//               members: membersData.map(doc => ({ id: doc.id, ...doc.data() })),
//             });
//           } else {
//             setGroup(null);
//           }
//           setLoading(false);
//         });
//     }
  
//     return () => fetchGroup(); // Unsubscribe on unmount
//   }, [route.params]);


//   const handleCreateMeeting = async () => {
//     const currentUser = await auth().currentUser;
//     const currentUserData = await firestore().collection('users').doc(currentUser.uid).get();
  
//     const membersData = [currentUserData, ...group.members];
  
//     const meetingRef = await firestore().collection('meetings').add({
//       title: title,
//       date: date,
//       members: membersData,
//       description: description,
//       timestamp: firestore.FieldValue.serverTimestamp(),
//     });
  
//     console.log('Meeting created');
//     setShowPrompt(true);
//     setTimeout(() => setShowPrompt(false), 3000);
//   };

//   const [name, setName] = useState('');
//   const [phoneNumber, setPhoneNumber] = useState('');
  

  // const handleCreateMeeting = async () => {
  //   const currentUser = await auth().currentUser;
  //   const currentUserData = await firestore().collection('users').doc(currentUser.uid).get();
  
  //   const membersData = [currentUserData, ...group.members];
  
  //   const meetingRef = await firestore().collection('meetings').add({
  //     title: title,
  //     date: date,
  //     members: membersData,
  //     description: description,
  //     timestamp: firestore.FieldValue.serverTimestamp(),
  //   });
  
  //   console.log('Meeting created');
  //   setShowPrompt(true);
  //   setTimeout(() => setShowPrompt(false), 3000);
  
  //   // After the meeting is created, send the notifications
  //   membersData.forEach(async member => {
  //     // Get the member's FCM token from Firestore
  //     const memberData = await firestore().collection('users').doc(member.id).get();
  //     const fcmToken = memberData.data().fcmToken;
  
  //     // Construct the notification message
  //     const message = {
  //       token: fcmToken,
  //       notification: {
  //         title: 'New Meeting Created',
  //         body: `Meeting "${title}" has been created.`,
  //       },
  //     };
  
  //     // Send the notification
  //     messaging().send(message).then(response => {
  //       console.log('Notification sent successfully:', response);
  //     }).catch(error => {
  //       console.log('Notification failed to send:', error);
  //     });
  //   });
  // };  
  
  // const handleCreateMeeting = async () => {
  //   const currentUser = await auth().currentUser;
  //   const currentUserData = await firestore().collection('users').doc(currentUser.uid).get();

  //   const membersData = [currentUserData, ...group.members];

  //   const meetingRef = await firestore().collection('meetings').add({
  //     title: title,
  //     date: date,
  //     members: membersData,
  //     description: description,
  //     timestamp: firestore.FieldValue.serverTimestamp(),
  //   });

  //   console.log('Meeting created');
  //   setShowPrompt(true);
  //   setTimeout(() => setShowPrompt(false), 3000);

  //   membersData.forEach(member => {
  //     SmsAndroid.autoSend(member.phoneNumber, `Meeting "${title}" has been created.`, (fail) => {
  //       console.log('Failed with this error: ' + fail);
  //     }, (success) => {
  //       console.log('SMS sent successfully');
  //     });
  //   });
  // }; 

  // const handleCreateMeeting = async () => {
  //   // Get the currently signed-in user's data
  //   const currentUser = await auth().currentUser;
  //   const currentUserData = await firestore().collection('users').doc(currentUser.uid).get();
  
  //   // Add the currently signed-in user's data to the members
  //   const membersData = [currentUserData, ...group.members];
  
  //   const meetingRef = await firestore().collection('meetings').add({
  //     title: title,
  //     date: date,
  //     members: membersData,
  //     description: description,
  //     timestamp: firestore.FieldValue.serverTimestamp(),
  //   });
  //   console.log('Meeting created');
  //   setShowPrompt(true);
  //   setTimeout(() => setShowPrompt(false), 3000);
  
  //   // After the meeting is created, send the SMS notifications
  //   membersData.forEach(member => {
  //     fetch('http://192.168.43.235:3000/send-sms', {
  //       method: 'POST',
  //       headers: {
  //         'Content-Type': 'application/json',
  //       },
  //       body: JSON.stringify({
  //         to: member.phoneNumber, // assuming the member object has a phoneNumber property
  //         body: `Meeting "${title}" has been created.`,
  //       }),
  //     })
  //     .then(response => {
  //       if (!response.ok) {
  //         throw new Error(`HTTP error! status: ${response.status}`);
  //       }
  //       return response.json();
  //     })
  //     .then(data => {
  //       if (data.success) {
  //         console.log(`SMS sent to ${member.phoneNumber} with SID ${data.messageSid}`);
  //       } else {
  //         console.log(`Failed to send SMS to ${member.phoneNumber}: ${data.error}`);
  //       }
  //     })
  //     .catch(error => {
  //       console.log('There was a problem with the fetch operation: ' + error.message);
  //     });
  //   });
  // };
  
  
  // const handleCreateMeeting = async () => {
  //   // Get the currently signed-in user's data
  //   const currentUser = await auth().currentUser;
  //   const currentUserDoc = await firestore().collection('users').doc(currentUser.uid).get();
  //   const currentUserData = { id: currentUserDoc.id, ...currentUserDoc.data() };
  
  //   // Add the currently signed-in user's data to the members
  //   const membersData = [currentUserData, ...group.members];
  
  //   const meetingRef = await firestore().collection('meetings').add({
  //     title: title,
  //     date: date,
  //     members: membersData,
  //     description: description,
  //     timestamp: firestore.FieldValue.serverTimestamp(),
  //   });
  
  //   console.log('Meeting created');
  //   setShowPrompt(true);
  //   setTimeout(() => setShowPrompt(false), 3000);
  
  //   // Send an SMS to each member
  //   for (const member of membersData) {
  //     if (member.phoneNumber) {
  //       // Ensure the message matches an approved template
  //       const message = `Dear User, Meeting "${title}" has been scheduled on ${date}. Regards, Your Team.`;
  //       const response = await fetch('https://api.textlocal.in/send/', {
  //         method: 'POST',
  //         headers: {
  //           'Content-Type': 'application/x-www-form-urlencoded',
  //         },
  //         body: `apiKey=your-textlocal-api-key&message=${encodeURIComponent(message)}&sender=TXTLCL&numbers=${member.phoneNumber}`,
  //       });
  //       const data = await response.json();
  //       console.log(data);
  //     }
  //   }
  // };
  
  
  