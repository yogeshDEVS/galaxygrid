import React, {useState, useEffect} from 'react';
import { StripeProvider } from '@stripe/stripe-react-native';
import { KeyboardAvoidingView, Platform } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createDrawerNavigator } from '@react-navigation/drawer';
import LoginScreen from './components/LoginScreen';
import SignupScreen from './components/SignupScreen';
import GetStartedScreen from './components/GetStartedScreen';
import HomeScreen from './components/HomeScreen'; // assuming HomeScreen.js is in the same directory
import { View, Text, Image, TouchableOpacity } from 'react-native';
import CreateMeetingScreen from './components/CreateMeetingsScreen'; 
import WriteNoteScreen from './components/WriteNoteScreen';
import CollectionScreen from './components/CollectionScreen';
import SubscriptionScreen from './components/SubscriptionScreen';
import AddCardScreen from './components/AddCardScreen';
import PaymentSuccessScreen from './components/PaymentSuccessScreen';
import MeetScreen from './components/MeetScreen';
import { KeyboardAwareView } from 'react-native-keyboard-aware-view';
import auth from '@react-native-firebase/auth';
import firebase from '@react-native-firebase/app';
import firestore from '@react-native-firebase/firestore';
import NoteScreen from './components/NotesScreen';
import AllUsersScreen from './components/AllUsersScreen';
import SavedNoteScreen from './components/SavedNoteScreen';
import UserScreen from './components/UserScreen';
import storage from '@react-native-firebase/storage';
import ScheduleMeetingScreen from './components/ScheduledMeetingsScreen';
import CalendarScreen from './components/CalendarScreen';
import DrivingTestScreen from './components/DrivingTestScreen';
import DrivingTestForm from './components/DrivingTestForm';
import ImportContactsScreen from './components/ImportContactsScreen';
import AddClientScreen from './components/AddClientScreen';
import NewClientScreen from './components/NewClientScreen';
import SmsScreen from './SmsScreen';







if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

const firebaseConfig = {
  apiKey: "AIzaSyCom1ZXGJmMqBvQdZSAyeu9kUQaWKT6MwU",
  authDomain: "diarylatest-88632.firebaseapp.com",
  databaseURL: "https://diarylatest-88632.firebaseio.com",
  projectId: "diarylatest-88632",
  storageBucket: "diarylatest-88632.appspot.com",
  messagingSenderId: "866393106718",
  appId: "1:866393106718:android:c01dccdc7a4bc0782ec10f"
};


const Stack = createStackNavigator();
const Drawer = createDrawerNavigator();
const drawerItems = [
  { name: 'Notes', icon: require('./assets/notes.png'), target: 'WriteNote' },
  { name: 'Calendar', icon: require('./assets/calendarnew.png'), target: 'CreateMeetings' },
  { name: 'Instruction Diagram', icon: require('./assets/instruction.png'), target: 'Subscription' },
  { name: 'Driving Test', icon: require('./assets/driving.png'), target: 'DrivingTestForm' },
  { name: 'Settings', icon: require('./assets/settings.png'), target: 'Subscription' },
  { name: 'Help', icon: require('./assets/help.png'), target: 'Subscription' },
];

