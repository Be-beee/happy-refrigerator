import React, { Component } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Image, FlatList, Dimensions, ScrollView, Alert, TextInput, Picker } from 'react-native';
import ImagePicker from 'react-native-image-picker';
import firebase from 'react-native-firebase';
import uuid from 'uuid/v4'; // Import UUID to generate UUID
import { db } from "../components/list_modules/dbConnect";
import Spinner from 'react-native-loading-spinner-overlay';
import DatePicker from "react-native-datepicker";

const options = {
  title: 'Select Image',
  storageOptions: {
    skipBackup: true,
    path: 'images'
  }
};
const ImageRow = ({ image, windowWidth, popImage }) => (
  <View>
    <Image
      source={{ uri: image }}
      style={[styles.img, { width: windowWidth / 2 - 15 }]}
      onError={popImage}
    />
  </View>
);
export default class App extends Component {
  state = {
    imgSource: '',
    uploading: false,
    progress: 0,
    images: [],
    name: '',
    exp: '2019-11-22',
    quantity: '1',
    isValueAdded: false,
    spinner: false
  };
  /**
   * Select image method
   */
  pickImage = () => {
    ImagePicker.showImagePicker(options, response => {
      if (response.didCancel) {
//        console.log('You cancelled image picker 😟');
      } else if (response.error) {
        alert('And error occured: ', response.error);
      } else {
        const source = { uri: response.uri };
        this.setState({
          imgSource: source,
          imageUri: response.uri
        });
      }
    });
  };
  /**
   * Upload image method
   */
  uploadImage = () => {
    const ext = this.state.imageUri.split('.').pop(); // Extract image extension
//    const filename = `${uuid()}.${ext}`; Generate unique name
    const filename = `data.jpg`; // Generate unique name
    const dbref = db.ref('users/user1/result');
    this.setState({ uploading: true });
    firebase.storage().ref(`tutorials/images/${filename}`).putFile(this.state.imageUri).on(
        firebase.storage.TaskEvent.STATE_CHANGED,
        snapshot => {
          let state = {};
          state = {
            ...state,
            progress: (snapshot.bytesTransferred / snapshot.totalBytes) * 100 // Calculate progress percentage
          };
          if (snapshot.state === firebase.storage.TaskState.SUCCESS) {
            const allImages = this.state.images;
            allImages.push(snapshot.downloadURL);
            state = {
              ...state,
              uploading: false,
              imgSource: '',
              imageUri: '',
              progress: 0,
              images: allImages
            };
          }
          this.setState(state);
        },
        error => {
          unsubscribe();
          alert('Sorry, Try again.');
        }
    );
    this.setState({ spinner: true });
    
    dbref.on("value", (data) => {
      data.forEach((child) => {
        if(child.key == '192837465'){
          this.setState({exp: child.val().유통기한, isValueAdded: true, spinner: false});
//          console.log(child.val().유통기한);
        }
        else {
          this.setState({ name: child.key, exp: child.val().유통기한, isValueAdded: true, spinner: false});
//          console.log(child.val().유통기한);
        }
      });
      setTimeout(function(){dbref.remove()}, 3000);
    });
    
  };
  
  removeImage = imageIndex => {
    let images = this.state.images;
    images.pop(imageIndex);
    this.setState({ images });
  };
  
