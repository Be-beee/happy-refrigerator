import React, { Component } from "react";
import { Button, Image, StyleSheet, Text, View, FlatList, TouchableOpacity } from "react-native";
import RecipeList from "../components/list_modules/RecipeList";
import { db } from "../components/list_modules/dbConnect";


export default class RecipeScreen extends Component{
  constructor(props) {
    super(props);
    this.state = { 
      rname: '',
    }
  }
  componentDidMount(){
    const ref = db.ref('users/user1/recipe');
    const iref = db.ref('users/user1/ing');
    
    iref.on("value", (snapshot) => {
      if(snapshot.numChildren() == 0){
        this.setState({ rname: '' });
      }
      else{
        iref.orderByChild('expiration').limitToFirst(1).once("child_added", (snap) => {
          var ingName = snap.val().name;
          var recipeName;
          ref.orderByChild('ingredients').equalTo(ingName).once("child_added", (data) => {
            recipeName = data.val().rname;
            this.setState({ rname: recipeName });
          });
          
        });
      }
    });
    
  }
  shouldComponentUpdate(){
    return true;
  }
  render(){
    return (
      <View style={styles.container}>
        <View style={styles.titleLogo}>
  
          <Text style={styles.title}>Recipe</Text>
          <View style={styles.recipeWindow}>
           <View>
           <Image style={styles.thumbnail} source={require("../components/img/logo.png")}/>
           </View>
           <View style={{ flex:1, alignItems: 'center', paddingLeft: '4%' }}>
             <Text style={{ fontSize: 15 }}>로즈마리의 추천메뉴</Text>
             {
               this.state.rname != '' ?
                 <Text style={styles.recTitle}>{this.state.rname}</Text>
               : <Text>추천할 레시피가 없습니다ㅠㅠ</Text>
             }
             
           </View>
          </View>
        </View>

        
        <View style={styles.contents}>
         <View style={styles.list}>
            <RecipeList />
          </View>

        </View>
      </View>
    );
  }
  
}

RecipeScreen.navigationOptions = {
  header: null,
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    flexDirection: 'column',
  },
  titleLogo: {
    flex: 1.3,
    backgroundColor: '#E8E1D3',
    paddingTop: '7%',
  },
  title: {
    fontSize: 55,
    fontWeight: 'bold',
    textAlign: 'center',
    lineHeight: 80,
    color:'#3D2D0E'
  },
  recipeWindow: {
    height: 180,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    paddingTop: 5,
    paddingRight: 20,
    paddingBottom: 5,
    paddingLeft: 20,
    margin: '4%',
    borderRadius: 20,
    /*shadowColor: '#000',
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 0.8,*/
    elevation: 1
  },
  contents: {
    flex: 1.5,
    backgroundColor: '#60C14F',
  },
  thumbnail: {
    flex: 1,
    resizeMode: "contain",
    width: 110,
    height: 110
  },
  recTitle: {
    fontSize: 20,
    fontWeight: 'bold'
  },
  list: {
    flex: 0.8,
    paddingLeft: 20,
    paddingRight: 20,
    paddingBottom: 10,
    backgroundColor: 'rgba(255,255,255,0.7)',
    marginTop: 20,
    marginBottom: 20,
    margin: 10,
    borderRadius: 20
  },
});