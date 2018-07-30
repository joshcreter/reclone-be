"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const functions = require("firebase-functions");
const admin = require("firebase-admin");
admin.initializeApp();
const settings = { timestampsInSnapshots: true };
admin.firestore().settings(settings);
const axios = require('axios');
function persistPost(postData, topComment) {
    admin.firestore().collection('webdev').doc(postData['id']).set({
        title: postData['title'],
        url: postData['url'],
        created: postData['created'],
        created_utc: postData['created_utc'],
        permalink: postData['permalink'],
        thumbnail: postData['thumbnail'],
        topComment: topComment
    }).catch(function (err) {
        console.log('err', err);
    });
}
function getTopComment(commentResponse) {
    let topComment = "[No comments yet!]";
    if (commentResponse && commentResponse.data && commentResponse.data.length == 2) {
        const comments = commentResponse.data[1]['data']['children'];
        if (comments[0]) {
            topComment = comments[0]['data']['body'];
        }
    }
    return topComment;
}
function processPost(postData) {
    axios.get('https://www.reddit.com' + postData['permalink'] + '.json')
        .then(function (commentResponse) {
        const topComment = getTopComment(commentResponse);
        persistPost(postData, topComment);
    });
}
exports.populateDBText = functions.https.onRequest((req, res) => {
    return axios.get('https://www.reddit.com/r/webdev.json')
        .then(function (response) {
        const posts = response.data['data']['children'];
        for (const postIdx in posts)
            if (posts.hasOwnProperty(postIdx)) {
                const postData = posts[postIdx]['data'];
                processPost(postData);
            }
        return res.send();
    })
        .catch(function (err) {
        console.log('err', err);
    });
});
//# sourceMappingURL=index.js.map