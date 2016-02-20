'use strict';
import React, {
  Alert,
  AppRegistry,
  Component,
  ListView,
  StyleSheet,
  Text,
  TextInput,
  ToolbarAndroid,
  TouchableHighlight,
  TouchableOpacity,
  View
} from 'react-native';
import ProgressBar from 'ProgressBarAndroid';
import Prompt from 'react-native-prompt';

var SERVER_ADD_CONTACT_URL = 'Url to add_contact.php here'
var SERVER_GET_CONTACTS_URL = 'Url to get_contacts.php here';

var showMessage = require('./showMessage');

var ContactsScreen = React.createClass({
  getInitialState: function() {
    return {
        isPromptVisible: false,
        dataSource: new ListView.DataSource({
          rowHasChanged: (row1, row2) => row1 !== row2,
        }),
        contacts: [],
        loading: false
    };
  },
  promptNewContact: function() {
    this.setState({isPromptVisible: true})
  },
  showProgressBar: function() {
    this.setState({loading: true})
  },
  hideProgressBar: function() {
    this.setState({loading: false})
  },
  addNewContact: function(username) {
    this.setState({
      isPromptVisible: false,
    });
    if (username === this.props.username) {
      showMessage('This is your username', 'You cannot add yourself to contacts!');
      return;
    }
    for (var i = 0; i < this.state.contacts.length; i++) {
      if (username === this.state.contacts[i].username) {
        showMessage('Existing Contact', 'Contact ' + username + ' already exists');
        return;
      }
    }
    this.showProgressBar();
    fetch(SERVER_ADD_CONTACT_URL + '?id=' + this.props.id + '&password=' + this.props.password + '&contact_username=' + username)
      .then((response) => response.json())
      .then((responseData) => {
        this.hideProgressBar();
        var result = responseData.result;
        var contactId = responseData.contact_id;
        if (result === 0) {
          console.log("Success");
          var newContacts = this.state.contacts.slice();
          newContacts[newContacts.length] = {
            contact_id: contactId,
            username: username
          }
          this.setState({
            dataSource: this.state.dataSource.cloneWithRows(newContacts),
            contacts: newContacts
          });
          showMessage('Contact added', 'User ' + username + ' was added to your contacts');
        }
        else {
          showMessage('Not Found', 'User ' + username + ' not found');
          console.log("Bad");
        }
      })
      .done();
  },
  onActionSelected: function(position) {
    if (position === 0) { // index of 'Add New Contact'
      this.promptNewContact();
    }
  },
  componentDidMount: function() {
    this.getContacts();
  },
  getContacts: function() {
    this.showProgressBar();
    fetch(SERVER_GET_CONTACTS_URL + '?id=' + this.props.id + '&password=' + this.props.password)
      .then((response) => response.json())
      .then((responseData) => {
        this.hideProgressBar();
        this.setState({
          contacts: responseData,
          dataSource: this.state.dataSource.cloneWithRows(responseData),
        });
      })
      .done();
  },
  goToChat: function(contact) {
    this.props.navigator.push({
      name: 'chat',
      id: this.props.id,
      password: this.props.password,
      username: this.props.username,
      contactId: contact.contact_id,
      contactUsername: contact.username
    });
  },
  render: function() {
    if (this.state.loading) {
      return (
        <View style = {styles.mainContainer}>
          <ToolbarAndroid
            actions = {[]}
            style = {styles.toolbar}
            titleColor = "white"  
            title = {'Contacts'} />
          <View style = {styles.progressBarContainer}>
            <ProgressBar 
              styleAttr = "Inverse" />
          </View>
        </View>
      );
    }
    else {
      return (
        <View style = {styles.mainContainer}>
          <ToolbarAndroid
              actions = {[{title: 'Add New Contact', show: 'never'}]}
              onActionSelected = {this.onActionSelected}
              style = {styles.toolbar}
              titleColor = "white"
              title = {'Contacts'} />
          <View style = {styles.contentContainer}>
            <ListView
              dataSource = {this.state.dataSource}
              renderRow = {this.renderContact}
              style = {styles.listView} />
          </View>
          <Prompt
            title = "Enter username of new contact"
            placeholder = "username"
            visible = {this.state.isPromptVisible}
            onCancel = {() => this.setState({isPromptVisible: false})}
            onSubmit = {(username) => this.addNewContact(username)} />
        </View>
      );
    }
  },
  renderContact: function(contact) {
    return (
      <View style = {styles.contactContainer}>
        <TouchableOpacity
          activeOpacity = {0.8}
          onPress = {() => this.goToChat(contact)}>
          <Text 
            style = {styles.contact} >
            {contact.username}
          </Text>
        </TouchableOpacity>
      </View>
    );
  }
});

const styles = StyleSheet.create({
  contact: {
    color: '5d1f9c',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    marginLeft: 15,
    marginTop: 15,
  },
  contactContainer: {
    backgroundColor: '#f5fcff',
    borderBottomWidth: 2,
    borderColor: '#5d1f9c',
    borderStyle: 'solid',
    borderTopWidth: 0,
    flex: 1,
    marginLeft: 5,
    marginRight: 5,
  },
  contentContainer: {
    backgroundColor: '#f5fcff',
    flex: 1,
    justifyContent: 'center',
  },
  listView: {
    backgroundColor: '#f5fcff',
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
  toolbar: {
    backgroundColor: '#5d1f9c',
    height: 56,
  },
});

module.exports = ContactsScreen;