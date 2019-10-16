import React from "react"
import {
    StyleSheet, Text,
    TextInput, View,
    Button, ImageEditor, ScrollView, 
    Image 
} from "react-native"

import ImagePicker from 'react-native-image-picker';

const options = {
    title: 'Select Post',
    customButtons: [{ name: 'Pawesome', title: 'Choose Photo from Facebook' }],
    storageOptions: {
        skipBackup: true,
        path: 'images',
    },
};
  

class NewCommunityPost extends React.Component {

    constructor(props){
        super(props)
        this.state={text:"This is place to write your post", imageSource:""}
    }

    componentDidMount = () => {
        this.props.navigation.setParams({handleSave: () => this.props.navigation.addPost(this.state)})
    }

    onChangeText = (text) =>{
        this.setState({text})
    }

    printState = () =>{console.log(this.state)}

    static navigationOptions = ({navigation}) => ({
        title: 'New Community Post',
        headerRight: <Button title="Post" onPress={ () =>{navigation.state.params.handleSave(); navigation.navigate("Feed")}}/>
    });

    pickImage = () => {
        ImagePicker.showImagePicker(options, (response) => {
            // console.log('Response = ', response);
          
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


    render(){
        return (
        <View>
            <TextInput
                style={{ height:300, borderColor: 'gray', borderWidth: 1 }}
                onChangeText={text => this.onChangeText(text)}
                value={this.state.text}
            />
            <Image source={this.state.imageSource} style={{width:100, height:100}}>

            </Image>

            <Button title="Add photo of your pets" onPress={ this.pickImage }/>

        </View>
        )
    }
}


export default NewCommunityPost