import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, Dimensions, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native'; 
import auth from '@react-native-firebase/auth';
import firebase from '@react-native-firebase/app';

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


const { width, height } = Dimensions.get('window');

const LoginScreen = () => {
  const navigation = useNavigation(); 
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [hidePassword, setHidePassword] = useState(true);
  

  const handleLogin = () => {
    if (email === '' || password === '') {
      Alert.alert(
        'Fields Empty',
        'Please fill in the email and password fields',
        [
          {text: 'OK', onPress: () => console.log('OK Pressed')}
        ],
        {cancelable: false}
      );
    } else {
      auth()
        .signInWithEmailAndPassword(email, password)
        .then(() => {
          console.log('User signed in!');
          navigation.navigate('Home');
        })
        .catch(error => {
          let errorMessage = '';
          if (error.code === 'auth/user-not-found') {
            errorMessage = 'No user found with this email address!';
          } else if (error.code === 'auth/wrong-password') {
            errorMessage = 'Wrong password!';
          } else {
            errorMessage = error.message;
          }
          Alert.alert(
            'Login Error',
            errorMessage,
            [
              {text: 'OK', onPress: () => console.log('OK Pressed')}
            ],
            {cancelable: false}
          );
        });
    }
  };
  
  return (
    <View style={styles.container}>
       <View style={styles.header}>
        <Text style={styles.headerTitle}>SIGN IN</Text>
      </View>
          <View style={styles.contentContainer}>
          <View style={styles.IntialContainer}>
      <Text style={styles.greeting}>Welcome to One2One App</Text>
      <Text style={styles.subheading}>Please sign in with your account</Text>
      </View>
      <Text style={styles.fieldTitle}>Email</Text>
      <View style={styles.inputContainer}>
  <TextInput
    style={styles.input}
    value={email}
    onChangeText={setEmail}
    placeholder="Enter your email"
  />
  <Image source={require('../assets/sms-tracking.png')} style={styles.icon} />
</View>
<Text style={styles.fieldTitle}>Password</Text>
<View style={styles.inputContainer}>
  <TextInput
    style={styles.input}
    value={password}
    onChangeText={setPassword}
    placeholder="Enter your password"
    secureTextEntry={hidePassword}
  />
  <Image source={require('../assets/lock.png')} style={styles.icon} />
  <TouchableOpacity onPress={() => setHidePassword(!hidePassword)} style={styles.eyeIcon}>
    <Image source={require('../assets/eye-slash.png')} />
  </TouchableOpacity>
</View>

      <TouchableOpacity onPress={() => {}}>
        <Text style={styles.forgotPassword}>Forgot Password?</Text>
      </TouchableOpacity>

      </View>
      <TouchableOpacity style={styles.signInButton} onPress={handleLogin}>
        <Text style={styles.signInText}>Sign In</Text>
      </TouchableOpacity>
      <View style={styles.createAccountContainer}>
        <Text style={styles.createAccount}>Don't have an account?</Text>
        <TouchableOpacity onPress={() => navigation.navigate('SIGN UP')}>
          <Text style={styles.createAccountLink}> Create Account</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: width * 0.04,
    backgroundColor: 'white',
  },
  greeting: {
    fontSize: width * 0.06,
    marginBottom: height * 0.015,
    fontWeight: 'bold',
    color:'#434343'
  },
  headerTitle: {
    fontSize: width * 0.042,
    alignSelf:'center',
    color:'#434343'
  },  
  subheading: {
    fontSize: width * 0.0375,
    marginBottom: height * 0.02,
    color: '#727272'
  },
  fieldTitle: {
    fontSize: width * 0.04,
    marginBottom: height * 0.015,
    fontWeight: 'bold',
    color: '#434343'
  },
  inputContainer: {
    flexDirection: 'row',
    minHeight: '10%',
    paddingLeft: width * 0.025,
    marginBottom: height * 0.01,
    alignItems: 'center',
    backgroundColor: '#FFF',
    borderRadius: 10,
    shadowColor: 'lightgray',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.20,
    shadowRadius: 3.84,
    elevation: 4,
  },
  icon: {
    position: 'absolute',
    left: width * 0.025,
    width: width * 0.05,
    height: height * 0.025,
    zIndex: 1,
  },
  eyeIcon: {
    position: 'absolute',
    right: width * 0.025,
    zIndex: 1,
  },
  input: {
    flex: 1,
    height: height * 0.05,
    paddingLeft: width * 0.075,
    marginTop: 10,
    marginBottom: 10,
    zIndex: 0,
    color:'black'
  },
  forgotPassword: {
    textAlign: 'right',
    marginBottom: height * 0.02,
    color:'#434343',
    fontSize: width * 0.0375,
  },
  signInButton: {
    backgroundColor: 'darkblue',
    padding: height * 0.0125,
    alignItems: 'center',
    marginBottom: height * 0.01,
    borderRadius: 23,
    position: 'absolute',
    bottom: height * 0.17,
    left: width * 0.04,
    right: width * 0.04,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  signInText: {
    color: 'white',
    fontSize: width * 0.045,
  },
  createAccountContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    position: 'absolute',
    bottom: height * 0.13600,
    left: width * 0.04,
    right: width * 0.04,
  },
  createAccount: {
    textAlign: 'center',
    color:'#7a7776'
  },
  createAccountLink: {
    color: 'darkblue',
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'center',
    marginBottom: height * 0.230,
  },
  IntialContainer: {
    marginBottom: height * 0.03375,
  }
});

export default LoginScreen;