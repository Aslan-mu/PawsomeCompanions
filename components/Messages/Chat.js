import React from 'react';
import { GiftedChat } from 'react-native-gifted-chat';

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
        };
    }

    render() {
        return (
        <GiftedChat
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
            }
        );
    }
    componentWillUnmount() {
        firebaseSvc.refOff();
    }
}

export default Chat;
