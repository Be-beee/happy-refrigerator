import React from "react";
import { Image, StyleSheet, Text, View, TouchableOpacity, FlatList, TextInput, Picker, Alert, ScrollView } from "react-native";
import IngList from "../components/list_modules/IngList";
import Modal from "react-native-modal";
import DatePicker from "react-native-datepicker";
import { db } from "../components/list_modules/dbConnect";


export default class HomeScreen extends React.Component {
  state = {
    visibleModal: null,
    addName: '',
    date: '2019-11-22',
    quantity: '1',
    arrayHolder: [],
    request: '',
    reqnum: 1
  };
  updateQuantity = (quantity) => {
      this.setState({ quantity: quantity })
  };
  /*updateName = (data) => {
    const getData = this.props.navigation.getParam('ingInfo', '');
    if(getData != ''){
      pname = getData.substring(0, (getData.indexOf('\n')));
      this.setState({addName: pname});
    }
    else{
      this.setState({ addName: data });
    }
  }
  updateDate = (date) => {
    const getData = this.props.navigation.getParam('ingInfo', '');
    if(getData != ''){
      pdate = getData.substring((getData.indexOf('\n')));
      this.setState({date: pdate});
    }
    else {
      this.setState({date: date});
    }
  }*/

  reqItem = () => {
    const qref = db.ref('/request/');
    const iref = db.ref('ting/');
    if(this.state.request == ''){
      Alert.alert('알림','원하는 식재료명을 입력해주세요!');
    }
    else{
      iref.once("value", (snap)=>{
        var isExist = false;
        snap.forEach((child) => {
          if(child.val().name == this.state.request){
            Alert.alert('알림','이미 등록되어있는 식재료입니다.');
            isExist = true;
          }
        });
        if(!isExist){
          qref.once("value", (snap)=>{
            var i = 0;
            snap.forEach((child) => {
              if(child.val().name == this.state.request){
                qref.child(child.key).update({ reqnum: child.val().reqnum+1 });
                i = 1;
                Alert.alert('알림', '요청되었습니다!');
              }
            });
            if(i == 0){
              qref.push({ name: this.state.request, reqnum: 1 });
              Alert.alert('알림', '요청되었습니다!');
            }
          });
          this.setState({visibleModal: 'null'});
        }
      });
    }
    
  }
  addItem = () => {
    const pnum = db.ref().length;
    const iref = db.ref('users/user1/ing');
    const tref = db.ref('ting/');
    const rref = db.ref('users/user1/recipe');
    const trref = db.ref('trecipe/');
    if(this.state.addName == ''){
      Alert.alert('알림', '추가할 식재료명을 입력해주세요!');
    }
    else{
      tref.once("value", (snap) => {
        var isSupported = false;
        snap.forEach((child) => {
          if(child.val().name == this.state.addName){
            var iurl = child.val().img;
            
            iref.once("value", (idata) => {
              var isUpdated = false;
              idata.forEach((ichild) => {
                if(ichild.val().name == this.state.addName){
                  if(ichild.val().expiration == this.state.date) {
                    iref.child(ichild.key).update({ quantity: ichild.val().quantity+parseInt(this.state.quantity) });
                    isUpdated = true;
                  }
                }
              });
              if(!isUpdated){
                iref.push({ name: this.state.addName, quantity: parseInt(this.state.quantity), expiration: this.state.date, imgUrl: iurl });
              }
            });
            
            isSupported = true;
            return;
          }
        });
        if(!isSupported){
          iref.push({ name: this.state.addName, quantity: parseInt(this.state.quantity), expiration: this.state.date, imgUrl: 'https://png.pngtree.com/element_our/20190601/ourlarge/pngtree-green-pepper-free-png-picture-image_1330636.jpg' });
          /*Alert.alert(
            'ㅠㅠ',
            '아직 인식이 지원되지 않는 식재료입니다.'
          );*/
        }
      });
      trref.once("value", (snap) => {
        snap.forEach((child) => {
          if(child.val().mainIng == this.state.addName){
            rref.once("value",(data) => {
              var isThere = 0;
              data.forEach((rchild) => {
                if(rchild.val().ingredients == this.state.addName) {
                  isThere = 1;
                }
              });
              if(isThere == 0){
                rref.push({ rname: child.val().rname, rimgUrl: child.val().trimg, ingredients: child.val().mainIng, subIng: child.val().subIng, rcontents: child.val().contents, });
              }
            });
            
          }
        });
      });
      Alert.alert('알림', '식재료가 추가되었습니다!');
      this.setState({visibleModal: 'null'});
    }
    
  }
  