const CustomDrawerContent = (props) => {

  const [userDetails, setUserDetails] = useState({});
  const [userImage, setUserImage] = useState(require('./assets/defaultimg.png'));

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

  const handleLogout = () => {
    auth()
      .signOut()
      .then(() => {
        console.log('User signed out!');
        props.navigation.navigate('SIGN IN');
      });
  };
  return (
    <View style={{ flex: 1 }}>
      {/* User Details */}
      <TouchableOpacity onPress={() => props.navigation.navigate('UserScreen')}>
        <View style={{ flexDirection: 'row', alignItems: 'center', margin: 20 }}>
        <Image source={userImage} style={{ width: 50, height: 50, borderRadius: 40 }} />
          <View style={{ marginLeft: 10 }}>
            <Text style={{ fontSize: 19, color: '#0C0B32' }}>{userDetails.firstName} {userDetails.lastName}</Text>
            <Text style={{ fontSize: 11, color: 'gray' }}>{auth().currentUser.email}</Text>
          </View>
        </View>
      </TouchableOpacity>
      {/* Drawer Items */}
      <View style={{ marginVertical: 20 }}>
        {drawerItems.map((item, index) => (
          <TouchableOpacity
            key={index}
            style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 25, marginTop:10 }}
            onPress={() => props.navigation.navigate(item.target)}
          >
            <Image source={item.icon} style={{ width: 21, height: 21, marginRight: 15, marginLeft: 12 }} />
            <Text style={{ fontSize: 15, color: '#434343' }}>{item.name}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <TouchableOpacity style={{ position: 'absolute', bottom: '15%', left: 0, right: 150, height: 50, justifyContent: 'center', alignItems: 'center', borderRadius: 5, flexDirection: 'row'  }} onPress={handleLogout}>
        <Image source={require('./assets/logout.png')} style={{ width: 20, height: 18, marginRight: 10 }} />
        <Text style={{ fontSize: 15, color: '#434343'  }}>Log Out</Text>
      </TouchableOpacity>
    </View>
  );
};

const HomeNavigator = () => {
  return (
    <Drawer.Navigator initialRouteName="HomeDrawer" drawerContent={props => <CustomDrawerContent {...props} />}>
      <Drawer.Screen name="HomeDrawer" component={HomeScreen} options={{ headerShown: false }}  />
    </Drawer.Navigator>
  );
};


const App = () => {
  return (
    <StripeProvider publishableKey="pk_test_51OqamVSB1jj7UmQH74b8HRVXyi0PzMYagOzjgqOV4VMbDk2kTUqPIQNMlF0VnbAp2BelmyqJHj3WmEu5ApuQGUSS00EGoeN730">
    <KeyboardAvoidingView 
    behavior={Platform.OS === 'ios' ? 'margin' : 'height'}
    style={{ flex: 15 }}
    keyboardVerticalOffset={Platform.OS === 'ios' ? 40 : 0}
  >  
    <NavigationContainer>
      <Stack.Navigator initialRouteName="SIGN IN">
        <Stack.Screen name="SIGN IN" component={LoginScreen} options={{ headerShown: false }} />
        <Stack.Screen name="SIGN UP" component={SignupScreen} options={{ headerShown: false }} />
        <Stack.Screen name="AddCard" component={AddCardScreen}  options={{ headerShown: false }} />
        <Stack.Screen name="CreateMeetings" component={CreateMeetingScreen}  options={{ headerShown: false }} />
        <Stack.Screen name="NotesScreen" component={NoteScreen}  options={{ headerShown: false }} />
        <Stack.Screen name="SavedNote" component={SavedNoteScreen}  options={{ headerShown: false }} />
        <Stack.Screen name="Calendar" component={CalendarScreen}  options={{ headerShown: false }} />
        <Stack.Screen name="AddClient" component={AddClientScreen}  options={{ headerShown: false }} />
        <Stack.Screen name="SmsScreen" component={SmsScreen}  options={{ headerShown: false }} />
        <Stack.Screen name="NewClient" component={NewClientScreen}  options={{ headerShown: false }} />
        <Stack.Screen name="ScheduleMeeting" component={ScheduleMeetingScreen}  options={{ headerShown: false }} />
        <Stack.Screen name="UserScreen" component={UserScreen}  options={{ headerShown: false }} />
        <Stack.Screen name="AllUsers" component={AllUsersScreen}  options={{ headerShown: false }} />
        <Stack.Screen name="PaymentSuccess" component={PaymentSuccessScreen}  options={{ headerShown: false }} />
        <Stack.Screen name="Meet" component={MeetScreen}  options={{ headerShown: false }} />
        <Stack.Screen name="ImportContacts" component={ImportContactsScreen}  options={{ headerShown: false }} />
        <Stack.Screen name="CollectionScreen" component={CollectionScreen}  options={{ headerShown: false }} />
        <Stack.Screen name="Subscription" component={SubscriptionScreen}  options={{ headerShown: false }} />
        <Stack.Screen name="DrivingTestForm" component={DrivingTestForm}  options={{ headerShown: false }} />
        <Stack.Screen name="WriteNote" component={WriteNoteScreen}  options={{ headerShown: false }} />
        <Stack.Screen name="GetStartedScreen" component={GetStartedScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Home" component={HomeNavigator} options={{ headerShown: false }} />
      </Stack.Navigator>
    </NavigationContainer>
    </KeyboardAvoidingView>
    </StripeProvider>
  );
};

export default App;
