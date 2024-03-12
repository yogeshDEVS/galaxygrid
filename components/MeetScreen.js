import React, { useEffect } from 'react';
import { useIsFocused } from '@react-navigation/native';
import { Linking } from 'react-native';

const MeetScreen = () => {
  const isFocused = useIsFocused();

  useEffect(() => {
    if (isFocused) {
      // Google Meet homepage URL
      const meetUrl = 'https://meet.google.com/';

      // Open the URL in the default browser
      Linking.openURL(meetUrl);
    }
  }, [isFocused]);

  return null;
};

export default MeetScreen;