  addItem = () => {
    const pnum = db.ref().length;
    const iref = db.ref('users/user1/ing');
    const tref = db.ref('ting/');
    const rref = db.ref('users/user1/recipe');
    const trref = db.ref('trecipe/');
    if(this.state.name == ''){
      Alert.alert('알림', '추가할 식재료명을 입력해주세요!');
    }
    else{
      tref.once("value", (snap) => {
        var isSupported = false;
        snap.forEach((child) => {
          if(child.val().name == this.state.name){
            var iurl = child.val().img;
            
            iref.once("value", (idata) => {
              var isUpdated = false;
              idata.forEach((ichild) => {
                if(ichild.val().name == this.state.name){
                  if(ichild.val().expiration == this.state.exp) {
                    iref.child(ichild.key).update({ quantity: ichild.val().quantity+parseInt(this.state.quantity) });
                    isUpdated = true;
                  }
                }
              });
              if(!isUpdated){
                iref.push({ name: this.state.name, quantity: parseInt(this.state.quantity), expiration: this.state.exp, imgUrl: iurl });
              }
            });
            
            isSupported = true;
            return;
          }
        });
        if(!isSupported){
          iref.push({ name: this.state.name, quantity: parseInt(this.state.quantity), expiration: this.state.exp, imgUrl: 'https://png.pngtree.com/element_our/20190601/ourlarge/pngtree-green-pepper-free-png-picture-image_1330636.jpg' });
          /*Alert.alert(
            'ㅠㅠ',
            '아직 인식이 지원되지 않는 식재료입니다.'
          );*/
        }
      });
      trref.once("value", (snap) => {
        snap.forEach((child) => {
          if(child.val().mainIng == this.state.name){
            rref.once("value",(data) => {
              var isThere = 0;
              data.forEach((rchild) => {
                if(rchild.val().ingredients == this.state.name) {
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
      this.props.navigation.navigate('Main');
    }
    
  }

  componentDidMount() {
    /*setInterval(() => {
      this.setState({
        spinner: !this.state.spinner
      });
    }, 5000);*/
  }

  
  render() {
    const { uploading, imgSource, progress, images, name, exp, quantity, isValueAdded } = this.state;
    const windowWidth = Dimensions.get('window').width;
    const disabledStyle = uploading ? styles.disabledBtn : {};
    const actionBtnStyles = [styles.btn, disabledStyle];
    
    return (
      <View style={styles.container}>
        <Spinner
        visible={this.state.spinner}
        textContent={'처리중...'}
        textStyle={styles.spinnerTextStyle}
        />
        <View style={styles.part}>
          
          { isValueAdded ? (
              <View>
                <Text style={{ paddingLeft: 20, fontSize: 20, textAlign: 'center' }}>재료 정보 수정</Text>
                <Text style={{ paddingLeft: 20, fontSize: 16, }}>재료명</Text>
                <TextInput
                  style={{ width: '87%', height: 50, backgroundColor: 'white', margin: 20, marginTop: 10 }}
                  placeholder="재료명"
                  value={this.state.name}
                  onChangeText={(data) => {this.setState({name: data})}}
                /> 
                <Text style={{ paddingLeft: 20, fontSize: 16, }}>수량</Text>
                <Picker selectedValue = {this.state.quantity} onValueChange = {(quantity) => {this.setState({ quantity: quantity })}} style={{ width: '87%', height: 50, backgroundColor: 'white', margin: 20, marginTop: 10 }}>
                   <Picker.Item label = "1" value = "1" />
                   <Picker.Item label = "2" value = "2" />
                   <Picker.Item label = "3" value = "3" />
                   <Picker.Item label = "4" value = "4" />
                   <Picker.Item label = "5" value = "5" />
                </Picker>
                <Text style={{ paddingLeft: 20, fontSize: 16, }}>유통기한</Text>
                <DatePicker style={{ width: '87%', height: 50, backgroundColor: 'white', margin: 20, marginTop: 10 }} date={this.state.exp} mode="date" placeholder="날짜를 선택하세요" format="YYYY-MM-DD" minDate={new Date()} maxDate="2021-12-31" confirmBtnText="확인" cancelBtnText="취소" onDateChange={(date) => {this.setState({exp: date})}} />
                <TouchableOpacity onPress={this.addItem} style={{ margin: 10, backgroundColor: '#3D2D0E', padding: 20,   }}>
                  <Text style={{ textAlign: 'center', color: '#fff' }}>식재료추가</Text>
                </TouchableOpacity>
              </View>
              
            )
            :(
              <View>
                <Text style={{ textAlign: 'center', fontSize: 16 }} >글자 인식</Text>
                <Text style={{ textAlign: 'center' }}>라벨 글자 인식을 위해 이미지를 선택해주세요!</Text>
                <TouchableOpacity style={styles.btn} onPress={this.pickImage} disabled={uploading}>
                  <Text style={styles.btnTxt}>이미지 선택하기👋</Text>
                </TouchableOpacity>
                {imgSource !== '' && (
                  <View>
                    <Image source={imgSource} style={styles.image} />
                    {uploading && ( <View style={[styles.progressBar, { width: `${progress}%` }]} /> )}

                    <TouchableOpacity style={actionBtnStyles} onPress={this.uploadImage} disabled={uploading}>
                      <View>
                        {uploading ? ( <Text style={styles.btnTxt}>업로드 중...</Text> )  : ( <Text style={styles.btnTxt}>글자 인식하기</Text> )}
                      </View>
                    </TouchableOpacity>
                  </View>
                )}
              </View>
            )
          }
          
          
          <View>
            <TouchableOpacity onPress={() =>{this.props.navigation.navigate('Main')}}>
              <Text style={{ fontWeight: '600', paddingTop: 20, alignSelf: 'center' }}>취소</Text>
            </TouchableOpacity>
          </View>

        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
      flex: 1,
      justifyContent: "center",
      flexDirection: "column",
      backgroundColor: '#ebe7dd',
    },
  btn: {
    width: 200,
    paddingLeft: 20,
    paddingRight: 20,
    paddingTop: 10,
    paddingBottom: 10,
    borderRadius: 20,
    backgroundColor: '#3D2D0E',
    marginTop: 20,
    alignItems: 'center',
    alignSelf: 'center',
  },
  disabledBtn: {
    backgroundColor: 'rgba(3,155,229,0.5)'
  },
  btnTxt: {
    color: '#fff'
  },
  image: {
    marginTop: 20,
    minWidth: 200,
    height: 200,
    resizeMode: 'contain',
    backgroundColor: '#ebe7dd',
  },
  img: {
    flex: 1,
    height: 100,
    margin: 5,
    resizeMode: 'contain',
    borderWidth: 1,
    borderColor: '#eee',
    backgroundColor: '#ccc'
  },
  progressBar: {
    backgroundColor: 'rgb(3, 154, 229)',
    height: 3,
    shadowColor: '#000',
  },
  spinnerTextStyle: {
    color: '#fff'
  }
});