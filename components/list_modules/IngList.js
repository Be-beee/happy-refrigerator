import React, { Component } from "react";
import { AppRegistry, Image, FlatList, StyleSheet, Text, View, Picker, TouchableOpacity, Alert } from "react-native";
import { db } from "./dbConnect";
import Modal from "react-native-modal";
import DatePicker from "react-native-datepicker";

class IngItem extends Component {
  state = {
    isModalVisible: false,
    date: this.props.item.exp,
    quantity: this.props.item.quan,
  };
  
//  dateCal = () => {
//    var dd = new Date(this.props.item.exp).getTime()-new Date().getTime();
//    var cal = Math.floor(dd / (1000 * 60 * 60 * 24));
//    return cal;
//  };
  
  updateQuantity = (quantity) => {
    this.setState({ quantity: quantity })
  };
  
  modifyItem = () => {
    const iref = db.ref('users/user1/ing').child(this.props.item.id);
    iref.update({ quantity: parseInt(this.state.quantity), expiration: this.state.date });
    Alert.alert('알림', '수정되었습니다.');
    this.setState({isModalVisible: false});
  }
  removeItem = () => {
    const iref = db.ref('users/user1/ing');
    const rref = db.ref('users/user1/ing').child(this.props.item.id);
    const reref = db.ref('users/user1/recipe');
    rref.remove();
    reref.once("value", (snap) =>{
      snap.forEach((child) => {
        if(this.props.item.name == child.val().ingredients){
          iref.once("value", (idata) => {
            var dontRemove = false;
            idata.forEach((ichild) => {
              if(ichild.val().name == child.val().ingredients){
                dontRemove = true;
              }
            });
            if(!dontRemove){
              db.ref('users/user1/recipe/'+child.key).set(null);
            }
          });
        }
      });
    });
    Alert.alert('알림', '삭제되었습니다.');
    this.setState({isModalVisible: false});
  }
  toggleModal = () => {
    this.setState({ isModalVisible: !this.state.isModalVisible });
  };
  render() {
    return (
      <View style={styles.mwindow}>
        <Modal isVisible={this.state.isModalVisible} style={{ overflow: 'hidden' }}>
          <View style={styles.inputwindow}>
            <Text style={styles.mtitle}>재료 정보 수정</Text>

            <View style={{ marginTop: 40 }}>
              <Text style={styles.subtitle}>재료명</Text>
              <Text style={styles.input}>{this.props.item.name}</Text>

              <Text style={styles.subtitle}>수량</Text>
              <Picker selectedValue = {''+this.state.quantity} onValueChange = {this.updateQuantity} style={styles.picker}>
                 <Picker.Item label = "1" value = "1" />
                 <Picker.Item label = "2" value = "2" />
                 <Picker.Item label = "3" value = "3" />
                 <Picker.Item label = "4" value = "4" />
                 <Picker.Item label = "5" value = "5" />
              </Picker>

              <Text style={{ paddingLeft: 20, fontSize: 16, }}>유통기한</Text>
              <DatePicker style={styles.pdate} date={this.state.date} mode="date" placeholder="select date" format="YYYY-MM-DD" minDate={new Date()} maxDate="2021-12-31" confirmBtnText="확인" cancelBtnText="취소" onDateChange={(date) => {this.setState({date: date})}} />
            </View>


            <View style={styles.btns}>
              <TouchableOpacity onPress={this.modifyItem} style = {styles.conbtn}>
                <Text style={styles.btntxt}>확인</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={this.removeItem} style = {styles.anotherbtn}>
                <Text style={styles.btntxt}>삭제</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={this.toggleModal} style = {styles.anotherbtn}>
                <Text style={styles.btntxt}>취소</Text>
              </TouchableOpacity>
              
            </View>

          </View>
        </Modal>
        <TouchableOpacity
                  style={{flex: 1, marginRight: 30, justifyContent: "center", alignItems: "center" }} onPress={this.toggleModal} >
          <Image source={{ uri: this.props.item.img, width: 130, height: 130 }} />
          <Text style={styles.ingtitle}>{this.props.item.name}</Text>
          <Text style={{ color: '#777', textAlign: 'center' }}>{this.props.item.quan}개, {Math.floor((new Date(this.props.item.exp).getTime()-new Date().getTime()) / (1000 * 60 * 60 * 24))+1}일 남음</Text>
        </TouchableOpacity>
      </View>
    );
  }
}

export default class IngList extends Component {
  constructor(props) {
    super(props);
    this.state = { 
      data: [],
    }
  }
  
  
  keyExtractor = (item) => item.id;
  toggleModal = () => {
    this.setState({ isModalVisible: !this.state.isModalVisible });
  };
  componentDidMount(){
    const ref = db.ref('users/user1/ing');
    num = 1;
    ref.on("value", (snap) => {
      var items = [];
      snap.forEach((child) => {
        items.push({
          id: child.key,
          name: child.val().name,
          img: child.val().imgUrl,
          quan: child.val().quantity,
          exp: child.val().expiration,
        });
      });
      
      this.setState({data: items});
    });
  }
  render() {
    return (
      <View style={{ flex: 1, justifyContent: "center" }}>
        {
          this.state.data.length > 0 ?
            <FlatList data={this.state.data} horizontal={true} keyExtractor={this.keyExtractor} 
            renderItem={({ item }) => {
            return <IngItem item={ item } />;}}
          />
        :<Text style={{ textAlign: 'center' }}>냉장고에 식재료가 없습니다.</Text>
        }
        
      </View>
    );
  }
}

const styles = StyleSheet.create({
  mwindow: { 
    flex: 1, 
    marginRight: 30, 
    justifyContent: "center", 
    alignItems: "center" 
  },
  inputwindow: { 
    flex: 1, 
    backgroundColor: '#ebe7dd', 
    flexDirection:'column', 
    alignItems: 'stretch', 
    justifyContent: 'center' 
  },
  mtitle: {
    fontSize: 30, 
    fontWeight: 'bold', 
    paddingBottom: 20,  
    textAlign: 'center'
  },
  subtitle: { 
    paddingLeft: 20, 
    fontSize: 16, 
  },
  input: {
    width: '87%',
    height: 50, 
//    backgroundColor: 'white', 
    margin: 20, 
    marginTop: 10
  },
  picker: {
    width: '87%', 
    height: 50, 
    backgroundColor: 'white', 
    margin: 20, 
    marginTop: 10 
  },
  pdate: { 
    width: '87%', 
    height: 50, 
    backgroundColor: 'white', 
    margin: 20, 
    marginTop: 10 
  },
  btns: { 
    flexDirection: 'row', 
    margin: 10, 
    marginTop: 80 
  },
  conbtn: { 
    flex: 1, 
    backgroundColor: '#3D2D0E', 
    padding: 15,
    alignItems: 'center'
  },
  anotherbtn: { 
    flex: 1, 
    backgroundColor: '#3D2D0E', 
    padding: 15, 
    marginLeft: 10,
    alignItems: 'center'
  },
  btntxt: { 
    width: 125, 
    color: 'white', 
    fontWeight: 'bold', 
    fontSize: 16,
    textAlign: 'center'
  },
  ingtitle: { 
    paddingTop: 10, 
    fontSize: 16, 
    fontWeight: 'bold', 
    textAlign: 'center' 
  }
});