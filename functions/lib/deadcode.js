// import 'firebase-functions';
// const firestore = new Firestore();
// const options = {
//     uri: 'https://www.reddit.com/r/webdev.json',
//     json: true // Automatically parses the JSON string in the response
// };
//
// exports.RPpopulateDBText = functions.https.onRequest((req, res) => {
//     return rp(options)
//                 .then(function (response) {
//                     const posts = response['data']['children'];
//                     for (const postIdx in posts) if (posts.hasOwnProperty(postIdx)){
//                         const postData = posts[postIdx]['data'];
//                         // console.log(postData['title']);
//                         admin.firestore().collection('webdev').doc(postData['id']).set({
//                             title: postData['title'],
//                             url: postData['url'],
//                             created: postData['created'],
//                             created_utc: postData['created_utc'],
//                             permalink: postData['permalink'],
//                             thumbnail: postData['thumbnail']
//                         }).catch(function (err) {console.log('err', err);});
//                     }
//                     return res.send();
//                     })
//
//     .catch(function (err) {
//     console.log('err', err);
//   });
// });
//
// exports.dummy = functions.https.onRequest((req, res) => {
//     return  console.log('invoked dummy');
// });
// import * as functions from 'firebase-functions';
// const axios = require('axios');
// const snoowrap = require('snoowrap');
// const FormData = require('form-data');
// const btoa = require('btoa');
//
// // // Start writing Firebase Functions
// // // https://firebase.google.com/docs/functions/typescript
// //
// // export const helloWorld = functions.https.onRequest((request, response) => {
// //  response.send("Hello from Firebase!");
// // });
//
// // The Cloud Functions for Firebase SDK to create Cloud Functions and setup triggers.
// // const functions = require('firebase-functions');
//
// // The Firebase Admin SDK to access the Firebase Realtime Database.
// const admin = require('firebase-admin');
// admin.initializeApp();
// // const r = new snoowrap({
// //   userAgent: 'Reclone',
// //       // username: 'put your username here',
// //   // password: 'put your password here'
// //   clientId: 'kSN8qRGWGUfdJQ',
// //   clientSecret: '-bJBqakJ-O_OlIowV0uqQgmD0NA',
// //   // refreshToken: 'put your refresh token here'
// // });
//
// // Take the text parameter passed to this HTTP endpoint and insert it into the
// // Realtime Database under the path /messages/:pushId/original
// exports.addMessage = functions.https.onRequest((req, res) => {
//     // Grab the text parameter.
//     const original = req.query.text;
//     // Push the new message into the Realtime Database using the Firebase Admin SDK.
//     return admin.database().ref('/messages').push({original: original}).then((snapshot) => {
//         // Redirect with 303 SEE OTHER to the URL of the pushed object in the Firebase console.
//         // return res.redirect(303, snapshot.ref.toString());
//         return res.send();
//     });
// });
//
// // Listens for new messages added to /messages/:pushId/original and creates an
// // uppercase version of the message to /messages/:pushId/uppercase
// exports.makeUppercase = functions.database.ref('/messages/{pushId}/original')
//     .onCreate((snapshot, context) => {
//       // Grab the current value of what was written to the Realtime Database.
//       const original = snapshot.val();
//       console.log('Uppercasing', context.params.pushId, original);
//       const uppercase = original.toUpperCase();
//       // You must return a Promise when performing asynchronous tasks inside a Functions such as
//       // writing to the Firebase Realtime Database.
//       // Setting an "uppercase" sibling in the Realtime Database returns a Promise.
//       return snapshot.ref.parent.child('uppercase2').set(uppercase);
//     });
//
// // function fetchAnonymousToken () {
// //     const form = new FormData();
// //     form.set('grant_type', 'https://oauth.reddit.com/grants/installed_client');
// //     form.set('device_id', 'DO_NOT_TRACK_THIS_DEVICE');
// //     return fetch('https://www.reddit.com/api/v1/access_token', {
// //       method: 'post',
// //       body: form,
// //       headers: { authorization: `Basic ${btoa(this.props.anonymousClientId + ':')}` },
// //       credentials: 'omit',
// //     }).then(response => response.text())
// //       .then(JSON.parse)
// //       .then(tokenInfo => tokenInfo.access_token)
// //       .then(anonymousToken => {
// //         const anonymousSnoowrap = new snoowrap({ accessToken: anonymousToken });
// //         anonymousSnoowrap.config({ proxies: false, requestDelay: 1000 });
// //         this.setState({ anonymousSnoowrap });
// //         return anonymousSnoowrap;
// //       });
// //   }
//
// // See https://github.com/not-an-aardvark/snoowrap/issues/114#issuecomment-337825121
// // and https://github.com/not-an-aardvark/reddit-oauth-helper/blob/f090f954322cdbf4e388132ec8659afa1cdf0ecd/browser.jsx#L80-L98
// function fetchAnonymousToken () {
//     let anonymousClientId = 'PDnacnMChBXZUy';
//     const form = new FormData();
//     form.append('grant_type', 'https://oauth.reddit.com/grants/installed_client');
//     form.append('device_id', 'DO_NOT_TRACK_THIS_DEVICE');
//     return axios.post('https://www.reddit.com/api/v1/access_token', {
//       method: 'post',
//       body: form,
//       headers: { authorization: `Basic ${btoa(anonymousClientId + ':')}` },
//       credentials: 'omit',
//     }).then(response => response.text())
//       .then(JSON.parse)
//       .then(tokenInfo => tokenInfo.access_token)
//       .then(anonymousToken => {
//         const anonymousSnoowrap = new snoowrap({ accessToken: anonymousToken });
//         anonymousSnoowrap.config({ proxies: false, requestDelay: 1000 });
//         this.setState({ anonymousSnoowrap });
//         return anonymousSnoowrap;
//       });
//   }
//
// exports.populateDBText = functions.https.onRequest((req, res) => {
//     // fetchAnonymousToken().anonymousSnoowrap.getSubreddit().getSubreddit('webdev').map(post => post.title).then(console.log).then(function(response) {return res.send()});
//     // var sub =
//     //     r.getSubreddit('webdev').map(post => post.title).then(console.log).then(function(response) {return res.send()});
//     return axios.get('https://www.reddit.com/r/webdev.json')
//                 .then(function (response) {
//                     let posts =  response.data['data']['children'];
//                     for (let postIdx in posts){
//                         let postData = posts[postIdx]['data'];
//                         console.log(postData['title']);
//                         admin.firestore().collection('webdev').doc(postData['id']).set({
//                             title: postData['title'],
//                             url: postData['url'],
//                             created: postData['created'],
//                             created_utc: postData['created_utc'],
//                             permalink: postData['permalink'],
//                             thumbnail: postData['thumbnail']
//                         })
//                     }
//                     // console.log(response.data['data']['children'].map(obj => obj['title']));
//                     // response.data['data']['children'].map(obj => obj['title']).then(console.log);
//                     // console.log(response.data['data']['children'].map(obj => obj['title']));
//                     // console.log(response.data.children.map(obj => obj.toString()));
//     //                 // admin.database().ref('/data').push({original: response}).then((snapshot) => {
//     //                 //     // Redirect with 303 SEE OTHER to the URL of the pushed object in the Firebase console.
//     //                 //     return res.redirect(303,
//     //                 //         snapshot.ref.toString());
//                     return res.send();
//                     })
//                 // }
//         // )
//     .catch(function (err) {
//     console.log('err', err);
//   });
// });
//
//
// // https://www.reddit.com/api/v1/authorize?client_id=CLIENT_ID&response_type=TYPE&%20state=RANDOM_STRING&redirect_uri=URI&duration=DURATION&scope=SCOPE_STRING
//
// exports.recordVote = functions.https.onRequest((req, res) => {
//     // Grab the text parameter.
//     const voteValue = req.query.vote;
//     const postId = req.query.postId;
//     const userId = 'dummyuser';
//     console.log(voteValue);
//     console.log(postId);
//
//     // Push the new message into the Realtime Database using the Firebase Admin SDK.
//     // return
//     admin.firestore().collection('userVotes').doc(userId).set({
//         [postId]: voteValue
//     }, { merge: true });
//
//     return res.send();
//
//     // admin.database().ref('/votes').push({vote: voteValue}).then((snapshot) => {
//     // // return admin.database().ref('/votes/' + userId + '/' + postId).push({vote: voteValue}).then((snapshot) => {
//     // //     // Redirect with 303 SEE OTHER to the URL of the pushed object in the Firebase console.
//     //     // return res.redirect(303, snapshot.ref.toString());
//     //     return res.send();
//     // });
// });
//
//# sourceMappingURL=deadcode.js.map