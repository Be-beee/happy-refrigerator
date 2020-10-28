import React from "react";
import { Image, StyleSheet, Text, View, TouchableOpacity, Alert } from "react-native";
import { db } from "../components/list_modules/dbConnect";

export default class LoginScreen extends React.Component {
  
  static navigationOptions = {
    header: null,
  };
  
  _doLogin() {
    const ref = db.ref('users/user1');
    ref.once("value", (data) =>{
      if(data.val().serial != 'test'){
        this.props.navigation.navigate('Main');
      }else {
        Alert.alert(
        '알림',
        '등록된 냉장고가 없습니다. QR코드 스캔 화면으로 이동합니다.',
          [
            {
              text: '취소',
//            onPress: () => console.log('Cancel Pressed'),
              style: 'cancel',
            },
            {
              text: '확인', 
              onPress: () => {
                this.props.navigation.navigate('Scanner');
//                this.props.navigation.navigate('Camera');
              }
            },
          ],
          {cancelable: false},
        );
      }
    })
    
  }
  
  render(){
    return (
      <View style={styles.container}>
        <View style={styles.title}>
          <Image style={styles.thumbnail} source={require("../components/img/logo.png")} />
          <Text style={styles.welcome}>환영합니다!</Text>
          <Text style={{ fontSize: 16, textAlign: 'center' }}>시작하기를 눌러 행복한 냉장고 애플리케이션을 사용해보세요!</Text>
        </View>
        <TouchableOpacity onPress={this._doLogin.bind(this)} style = {styles.startbtn}>
          <Text style = {{ fontSize: 16 }}>시작하기</Text>
        </TouchableOpacity>
      </View>
    );
  }
  
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: "center",
      flexDirection: "column",
      backgroundColor: '#ebe7dd'
    },
    thumbnail: {
        flex: 1,
        resizeMode: "contain",
        width: 150,
        height: 150,
        paddingTop: 150,
    },
    title: {
      alignItems: 'center'
    },
    welcome: {
      fontSize: 30,
      fontWeight: 'bold',
      padding: 20
    },
    startbtn: {
      alignItems: 'center',
      marginTop: 100,
      margin: 20,
      padding: 20,
      backgroundColor: '#60C14F',
      borderRadius: 10
      
    }
    
});