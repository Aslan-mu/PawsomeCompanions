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

    getAllUserData(callback){
        return this.refUser().get().then( snapshot =>{
            callback(snapshot)
        }).catch(
            err => {
                console.log("Error getting documents", err)
            }
        )
    }

    refMessages() {
        return firebase.database().ref('Messages');
    }

    refRequests() {
        return firebase.firestore().collection('Requests');
    }

    refPetSittingSessions() {
        return firebase.firestore().collection("PetSittingSessions")
    }

    async querySpecificUser (userID) {
        const snapShot = await this.refUser().doc(userID).get().catch(error => console.warn(error))
        return snapShot
    }

    async queryInstructionsForOneSession(docID) {
        const snapshot = await this.refPetSittingSessions().doc(docID).collection("Instructions").get()
        return snapshot 
    }

    async queryPetSittingSessionForOneOwner(ownerID){
        const snapshot = await this.refPetSittingSessions().where( "owner" ,"==", ownerID ).get().catch(error => console.log)
        console.log("receive data")
        
        if (!snapshot){
            return []
        }
        const docs = []

        snapshot.forEach(doc =>{
            console.log("owner")
            console.log(doc.data())
            docs.push(doc)
        })
        return docs        
    }

    async queryPetSittingSessionForOneSitter(sitterID){
        const snapshot = await this.refPetSittingSessions().where( "sitter" ,"==", sitterID ).get().catch(error => console.log)
        
        if (!snapshot){
            return []
        }
        const docs = []

        snapshot.forEach(doc =>{
            console.log("sitter")
            console.log(doc.data())
            docs.push(doc)
        })
        return docs        
    }


    async addNewInstructionToTheSession(sessionId , newInstruction){
        this.refPetSittingSessions().doc(sessionId).collection("Instructions").add(
            {...newInstruction, timestamp:this.timestamp}).
            then().catch(console.warn)
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
                    //avatar:user.avatar
                }
            };
        }
        return message;
    };

    refRequests(){
        return firebase.firestore().collection("Requests");
    }

    addNewRequest(requestData){
        // Need more tweaks
        const newRequestDataPushed = {
            ...requestData,
            accepted: false,
            // owner: firebase.firestore().doc(`/Users/${global.currentUser.id}`),
            // sitter: firebase.firestore().doc(`/Users/${requestData.sitter}`),
            owner: global.currentUser.id,
            sitter: requestData.sitter,
            timestamp: firebase.firestore.Timestamp.now(),
            haveRead: false
        }
        this.refRequests().add(newRequestDataPushed).then(()=>{console.log("New request created")})
    }

    refPosts() {
        return firebase.firestore().collection('CommunityPosts');
    }

    refPostOn = (callback, modifiedCallback) =>{
        this.refPosts().onSnapshot(
            querySnapShot =>{
                querySnapShot.docChanges().forEach(change => {
                    if (change.type === 'added') {
                        callback(change.doc.data(), change.doc.id)
                      }
                    else if (change.type === "modified") {
                        modifiedCallback(change.doc.data(), change.doc.id)
                    }
                }) 
            }
        )
    }

    refOn = (name,chatWith,_idTo,callback) => {
        this.refMessages()
        .on('child_added',snapshot => {
            callback(this.parse(name,chatWith,_idTo,snapshot));
        });
    }

    get timestamp() {
        return firebase.database.ServerValue.TIMESTAMP;
    }
    
    get firestoreTimestamp(){
        return firebase.firestore.Timestamp.now();   
    }

    // send the message to the Backend
    send = (messages) => {
        for (let i = 0; i < messages.length; i++) {
            const { text, user } = messages[i];
            const message = {
                text,
                user,
                createdAt: this.firestoreTimestamp,
            };
            this.refMessages().push(message);
        }
    };

    setNewPost = ( newPost ) =>{
        console.log("push to firestore")
        
        const {text, numberOfLike, numberOfComment, image, usersWhoLike} = newPost
        const newPostToFirestore = {
            text,
            usersWhoLike,
            numberOfComment, numberOfLike, image, timestamp: this.firestoreTimestamp, owner: firebase.firestore().doc(`/Users/${global.currentUser.id}`)

        }

        console.log(newPostToFirestore)
        this.refPosts().add(newPostToFirestore)
    } 

    updateReferral = (referral) => this.refUser().doc(global.currentUser.id).update({referral: referral})

    updateImage = (url) => this.refUser().doc(global.currentUser.id).update({image: url})

    refOff() {
        this.refMessages().off();
    }
    
    async addNewSession(incomingSession) {
        const newSession = await this.refPetSittingSessions().add(incomingSession)
        newSession.collection("Instructions").add(
            {
                instruction: "add a new instruction",
                timestamp: this.firestoreTimestamp,
                date: new Date(Date.now()),
                repeat: "Everyday",
            }
        )
    }
    
    refPostDoc = (postID) => firebase.firestore().collection("CommunityPosts").doc(postID)
    
    updateUsersWhoLike = (newUsersWhoLike , postID) => {
        this.refPostDoc(postID).update(
            {
                usersWhoLike: newUsersWhoLike
            }
        ).catch(error => {
            console.log("update fail")
            console.log(error)
            
        })
    }
}
const firebaseSvc = new FirebaseSvc();
export default firebaseSvc;