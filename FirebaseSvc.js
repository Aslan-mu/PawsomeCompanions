import firebase from 'firebase';
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
    state = {};
    login = async(user, success_callback, failed_callback) => {
        console.log("logging in");
        const output = await firebase.auth().signInWithEmailAndPassword(user.email, user.password)
        .then(success_callback, failed_callback);
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

    refUser() {
        return firebase.firestore().collection('Users');
    }

    refMessages() {
        return firebase.database().ref('Messages');
    }

    refRequests() {
        return firebase.firestore().collection('Requests');
    }

    createAccount = async (user,success_callback, failed_callback) => {
        firebase.auth()
        .createUserWithEmailAndPassword(user.email, user.password)
        .then(function() {
            success_callback();
            console.log("created user successfully. User email:" + user.email + " name:" + user.name);
            var userf = firebase.auth().currentUser;
            userf.updateProfile({ displayName: user.name})
            .then(function() {
                const userinfo = { 
                    id: userf.uid,
                    email: userf.email,
                    name: userf.displayName,
                };
                // use random-generated id as key: 
                // firebase.firestore().collection('Users').add(userinfo);

                // use user_id as key: 
                firebase.firestore().collection('Users').doc(userinfo.id).set(userinfo);
                global.currentUser = userinfo;
            }, function(error) {
                console.warn("Error update displayName.");
            });
            
            
        }, function(error) {
            //console.error("got error:" + typeof(error) + " string:" + error.message);
            alert("Create account failed. Error: " + error.message);
        });
    }

    onLogout = user => {
        firebase.auth().signOut().then(function() {
            console.log("Sign-out successful.");
        }).catch(function(error) {
            console.log("An error happened when signing out");
        });
    }

    get uid() {
        return (firebase.auth().currentUser || {}).uid;
    }

    parse = (name,chatWith,_idTo,snapshot) => {
        var message = null;
        const { createdAt, text, user } = snapshot.val();
        var userf = global.currentUser.id;
        if(user && user._id == userf && user._idTo == _idTo){
            const { key: id } = snapshot;
            const { key: _id } = snapshot;
            const timestamp = new Date(createdAt);
            message = {
                id,
                _id,
                createdAt: timestamp,
                text,
                user: {
                    _id:userf,
                    _idTo:_idTo,
                    name:name,
                    avatar:user.avatar
                }
            };
        }
        if(user && user._id && user._idTo == userf && user._id == _idTo){
            const { key: id } = snapshot;
            const { key: _id } = snapshot;
            const timestamp = new Date(createdAt);
            message = {
                id,
                _id,
                createdAt: timestamp,
                text,
                user: {
                    _id:_idTo,
                    _idTo:userf,
                    name:chatWith,
                    avatar:user.avatar
                }
            };
        }
        return message;
    };

    refOn = (name,chatWith,_idTo,callback) => {
        this.refMessages()
        .on('child_added',snapshot => {
            callback(this.parse(name,chatWith,_idTo,snapshot));
        });
    }

    get timestamp() {
        return firebase.database.ServerValue.TIMESTAMP;
    }
    
    // send the message to the Backend
    send = (messages) => {
        for (let i = 0; i < messages.length; i++) {
            const { text, user } = messages[i];
            const message = {
                text,
                user,
                createdAt: this.timestamp,
            };
            this.refMessages().push(message);
        }
    };

    updateReferral = (referral) => this.refUser().doc(global.currentUser.id).update({referral: referral})

    updateImage = (url) => this.refUser().doc(global.currentUser.id).update({image: url})

    refOff() {
        this.refMessages().off();
    }
}
const firebaseSvc = new FirebaseSvc();
export default firebaseSvc;