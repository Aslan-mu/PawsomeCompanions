import React from 'react';
import {
  StyleSheet, Text,
  TextInput, View,
  TouchableOpacity,
  Image,
} from 'react-native';

import firebaseSvc from '../../FirebaseSvc';
import firebase from 'firebase';
import ImagePicker from 'react-native-image-picker';
import RNPickerSelect, { defaultStyles } from 'react-native-picker-select';
import Icon from 'react-native-vector-icons/MaterialIcons';

const options = {
    title: 'Image',
    customButtons: [{ name: 'Pawesome', title: 'Choose Photo from Facebook' }],
    storageOptions: {
        skipBackup: true,
        path: 'images',
    },
};

const sports = [
    {
        label: 'Less than 1',
        value: 0,
    },
    {
        label: "1",
        value: 1,
    },
    {
        label: "2",
        value: 2,
    },
    {
        label: "3",
        value: 3,
    },
    {
        label: "4",
        value: 4,
    },
    {
        label: "5",
        value: 5,
    },
    {
        label: "6",
        value: 6,
    },
    {
        label: "7",
        value: 7,
    },
    {
        label: "8",
        value: 8,
    },
    {
        label: "9",
        value: 9,
    },
    {
        label: "10",
        value: 10,
    },
    {
        label: "10+",
        value: 11,
    },
  ];

class Referral extends React.Component {

    constructor(props){
        super(props)
        this.state={ 
            imageSource: require("./camera.png"),
            petType:"",
            petName:"",
            petAge:null,
            petTypeDetail:"",
            owner:global.currentUser.id
        }
    }

    static navigationOptions = {
        title: 'Pet Profile',
    };

    pickImage = () => {
        ImagePicker.showImagePicker(options, (response) => {
            if (response.didCancel) {
                console.log('User cancelled image picker');
            } else if (response.error) {
                console.log('ImagePicker Error: ', response.error);
            } else if (response.customButton) {
                console.log('User tapped custom button: ', response.customButton);
            } else {
                const source = { uri: response.uri };
          
                // You can also display the image using data:
                // const source = { uri: 'data:image/jpeg;base64,' + response.data };
                this.setState({
                    imageSource: source,
                });
            }
        });
    }

    uploadImage = async (source,petId) => {
        console.log('got image to upload. uri:' + source.uri);
        try {
            const response = await fetch(source.uri);
            const blob = await response.blob();
            const ref = firebase.storage().ref('PetImage').child(petId);
            const task = ref.put(blob);
            
            return new Promise((resolve, reject) => {
                task.on('state_changed',(snapshot) => {
                    // Observe state change events such as progress, pause, and resume
                    // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
                    var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                    console.log('Upload is ' + progress + '% done');
                    switch (snapshot.state) {
                        case firebase.storage.TaskState.PAUSED: // or 'paused'
                        console.log('Upload is paused');
                        break;
                        case firebase.storage.TaskState.RUNNING: // or 'running'
                        console.log('Upload is running');
                        break;
                    }
                    /* noop but you can track the progress here */
                },reject /* this is where you would put an error callback! */,
                    () => resolve(task.snapshot.downloadURL)
                );
            });
        } catch (err) {
            console.log('uploadImage try/catch error: ' + err.message); 
        }
    }

    confirmButton = async () => {
        if (this.state.petType == ""){
            alert("Please choose pet type!")
            return
        }
        if (this.state.petName == ""){
            alert("Please fill pet name!")
            return
        }
        if (this.state.petAge == null){
            alert("Please fill pet age!")
            return
        }
        if (this.state.petTypeDetail == ""){
            alert("Please fill pet type detail!")
            return
        }

        // update the pet object and get the doc object
        const petDoc = await firebase.firestore().collection('Pets').add(this.state);

        if (this.state.imageSource != null) {
            // upload image to storage at pet id
            const success =  await this.uploadImage(this.state.imageSource,petDoc.id);
            // update the pet object and get the doc object
            const url = await firebase.storage().ref('PetImage').child(petDoc.id).getDownloadURL()
            // update the pet object and get the doc object
            const pet = await firebase.firestore().collection('Pets').doc(petDoc.id).update({imageSource: url})
            alert("Register success!")
        }
        this.props.navigation.navigate("App")
    }

