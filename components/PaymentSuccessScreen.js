import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Dimensions } from 'react-native';

// Get the screen's width and height
const { width, height } = Dimensions.get('window');

const PaymentSuccessScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.header}>PAYMENT SUCCESS</Text>
      <View style={styles.card}>
        <Image source={require('../assets/paysuccess.png')} style={styles.icon} />
        <Text style={styles.title}>Payment Success!</Text>
        <Text style={styles.description}>Congratulations! Your payment has been confirmed</Text>
        <View style={styles.subscription}>
  <View style={styles.iconContainer}>
    <Image source={require('../assets/crown.png')} style={styles.crownIcon} />
  </View>
  <View>
    <Text style={styles.subtext}>Movees 1 Year Subscription</Text>
    <Text style={styles.offertext}>You save over 15%</Text>
  </View>
</View>

        <View style={styles.priceContainer}>
  <Text style={styles.price}>Subscription fee:</Text>
  <Text style={styles.price}>$119.98</Text>
</View>
<View style={styles.priceContainer}>
  <Text style={styles.price}>Tax fee:</Text>
  <Text style={styles.price}>$2.4</Text>
</View>
<View style={styles.priceContainer}>
  <Text style={styles.price}>Total:</Text>
  <Text style={styles.totalprice}>$123.38</Text>
</View>

        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>Use Now!</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: width * 0.05, // 5% of screen width
    backgroundColor: '#fff',
  },
  header: {
    fontSize: width * 0.0425, // 4.25% of screen width
    alignSelf: 'center',
    color: '#434343',
    marginBottom: height * 0.02, // 26% of screen height
  },
  card: {
    padding: width * 0.05, // 5% of screen width
    borderColor: 'gray',
   
    borderRadius: 10,
    marginBottom: height * 0.02, // 2% of screen height
    alignItems: 'center',
    
  },
  icon: {
    width: width * 0.86, // 15% of screen width
    height: height * 0.33, // 15% of screen height
    marginBottom: height * 0.02, // 2% of screen height
    borderRadius: 15
  },
  iconcrown: {
    width: width * 0.11, // 15% of screen width
    height: height * 0.05,
    marginRight: 15
  },
  title: {
    fontSize: width * 0.06, // 6% of screen width
    fontWeight: 'bold',
    marginBottom: height * 0.01, // 1% of screen height
    color: '#434343',
  },
  description: {
    fontSize: width * 0.04, // 4% of screen width
    marginBottom: height * 0.02, // 2% of screen height
    color: '#807C83',
  },
  subscription: {
    flexDirection: 'row', // Add this line
    alignItems: 'center', // Add this line
    fontSize: width * 0.045, // 4.5% of screen width
    fontWeight: '700',
    marginBottom: height * 0.01, // 1% of screen height
    color: '#434343',
  },
  iconContainer: {
    backgroundColor: '#e8f8ff', // Add this line
    padding: width * 0.02, // 2% of screen width
    borderRadius: 10, // Add this line
    marginRight: width * 0.05, // 2% of screen width
    marginBottom: width * 0.05, 
    marginTop: width * 0.05, 
    alignItems:'center'
  },
  
  
  
  offer: {
    fontSize: width * 0.04, // 4% of screen width
    marginBottom: height * 0.01, // 1% of screen height
    color: '#434343',
  },
  priceContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: height * 0.02, // 2% of screen height
  },
  price: {
    fontSize: width * 0.04, // 4% of screen width
    color: '#434343',
  },
  totalprice:{
    fontSize: width * 0.04, // 4% of screen width
    color: 'blue',
  },
  subtext:{
    fontSize: width * 0.04, // 4% of screen width
    color: '#434343',
    fontWeight:'700'
  },
  offertext:{
    fontSize: width * 0.034, // 4% of screen width
    color: 'gray',
    
  },
  
  total: {
    fontSize: width * 0.04, // 4% of screen width
    fontWeight: 'bold',
    color: '#434343',
  },
 
  crownIcon: {
    width: width * 0.055, // 5% of screen width
    height: height * 0.03, // 5% of screen height
    marginRight: width * 0.040, // 2% of screen width
    marginLeft: width * 0.040,
  },
    
  button: {
    backgroundColor: '#0000ff',
    padding: height * 0.0125, // 1.25% of screen height
    borderRadius: 20,
    alignItems: 'center',
    marginTop: height * 0.02, // 2% of screen height
    width: width * 0.85, // 90% of screen width
  },
  buttonText: {
    color: '#fff',
    fontSize: width * 0.0425, // 4.25% of screen width
    fontWeight: '600',
  },
});

export default PaymentSuccessScreen;
