import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, Dimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';

// Get the screen's width and height
const { width, height } = Dimensions.get('window');

const GetStartedScreen = () => {
  const navigation = useNavigation();
 

  return (
    <View style={styles.container}>
      <Image source={require('../assets/getstartedimg.png')} style={styles.backgroundImage} />
      <View style={styles.titleContainer}>
        <Text style={styles.title}>Fillout Your Emotion</Text>
        <Text style={styles.title}>With Writing a Note</Text>
      </View>
      <TouchableOpacity style={styles.getStartedButton} onPress={() => navigation.navigate('Home')}>
        <Text style={styles.getStartedText}>Get Started</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: width * 0.04, // 4% of screen width
    backgroundColor: 'white',
  },
  backgroundImage: {
    top: -height * 0.05, // 5% of screen height
    left: 0,
    right: 0,
    alignSelf:'center',
    width: width * 1.1, // 110% of screen width
    height: height * 0.75, // 75% of screen height
  },
  titleContainer: {
    position: 'absolute',
    bottom: height * 0.1, // 10% of screen height
    alignItems: 'center',
    marginBottom: height * 0.01, // 1% of screen height
    width: '100%',
  },
  title: {
    fontSize: width * 0.07, // 7% of screen width
    fontWeight: 'bold',
    textAlign: 'center',
    color:'#434343',
    marginLeft: width * 0.05, // 5% of screen width
  },
  getStartedButton: {
    backgroundColor: '#0000FF',
    padding: height * 0.0125, // 1.25% of screen height
    alignItems: 'center',
    borderRadius: 23,
    marginTop: height * 0.085, // 8.5% of screen height
    width: width * 0.85, // 85% of screen width
    alignSelf:'center'
  },
  getStartedText: {
    color: 'white',
    fontSize: width * 0.04, // 4% of screen width
  },
});

export default GetStartedScreen;