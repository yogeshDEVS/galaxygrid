import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, Dimensions } from 'react-native';
import CheckBox from '@react-native-community/checkbox';
import { useNavigation } from '@react-navigation/native';
import { CardField, useStripe, StripeProvider } from '@stripe/stripe-react-native';

// Get the screen's width and height
const { width, height } = Dimensions.get('window'); 

const AddCardScreen = () => {
  const [isSelected, setSelection] = useState(false);
  const [cardComplete, setCardComplete] = useState(false);
  const navigation = useNavigation();
  const { confirmPayment, handleCardAction } = useStripe();
  const cardFieldRef = React.useRef();
  const stripe = useStripe();
  
  const handlePayPress = async () => {
    // Add a slight delay to ensure cardDetails is updated
    setTimeout(async () => {
      // Create a PaymentIntent on your server
      const response = await fetch('http://192.168.68.103:3000/create-payment-intent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: 1198, // The amount you want to charge in cents
        }),
      });
      const { clientSecret } = await response.json();
    
      // Get card details
      const cardDetails = cardFieldRef.current?.details;
    
      // Check if card details are complete
      if (!cardDetails || !cardDetails.complete) {
        console.log('Please complete all card details');
        return;
      }
      
      // Confirm the payment
      const { error, paymentIntent } = await confirmPayment(clientSecret, {
  type: 'Card',
  card: cardDetails,
});


      if (error) {
        console.log('Payment failed', error);
      } else if (paymentIntent) {
        console.log('Payment succeeded', paymentIntent);
        navigation.navigate('PaymentSuccess');
      }
    }, 1000); // Adjust the delay as needed
  };
  
  return (
      <View style={styles.container}>
        <Text style={styles.header}>ADD CARD</Text>
        <Text style={styles.header2}>Add Card</Text>
        <CardField
          ref={cardFieldRef}
          postalCodeEnabled={true}
          placeholder={{
            number: '4242 4242 4242 4242',
          }}
          cardStyle={{
            backgroundColor: '#FFFFFF',
            textColor: '#000000',
          }}
          style={{
            width: '100%',
            height: 50,
            marginVertical: 30,
          }}
          onCardChange={(cardDetails) => {
            console.log('cardDetails', cardDetails);
            setCardComplete(cardDetails.complete);
          }}
          onFocus={(focusedField) => {
            console.log('focusField', focusedField);
          }}
        />
        {!cardComplete && <Text>Please complete all card details</Text>}
        <TouchableOpacity style={styles.button} onPress={handlePayPress}>
          <Text style={styles.buttonText}>Pay $11.98/month</Text>
        </TouchableOpacity>
        <View style={styles.checkboxContainer}>
          <CheckBox
            value={isSelected}
            onValueChange={setSelection}
            style={styles.checkbox}
          />
          <Text style={styles.label}>Accept all the requirements that we have provided.</Text>
        </View>
        <Text style={styles.text}>Or continue with</Text>
      </View>
    );
}




      
  


const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: width * 0.05, // 5% of screen width
    backgroundColor:'white'
  },
  header: {
    fontSize: width * 0.0425, // 4.25% of screen width
    alignSelf:'center',
    color:'#434343',
    marginBottom: height * 0.12, // 26% of screen height
  },
  header2: {
    fontSize: width * 0.0425, // 4.25% of screen width
    fontWeight:'700',
    color:'#434343',
    marginBottom: height * 0.02, // 26% of screen height
    marginLeft: height * 0.02,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
    position: 'relative',
  },
  icon: {
      height: 20,
      width: 20,
      position: 'absolute',
      zIndex: 1,
      left: 20,
      right:20,
      marginBottom:5,
      alignSelf:'center',
      paddingBottom:10
  },
  inputWithIcon: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 0.4,
    flex: 1,
    marginLeft: 10,
    paddingLeft: 50, // leave space for the icon
    borderRadius:15,
    width:'95%',
    marginBottom: '2%',
    color:'black'
  },
  button: {
    backgroundColor: '#0000ff',
    padding: height * 0.0125, // 1.25% of screen height
    borderRadius: 25,
    alignItems: 'center',
    marginBottom: height * 0.01, // 1% of screen height
    marginTop: height * 0.015, // 1.5% of screen height
    width: width * 0.86, // 95% of screen width
    alignSelf:'center'
  },
  buttonText: {
    color: '#fff',
    fontSize: width * 0.04, // 4% of screen width
  },
  checkboxContainer: {
    flexDirection: 'row',
    marginBottom: height * 0.02, // 2% of screen height
  },
  checkbox: {
    alignSelf: 'center',
  },
  label: {
    margin: height * 0.005, // 0.5% of screen height
    fontSize: width * 0.0325, // 3.25% of screen width
    color: 'gray'
  },
  text: {
    marginTop: height * 0.01, // 1% of screen height
    alignSelf:'center',
    color: 'gray'
  },
});

export default AddCardScreen;



{/* <View style={styles.inputContainer}>
      
      <Image source={require('../assets/user.png')} style={styles.icon} />
        <TextInput placeholder="Name" style={styles.inputWithIcon} />
      </View>
      <View style={styles.inputContainer}>
      <Image source={require('../assets/sms-tracking.png')} style={styles.icon} />
        <TextInput placeholder="Card Number" style={styles.inputWithIcon} keyboardType="numeric" />
      </View>
      <View style={styles.inputContainer}>
      <Image source={require('../assets/calendarnew.png')} style={styles.icon} />
        <TextInput placeholder="MM/YY" style={styles.inputWithIcon} keyboardType="numeric" />
      </View>
      <View style={styles.inputContainer}>
      <Image source={require('../assets/lock.png')} style={styles.icon} />
        <TextInput placeholder="CVV" style={styles.inputWithIcon} keyboardType="numeric" />
      </View>
      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('PaymentSuccess')} >
        <Text style={styles.buttonText}>Pay $11.98/month</Text>
      </TouchableOpacity>
      <View style={styles.checkboxContainer}>
        <CheckBox
          value={isSelected}
          onValueChange={setSelection}
          style={styles.checkbox}
        />
        <Text style={styles.label}>Accept all the requirements that we have provided.</Text>
      </View>
      <Text style={styles.text}>Or continue with</Text>
    </View> */}