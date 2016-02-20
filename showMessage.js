'use strict';
import React, {
  Alert,
} from 'react-native';

function showMessage(title, message) {
  Alert.alert(
    title,
    message,
    [
      {text: 'OK', onPress: () => console.log('OK Pressed')},
    ]
  )
}

module.exports = showMessage;