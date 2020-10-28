import React from 'react';
import { createAppContainer, createSwitchNavigator } from 'react-navigation';
import firebase from 'react-native-firebase';
import type { RemoteMessage } from 'react-native-firebase';
import { AsyncStorage, Alert } from 'react-native';

import tabNavigator from './navigation/MainTabNavigator';
import ScannerScreen from './screens/ScannerScreen';
import LoginScreen from './screens/LoginScreen';
import ConfirmScreen from './screens/ConfirmScreen';
import CameraScreen from './screens/CameraScreen';


const AppNavigator = createSwitchNavigator({
    Login: LoginScreen,
    Scanner: ScannerScreen,
    Confirm: ConfirmScreen,
    Main: tabNavigator,
    Camera: CameraScreen,
    
  });

const AppContainer = createAppContainer(AppNavigator);

export default class App extends React.Component {

  async componentDidMount() {
//    const functions = require("firebase-functions");
    this.checkPermission();
    this.createNotificationListeners();
    const enabled = await firebase.messaging().hasPermission();
    if (enabled) {
      firebase.messaging().getToken().then(fcmToken => {
          if (fcmToken) {
//            console.log(fcmToken);
            firebase.database().ref("/tokens/").set({
                email: "maybutter756@gmail.com",
                notification_token: fcmToken,
                created_at: Date.now(),
              })
              .then(res => {
                console.log(res);
              });
          } else {
          alert("user doesn't have a device token yet");
          }
        });
    } else {
      alert("no");
    }
  }
  
  componentWillUnmount() {
    this.notificationListener();
    this.notificationOpenedListener();
  }

  async createNotificationListeners() {
    /*
    * Triggered when a particular notification has been received in foreground
    * */
    this.notificationListener = firebase.notifications().onNotification((notification) => {
        const { title, body } = notification;
        this.showAlert(title, body);
    });

    /*
    * If your app is in background, you can listen for when a notification is clicked / tapped / opened as follows:
    * */
    this.notificationOpenedListener = firebase.notifications().onNotificationOpened((notificationOpen) => {
        const { title, body } = notificationOpen.notification;
        this.showAlert(title, body);
    });

    /*
    * If your app is closed, you can check if it was opened by a notification being clicked / tapped / opened as follows:
    * */
    const notificationOpen = await firebase.notifications().getInitialNotification();
    if (notificationOpen) {
        const { title, body } = notificationOpen.notification;
        this.showAlert(title, body);
    }
    /*
    * Triggered for data only payload in foreground
    * */
    this.messageListener = firebase.messaging().onMessage((message) => {
      //process data message
      console.log(JSON.stringify(message));
    });
  }

  showAlert(title, body) {
    Alert.alert(
      title, body,
      [
          { text: 'OK', onPress: () => console.log('OK Pressed') },
      ],
      { cancelable: false },
    );
  }
  

    //1
  async checkPermission() {
    const enabled = await firebase.messaging().hasPermission();
    if (enabled) {
        this.getToken();
    } else {
        this.requestPermission();
    }
  }

    //3
  async getToken() {
    let fcmToken = await AsyncStorage.getItem('fcmToken');
    if (!fcmToken) {
        fcmToken = await firebase.messaging().getToken();
        if (fcmToken) {
            // user has a device token
            await AsyncStorage.setItem('fcmToken', fcmToken);
        }
    }
  }

    //2
  async requestPermission() {
    try {
        await firebase.messaging().requestPermission();
        // User has authorised
        this.getToken();
    } catch (error) {
        // User has rejected permissions
        console.log('permission rejected');
    }
  }
  render() {
    console.disableYellowBox = true;
    return <AppContainer />;
  }
}

