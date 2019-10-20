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
    }
    static navigationOptions = ({ navigation }) => ({
        title: (navigation.state.params || {}).chatWith || 'Chat!',
    });

    state = {
        user:{
            name:"",
            chatWith:""
        },
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

    acceptButton(){
        console.log("accept");
    }

    declineButton(){
        console.log("decline");
    }

    toolBar =  () => {
        return (
            <View style = {styles.viewStyle}>
                <Text>12313</Text>
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
            </View>
    )}

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
        backgroundColor: 'red'
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
        justifyContent: 'space-between',
        flexDirection: 'row',
        //padding:5,
    },
    image: {
        width:100, 
        height:100,
        marginLeft: offset,
        marginTop: offset,
    }
});

export default Chat;
