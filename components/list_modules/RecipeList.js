import React, { Component } from "react";
import {
  AppRegistry,
  Image,
  FlatList,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView
} from "react-native";
import Modal from "react-native-modal";
import { db } from "./dbConnect";


class RecipeItem extends Component {
  state = {
    isModalVisible: false
  };
 
  toggleModal = () => {
    this.setState({ isModalVisible: !this.state.isModalVisible });
  };
  render() {
    return (
      <View>
        <Modal isVisible={this.state.isModalVisible} style={{ backgroundColor: '#ebe7dd', }}>
              <View style={{ alignItems: 'center', paddingTop: '10%' }}>
                <Text style={{ fontSize: 30, fontWeight: 'bold', padding: 10 }}>
                  {this.props.item.name} 레시피</Text>
                <Text style={{ fontSize: 18, paddingBottom: 10 }}>주재료 : {this.props.item.ing}</Text>
              </View>
            <View style={{ flex: 1, flexDirection:'column', alignItems: 'stretch', justifyContent: 'center' }}>
              
                <ScrollView style={{ paddingLeft: '4%', paddingRight: '4%' }}>
                  <Text style={{ fontSize: 16, paddingBottom: '5%' }}>{this.props.item.sing}</Text>
                  <Text style={{ fontSize: 20 }}>[순서]</Text>
                  <Text style={{ fontSize: 20 }}>{this.props.item.rcon}</Text>
                </ScrollView>

              
            </View>
            <TouchableOpacity
              onPress={this.toggleModal}
              style = {{ backgroundColor: '#3D2D0E', margin: 10, padding: 15, marginTop: 20 }}>
              <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 16, textAlign: 'center' }}>
                확인</Text>
            </TouchableOpacity>
        </Modal>
        <TouchableOpacity
          style={{flex: 1, marginRight: 30, justifyContent: "center", alignItems: "center", marginTop: 10 }} onPress={this.toggleModal} >
          <Image source={{ uri: this.props.item.img, width: 130, height: 130 }} />
          <Text style={{ paddingTop: 10, fontSize: 16, fontWeight: 'bold' }}>{this.props.item.name}</Text>
          <Text style={{ padding: 5, color: '#777' }}>{this.props.item.ing}</Text>
        </TouchableOpacity>
      </View>
    );
  }
}


export default class RecipeList extends Component {
  constructor(props) {
    super(props);
    this.state = { 
      data: [],
    }
  }
  
  keyExtractor = (item) => item.id;
  
  
  componentDidMount(){
    const ref = db.ref('users/user1/recipe');
    
    ref.on("value", (snap) => {
      var items = [];
      snap.forEach((child) => {
        items.push({
          id: child.key,
          name: child.val().rname,
          img: child.val().rimgUrl,
          ing: child.val().ingredients,
          sing: child.val().subIng,
          rcon: child.val().rcontents,
        });
      });
      
      this.setState({data: items});
    });
  }

//  renderItem = ;
  render() {
    return (
      <View style={{ flex: 1, justifyContent: "center" }}>
        {
          this.state.data.length > 0
          ? <FlatList
            data={this.state.data}
            horizontal={true}
            keyExtractor={this.keyExtractor}
            renderItem={({ item }) => {
            return <RecipeItem item={ item } />;}}
          />
        :<Text style={{ textAlign: 'center' }}>표시할 레시피가 없습니다.</Text>
        }
        
      </View>
    );
  }
}