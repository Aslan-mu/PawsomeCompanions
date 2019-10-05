import React from 'react';
import {
  StyleSheet, Text, View, FlatList, Button,
} from 'react-native';
import firebaseSvc from '../FirebaseSvc';

function Item({ user }) {
    onPressItem = ()=>{
        console.log("pressed!");
        this.props.navigation.navigate('Chat', {
            name: this.state.name,
            email: this.state.email,
        });
    };
    return (
        <Button 
            style={styles.title} 
            onPress={this.onPressItem} 
            title={user} 
            />
    );
}

class Main extends React.Component {

    state = {
    };

    constructor(props) {
        super(props);
        itemsRef = firebaseSvc.refUser();
        itemsRef.onSnapshot((Snapshot) => {
            var items = [];
            Snapshot.forEach((doc) => {
                const {email, name} = doc.data()
                items.push({
                id: doc.id,
                name: name,
                email: email,
              });
            });
            this.setState({
              data: items
            });
        });
    }

    // onPressItem = (chatWith)=>{
    //     this.setState({ chatWith });
    //     this.props.navigation.navigate('Chat', {
    //         chatWith: this.state.chatWith,
    //         name: this.state.name,
    //         email: this.state.email,
    //     });
    // };

      
    render() {
        return (
            <View>
                <Text style={styles.title}>Login in!</Text>
                <Text style={styles.title}>Your Name: {JSON.stringify(this.props.navigation.getParam('name', 'NO-ID'))}</Text>
                <Text style={styles.title}>Your Email: {JSON.stringify(this.props.navigation.getParam('email', 'NO-ID'))}</Text>

                <Text style={styles.title}>Your friend lists:</Text>
                <FlatList
                    data={this.state.data}
                    renderItem={({ item }) => 
                        <Button 
                            style={styles.title} 
                            onPress={
                                ()=>this.props.navigation.navigate('Chat', {
                                chatWith: item.name,
                                name: this.state.name,
                                email: this.state.email,
                            })} 
                            title={item.name} 
                        />}
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
});
  
export default Main;
  