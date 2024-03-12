import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, TextInput } from 'react-native';
import CheckBox from '@react-native-community/checkbox';

const styles = StyleSheet.create({
  Maincontainer: {
    flex: 1,
    padding: 20,
    marginBottom:5
  },
  container: {
    flex:1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    borderWidth: 1,
    padding: 10,
    marginBottom: 10,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    width:'60%'
  },
  circle: {
    height: 30,
    width: 30,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: '#000',
    alignItems: 'center',
    justifyContent: 'center',
  },
  selectedCircle: {
    backgroundColor: 'lightblue',
  },
  whiteText: {
    color: '#fff',
  },
  bottomContainer:{
    flex:1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    borderWidth: 1,
    padding: 10,
    marginBottom: 10,
    width:'30%'
  },
  bottomContainer1:{
    flexDirection:'row',
    marginBottom:25,
    margin:5
  }
});

const DrivingTestFormSection = () => {
  const [isSelected, setSelection] = useState(false);
  const [isControlSelected, setControlSelection] = useState(false);
  const [isObservationSelected, setObservationSelection] = useState(false);
  const [isEyesightTestSelected, setEyesightTestSelection] = useState(false);
  const [isReverseRightSelected, setReverseRightSelection] = useState(false);
  const [isReverseParkSelected, setReverseParkSelection] = useState(false);

  return (
    <ScrollView style={styles.Maincontainer}>
      <View>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20, borderWidth:1 }}>
  <View>
    <View style={{ flexDirection: 'row', marginLeft:5}}>
    <Text style={{ height: 40, color:'black', marginTop: 10 }}>Name</Text>
    <TextInput style={{ height: 40, borderColor: 'gray', marginLeft:5 }} />
    </View>
    <View style={{ flexDirection: 'row',marginLeft:5 }}>
    <Text style={{ height: 40, color:'black', marginTop: 10 }}>Date</Text>
    <TextInput style={{ height: 40, borderColor: 'gray', marginLeft:5 }} />
    </View>
    <View style={{ flexDirection: 'row',marginLeft:5 }}>
    <Text style={{ height: 40, color:'black', marginTop: 10 }}>Time</Text>
    <TextInput style={{ height: 40, borderColor: 'gray', marginLeft:5 }} />
    </View>
     
   
  </View>
 
</View>
        <View style={styles.container}>
          <Text style={styles.title}>Eyesight Test</Text>
          <CheckBox
           value={isEyesightTestSelected}
           onValueChange={setEyesightTestSelection}
          />
        </View>

        <Text style={styles.title}>Manoeuvres</Text>

        <View style={styles.container}>
          <Text>Reverse / Right</Text>
          <CheckBox
            value={isReverseRightSelected}
            onValueChange={setReverseRightSelection}
          />
        </View>
        <View style={styles.container}>
          <Text>Reverse park (road)</Text>
          <CheckBox
            value={isReverseParkSelected}
            onValueChange={setReverseParkSelection}
          />
        </View>
        <View style={styles.container}>
          <Text>Reverse park (car park)</Text>
          <CheckBox
            value={isSelected}
            onValueChange={setSelection}
          />
        </View>
        <View style={styles.container}>
          <Text>Forward park</Text>
          <CheckBox
            value={isSelected}
            onValueChange={setSelection}
          />
        </View>

       
        <View style={styles.container}>
        <Text style={styles.title}>Control</Text>
          <TouchableOpacity
            style={[styles.circle, isControlSelected && styles.selectedCircle]}
            onPress={() => setControlSelection(true)}
          >
            <Text style={isControlSelected && styles.whiteText}>S</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.circle, !isControlSelected && styles.selectedCircle]}
            onPress={() => setControlSelection(false)}
          >
            <Text style={!isControlSelected && styles.whiteText}>D</Text>
          </TouchableOpacity>
        </View>

      
        <View style={styles.container}>
        <Text style={styles.title}>Observation</Text>
          <TouchableOpacity
            style={[styles.circle, isObservationSelected && styles.selectedCircle]}
            onPress={() => setObservationSelection(true)}
          >
            <Text style={isObservationSelected && styles.whiteText}>S</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.circle, !isObservationSelected && styles.selectedCircle]}
            onPress={() => setObservationSelection(false)}
          >
            <Text style={!isObservationSelected && styles.whiteText}>D</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.container}>
  <Text style={styles.title}>Show me / Tell me</Text>
  <TouchableOpacity
    style={[styles.circle, isSelected && styles.selectedCircle]}
    onPress={() => setSelection(!isSelected)}
  >
    <Text style={isSelected && styles.whiteText}>S</Text>
  </TouchableOpacity>
  <TouchableOpacity
    style={[styles.circle, !isSelected && styles.selectedCircle]}
    onPress={() => setSelection(!isSelected)}
  >
    <Text style={!isSelected && styles.whiteText}>D</Text>
  </TouchableOpacity>
