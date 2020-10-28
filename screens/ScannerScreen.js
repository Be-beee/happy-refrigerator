import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  TouchableOpacity,
  Linking,
  Alert
} from 'react-native';
import QRCodeScanner from 'react-native-qrcode-scanner';
import { db } from "../components/list_modules/dbConnect";
 
export default class ScannerScreen extends Component {
  onSuccess = (e) => {
    Alert.alert(
    '인식 알림',
    '냉장고가 인식되었습니다!\n일련번호:'+e.data,
      [
        {
          text: '재인식',
//          onPress: () => console.log('Cancel Pressed'),
          style: 'cancel',
        },
        {
          text: '확인', 
          onPress: () => {
            const ref = db.ref('users/user1');
            ref.update({ serial: e.data });
            this.props.navigation.navigate('Confirm');
          }
        },
      ],
      {cancelable: false},
    );
//    alert(`냉장고가 인식되었습니다!\n일련번호:${e.data}`);
//    this.props.navigation.navigate('Confirm');
  }
 
  render() {
    return (
      <QRCodeScanner
        onRead={this.onSuccess}
//        flashMode={QRCodeScanner.Constants.FlashMode.torch}      
        topContent={
          <Text style={styles.centerText}>
            QR 코드를 카메라에 스캔해주세요
          </Text>
        }
        style ={{ backgroundColor: '#ebe7dd' }}
      />
    );
  }
}
 
const styles = StyleSheet.create({
  centerText: {
    flex: 1,
    fontSize: 18,
    padding: 32,
    color: '#3D2D0E',
  },
});
 
//AppRegistry.registerComponent('default', () => ScannerScreen);