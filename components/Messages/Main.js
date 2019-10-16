import React from 'react';
import {
  StyleSheet, Text, View, FlatList, Button,
} from 'react-native';
import firebaseSvc from '../../FirebaseSvc';


class Main extends React.Component {

    state = {
    };

    constructor(props) {
        super(props);
        itemsRef = firebaseSvc.refUser();
        itemsRef.onSnapshot((Snapshot) => {
            var items = [];
            Snapshot.forEach((doc) => {
                const {name, id} = doc.data()
                items.push({
                id:doc.id,// used as unique id in the list
                _idTo:id,
                name: name,
              });
            });
            this.setState({
                data: items,
            });
        });
        this.state.name = global.currentUser.name;
        this.state.email = global.currentUser.email;
    }

    componentDidMount() {
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
            <View>
                <Text style={styles.title}>Login in!</Text>
                <Text style={styles.title}>Your Name: {this.state.name}</Text>
                <Text style={styles.title}>Your Email: {this.state.email}</Text>
                <Text style={styles.title}>Your friend lists:</Text>
                <FlatList
                    data={this.state.data}
                    renderItem={({ item }) => 
                        <Button 
                            style={styles.title} 
                            onPress={
                                ()=>this.props.navigation.navigate('Chat', {
                                    chatWith: item.name,
                                    _idTo: item._idTo,
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
  