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
        this.state={text:"", imageSource:""}
    }

    componentDidMount = () => {
        console.log(this.props.navigation.state)
        this.props.navigation.setParams({handleSave: () => 
        {    
            this.props.navigation.state.params.addNewPost(
            {   
                text: this.state.text,
                imageSource: this.state.imageSource,
                likeNumber: 0,
                commentNumber: 0,
                user:""
            })

            // console.log(this.state.imageSource.substring(0,300))
        }
        }
        )
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
              // You can also display the image using data:
              const source = { uri: 'data:image/jpeg;base64,' + response.data };
          
              this.setState({
                imageSource: source,
              });
            //   console.log(source)
            }
          });
    }


    render(){
        return (
        <View>
            <TextInput style={styles.posterSubject}>
              Welcome to the community!

            </TextInput>

            <TextInput 
                multiline            
                style={styles.postContent}
                onChangeText={text => this.onChangeText(text)}
                value={this.state.text}
                placeholder="This is the placeholder"
                />
            <Image source={this.state.imageSource} style={{width:100, height:100}}/>
            
            <Button title="Add photo of your pets" onPress={ this.pickImage }/>
            <Button title="Add photo of your pets" onPress={ this.pickImage }/>
            <Button title="Add photo of your pets" onPress={ this.pickImage }/>
            <Button title="Add photo of your pets" onPress={ this.pickImage }/>

        </View>
        )
    }
}

const styles = StyleSheet.create({
  posterSubject: {
    // height: 150,
    fontSize:20,
    paddingHorizontal:16,
    marginTop: 20,
    marginBottom: 20,
    fontWeight:"bold",
    alignItems:"flex-start"
  },
  postContent: {
    paddingHorizontal:16,
    fontSize:12,
    height:300 
  }
})


export default NewCommunityPost