  componentDidMount() { 
    this._ismounted = true;
    
  }

  render() {
    return ( 
    <View style={styles.container}>

      <Modal
        isVisible={this.state.visibleModal === 'request'}
        style={{ overflow: 'hidden' }}
      >
        <View style={{ flex: 1, backgroundColor: '#ebe7dd', flexDirection:'column', alignItems: 'stretch', justifyContent: 'center' }}>
          <View style={{ alignItems: 'center' }}>
            <Text style={{ fontSize: 30, fontWeight: 'bold', paddingBottom: 20, }}>
              신청하기</Text>
            <Text style={{ fontSize: 16, textAlign: 'center'}}>원하는 재료 이름을 입력해주세요!</Text>
            <Text style={{ fontSize: 16, textAlign: 'center'}}>많은 사람이 신청할수록 일찍 반영됩니다.</Text>
          </View>
            <TextInput
              style={{ height: 50, margin: 20, marginTop: 50, backgroundColor: 'white' }}
              placeholder="여기에 입력하세요!"
              onChangeText={(text) => this.setState({ request: text })}
              value={this.state.text}
            />
            <View style={{ flexDirection: 'row', margin: 10, marginTop: 80 }}>
              <TouchableOpacity
                onPress={() => this.setState({visibleModal: 'null'})}
                style = {{ flex:1, backgroundColor: '#3D2D0E', padding: 15, alignItems: 'center'  }}>
                <Text style={{ width: 125, color: 'white', 
                               fontWeight: 'bold', fontSize: 16, textAlign: 'center' }}>취소</Text>
              </TouchableOpacity>
                <TouchableOpacity
                onPress={this.reqItem}
                style = {{ flex: 1, backgroundColor: '#3D2D0E', padding: 15, marginLeft: 10, alignItems: 'center' }}>
                <Text style={{ width: 125, color: 'white', 
                               fontWeight: 'bold', fontSize: 16, textAlign: 'center' }}>확인</Text>
              </TouchableOpacity>
            </View>
        </View>
      </Modal>

      <Modal
        isVisible={this.state.visibleModal === 'additem'}
        style={{ overflow: 'hidden' }}
      >
        <View style={{ flex: 1, backgroundColor: '#ebe7dd', flexDirection:'column', alignItems: 'stretch', justifyContent: 'center', paddingTop: 30 }}>
          <Text style={{ fontSize: 30, fontWeight: 'bold', paddingBottom: 20,  textAlign: 'center' }}>식재료 추가</Text>
          <ScrollView style={{ marginTop: 15 }}>
            <Text style={{ paddingLeft: 20, fontSize: 16, }}>재료명</Text>
            <TextInput
              style={{ width: '87%', height: 50, backgroundColor: 'white', margin: 20, marginTop: 10 }}
              placeholder="재료명"
              value={this.state.text}
              onChangeText={(data) => {this.setState({addName: data})}}
            /> 
            <Text style={{ paddingLeft: 20, fontSize: 16, }}>수량</Text>
            <Picker selectedValue = {this.state.quantity} onValueChange = {this.updateQuantity} style={{ width: '87%', height: 50, backgroundColor: 'white', margin: 20, marginTop: 10 }}>
               <Picker.Item label = "1" value = "1" />
               <Picker.Item label = "2" value = "2" />
               <Picker.Item label = "3" value = "3" />
               <Picker.Item label = "4" value = "4" />
               <Picker.Item label = "5" value = "5" />
            </Picker>
            <Text style={{ paddingLeft: 20, fontSize: 16, }}>유통기한</Text>
            <DatePicker style={{ width: '87%', height: 50, backgroundColor: 'white', margin: 20, marginTop: 10 }} date={this.state.date} mode="date" placeholder="날짜를 선택하세요" format="YYYY-MM-DD" minDate={new Date()} maxDate="2021-12-31" confirmBtnText="확인" cancelBtnText="취소" onDateChange={(date) => {this.setState({date: date})}} />
            
          </ScrollView>
          <View>
            <TouchableOpacity style = {{ width: '60%', backgroundColor: '#3D2D0E', margin: 10, padding: 10, alignItems: 'center', borderRadius: 20, alignSelf: 'center' }} onPress = {() => {this.props.navigation.navigate('Camera');}} >
              <Text style={{ color: '#fff', }}>라벨 인식하기</Text>    
            </TouchableOpacity>
          </View>
          <View style={{ flexDirection: 'row', margin: 10, marginTop: 0 }}>
            <TouchableOpacity
              onPress={() => this.setState({visibleModal: 'null'})}
              style = {{ flex: 1, backgroundColor: '#3D2D0E', padding: 15, alignItems: 'center' }}>
              <Text style={{ width: 125, color: 'white', 
                             fontWeight: 'bold', fontSize: 16, textAlign: 'center' }}>취소</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={this.addItem}
              style = {{ flex: 1, backgroundColor: '#3D2D0E', padding: 15, marginLeft: 10, alignItems: 'center' }}>
              <Text style={{ width: 125, color: 'white', 
                             fontWeight: 'bold', fontSize: 16, textAlign: 'center' }}>확인</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <View style={styles.titleLogo}>
          <Image style={styles.thumbnail} source={require("../components/img/logo.png")} />
          <Text style={styles.title}>Food List</Text>
      </View>

      <View style={styles.contents}>
          <View style={styles.list}>
            <IngList />
          </View>
          <TouchableOpacity activeOpacity={0.5} style={styles.TouchableOpacityStyle} onPress={() => this.setState({ visibleModal: 'additem' })}>
            <Image source={{uri : 'https://reactnativecode.com/wp-content/uploads/2017/11/Floating_Button.png'}} 
                 style={styles.FloatingButtonStyle} />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => this.setState({ visibleModal: 'request' })}>
            <Text style={styles.touch}>
              인식이 안되신다면, 여기를 터치해주세요!
            </Text>
          </TouchableOpacity>
      </View>
    </View>
    );
  }
}

