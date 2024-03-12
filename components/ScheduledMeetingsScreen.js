import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, StyleSheet, ScrollView } from 'react-native';
import firestore from '@react-native-firebase/firestore';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Picker } from '@react-native-picker/picker';

const ScheduleMeetingScreen = () => {
  const [title, setTitle] = useState('');
  const [date, setDate] = useState(new Date());
  const [mode, setMode] = useState('date');
  const [show, setShow] = useState(false);
  const [time, setTime] = useState('12:00 AM');
  const [guests, setGuests] = useState('');
  const [location, setLocation] = useState('');
  const [creator, setCreator] = useState('');
  const [description, setDescription] = useState('');

  const [users, setUsers] = useState([]);

  const handleScheduleMeeting = async () => {
    await firestore().collection('meetings').add({
      title: title,
      date: date,
      time: time,
      guests: guests,
      location: location,
      creator: creator,
      description: description,
      timestamp: firestore.FieldValue.serverTimestamp(),
    });
    console.log('Meeting scheduled');
    Alert.alert('Meeting scheduled!');
  };

  useEffect(() => {
    const fetchUsers = async () => {
      const usersDocument = await firestore().collection('users').get();
      const usersData = usersDocument.docs.map(doc => ({ ...doc.data(), id: doc.id }));
      setUsers(usersData);
    };

    fetchUsers();
  }, []);
  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setShow(Platform.OS === 'ios');
    setDate(currentDate);
  };

  const showMode = (currentMode) => {
    setShow(true);
    setMode(currentMode);
  };

  const showDatepicker = () => {
    showMode('date');
  };

  return (
    <ScrollView> 
    <View style={styles.container}>
      <Text style={styles.header}>Schedule Meeting</Text>
      <Text style={styles.label}>Meeting Title</Text>
      <TextInput style={styles.input} placeholder="Enter meeting title" onChangeText={setTitle} />
      <TouchableOpacity onPress={showDatepicker} style={styles.dateButton}>
        <Text>{date.toLocaleDateString()}</Text>
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
      <Text style={styles.label}>Select Time</Text>
      <Picker
        selectedValue={time}
        onValueChange={(itemValue, itemIndex) => setTime(itemValue)}
      >
        <Picker.Item label="12:00 AM-1:00 AM" value="12:00 AM-1:00 AM" />
        <Picker.Item label="01:00 AM-2:00 AM" value="01:00 AM-2:00 AM" />
        <Picker.Item label="02:00 AM-03:00 AM" value="02:00 AM-03:00 AM" />
        <Picker.Item label="03:00 AM-04:00 AM" value="03:00 AM-04:00 AM" />
        <Picker.Item label="04:00 AM-05:00 AM" value="04:00 AM-05:00 AM" />
        <Picker.Item label="05:00 AM-06:00 AM" value="05:00 AM-06:00 AM" />
        <Picker.Item label="06:00 AM-07:00 AM" value="06:00 AM-07:00 AM" />
        <Picker.Item label="07:00 AM-08:00 AM" value="07:00 AM-08:00 AM" />
        
      </Picker>
      <Text style={styles.label}>Add Guests</Text>
      <Picker
        selectedValue={guests}
        onValueChange={(itemValue, itemIndex) => setGuests(itemValue)}
      >
        {users.map(user => (
          <Picker.Item key={user.id} label={user.phoneNumber} value={user.phoneNumber} />
        ))}
      </Picker>
      <Text style={styles.label}>Add Location</Text>
      <TextInput style={styles.input} placeholder="Enter location" onChangeText={setLocation} />
      <Text style={styles.label}>Event Creator</Text>
      <TextInput style={styles.input} placeholder="Enter your name" onChangeText={setCreator} />
      <Text style={styles.label}>Add Description</Text>
      <TextInput style={styles.descriptionInput} multiline placeholder="Type here..." onChangeText={setDescription} />
      <TouchableOpacity style={styles.createButton} onPress={handleScheduleMeeting}>
        <Text style={styles.createButtonText}>SCHEDULE</Text>
      </TouchableOpacity>
    </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#F5F5F5',
  },
  header: {
    fontSize: 25,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    color: '#333',
    marginBottom: 10,
  },
  input: {
    height: 50,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 15,
    backgroundColor: '#fff',
    marginBottom: 20,
  },
  dateButton: {
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 10,
    marginBottom: 20,
  },
  descriptionInput: {
    height: 150,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 15,
    backgroundColor: '#fff',
    marginBottom: 20,
    textAlignVertical: 'top',
  },
  createButton: {
    height: 50,
    borderRadius: 10,
    backgroundColor: '#1E90FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  createButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default ScheduleMeetingScreen;
