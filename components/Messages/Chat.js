import React from 'react';
import { GiftedChat } from 'react-native-gifted-chat';
import {Text, View, StyleSheet, TouchableOpacity} from 'react-native';

import firebaseSvc from '../../FirebaseSvc';

// type Props = {
//   name?: string,
//   email?: string,
// };

class Chat extends React.Component{

    constructor(props) {
        super(props);
        this.state.user = {
            _idTo: this.props.navigation.state.params._idTo,
            name: global.currentUser.name,
            chatWith: this.props.navigation.state.params.chatWith,
        }
        this.state.request = this.props.navigation.state.params.request
    }
    static navigationOptions = ({ navigation }) => ({
        title: (navigation.state.params || {}).chatWith || 'Chat!',
    });

    state = {
        user:{
            name:"",
            chatWith:""
        },
        request:false,
        messages: [],
    };

    get user() {
        return {
            name: global.currentUser.name,
            chatWith: this.props.navigation.state.params.chatWith,
            _idTo: this.props.navigation.state.params._idTo,
            _id: global.currentUser.id, // need for gifted-chat
            avatar: global.currentUser.imageSource.uri || null,
        };
    }

    acceptButton =  async() => {
        requestRef = firebaseSvc.refRequests().doc(this.state.request.id).update({accepted: true})
        const doc =  await firebaseSvc.refRequests().doc(this.state.request.id)
        const data = doc.data()
        
        // Create session
        firebaseSvc.addNewSession({
            startDate: data.startDate,
            endDate: data.endDate,
            owner: data.owner,
            sitter: data.sitter,
            pet: 'Griffey',
            service: data.service,
        })
        
        this.setState({
            request:false
        })
        alert("Accepted the request!")
        console.log("accept");
    }

    declineButton = () => {
        this.setState({
            request:false
        })
        alert("Declined the request!")
        console.log("decline");
    }

    toolBar =  () => {
        if (this.state.request){
            request = this.state.request.data();
            return (
                <View style = {styles.viewStyle}>
                    <Text>You got a new request from {this.state.user.chatWith}!</Text>
                    <Text>From {(new Date(request.startDate.seconds*1000).toLocaleString())} to {(new Date(request.endDate.seconds*1000).toLocaleString())}!</Text>
                    <View style = {styles.rowContainer}>
                        <TouchableOpacity
                            style={styles.buttonText}
                            onPress={ this.acceptButton }
                        >
                            <Text> Accept </Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={styles.buttonText}
                            onPress={ this.declineButton }
                        >
                            <Text> Decline </Text>
                        </TouchableOpacity>
                    </View>
                </View>)
        }
        else{
            return(null)
        }
    }

    render() {
        return (
        <GiftedChat
            alwaysShowSend = {true}
            //renderUsernameOnMessage = {true}
            showUserAvatar = {true}
            //renderFooter = {this.toolBar}
            //renderActions = {this.toolBar}
            renderChatFooter = {this.toolBar}
            scrollToBottom = {true}
            timeFormat = {"YYYY-MM-DD LT"}
            messages = {this.state.messages}
            onSend = {firebaseSvc.send}
            user = {this.user}
        />
        );
    }

    componentDidMount() {
        this.setState({
            user:{
                name: this.state.user.name ||  global.currentUser.name,
                chatWith: this.state.user.chatWith ||  this.props.navigation.state.params.chatWith,
                _idTo: this.props.navigation.state.params._idTo,
            }
        });

        firebaseSvc.refOn(this.state.user.name,this.state.user.chatWith,this.state.user._idTo,message =>{
            if(message!=null){
                this.setState(previousState => ({
                    messages: GiftedChat.append(previousState.messages, message),
                }))
            }
        });
    }
    componentWillUnmount() {
        firebaseSvc.refOff();
    }
}


const offset = 16;
const styles = StyleSheet.create({
    viewStyle: {
        backgroundColor: '#D5E9FA',
        alignItems: 'center',
        padding:3,
    },
    title: {
        marginTop: offset,
        marginLeft: offset,
        fontSize: offset,
    },
    nameInput: {
        height: offset * 3,
        margin: offset,
        paddingHorizontal: offset,
        borderColor: '#111111',
        borderWidth: 1,
        fontSize: offset,
    },
    buttonText: {
        height: offset * 3,
        color: 'red',
        marginLeft: offset,
        fontSize: 42,
    },
    rowContainer:{
        //flex: 1,
        //justifyContent: 'space-between',
        flexDirection: 'row',
        padding:5,
    },
    image: {
        width:100, 
        height:100,
        marginLeft: offset,
        marginTop: offset,
    }
});

export default Chat;
