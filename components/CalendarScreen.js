import React, { useState, useRef, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, ScrollView, StyleSheet, Image, Dimensions} from 'react-native';
  
const { width, height } = Dimensions.get('window');

const CalendarScreen = ({ navigation }) => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedTime, setSelectedTime] = useState('12:00 AM');
  const [startDate, setStartDate] = useState(new Date());
  useEffect(() => {
    setSelectedDate(startDate);
  }, [startDate]);

  const dates = Array.from({ length: 5 }, (_, i) => new Date(startDate.getTime() + 86400000 * i));
  const times = Array.from({ length: 48 }, (_, i) => `${Math.floor(i / 2)}:${i % 2 === 0 ? '00' : '30'} ${i < 24 ? 'AM' : 'PM'}`);

  const dateScrollRef = useRef();
  const gridScrollRef = useRef();

  const handleDatePress = (date) => {
    setSelectedDate(date);
    navigation.navigate('CreateMeetings', { date: date.toISOString() });
  };

  const handleTimePress = (time) => {
    setSelectedTime(time);
  };

  const handleCellPress = (date, time) => {
    setSelectedDate(date);
    setSelectedTime(time);
    navigation.navigate('CreateMeetings', { date: date.toISOString(), time });
  };

  const handleDateScroll = (event) => {
    const x = event.nativeEvent.contentOffset.x;
    gridScrollRef.current.scrollTo({ x, animated: false });
  };

  const handleGridScroll = (event) => {
    const x = event.nativeEvent.contentOffset.x;
    dateScrollRef.current.scrollToOffset({ offset: x, animated: false });
  };

  const handleNextPress = () => {
    setStartDate(prevDate => new Date(prevDate.getTime() + 5 * 86400000));
  };

  const handleBackPress = () => {
    setStartDate(prevDate => new Date(prevDate.getTime() - 5 * 86400000));
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Calendar</Text>
      </View>
      <FlatList
        ref={dateScrollRef}
        horizontal
        onScroll={handleDateScroll}
        scrollEventThrottle={16}
        data={[{ isPlaceholder: true }, ...dates]}
        renderItem={({ item: date, index }) => (
          date.isPlaceholder ?
            <View style={styles.emptyCell}>
              <TouchableOpacity onPress={handleBackPress}>
                <Image style={styles.backimg} source={require('../assets/back.png')} />
              </TouchableOpacity>
              <TouchableOpacity onPress={handleNextPress}>
                <Image style={styles.nextimg} source={require('../assets/nexti.png')} />
              </TouchableOpacity>
            </View>
            :
            <TouchableOpacity onPress={() => handleDatePress(date)} style={styles.dateButton}>
              <Text style={styles.dateText}>{date.toDateString()}</Text>
            </TouchableOpacity>
        )}
        keyExtractor={(item, index) => index.toString()}
      />
      <ScrollView
        ref={gridScrollRef}
        onScroll={handleGridScroll}
        scrollEventThrottle={16}
      >
        {times.map((time, i) => (
          <View key={i} style={styles.row}>
            <TouchableOpacity onPress={() => handleTimePress(time)} style={styles.timeButton}>
              <Text style={styles.timeText}>{time}</Text>
            </TouchableOpacity>
            <ScrollView horizontal>
              {dates.map((date, j) => (
                <TouchableOpacity key={j} style={styles.cell} onPress={() => handleCellPress(date, time)}>
                  <View style={styles.cellContent} />
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        ))}
      </ScrollView>
    </View>
  );
};







const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
  },
  headerTitle: {
    fontSize: width * 0.04, // 4% of screen width
    alignSelf:'center',
    color:'#434343'
  },
  header: {
    alignItems:'center',
    alignSelf:'center',
    marginBottom: height * 0.01, // 1% of screen height
    marginTop: height * 0.01, // 1% of screen height
  },
  emptyCell: {
    width: width * 0.16, // 15% of screen width
    height: height * 0.075, // 7.5% of screen height
    borderColor: '#ddd',
    borderWidth: 1,
    backgroundColor: '#f0f0f0',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dateButton: {
    width: width * 0.16, // 15% of screen width
    height: height * 0.075, // 7.5% of screen height
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: '#ddd',
    borderWidth: 1,
  },
  dateText: {
    fontSize: width * 0.03, // 3% of screen width
    color: '#333',
  },
  row: {
    flexDirection: 'row',
  },
  timeButton: {
    width: width * 0.16, // 15% of screen width
    height: height * 0.075, // 7.5% of screen height
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: '#ddd',
    borderWidth: 1,
  },
  timeText: {
    fontSize: width * 0.0325, // 3.25% of screen width
    color: '#333',
  },
  cell: {
    width: width * 0.16, // 15% of screen width
    height: height * 0.075, // 7.5% of screen height
    borderColor: '#ddd',
    borderWidth: 1,
  },
  cellContent: {
    flex: 1,
    backgroundColor: 'lightblue', // Dark gray
  },
  backimg: {
    width: width * 0.05, // 5% of screen width
    height: height * 0.025, // 2.5% of screen height
  },
  nextimg: {
    width: width * 0.05, // 5% of screen width
    height: height * 0.025, // 2.5% of screen height
  },
});

export default CalendarScreen;
