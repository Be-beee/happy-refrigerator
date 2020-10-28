import React from "react";
import { Image, StyleSheet, Text, View, TouchableOpacity } from "react-native";

export default class ConfirmScreen extends React.Component {
  
  static navigationOptions = {
    header: null,
  };
  
  _doLogin() {
    this.props.navigation.navigate('Main')
  }
  
  render(){
    return (
      <View style={styles.container}>
        <View style={styles.title}>
          <Image style={styles.thumbnail} source={require("../components/img/logo.png")} />
          <Text style={styles.welcome}>등록되었습니다!</Text>
        </View>
        <TouchableOpacity onPress={this._doLogin.bind(this)} style = {styles.startbtn}>
          <Text style = {{ fontSize: 16 }}>메인으로</Text>
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
        paddingTop: 150
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