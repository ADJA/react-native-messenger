'use strict';
var React = require('react-native');
var {
  AppRegistry,
  BackAndroid,
  Navigator,
  StyleSheet,
  View,
} = React;

var LoginScreen = require('./LoginScreen');
var ContactsScreen = require('./ContactsScreen');
var ChatScreen = require('./ChatScreen');

var navigator;
BackAndroid.addEventListener('hardwareBackPress', () => {
  if (navigator && navigator.getCurrentRoutes().length > 1) {
    navigator.pop();
    return true;
  }
  return false;
});

var RouteMapper = function(route, navigationOperations, onComponentRef) {
  navigator = navigationOperations;
  if (route.name === 'login') {
    return (
      <LoginScreen 
        navigator = {navigationOperations}>
      </LoginScreen>
    );
  } else if (route.name === 'contacts') {
    return (
      <ContactsScreen 
        navigator = {navigationOperations}
        id = {route.id}
        password = {route.password}
        username = {route.username}>
      </ContactsScreen>
    );
  } else if (route.name === 'chat') {
    return (
      <ChatScreen 
        navigator = {navigationOperations}
        id = {route.id}
        password = {route.password}
        username = {route.username}
        contactId = {route.contactId}
        contactUsername = {route.contactUsername}>
      </ChatScreen>
    );
  }
};

var Messenger = React.createClass({
  render: function() {
    var initialRoute = {name: 'login'};
    return (
      <Navigator
        style = {styles.container}
        initialRoute = {initialRoute}
        configureScene = {() => Navigator.SceneConfigs.FadeAndroid}
        renderScene = {RouteMapper} />
    );
  }
});

var styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    flex: 1,
  },
});

AppRegistry.registerComponent('Messenger', () => Messenger);
module.exports = Messenger;