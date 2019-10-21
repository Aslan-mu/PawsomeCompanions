import React from 'react';
import {
  StyleSheet, Text, View, FlatList, TouchableOpacity, Image,
} from 'react-native';
import firebaseSvc from '../../FirebaseSvc';

function Item({ data, navigation }) {
    return (
        <TouchableOpacity
            onPress={
                () => navigation.navigate('Chat', {
                    request: data.request,
                    chatWith: data.name,
                    _idTo: data._idTo,
                })
            } >
            <View style = {styles.box}>
                <Image style={styles.image} source={{uri: data.avatar}}/>
                <View style = {styles.columnContainer}>
                    <View style = {styles.rowContainer}>
                        <Text style = {styles.username}>{data.name}</Text>
                        <Text style = {styles.message}>{data.msg.createdAt == 0 ?  null : (new Date(data.msg.createdAt)).toLocaleString('en-GB')}</Text>
                    </View>
                    <RequestOrMessage data = { data } />
                </View>
            </View>
        </TouchableOpacity>
    );
}

function RequestOrMessage({ data }){
    if (data.request){
        return(
            <Text style = {styles.newRequest}>[New Request!]</Text>
        )
    }else{
        return (
            <Text style = {styles.message}>{data.msg.text}</Text>
        )
    }
}
class ChatMain extends React.Component {

    static navigationOptions = {
        title: 'Messages',
    };

    state = {
        render:"",
        data:[],
        messages:[]
    };

    constructor(props) {
        super(props);
        this.state.name = global.currentUser.name;
        this.state.email = global.currentUser.email;
    }

    // fetchLastMessage = (chatWithId,userId) => {
    //     const setNewRequest = (newData) => {
    //         this.setState({data: newData})
    //     }
    //     return new Promise((resolve, reject) => {
    //         messageRef = firebaseSvc.refMessages();
    //         messageRef.on("value", (snapshot) => {
    //             var msg = {
    //                 createdAt: 0,
    //                 text: ""
    //             };
    //             snapshot.forEach((child) => {
    //                 if(((child.val().user._idTo == chatWithId && child.val().user._id == userId)
    //                     ||( child.val().user._idTo == userId && child.val().user._id == chatWithId)) 
    //                     && child.val().createdAt > msg.createdAt){
    //                     msg.createdAt = child.val().createdAt;
    //                     msg.text = child.val().text;

    //                     var data = this.state.data
    //                     data.forEach((temp) => {
    //                         if(temp._idTo == chatWithId){
    //                             temp.msg = msg
    //                             const dataOtherThanTemp = data.filter(te => te._idTo !== chatWithId)
    //                             const newData = [temp].concat(dataOtherThanTemp)
    //                             setNewRequest(newData) 
    //                         }
    //                     })
    //                 }
    //             });
    //             resolve(msg)
    //         });
    //     });
    // }

    fetchLastMessage = () => {
        const setNewRequest = (newData) => {
            this.setState({data: newData})
        }
        userId = global.currentUser.id
        messageRef = firebaseSvc.refMessages();
        messageRef.on('child_added', snapshot => {
            var msg = {
                createdAt: 0,
                text: ""
            };
            data = this.state.data
            data.forEach((temp) => {
                _idTo = temp._idTo;
                if(((snapshot.val().user._idTo == _idTo && snapshot.val().user._id == userId)
                ||( snapshot.val().user._idTo == userId && snapshot.val().user._id == _idTo)) 
                && snapshot.val().createdAt > msg.createdAt){
                    msg.createdAt = snapshot.val().createdAt;
                    msg.text = snapshot.val().text;

                    var dataAll = this.state.data
                    temp.msg = msg

                    const dataOtherThanTemp = dataAll.filter(te => te._idTo !== _idTo)
                    const newData = [temp].concat(dataOtherThanTemp)
                    setNewRequest(newData) 
                }
            });
        })
    }

