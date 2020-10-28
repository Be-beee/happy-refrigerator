

/*const functions = require("firebase-functions");
const admin = require("firebase-admin");
admin.initializeApp(functions.config().firebase);
exports.sendPushNotification = functions.database.ref("users/user1/ing").onCreate(event => {
    const data = event.data;
//    const val = event.data.val();
    console.log(data);
    payload = {
      notification: {
        title: "알림",
        body: `새로운 식재료가 추가되었습니다!`,
      },
    };
    admin
      .messaging()
      .sendToDevice(data.notification_token, payload)
      .then(function(response) {
        console.log("Notification sent successfully:", response);
      })
      .catch(function(error) {
        console.log("Notification sent failed:", error);
      });
  });*/
const functions = require("firebase-functions");
const admin = require("firebase-admin");
admin.initializeApp(functions.config().firebase);

exports.sendPushNotification = functions.database.ref('users/user1/result2/{pushId}')
    .onCreate((snapshot, context) => {
      // Grab the current value of what was written to the Realtime Database.
      const original = snapshot.val();
      console.log('context', context.params.pushId);
      console.log('snapshot', original);
  
//      const token_data = admin.database().ref('/tokens/').child('notification_token').once('value');
      const token_data = 'fYmaW0CnKMM:APA91bGiykjKmMelVuuPPa4o8uQxmfjkNIFllfMzDQe5HJLW7YftmSCVgp31Vf2OYk9qxBRjGEAbSdZnVnJJGMCWzcKmCZJcz4x9-GWvkFliiY8OpBdFh7EQZjcA0xFHi888pk2RKcww';
      payload = {
        notification: {
          title: "🙂 알림 🙂",
          body: "새로운 식재료가 감지되었습니다!",
        },
      };
      admin
        .messaging()
        .sendToDevice(token_data, payload)
        .then(function(response) {
          console.log("Notification sent successfully:", response);
        })
        .catch(function(error) {
          console.log("Notification sent failed:", error);
        });
//      const img;
      admin.database().ref('users/user1/ting').once('value', data => {
        
      });
  
    const iref = admin.database().ref('users/user1/ing');
    const tref = admin.database().ref('ting/');
    const rref = admin.database().ref('users/user1/recipe');
    const trref = admin.database().ref('trecipe/');
    tref.once("value", (snap) => {
      var isSupported = false;
      snap.forEach((child) => {
        if(child.val().name == snapshot.val().name){
          var iurl = child.val().img;

          iref.once("value", (idata) => {
            var isUpdated = false;
            idata.forEach((ichild) => {
              if(ichild.val().name == snapshot.val().name){
                if(ichild.val().expiration == '2019-11-30') {
                  iref.child(ichild.key).update({ quantity: ichild.val().quantity+1 });
                  isUpdated = true;
                }
              }
            });
            if(!isUpdated){
              iref.push({ name: snapshot.val().name, quantity: 1, expiration: '2019-11-30', imgUrl: iurl });
            }
          });

          isSupported = true;
          return;
        }
      });
      if(!isSupported){
        iref.push({ name: snapshot.val().name, quantity: 1, expiration: '2019-11-30', imgUrl: 'https://png.pngtree.com/element_our/20190601/ourlarge/pngtree-green-pepper-free-png-picture-image_1330636.jpg' });
      }
    });
    trref.once("value", (snap) => {
      snap.forEach((child) => {
        if(child.val().mainIng == snapshot.val().name){
          rref.once("value",(data) => {
            var isThere = 0;
            data.forEach((rchild) => {
              if(rchild.val().ingredients == snapshot.val().name) {
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
      
      return ;
      
      /*const getDeviceTokensPromise = admin.database()
          .ref(`/tokens/`).once('value');

      // Get the follower profile.
//      const getFollowerProfilePromise = admin.auth().getUser(followerUid);

      // The snapshot to the user's tokens.
      let tokensSnapshot;

      // The array containing all the user's tokens.
      let tokens;

      const results = await Promise.all(getDeviceTokensPromise);
      tokensSnapshot = results;
//      const follower = results[1];

      // Check if there are any device tokens.
      if (!tokensSnapshot.hasChildren()) {
        return console.log('There are no notification tokens to send to.');
      }
      console.log('There are', tokensSnapshot.numChildren(), 'tokens to send notifications to.');
//      console.log('Fetched follower profile', follower);

      // Notification details.
      const payload = {
        notification: {
          title: 'You have a new follower!',
          body: `${follower.displayName} is now following you.`,
          icon: follower.photoURL
        }
      };

      // Listing all tokens as an array.
      tokens = Object.keys(tokensSnapshot.val());
      // Send notifications to all tokens.
      const response = await admin.messaging().sendToDevice(Object.keys(tokensSnapshot.val().notification_token), payload);
      // For each message check if there was an error.
      const tokensToRemove = [];
      response.results.forEach((result, index) => {
        const error = result.error;
        if (error) {
          console.error('Failure sending notification to', tokens[index], error);
          // Cleanup the tokens who are not registered anymore.
          if (error.code === 'messaging/invalid-registration-token' ||
              error.code === 'messaging/registration-token-not-registered') {
            tokensToRemove.push(tokensSnapshot.ref.child(tokens[index]).remove());
          }
        }
      });
      return Promise.all(tokensToRemove);*/
    });
/*exports.sendNotification = functions.database
  .ref("tokens/")
  .onCreate(event => {
    const data = event._data;
    payload = {
      notification: {
        title: "Welcome",
        body: "thank for installed our app",
      },
    };
    admin
      .messaging()
      .sendToDevice(data.notification_token, payload)
      .then(function(response) {
        console.log("Notification sent successfully:", response);
      })
      .catch(function(error) {
        console.log("Notification sent failed:", error);
      });
  });*/