    onChangePetName = petName => this.setState({ petName });
    onChangePetAge = petAge => this.setState({ petAge });
    onChangePetTypeDetail = petTypeDetail => this.setState({ petTypeDetail });
    render() {
        const placeholder = {
            label: 'Select the age...',
            value: null,
            color: '#9EA0A4',
          };
        return (
            <View style = {styles.viewStyle}>
                <View style={styles.columnBox}>
                    <Text style={styles.servicesLabel}>
                        Pet Profile
                    </Text>
                    <TouchableOpacity 
                        style={{alignItems: 'center',marginBottom:20}}
                        onPress={this.pickImage}>
                        <Image source={this.state.imageSource} style={styles.image}></Image>
                    </TouchableOpacity>
                </View>
                <View style = {styles.flexRow}>
                    <TouchableOpacity style={ this.state.petType === "dog" ?  styles.selectedServiceButtonStyle :  styles.serviceButtonStyle} onPress={() => { this.setState({petType: "dog"})} }>
                        <Text style={this.state.petType === "dog" ? styles.selectedText : styles.unselectedText}>
                            Dog
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={this.state.petType === "cat"? styles.selectedServiceButtonStyle : styles.serviceButtonStyle} onPress={() => { this.setState({petType: "cat"})}}>
                        <Text style={this.state.petType === "cat"? styles.selectedText : styles.unselectedText} >
                            Cat
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={ this.state.petType === "other"? styles.selectedServiceButtonStyle : styles.serviceButtonStyle} onPress={() => { this.setState({petType: "other"}) }}>
                        <Text style={this.state.petType === "other"? styles.selectedText : styles.unselectedText}>
                            Other
                        </Text>
                    </TouchableOpacity>
                </View>
                <View style={styles.columnBox}>
                    <View >
                        <Text>Name: </Text>
                        <TextInput
                            style={styles.inputField}
                            onChangeText={this.onChangePetName}
                        />
                    </View>
                    <View >
                        <Text>Age: </Text>
                        <RNPickerSelect
                            placeholder={placeholder}
                            items={sports}
                            onValueChange={value => {
                                this.setState({
                                    petAge: value,
                                });
                            }}
                            style={{
                                ...pickerSelectStyles,
                                iconContainer: {
                                    top: 10,
                                    right: 12,
                                },
                            }}
                            value={this.state.petAge}
                            useNativeAndroidPickerStyle={false}
                            textInputProps={{ underlineColor: 'yellow' }}
                            Icon={() => {
                                return <Icon name="arrow-downward" size={24} color={"#d0c9d6"}></Icon>;
                            }}
                        />

                    </View>
                    <View >
                        <Text>Type: </Text>
                        <TextInput
                            style={styles.inputField}
                            onChangeText={this.onChangePetTypeDetail}
                        />
                    </View>
                </View>
                <View style={styles.columnBox}>
                    <TouchableOpacity style={styles.button} 
                        onPress={this.confirmButton}
                        >
                        <Text style = { styles.text}>
                            Confirm
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>
        );
    }
}
  
const offset = 16;
const styles = StyleSheet.create({
    image: {
        width:80, 
        height:80,
        borderColor:"grey",
        borderWidth:2,
        borderRadius:50,
        marginTop: offset,
    },
    viewStyle:{
        paddingTop:50,
        flex:1,
        backgroundColor:"rgb(250,250,251)"
    },
    flexRow:{
        justifyContent:"center",
        flexDirection: "row",
    },
    selectedText:{
        color: "#1a051d",
        fontWeight:"bold"
    },
    unselectedText:{
        //todo
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
    inputField: {
        color: "#000000",
        borderBottomWidth: 1,
        borderBottomColor: "#e5e3e2",
        backgroundColor: "#ffffff",
        borderRadius: 8, 
        padding: 12,
        marginBottom:10,
        marginTop:5
    },
    button: {
        // width: "90%",
        height: 48,
        borderRadius: 6,
        backgroundColor: "#f99558",
        justifyContent: "center",
        alignItems: "center"
    },
    columnBox:{
        flexDirection: "column", 
        marginBottom: 20,
        marginLeft: 20,
        marginRight: 20
    },
    text:{
        textAlign: 'center',
        fontSize: 17,
        fontWeight: "400",
        lineHeight: 20,
        letterSpacing: 0,
        color: "white",
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

const pickerSelectStyles = StyleSheet.create({
    inputIOS: {
        borderBottomWidth: 1,
        borderBottomColor: "#e5e3e2",
        backgroundColor: "#ffffff",
        borderRadius: 8, 
        padding: 12,
        marginBottom:10,
        marginTop:5,
        paddingRight: 30, // to ensure the text is never behind the icon
    },
    inputAndroid: {
        fontSize: 16,
        paddingHorizontal: 10,
        paddingVertical: 8,
        borderWidth: 0.5,
        borderBottomColor: 'purple',
        borderRadius: 8,
        color: 'black',
        paddingRight: 30, // to ensure the text is never behind the icon
    },
});
  
export default Referral;
  