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
  View
} from 'react-native';
import InvertibleScrollView from 'react-native-invertible-scroll-view';
import ProgressBar from 'ProgressBarAndroid';
import Prompt from 'react-native-prompt';

var SERVER_GET_MESSAGES_URL = 'Url to get_messages.php here';
var SERVER_ADD_MESSAGES_URL = 'Url to add_message.php here';

var TimerMixin = require('react-timer-mixin');
var showMessage = require('./showMessage');

var ChatScreen = React.createClass({
  mixins: [TimerMixin],
  getInitialState: function() {
    return {
      dataSource: new ListView.DataSource({
        rowHasChanged: (row1, row2) => row1 !== row2,
      }),
      messages: [],
      newMessage: '',
      loading: false,
    };
  },
  componentDidMount: function() {
    this.update();
  },
  showProgressBar: function() {
     this.setState({loading: true})
  },
  hideProgressBar: function() {
     this.setState({loading: false})
  },
  getMessages: function(showProgressBar) {
    if (showProgressBar)
      this.showProgressBar();
    fetch(SERVER_GET_MESSAGES_URL + '?id=' + this.props.id + '&password=' + this.props.password + '&contact_id=' + this.props.contactId)
      .then((response) => response.json())
      .then((responseData) => {
        if (showProgressBar)
          this.hideProgressBar();
        var messagesCopy = responseData;
        var oldMessagesNumber = this.state.messages.length;
        messagesCopy.reverse();
        this.setState({
          messages: messagesCopy,
          dataSource: this.state.dataSource.cloneWithRows(messagesCopy),
        });
        if (oldMessagesNumber < messagesCopy.length)
          this.scrollToTheBottom();
      })
      .done();
  },
  update: function() {
    this.getMessages(true);
    this.setInterval(
      () => {this.getMessages(false);},
      5000
    );
  },
  scrollToTheBottom: function() {
    this.refs.list.getScrollResponder().scrollTo(0);
  },
  sendNewMessage: function() {
    var message = this.state.newMessage;
    if (message) {
      this.refs['newMessage'].setNativeProps({text: ''});
      var messagesCopy = this.state.messages.slice();
      for (var i = messagesCopy.length; i > 0; i--) {
        messagesCopy[i] = messagesCopy[i - 1];
      }
      messagesCopy[0] = {
        from_id: this.props.id,
        to_id: this.props.contactId,
        message: message
      }
      this.setState({
        dataSource: this.state.dataSource.cloneWithRows(messagesCopy),
        messages: messagesCopy,
        newMessage: '',
      });
      this.scrollToTheBottom();
      fetch(SERVER_ADD_MESSAGES_URL + '?id=' + this.props.id + '&password=' + this.props.password + '&contact_id=' + this.props.contactId + '&message=' + message)
        .then((response) => response.json())
        .then((responseData) => {
        })
        .done();
    }
  },
  render: function() {
    if (this.state.loading) {
      return (
        <View style = {styles.mainContainer}>
          <ToolbarAndroid
            style = {styles.toolbar}
            titleColor = "white"
            title = {'Chat with ' + this.props.contactUsername} />
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
              style = {styles.toolbar}
              titleColor = "white"
              title = {'Chat with ' + this.props.contactUsername} />
          <View style = {styles.contentContainer}>
            <ListView
              ref = "list"
              renderScrollComponent={props => <InvertibleScrollView {...props} inverted />}
              dataSource = {this.state.dataSource}
              renderRow  ={this.renderMessage}
              style = {styles.listView} />
            <View style = {styles.inputAndSendView}>
              <TextInput 
                ref = {'newMessage'}
                style = {styles.inputMessage}
                placeholder = {'Enter new message here'}
                text = {this.state.newMessage}
                onChangeText = {(e) => this.setState({newMessage: e})} />
              <TouchableHighlight 
                style = {styles.sendButton}
                onPress = {() => this.sendNewMessage()}> 
                <Text style = {styles.whiteText}>
                  SEND
                </Text>
              </TouchableHighlight>
            </View>
          </View>
        </View>
      );
    }
  },
  renderMessage: function(message) {
    if (message.from_id === this.props.id) {
      return (
        <View style = {styles.userMessageRow}>
          <View style = {styles.userMessageContainer}>
            <Text style = {styles.userMessage}>
              {message.message}
            </Text>
          </View>
        </View>
      );
    } else {
      return (
        <View style = {styles.contactMessageRow}>
          <View style = {styles.contactMessageContainer}>
            <Text style = {styles.contactMessage}>
              {message.message}
            </Text>
          </View>
        </View>
      );
    }
  }
});

const styles = StyleSheet.create({
  contentContainer: {
    backgroundColor: '#f5fcff',
    flex: 1,
  },
  contactMessage: {
    color: 'black',
  },
  contactMessageContainer: {
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    borderRadius: 5,
    justifyContent: 'center',
    marginBottom: 10,
    marginTop: 10,
    marginLeft: 10,
    padding: 5
  },
  contactMessageRow: {
    alignItems: 'flex-start',
  },
  listView: {
    backgroundColor: '#f5fcff',
    flex: 1,
  },
  inputAndSendView: {
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
    borderColor: '#5d1f9c',
    borderStyle: 'solid',
    borderTopWidth: 2,
    flexDirection: 'row', 
    height: 40,
    justifyContent: 'center',
    marginTop: 10
  },
  inputMessage: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
    textAlign: 'center',
  },
  inputView: {
    alignItems: 'center',
    flex: 80,
    justifyContent: 'center',
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
  sendButton: {
    alignItems: 'center',
    backgroundColor: '#5d1f9c',
    height: 40,
    justifyContent: 'center',
    padding: 5,
    width: 80,
  },
  sendButtonView: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
  },
  toolbar: {
    backgroundColor: '#5d1f9c',
    height: 56,
  },
  userMessage: {
    color: 'white',
  },
  userMessageContainer: {
    alignItems: 'center',
    backgroundColor: '#5d1f9c',
    borderRadius: 5,
    justifyContent: 'center',
    marginBottom: 10,
    marginTop: 10,
    marginRight: 10,
    padding: 5
  },
  userMessageRow: {
    alignItems: 'flex-end',
  },
  whiteText: {
    color: 'white',
  },
});

module.exports = ChatScreen;