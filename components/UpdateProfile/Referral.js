import React from 'react';
import {
  StyleSheet, Text,
  TextInput, View,
  Button,
} from 'react-native';

import firebaseSvc from '../../FirebaseSvc';

class Referral extends React.Component {
    static navigationOptions = {
        title: 'Referral',
    };
  
    state = {
        referral: '',
    };
  
  
    onChangeTextReferral = referral => {
        this.setState({ referral });
    }
  
  
    render() {
        return (
            <View>
            <Text style={styles.title}>Community Referral: </Text>
           
            <TextInput
                style={styles.nameInput}
                onChangeText={this.onChangeTextReferral}
                value={this.state.referral}
            />
            <Button
                title="Confirm"
                style={styles.buttonText}
                onPress={() => {
                    firebaseSvc.updateReferral(this.state.referral);
                    this.props.navigation.navigate("PetSittingPreference")}
                }
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
        marginLeft: offset,
        fontSize: 42,
    },
});
  
export default Referral;
  