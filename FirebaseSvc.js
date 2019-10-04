import firebase from 'firebase';
import uuid from 'uuid';
import config from './firebaseConfig';
import 'firebase/firestore';

class FirebaseSvc {
    constructor() {
        if (!firebase.apps.length) {
            firebase.initializeApp(config);
        } else {
            console.log("firebase apps already running...")
        }
    }
    
    login = async(user, success_callback, failed_callback) => {
        console.log("logging in");
        const output = await firebase.auth().signInWithEmailAndPassword(user.email, user.password)
        .then(success_callback, failed_callback);
    }

    getUserInfo = (email) => {
        this.refUser.orderByChild('email').equalTo(email).once('value').then(
            function(snapshot){
                snapshot.forEach(function(childSnapshot){
                    return {
                        name: childSnapshot.val().name,
                        email: childSnapshot.val().email,
                    }
                })
            }
        )
    }

    observeAuth = () =>
    firebase.auth().onAuthStateChanged(this.onAuthStateChanged);

    onAuthStateChanged = user => {
        if (!user) {
            try {
                this.login(user);
            } catch ({ message }) {
                console.log("Failed:" + message);
            }
        } else {
            console.log("Reusing auth...");
        }
    };

    get refUser() {
        return firebase.firestore().collection('Users');
    }

    get refMessages() {
        return firebase.firestore().collection('Messages');
    }

    createAccount = async (user,success_callback, failed_callback) => {
        firebase.auth()
        .createUserWithEmailAndPassword(user.email, user.password)
        .then(function() {
            success_callback();
            console.log("created user successfully. User email:" + user.email + " name:" + user.name);
            const userinfo = { 
                email: user.email,
                name: user.name,
            };
            firebase.firestore().collection('Users').add(userinfo);
            var userf = firebase.auth().currentUser;
            userf.updateProfile({ displayName: user.name})
            .then(function() {
                alert("User " + user.name + " was created successfully. Please login.");
            }, function(error) {
                console.warn("Error update displayName.");
            });
            
        }, function(error) {
            //console.error("got error:" + typeof(error) + " string:" + error.message);
            alert("Create account failed. Error: "+error.message);
        });
    }
}
const firebaseSvc = new FirebaseSvc();
export default firebaseSvc;