HomeScreen.navigationOptions = {
    header: null,
};


const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: "center",
      flexDirection: "column"
    },
    thumbnail: {
      flex: 1,
      resizeMode: "contain",
      width: 150,
      height: 150,
//      paddingTop: 150
      paddingTop: '20%'
    },
    titleLogo: {
      flex: 1,
      backgroundColor: "#E8E1D3",
      padding: 20,
      alignItems: "center",
      flexDirection: "column"
    },
    title: {
      flex: 1,
      fontSize: 55,
      fontWeight: "bold",
      lineHeight: 55,
      color:'#3D2D0E',
      marginTop: '10%'
    },
    contents: {
      flex: 1.5,
      backgroundColor: "#60C14F",
    },

    list: {
      flex: 0.8,
      height: 200,
      padding: '1%',
      backgroundColor: 'rgba(255,255,255,0.7)',
      margin: '5%',
      borderRadius: 20
    },

    touch: {
      textAlign: "center",
      textDecorationLine: "underline",
      color: "brown",
      marginTop: 10
    },
  
    TouchableOpacityStyle:{
      position: 'absolute',
      width: 60,
      height: 60,
      alignItems: 'center',
      justifyContent: 'center',
      right: '5%',
      bottom: '20%',
    },
 
    FloatingButtonStyle: {
      resizeMode: 'contain',
      width: 60,
      height: 60,
    }
});