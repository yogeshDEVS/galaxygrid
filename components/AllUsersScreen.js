import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image,Dimensions } from 'react-native';
import firestore from '@react-native-firebase/firestore';
import { ScrollView } from 'react-native-gesture-handler';
import auth from '@react-native-firebase/auth';
import firebase from '@react-native-firebase/app';
import { useNavigation } from '@react-navigation/native'; 


const { width, height } = Dimensions.get('window');

const AllUsersScreen = () => {
    const navigation = useNavigation(); 
  const [users, setUsers] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);

  const defaultImg = require('../assets/defaultimg.png');

  useEffect(() => {
    const fetchUsers = async () => {
        const usersDocument = await firestore().collection('users').get();
        const usersData = usersDocument.docs.map(doc => ({ ...doc.data(), id: doc.id }));
        setUsers(usersData);
      };

    fetchUsers();
  }, []);

  const handleUserPress = (userId) => {
    setSelectedUsers(prevSelectedUsers => {
      if (prevSelectedUsers.includes(userId)) {
        return prevSelectedUsers.filter(id => id !== userId);
      } else {
        return [...prevSelectedUsers, userId];
      }
    });
  };
  
  const handleCreateGroup = async () => {
    // Get the currently signed-in user's data
    const currentUser = await auth().currentUser;
    const currentUserDoc = await firestore().collection('users').doc(currentUser.uid).get();
    const currentUserData = { id: currentUserDoc.id, ...currentUserDoc.data() };
  
    // Add the currently signed-in user's data to the selected users if they're not already included
    let selectedUsersData = users.filter(user => selectedUsers.includes(user.id));
    if (!selectedUsers.includes(currentUser.uid)) {
      selectedUsersData = [currentUserData, ...selectedUsersData];
    }
  
    const selectedUserIds = selectedUsersData.map(user => user.id);
  
    // Create the group in Firestore
    const groupRef = await firestore().collection('groups').add({
      members: selectedUsersData,
      memberIds: selectedUserIds,
      timestamp: firestore.FieldValue.serverTimestamp(),
    });
  
    console.log('Group created with ID: ', groupRef.id);
    navigation.navigate('CreateMeetings', { groupId: groupRef.id });  // Navigate to CreateMeetingScreen with the new group ID
  };
  
      
      return (
        <ScrollView>
          <View style={styles.container}>
          <Text style={styles.header}>ALL USERS</Text>
            <Text style={styles.heading}>Joined Users</Text>
            <Text style={styles.subHeading}>Please select users to form a group</Text>
            {users.map(user => {
             
              return (
                <TouchableOpacity
                  key={user.id}
                  onPress={() => handleUserPress(user.id)}
                  style={[
                    styles.userItem,
                    selectedUsers.includes(user.id) ? styles.selectedUserItem : null,
                  ]}
                >
                  <View style={styles.userContent}>
                    <Image
                      source={user.imageUri ? { uri: user.imageUri } : defaultImg}
                      style={styles.userImage}
                    />
                     <View style={styles.userInfo}>
                     <Text
                      style={[
                        styles.userName,
                        selectedUsers.includes(user.id) ? styles.selectedUserName : null,
                      ]}
                    >
                      {user.firstName} {user.lastName}
                    </Text>
      <Text style={styles.userPhone}>Contact Number: {user.phoneNumber}</Text> 
    </View>
                   
                   
                  </View>
                </TouchableOpacity>
              );
            })}
            <TouchableOpacity onPress={handleCreateGroup} style={styles.createGroupButton}>
              <Text style={styles.createGroupButtonText}>Create Group</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      );
    };
    
    const styles = StyleSheet.create({
        container: {
          flex: 1,
          padding: 16,
          backgroundColor: '#f5f5f5',
        },
        header: {
            fontSize: width * 0.049, // 4.25% of screen width
            alignSelf: 'center',
            color: '#434343',
            marginBottom: height * 0.02, // 26% of screen height
          },
        heading: {
          fontSize: 18,
          fontWeight: 'bold',
          marginBottom: 8,
          color: 'black',
        },
        subHeading: {
          fontSize: 15,
          color: 'black',
          marginBottom: 16,
        },
        userItem: {
          padding: 16,
          backgroundColor: '#fff',
          borderRadius: 8,
          marginBottom: 8,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
        },
        selectedUserItem: {
          backgroundColor: 'lightblue',
        },
        userContent: {
          flexDirection: 'row',
          alignItems: 'center',
        },
        userImage: {
          width: 50,
          height: 50,
          borderRadius: 25,
          marginRight: '10%',
        },
        userName: {
          fontSize: 17,
          color: 'black',
        },
        userPhone:{
          fontSize: 12,
          color: 'gray',
          marginTop:5
        }, 
        selectedUserName: {
          color: 'black',
        },
        createGroupButton: {
          padding: 10,
          backgroundColor: 'blue',
          borderRadius: 8,
          alignItems: 'center',
          width:'57%',
          alignSelf:'center'
        },
        createGroupButtonText: {
          fontSize: 16,
          color: '#fff',
          fontWeight: 'bold',
        },

        userInfo: {
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'flex-start',
        },
      });
      
      export default AllUsersScreen;