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

    get ref() {
        return firebase.database().ref('Messages');
    }

    parse = (name,chatWith,snapshot) => {
        var message = null;
        const { timestamp: numberStamp, text, user } = snapshot.val();
        if(user.name == name && user.chatWith ==chatWith){
            const { key: id } = snapshot;
            const { key: _id } = snapshot;
            const timestamp = new Date(numberStamp);
            message = {
                id,
                _id,
                timestamp,
                text,
                user: {
                    _id:user._id,
                    id:user.id,
                    name:name,
                    chatWith:chatWith,
                }
            };
        }
        if(user.chatWith == name && user.name == chatWith){
            const { key: id } = snapshot;
            const { key: _id } = snapshot;
            const timestamp = new Date(numberStamp);
            message = {
                id,
                _id,
                timestamp,
                text,
                user: {
                    _id:user._id,
                    id:user.id,
                    name:chatWith,
                    chatWith:name,
                }
            };
        }
        return message;
    };

    refOn = (name,chatWith,callback) => {
        this.refMessages()
        .on('child_added',snapshot => {
            callback(this.parse(name,chatWith,snapshot));
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

    refOff() {
        this.refMessages().off();
    }
}
const firebaseSvc = new FirebaseSvc();
export default firebaseSvc;