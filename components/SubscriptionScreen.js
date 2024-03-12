import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Dimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';

// Get the screen's width and height
const { width, height } = Dimensions.get('window');

const SubscriptionScreen = () => {
  const [selectedSubscription, setSelectedSubscription] = useState(null);
  const navigation = useNavigation(); 

  const subscriptions = [
    { id: 1, title: 'Yearly', price: '$99.99/year', includes: 'Includes family sharing' },
    { id: 2, title: 'Monthly', price: '$39.99/year', originalPrice: '$79.99/year', includes: 'Includes family sharing', discount: '50% OFF' },
    { id: 3, title: 'Free', price: '$0 / 7 Day trials', includes: 'Includes family sharing' },
  ];

  const handleSubscriptionPress = (id) => {
    setSelectedSubscription(id);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>SUBSCRIPTION</Text>
      <Text style={styles.subHeader}>App Premium</Text>
      <Text style={styles.description}>Be the chance to get exclusive offers and the latest news on our product directly in application.</Text>
      <ScrollView>
      {subscriptions.map((subscription) => (
  <TouchableOpacity
    key={subscription.id}
    style={[
      styles.subscriptionCard,
      selectedSubscription === subscription.id ? styles.selectedSubscriptionCard : null,
    ]}
    onPress={() => handleSubscriptionPress(subscription.id)}
  >
    <View style={styles.checkboxContainer}>
      <View style={selectedSubscription === subscription.id ? styles.checkedCircle : styles.circle}>
        {selectedSubscription === subscription.id && <Text style={styles.checkMark}>✓</Text>}
      </View>
    </View>
    <View style={styles.subscriptionDetails}>
      {subscription.discount && (
        <Text style={styles.subscriptionDiscount}>{subscription.discount}</Text>
      )}
      <Text style={styles.subscriptionTitle}>{subscription.title}</Text>
      <View style={styles.priceContainer}>
      <Text style={styles.subscriptionPrice}>{subscription.price}</Text>  
        {subscription.originalPrice && <Text style={styles.subscriptionOriginalPrice}>{subscription.originalPrice}</Text>}
       
      </View>
      <Text style={styles.subscriptionIncludes}>{subscription.includes}</Text>
    </View>
  </TouchableOpacity>
))}


      </ScrollView>
      <Text style={styles.autoRenewal}>Auto recurring</Text>
      <Text style={styles.offerText}>
  <Text style={styles.originalPrice}>$79.99/year</Text> $39.99/year (50% OFF)
</Text>
      {/* <TouchableOpacity style={styles.subscribeButton} onPress={() => navigation.navigate('AddCard')}>
        <Text style={styles.subscribeButtonText}>Subscribe Now</Text>
      </TouchableOpacity> */}
    
<TouchableOpacity style={styles.subscribeButton} onPress={() => navigation.navigate('AddCard', { subscription: selectedSubscription })}>
  <Text style={styles.subscribeButtonText}>Subscribe Now</Text>
</TouchableOpacity>



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
    alignSelf:'center',
    color:'#434343'
  },
  subHeader: {
    fontSize: width * 0.045, // 4.5% of screen width
    marginBottom: height * 0.01, // 1% of screen height
    alignSelf:'center',
    marginTop: height * 0.05, // 5% of screen height
    fontWeight:'700',
    color:'#434343'
  },
  description: {
    fontSize: width * 0.04, // 4% of screen width
    marginBottom: height * 0.02, // 2% of screen height
    color:'#807C83'
  },
  selectedSubscriptionCard: {
    backgroundColor: '#e8f8ff',
    borderRadius: 12,
    padding: width * 0.05, // 5% of screen width
    marginBottom: height * 0.02, // 2% of screen height
  },
  subscriptionTitle: {
    fontSize: width * 0.045, // 4.5% of screen width
    fontWeight: '700',
    color:'#434343'
  },
  subscriptionPrice: {
    fontSize: width * 0.04, // 4% of screen width
    color: '#434343',
    marginBottom: height * 0.01, // 1% of screen height
    marginRight: width * 0.0225, // 2.25% of screen width
  },
  subscriptionOriginalPrice: {
    fontSize: width * 0.0325, // 3.25% of screen width
    color: 'gray',
    textDecorationLine: 'line-through',
    marginBottom: height * 0.01, // 1% of screen height
  },
  subscriptionIncludes: {
    fontSize: width * 0.04, // 4% of screen width
    color: 'gray',
  },
  subscriptionDiscount: {
    fontSize: width * 0.03, // 3% of screen width
    color: 'white',
    backgroundColor: 'blue',
    position: 'absolute',
    bottom: '80%',
    right: -12,
    padding: width * 0.015, // 1.5% of screen width
    borderRadius: 23,
  },
  selectedSubscriptionText: {
    color: 'white',
  },
  autoRenewal: {
    fontSize: width * 0.04, // 4% of screen width
    color: 'gray',
    marginTop: height * 0.02, // 2% of screen height
    marginBottom: height * 0.10, // 2% of screen height
  },
  subscribeButton: {
    height: height * 0.052, // 4% of screen height
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,
    backgroundColor: 'blue',
    width: width * 0.85, // 90% of screen width
    alignSelf:'center'
  },
  subscribeButtonText: {
    color: '#fff',
    fontSize: width * 0.0425, // 4.25% of screen width
    fontWeight: '600',
  },
  originalPrice: {
    textDecorationLine: 'line-through',
    marginRight: width * 0.0125, // 1.25% of screen width
    color:'#807C83'
  },
  offerText: {
    fontSize: width * 0.0325, // 3.25% of screen width
    color: 'gray',
    textAlign: 'center',
    marginBottom: height * 0.01, // 1% of screen height
    color:'#434343'
  },
  circle: {
    width: width * 0.066, // 6% of screen width
    height: height * 0.033, // 2.4% of screen height
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#000',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: height * 0.015, // 1.5% of screen height
  },
  checkedCircle: {
    width: width * 0.066, // 6% of screen width
    height: height * 0.033, // 2.4% of screen height
    borderRadius: 12,
    backgroundColor: 'blue',
    alignItems: 'center',
    justifyContent: 'center',
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkMark: {
    color: 'white',
    fontSize: width * 0.0375, // 3.75% of screen width
  },
  subscriptionCard: {
    flexDirection: 'row',
    padding: width * 0.05, // 5% of screen width
    borderColor: 'gray',
    borderWidth: 0.5,
    borderRadius: 10,
    marginBottom: height * 0.02, // 2% of screen height
  },
  checkboxContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  subscriptionDetails: {
    flex: 4,
    marginLeft: width * 0.025, // 2.5% of screen width
  },
});

export default SubscriptionScreen;