# react-native-messenger
Simple messenger for Android coded in React Native

## Mobile app
Messenger application supports login of existing and sign up of new users, where user is defined by his username and password. 
User can also add another person to his contact list, and do tête-à-tête chatting.

## Backend
Backend files are located at the separate <a href="https://github.com/ADJA/react-native-messenger/tree/master/backend">folder</a>. It is 
simple PHP and MySQL backend. Before you run the code, you need to create all required database tables (see backend scripts for details), 
connect php scripts to your database, and provide urls for your backend scripts in the react native code.

*To do:* current code queries the backend server every five seconds to update messages. It would be a good idea to change this all to 
WebSockets or something else to do this realtime, if you want to extensively use the messenger.

## Screenshots

<img src="https://github.com/ADJA/react-native-messenger/blob/master/screenshots/Screenshot_20160220-223619.png" align="left" height="25%" width="25%"/>
<img src="https://github.com/ADJA/react-native-messenger/blob/master/screenshots/Screenshot_20160220-223750.png" align="left" height="25%" width="25%"/>
<img src="https://github.com/ADJA/react-native-messenger/blob/master/screenshots/Screenshot_20160220-223909.png" align="left" height="25%" width="25%"/>

