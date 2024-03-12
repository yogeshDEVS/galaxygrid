import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, TextInput, StyleSheet, Image, Dimensions, Linking, KeyboardAvoidingView } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useNavigation } from '@react-navigation/native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import auth from '@react-native-firebase/auth';
import firebase from '@react-native-firebase/app';
import firestore from '@react-native-firebase/firestore';

// Import the screens
import CollectionScreen from './CollectionScreen';
import NotesScreen from './NotesScreen';
import MeetScreen from './MeetScreen';
import ScheduledMeetingsScreen from './ScheduledMeetingsScreen';
import CreateMeetingScreen from './CreateMeetingsScreen';
import WriteNoteScreen from './WriteNoteScreen';

// Get the screen's width and height
const { width, height } = Dimensions.get('window');

const icons = {
  drawer: require('../assets/drawer3.png'),
  moreOptions: require('../assets/hometab.png'),
  newNotes: require('../assets/notes.png'),
  meet: require('../assets/appointment.png'),
  collection: require('../assets/collection.png'),
  scheduleMeetings: require('../assets/calendar.png'),
  addButton: require('../assets/drawer.png'),
  search: require('../assets/search.png'), // assuming you have a search icon
};

const cardItems = [
  { id: 1, title: 'New Notes', icon: icons.newNotes },
  { id: 2, title: 'Scheduled', icon: icons.meet },
  { id: 3, title: 'Collection', icon: icons.collection },
  { id: 4, title: 'Schedule Meetings', icon: icons.scheduleMeetings },
];

const Tab = createBottomTabNavigator();

const HomeScreenContent = () => {
  const [userDetails, setUserDetails] = useState({});
  const [selectedCard, setSelectedCard] = useState(null);
  const navigation = useNavigation();
  const openMeet = () => {
    // Google Meet homepage URL
    const meetUrl = 'https://meet.google.com/';

    // Open the URL in the default browser
    Linking.openURL(meetUrl);
  };
  const handleCardPress = (id) => {
    setSelectedCard(id);
    if (id === 1) { // assuming the id of 'New Notes' card is 1
      navigation.navigate('WriteNote'); // navigate to 'WriteNote'
    }else if (id === 3) { // assuming the id of 'Collection' card is 3
      navigation.navigate('CollectionScreen'); // navigate to 'Collection'
    }else if (id === 2) { // assuming the id of 'Meet' card is 2
      navigation.navigate('CreateMeetings'); // navigate to 'Collection'
    } else if (id === 4) { 
      navigation.navigate('Calendar');
    }

  };


  useEffect(() => {
    const user = auth().currentUser;
    if (user) {
      firestore()
        .collection('users')
        .doc(user.uid)
        .onSnapshot(documentSnapshot => {
          if (documentSnapshot.exists) {
            const userData = documentSnapshot.data();
            setUserDetails(userData);
            if (userData.imageUri) {
              setUserImage({ uri: userData.imageUri });
            }
          }
        });
    }
  }, []);

  return (
    
    <View style={styles.container}>
      {/* Custom Header */}
      <KeyboardAwareScrollView keyboardShouldPersistTaps='handled'>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.openDrawer()}>
          <Image source={icons.drawer} style={styles.icon} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>HOME</Text>
      </View>

      {/* Search Bar */}
      <View style={styles.searchBar}>
        <Image source={icons.search} style={styles.searchIcon} />
        <TextInput style={styles.searchInput} placeholder="Search" />
      </View>

      {/* Welcome Text */}
      <Text  style={styles.welcomeText} > Welcome back {userDetails.firstName} {userDetails.lastName}!</Text>
      

      {/* Cards */}
      <View style={styles.cardsContainer}>
        {cardItems.map((item) => (
          <TouchableOpacity
            key={item.id}
            style={[
              styles.card,
              { backgroundColor: selectedCard === item.id ? 'darkblue' : 'white' },
            ]}
            onPress={() => handleCardPress(item.id)}
          >
            <Image
              source={item.icon}
              style={[
                styles.cardIcon,
                { tintColor: selectedCard === item.id ? 'white' : 'grey' },
              ]}
            />
            <Text style={{ color: selectedCard === item.id ? 'white' : 'grey' }}>
              {item.title}
            </Text>
          </TouchableOpacity>
        ))} 
      </View>
      </KeyboardAwareScrollView>

      {/* Plus Button */}
      <TouchableOpacity style={styles.addButton} onPress={() => navigation.navigate('Calendar')}>
        <Text style={styles.add}>+</Text>
      </TouchableOpacity>
    </View>
  );
};

const HomeScreen = () => {
  return (
    <Tab.Navigator
    screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'Home') {
            iconName = focused ? icons.moreOptions : icons.moreOptions;
          } else if (route.name === 'Collection') {
            iconName = focused ? icons.collection : icons.collection;
          } else if (route.name === 'Notes') {
            iconName = focused ? icons.newNotes : icons.newNotes;
          } else if (route.name === 'Scheduled') {
            iconName = focused ? icons.meet : icons.meet;
          } else if (route.name === 'Meetings') {
            iconName = focused ? icons.scheduleMeetings : icons.scheduleMeetings;
          }

          // You can return any component that you like here!
          return <Image source={iconName} style={{ width: 20, height: 20, tintColor: color }} />;
        },
        tabBarActiveTintColor: 'darkblue',
        tabBarInactiveTintColor: 'gray',
        tabBarStyle: [
          {
            display: 'flex'
          },
          null
        ]
      })}
>
    <Tab.Screen name="Home" component={HomeScreenContent} />
    <Tab.Screen name="Collection" component={CollectionScreen} />
    <Tab.Screen name="Notes" component={WriteNoteScreen} />
    <Tab.Screen name="Scheduled" component={CreateMeetingScreen} />
    <Tab.Screen name="Meetings" component={CreateMeetingScreen} />
</Tab.Navigator>

  );
};



const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    padding: width * 0.05,
    marginBottom: height * 0.03,
    backgroundColor: '#FFF',
  },
  icon: {
    width: width * 0.0570,
    height: height * 0.022,
  },
  headerTitle: {
    fontSize: width * 0.0450,
    alignSelf:'center',
    marginLeft: width * 0.32,
    color:'#434343'
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    width: width * 0.9,
    height: height * 0.055,
    borderRadius: 20,
    marginTop: height * 0.007,
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
  welcomeText: {
    fontSize: width * 0.047,
    marginTop: height * 0.05,
    alignSelf: 'flex-start',
    marginLeft: width * 0.05,
    color:'#434343',
    fontWeight: '700'
  },
  cardsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    width: '92%',
    marginTop: height * 0.05,
    alignSelf: 'center'
  },
  card: {
    width: width * 0.42,
    height: height * 0.18,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: height * 0.04,
    backgroundColor: 'white',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  cardIcon: {
    width: width * 0.0660,
    height: height * 0.0329,
    marginBottom: height * 0.04,
  },
  addButton: {
    position: 'absolute',
    bottom: '6%',
    alignSelf: 'center',
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'darkblue',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  add: {
    color: 'white',
    fontSize: 30,
  },
});


export default HomeScreen;