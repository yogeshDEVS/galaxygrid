import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, StyleSheet } from 'react-native';
import firestore from '@react-native-firebase/firestore';
import { useNavigation } from '@react-navigation/native'; 
import auth from '@react-native-firebase/auth';


const AddClientScreen = () => {
  const [clients, setClients] = useState([]);
  const navigation = useNavigation();

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
  
        setClients(clients);
      });
  
    // Unsubscribe from events when no longer in use
    return () => unsubscribe();
  }, []);
  

  const getInitials = (name) => {
    let initials = name.match(/\b\w/g) || [];
    initials = ((initials.shift() || '') + (initials.pop() || '')).toUpperCase();
    return initials;
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Add client</Text>
      </View>
      
      <View style={styles.searchBar}>
        <Image source={require('../assets/search.png')} style={styles.searchIcon} />
        <TextInput 
          style={styles.searchInput} 
          placeholder="Search clients or contacts" 
          underlineColorAndroid="black"
        />
      </View>
      
      <View style={styles.addButtonContainer}>
        <TouchableOpacity 
          style={styles.addButton}
          onPress={() => navigation.navigate('NewClient')}
        >
          <Text style={styles.addButtonText}>+</Text>
        </TouchableOpacity>
        <TouchableOpacity 
        
          onPress={() => navigation.navigate('NewClient')}
        >
        <Text style={styles.addtext}>Add new client</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.clientsHeader}>Clients</Text>

      {/* List of Clients */}
      <View>
        {clients.map((client, index) => (
          <View key={index} style={styles.clientItem}>
            <View style={styles.clientIcon}>
              <Text style={styles.clientIconText}>{getInitials(client.name)}</Text>
            </View>
            <View>
              <Text style={styles.clientName}>{client.name}</Text>
           
            </View>
          </View>
        ))}
      </View>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  
  header: {
    padding: 20,
    backgroundColor: 'lightblue',

  },

  headerText: {
    fontSize: 22,
    fontWeight: 'bold',
    color: 'black',
  },

  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    marginHorizontal: 20,
    marginBottom: 20,
  },

  searchIcon: {
    width: 20,
    height: 20,
    marginRight: 10,
  },

  searchInput: {
    flex: 1,
    color:'black'
  },
  addButtonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    marginBottom:40,
    marginHorizontal: 20,
  },

  addButton: {
    backgroundColor: '#FFF',
    borderRadius: 50,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
    borderWidth: 1,
    borderColor: '#112040'
  },


  addButtonText: {
    color: '#112040',
    fontSize: 25,
    fontWeight: '600',
  },

  clientsHeader: {
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 20,
    marginBottom: 10,
    color:'black'
  },

  clientItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    marginHorizontal: 20,
  },

  clientIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#ebedf2',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },

  clientIconText: {
    color: 'white',
    fontWeight: 'bold',
    color:'#112040'
  },

  clientName: {
    fontSize: 16,
    fontWeight: '600',
    color:'black'
  },

  clientMobile: {
    fontSize: 11,
    color: '#888',
  },
  addtext: {
    fontSize: 16,
    fontWeight: '600',
    color:'black'
  }
});

export default AddClientScreen;