</View>

<View style={styles.container}>
  <Text style={styles.title}>Controlled stop</Text>
  <TouchableOpacity
    style={[styles.circle, isSelected && styles.selectedCircle]}
    onPress={() => setSelection(!isSelected)}
  >
    <Text style={isSelected && styles.whiteText}>S</Text>
  </TouchableOpacity>
  <TouchableOpacity
    style={[styles.circle, !isSelected && styles.selectedCircle]}
    onPress={() => setSelection(!isSelected)}
  >
    <Text style={!isSelected && styles.whiteText}>D</Text>
  </TouchableOpacity>
</View>

<Text style={styles.title}>Control</Text>
{['Accelerator', 'Clutch', 'Gears', 'Footbrake', 'Parking brake', 'Steering'].map((item) => (
  <View style={styles.container}>
    <Text style={styles.title}>{item}</Text>
    <TouchableOpacity
      style={[styles.circle, isSelected && styles.selectedCircle]}
      onPress={() => setSelection(!isSelected)}
    >
      <Text style={isSelected && styles.whiteText}>S</Text>
    </TouchableOpacity>
    <TouchableOpacity
      style={[styles.circle, !isSelected && styles.selectedCircle]}
      onPress={() => setSelection(!isSelected)}
    >
      <Text style={!isSelected && styles.whiteText}>D</Text>
    </TouchableOpacity>
  </View>
  
  ))}
  <Text style={styles.title}>Move off</Text>
{['Safety', 'Control'].map((item) => (
  <View style={styles.container}>
    <Text style={styles.title}>{item}</Text>
    <TouchableOpacity
      style={[styles.circle, isSelected && styles.selectedCircle]}
      onPress={() => setSelection(!isSelected)}
    >
      <Text style={isSelected && styles.whiteText}>S</Text>
    </TouchableOpacity>
    <TouchableOpacity
      style={[styles.circle, !isSelected && styles.selectedCircle]}
      onPress={() => setSelection(!isSelected)}
    >
      <Text style={!isSelected && styles.whiteText}>D</Text>
    </TouchableOpacity>
  </View>
))}

<Text style={styles.title}>Use of Mirrors</Text>
{['Signalling', 'Change direction', 'Change speed'].map((item) => (
  <View style={styles.container}>
    <Text style={styles.title}>{item}</Text>
    <TouchableOpacity
      style={[styles.circle, isSelected && styles.selectedCircle]}
      onPress={() => setSelection(!isSelected)}
    >
      <Text style={isSelected && styles.whiteText}>S</Text>
    </TouchableOpacity>
    <TouchableOpacity
      style={[styles.circle, !isSelected && styles.selectedCircle]}
      onPress={() => setSelection(!isSelected)}
    >
      <Text style={!isSelected && styles.whiteText}>D</Text>
    </TouchableOpacity>
  </View>
))}

<Text style={styles.title}>Signals</Text>
{['Necessary', 'Correctly', 'Timed'].map((item) => (
  <View style={styles.container}>
    <Text style={styles.title}>{item}</Text>
    <TouchableOpacity
      style={[styles.circle, isSelected && styles.selectedCircle]}
      onPress={() => setSelection(!isSelected)}
    >
      <Text style={isSelected && styles.whiteText}>S</Text>
    </TouchableOpacity>
    <TouchableOpacity
      style={[styles.circle, !isSelected && styles.selectedCircle]}
      onPress={() => setSelection(!isSelected)}
    >
      <Text style={!isSelected && styles.whiteText}>D</Text>
    </TouchableOpacity>
  </View>
  ))}
  <Text style={styles.title}>Junctions</Text>
{['Approach speed', 'Observation', 'Turning right', 'Turning left', 'Cutting corners'].map((item) => (
  <View style={styles.container}>
    <Text style={styles.title}>{item}</Text>
    <TouchableOpacity
      style={[styles.circle, isSelected && styles.selectedCircle]}
      onPress={() => setSelection(!isSelected)}
    >
      <Text style={isSelected && styles.whiteText}>S</Text>
    </TouchableOpacity>
    <TouchableOpacity
      style={[styles.circle, !isSelected && styles.selectedCircle]}
      onPress={() => setSelection(!isSelected)}
    >
      <Text style={!isSelected && styles.whiteText}>D</Text>
    </TouchableOpacity>
  </View>
))}