    fetchRequest = () => {
        const setNewRequest = (newData) => {
            this.setState({data: newData})
        }

        userId = global.currentUser.id

        requestRef = firebaseSvc.refRequests().where("sitter", "==", userId).onSnapshot(querySnapshot => {
            returnDoc = false;
            querySnapshot.docChanges().forEach(change => {
                if (change.type === 'added' && !change.doc.data().accepted) {
                    var data = this.state.data
                    data.forEach((temp)=>{
                        owner = change.doc.data().owner;
                        if(temp._idTo == owner){
                            temp.request = change.doc
                            const dataOtherThanTemp = data.filter(te => te._idTo !== owner)
                            const newData = [temp].concat(dataOtherThanTemp)
                            setNewRequest(newData) 
                        }
                    })
                }
                if (change.type === 'modified' && change.doc.data().accepted) {
                    var data = this.state.data
                    data.forEach((temp)=>{
                        owner = change.doc.data().owner;
                        if(temp._idTo == owner){
                            temp.request = false
                            const dataOtherThanTemp = data.filter(te => te._idTo !== owner)
                            const newData = [temp].concat(dataOtherThanTemp)
                            setNewRequest(newData) 
                        }
                    })
                }
            });
        })
    }

    componentDidMount = async() => {
        users = firebaseSvc.refUser();

        const response = await users.onSnapshot((Snapshot) => {
            Snapshot.forEach(async(doc) => {
                const {name, id, image} = doc.data()
                //ignore self
                if(id != global.currentUser.id){
                    var temp = {
                        id:doc.id,// used as unique id in the list
                        _idTo:id,
                        name: name,
                        //avatar: null,
                        avatar:image || null,
                        msg: {
                            createdAt: 0,
                            text:""
                        },
                        request:false
                    }
                    var joined = this.state.data.concat(temp);
                    this.setState({data: joined})
                }
            });
        })

        //fetch message between u and your friend
        this.fetchLastMessage();
        this.fetchRequest();
      

        // const response = await itemsRef.onSnapshot((Snapshot) => {
        //     Snapshot.forEach(async(doc) => {
        //         const {name, id, image} = doc.data()
        //         //ignore self
        //         if(id != global.currentUser.id){
        //             var temp = {
        //                 id:doc.id,// used as unique id in the list
        //                 _idTo:id,
        //                 name: name,
        //                 avatar: null,
        //                 //avatar:image || null,
        //                 msg: {
        //                     createdAt: 0,
        //                     text:"Default"
        //                 },
        //                 request:false
        //             }
        //             //fetch message between u and your friend
        //             const data = await this.fetchLastMessage(id,global.currentUser.id)
        //             temp.msg.createdAt = data.createdAt;
        //             temp.msg.text = data.text;

        //             const returnDoc = await this.fetchRequest(id,global.currentUser.id);
        //             temp.request = returnDoc
        //             var joined = this.state.data.concat(temp);
        //             this.setState({data: joined})
        //         }
        //     });
        // })

        this.setState({
            name: global.currentUser.name,
            email: global.currentUser.email,
        });
    }

    componentWillUnmount() {
        firebaseSvc.refOff();
    }

    render() {
        return (
            <View style={styles.container}>
                <FlatList
                    style={styles.container}
                    data={this.state.data}
                    renderItem = {({ item }) => <Item data = { item } navigation = {this.props.navigation}/>}
                    keyExtractor={item => item.id}
                />
            </View>
        );
    }
}
  
const offset = 16;
const styles = StyleSheet.create({
    title: {
        marginTop: offset,
        marginLeft: offset,
        fontSize: offset,
    },
    box: {
        padding:5,
        marginTop:5,
        marginBottom:5,
        backgroundColor: '#FFFFFF',
        flexDirection: 'row',
        shadowColor: 'black',
        shadowOpacity: .2,
        shadowOffset: {
          height:1,
          width:-2
        },
        elevation:2
      },
      username:{
        fontWeight: 'bold',
        fontSize:20,
        alignSelf:'flex-start',
        marginLeft:10
      },
      body: {
        padding:30,
        backgroundColor :"#E6E6FA",
      },
      image:{
        width: 60,
        height: 60,
      },
      columnContainer:{
        flex: 1,
        flexDirection: 'column',
        padding:5,
      },
      rowContainer:{
        justifyContent: 'space-between',
        flexDirection: 'row',
        //padding:5,
      },
      newRequest:{
        color: "#6979F8",
        fontSize:16,
        alignSelf:'flex-start',
        marginTop:3,
        marginLeft:10
      },
      message:{
        fontSize:16,
        alignSelf:'flex-start',
        marginTop:3,
        marginLeft:10
      }
});
  
export default ChatMain;
  