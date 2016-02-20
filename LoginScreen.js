'use strict';
import React, {
  Alert,
  AppRegistry,
  Component,
  StyleSheet,
  Text,
  TextInput,
  ToolbarAndroid,
  TouchableHighlight,
  TouchableOpacity,
  View
} from 'react-native';
import ProgressBar from 'ProgressBarAndroid';

var SERVER_LOGIN_URL = 'Url to login.php here';
var SERVER_SIGNUP_URL = 'Url to signup.php here';

var showMessage = require('./showMessage');

var LoginScreen = React.createClass({
  getInitialState: function() {
    return {
      username: "",
      password: "",
      loading: false,
    };
  },
  showProgressBar: function() {
    this.setState({loading: true});
  },
  hideProgressBar: function() {
    this.setState({loading: false});
  },
  login: function() {
    if (this.state.username === '') {
      showMessage("Something is bad", "Username cannot be empty");
      return;
    }
    if (this.state.password === '') {
      showMessage("Something is bad", "Password cannot be empty");
      return;
    }
    this.showProgressBar();
    fetch(SERVER_LOGIN_URL + '?username=' + this.state.username + '&password=' + this.state.password)
      .then((response) => response.json())
      .then((responseData) => {
        var id = responseData.id;
        if (id === -1) {
          this.hideProgressBar();
          showMessage("Something is bad", "Invalid username and/or password");
        }
        else {
          this.props.navigator.push({
            name: 'contacts',
            password: this.state.password,
            id: id,
            username: this.state.username
          });
        }
      })
      .done();
  },
  signup: function() {
    if (this.state.username === '') {
      showMessage("Something is bad", "Username cannot be empty");
      return;
    }
    if (this.state.password === '') {
      showMessage("Something is bad", "Password cannot be empty");
      return;
    }
    this.showProgressBar();
    fetch(SERVER_SIGNUP_URL + '?username=' + this.state.username + '&password=' + this.state.password)
      .then((response) => response.json())
      .then((responseData) => {
        var id = responseData.id;
        if (id === -1) {
          this.hideProgressBar();
          showMessage("Something is bad", "This username is already taken");
        }
        else {
          this.props.navigator.push({
            name: 'contacts',
            password: this.state.password,
            id: id,
            username: this.state.username
          });
        }
      })
      .done();
  },
  render: function() {
    if (this.state.loading) {
      return (
        <View style = {styles.mainContainer}>
          <ToolbarAndroid
            actions = {[]}
            style = {styles.toolbar}
            titleColor = "white"
            title = {'Login'} />
          <View style = {styles.progressBarContainer}>
            <ProgressBar 
              styleAttr = "Inverse" />
          </View>
        </View>
      );
    } else {
      return (
        <View style={styles.mainContainer}>
          <ToolbarAndroid
            actions = {[]}
            style = {styles.toolbar}
            titleColor = "white"
            title = {'Login'} />
          <View style = {styles.contentContainer}>
            <View style = {styles.inputView}>
              <TextInput 
                style = {styles.textInput}
                placeholder = {'username'}
                text = {this.state.username}
                onChangeText = {(e) => this.setState({username: e})} />
            </View>
            <View style = {styles.inputView}>
              <TextInput 
                style = {styles.textInput}
                placeholder = {'password'}
                text = {this.state.password}
                onChangeText = {(e) => this.setState({password: e})} />
            </View>
            <View style = {styles.buttonsContainer}>
              <TouchableHighlight 
                style = {styles.button}
                onPress = {() => this.login()}> 
                <Text style = {styles.whiteText}>
                  Login
                </Text>
              </TouchableHighlight>
              <TouchableHighlight 
                style = {styles.button}
                onPress = {() => this.signup()}> 
                <Text style = {styles.whiteText}>
                  Sign up
                </Text>
              </TouchableHighlight>
            </View>
          </View>
        </View>
      );
    }
  }
});

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#5d1f9c',
    borderColor: '#5d1f9c',
    borderStyle: 'solid',
    borderWidth: 2,
    marginLeft: 10,
    marginRight: 10,
    marginTop: 20,
    padding: 5,
  },
  buttonsContainer: {
    flexDirection: 'row',
  }, 
  contentContainer: {
    alignItems: 'center',
    backgroundColor: '#f5fcff',
    flex: 1,
    justifyContent: 'center',
  },
  inputView: {
    alignItems: 'center',
    borderColor: '#5d1f9c',
    borderStyle: 'solid',
    borderWidth: 3,
    height: 40,
    justifyContent: 'center',
    marginTop: 20,
  },
  mainContainer: {
    flex: 1,
  },
  progressBarContainer: {
    alignItems: 'center',
    backgroundColor: '#f5fcff',
    flex: 1,
    justifyContent: 'center',
  },
  textInput: {
    alignItems: 'center',
    borderColor: '#5d1f9c',
    borderStyle: 'solid',
    borderWidth: 1,
    justifyContent: 'center',
    textAlign: 'center',
    width: 200,
  },
  toolbar: {
    backgroundColor: '#5d1f9c',
    height: 56,
  },
  whiteText: {
    color: 'white',
  },
});

module.exports = LoginScreen;