<Text style={styles.title}>Judgement</Text>
{['Overtaking', 'Meeting', 'Crossing'].map((item) => (
  <View style={styles.container}>
    <Text style={styles.title}> {item}</Text>
    <TouchableOpacity
      style={[styles.circle, isSelected && styles.selectedCircle]}
      onPress={() => setSelection(!isSelected)}
    >
      <Text style={isSelected && styles.whiteText}>S</Text>
    </TouchableOpacity>
    <TouchableOpacity
      style={[styles.circle, !isSelected && styles.selectedCircle]}
      onPress={() => setSelection(!isSelected)}
    >
      <Text style={!isSelected && styles.whiteText}>D</Text>
    </TouchableOpacity>
  </View>
))}
<Text style={styles.title}>Positioning</Text>
{['Normal driving', 'Lane discipline', 'Pedestrian crossings', 'Position/normal stop', 'Awareness planning', 'Clearance', 'Following distance', 'Use of speed'].map((item) => (
  <View style={styles.container}>
    <Text style={styles.title}>{item}</Text>
    <TouchableOpacity
      style={[styles.circle, isSelected && styles.selectedCircle]}
      onPress={() => setSelection(!isSelected)}
    >
      <Text style={isSelected && styles.whiteText}>S</Text>
    </TouchableOpacity>
    <TouchableOpacity
      style={[styles.circle, !isSelected && styles.selectedCircle]}
      onPress={() => setSelection(!isSelected)}
    >
      <Text style={!isSelected && styles.whiteText}>D</Text>
    </TouchableOpacity>
  </View>
))}
<Text style={styles.title}>Progress</Text>
{['Appropriate speed', 'Undue hesitation'].map((item) => (
  <View style={styles.container}>
    <Text style={styles.title}>{item}</Text>
    <TouchableOpacity
      style={[styles.circle, isSelected && styles.selectedCircle]}
      onPress={() => setSelection(!isSelected)}
    >
      <Text style={isSelected && styles.whiteText}>S</Text>
    </TouchableOpacity>
    <TouchableOpacity
      style={[styles.circle, !isSelected && styles.selectedCircle]}
      onPress={() => setSelection(!isSelected)}
    >
      <Text style={!isSelected && styles.whiteText}>D</Text>
    </TouchableOpacity>
  </View>
))}

<Text style={styles.title}>Response to signs / signals</Text>
{['Traffic signs', 'Road markings', 'Traffic lights', 'Traffic controllers', 'Other road users'].map((item) => (
  <View style={styles.container}>
    <Text style={styles.title}>{item}</Text>
    <TouchableOpacity
      style={[styles.circle, isSelected && styles.selectedCircle]}
      onPress={() => setSelection(!isSelected)}
    >
      <Text style={isSelected && styles.whiteText}>S</Text>
    </TouchableOpacity>
    <TouchableOpacity
      style={[styles.circle, !isSelected && styles.selectedCircle]}
      onPress={() => setSelection(!isSelected)}
    >
      <Text style={!isSelected && styles.whiteText}>D</Text>
    </TouchableOpacity>
  </View>
))} 
 <View  style={styles.bottomContainer1}> 
<View style={styles.bottomContainer}>
  <Text style={styles.title}>Total faults</Text>
  <CheckBox
    value={isSelected}
    onValueChange={setSelection}
  />
  </View>
  <View style={{ flexDirection: 'row', alignItems: 'center' }} > 
  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
    <CheckBox
      value={isSelected}
      onValueChange={setSelection}
    />
    <Text>Pass</Text>
  </View>
  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
    <CheckBox
      value={!isSelected}
      onValueChange={setSelection}
    />
    <Text>Fail</Text>
  
</View>
</View>
</View>
<View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20, borderWidth: 1 }}>
  {['ETA', 'Physical', 'Verbal'].map((item) => (
    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
      <CheckBox
        value={isSelected}
        onValueChange={setSelection}
      />
      <Text>{item}</Text>
    </View>
  ))}
</View>

<View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20, borderWidth: 1 }}>
  {['ECO', 'Control', 'Planning'].map((item) => (
    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
      <CheckBox
        value={isSelected}
        onValueChange={setSelection}
      />
      <Text>{item}</Text>
    </View>
  ))}
</View>

      </View>
    </ScrollView>
  );
};

export default DrivingTestFormSection;
