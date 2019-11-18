import React from 'react';
import firebaseSvc from '../../FirebaseSvc';
import {
  StyleSheet, Text,
  View,TouchableOpacity,
  ScrollView,
} from 'react-native';

class PetSittingPreference extends React.Component {
    static navigationOptions = {
        title: 'PetSittingPreference',
    };
    
    constructor(props) {
        super(props)
        this.state = {
            dog:false,
            cat:false,
            other:false,
            days:false,
            oneWeek:false,
            twoWeeks:false,
            dontMind:false,
        }
    }

    nextButton = async () => {
        firebaseSvc.refPetSittingPreference().doc(global.currentUser.id).set(this.state);
        this.props.navigation.navigate("PetProfile")
    }
    render() {
        return (
            <ScrollView style = {styles.viewStyle}>
                <View style={styles.columnBox1}>
                    <Text style={styles.servicesLabel}>
                        What pets are you willing to take care of?
                    </Text>
                    <View style = {styles.flexRow}>
                        <TouchableOpacity style={ this.state.dog?  styles.selectedServiceButtonStyle :  styles.serviceButtonStyle} onPress={() => { this.setState(prevState => ({dog: !prevState.dog}))} }>
                            <Text style={this.state.dog? styles.selectedText : styles.unselectedText}>
                                Dog
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={this.state.cat? styles.selectedServiceButtonStyle : styles.serviceButtonStyle} onPress={() => { this.setState(prevState => ({cat: !prevState.cat}))}}>
                            <Text style={this.state.cat? styles.selectedText : styles.unselectedText} >
                                Cat
                            </Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={ this.state.other ? styles.selectedServiceButtonStyle : styles.serviceButtonStyle} onPress={() => { this.setState(prevState => ({other: !prevState.other})) }}>
                            <Text style={this.state.other? styles.selectedText : styles.unselectedText}>
                                Other
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
                <View style={styles.columnBox2}>
                    <Text style={styles.servicesLabel}>How long would you prefer to take care of others pets?</Text>
                    <TouchableOpacity style={ this.state.days?  styles.selectedServiceButtonStyle :  styles.serviceButtonStyle} onPress={() => { this.setState(prevState => ({days: !prevState.days}))}}>
                        <Text style={this.state.days? styles.selectedText : styles.unselectedText}>
                            Couple of days
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={this.state.oneWeek? styles.selectedServiceButtonStyle : styles.serviceButtonStyle} onPress={() => { this.setState(prevState => ({oneWeek: !prevState.oneWeek}))}}>
                        <Text style={this.state.oneWeek? styles.selectedText : styles.unselectedText} >
                            Less than a week
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={ this.state.twoWeeks? styles.selectedServiceButtonStyle : styles.serviceButtonStyle} onPress={() => { this.setState(prevState => ({twoWeeks: !prevState.twoWeeks}))}}>
                        <Text style={this.state.twoWeeks? styles.selectedText : styles.unselectedText}>
                            Less than 2 weeks
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={ this.state.dontMind? styles.selectedServiceButtonStyle : styles.serviceButtonStyle} onPress={() => { this.setState(prevState => ({dontMind: !prevState.dontMind}))}}>
                        <Text style={this.state.dontMind? styles.selectedText : styles.unselectedText}>
                            I don't mind
                        </Text>
                    </TouchableOpacity>
                </View>
                <View style={styles.columnBox}>
                    <TouchableOpacity style={styles.loginButton} 
                        onPress={this.nextButton}
                        >
                        <Text style={styles.loginText}>
                            Next 
                        </Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        );
    }
}
  
const styles = StyleSheet.create({
    viewStyle:{
        flex:1,
        backgroundColor:"rgb(250,250,251)"
    },
    flexRow:{
        justifyContent:"center",
        flexDirection: "row",
    },
    servicesLabel: {
        textAlign: 'center',
        fontWeight: "600",
        fontSize: 20,
        lineHeight: 24,
        lineHeight: 20,
        letterSpacing: 0,
        color: "#1a051d",
        margin:20,
    },
    textContent:{
        textAlign: 'center',
        fontSize: 15,
        lineHeight: 20,
        letterSpacing: 0,
        color: "#1a051d",
        margin:10
    },
    selectedText:{
        color: "#1a051d",
        fontWeight:"bold"
    },
    unselectedText:{
        //todo
    },
    loginText:{
        textAlign: 'center',
        fontSize: 17,
        fontWeight: "400",
        lineHeight: 20,
        letterSpacing: 0,
        color: "white",
    },
    loginButton: {
        margin: 10,
        height: 48,
        borderRadius: 6,
        backgroundColor: "#f99558",
        justifyContent: "center",
        alignItems: "center"
    },
    columnBox:{
        flex:1,
        flexDirection: "column", 
        margin: 40,
    },
    columnBox1:{
        flex:1,
        flexDirection: "column", 
        margin: 40,
    },
    columnBox2:{
        flex:2,
        flexDirection: "column", 
        margin: 40,
    },
    serviceButtonStyle: {
        // width: "80%",
        height: 44,
        borderRadius: 4,
        backgroundColor: "#ffffff",
        borderStyle: "solid",
        borderWidth: 1,
        borderColor: "#e5e3e2",
        justifyContent: "center",
        alignItems: "flex-start",
        marginBottom: 16,
        paddingHorizontal: 16
    },
    selectedServiceButtonStyle: {
        height: 44,
        borderRadius: 4,
        backgroundColor: "#ffffff",
        borderStyle: "solid",
        borderWidth: 1,
        borderColor: "#f99558",
        justifyContent: "center",
        alignItems: "flex-start",
        marginBottom: 16,
        paddingHorizontal: 16
    },
});
  
export default PetSittingPreference;
  