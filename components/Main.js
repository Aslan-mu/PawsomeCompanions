import React from 'react';
import {
  StyleSheet, Text, View,
} from 'react-native';

class Main extends React.Component {
    render() {
        return (
            <View>
            <Text style={styles.title}>Login in!</Text>
            <Text style={styles.title}>Name: {JSON.stringify(this.props.navigation.getParam('name', 'NO-ID'))}</Text>
            <Text style={styles.title}>Email: {JSON.stringify(this.props.navigation.getParam('email', 'NO-ID'))}</Text>
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
  