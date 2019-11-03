import React from 'react';
import {
  StyleSheet, Text, View, FlatList, TouchableOpacity, Image,
} from 'react-native';
import firebaseSvc from '../../FirebaseSvc';

function Item({ data, navigation }) {
    return (
        <TouchableOpacity
            onPress={
                () => {
                    navigation.navigate('Chat', {
                        request: data.request,
                        chatWith: data.name,
                        _idTo: data._idTo,
                    })
                }
            } >
            <View style = {styles.box}>
                <Image style={styles.image} source={{uri: data.avatar}}/>
                <View style = {styles.columnContainer}>
                    <View style = {styles.rowContainer}>
                        <Text style = {styles.username}>{data.name}</Text>
                        <Text style = {styles.message}>{data.msg.createdAt == null || data.msg.createdAt == "" ?  null : (new Date(data.msg.createdAt.toDate())).toLocaleString('en-GB')}</Text>
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

    fetchLastMessage = () => {
        const setNewRequest = (newData) => {
            this.setState({data: newData})
        }
        userId = global.currentUser.id
        firebaseSvc.refLastMessages().onSnapshot(querySnapshot => {
            querySnapshot.docChanges().forEach(change => {
                var msg = {
                    createdAt: "",
                    text: ""
                };
                data = this.state.data
                firstId = change.doc.id.split("_")[0]
                secondId = change.doc.id.split("_")[1]
                data.forEach((temp) => {
                    _idTo = temp._idTo;
                    if(((firstId == _idTo && secondId == userId)
                    ||( firstId == userId && secondId == _idTo)) 
                    && (temp.msg.createdAt == "" || change.doc.data().createdAt > temp.msg.createdAt )){
                        msg.createdAt = change.doc.data().createdAt;
                        msg.text = change.doc.data().text;
    
                        var dataAll = this.state.data
                        temp.msg = msg
    
                        const dataOtherThanTemp = dataAll.filter(te => te._idTo !== _idTo)
                        const newData = [temp].concat(dataOtherThanTemp)
                        setNewRequest(newData) 
                    }
                });
            })
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
                        avatar: null,
                        //avatar:image || null,
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

        // /fetch message between u and your friend
        this.fetchLastMessage();
        this.fetchRequest();

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
                    renderItem = {({ item }) => <Item data = { item } navigation = {this.props.navigation} />}
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
  