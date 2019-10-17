import React from "react"
import {
    StyleSheet, Text,
    TextInput, View,
    Button, ImageEditor, ScrollView, 
    Image
} from "react-native"

import ImagePicker from 'react-native-image-picker';
import Icon from 'react-native-vector-icons/MaterialIcons';

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
        <View style={{padding:12}}>
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
            {/* <Image source={this.state.imageSource} style={{width:100, height:100}}/> */}
            <View style={{height: 1, width: "100%", backgroundColor:"#C9C9C9", marginBottom: 10}}>
            </View>
            <View style={{flexDirection:"row", alignItems:"center"}}>
                <Icon name="camera-alt" size={24} style={{marginRight:30}}></Icon>
                <Button title="Add photo / video" color={"black"} onPress={ this.pickImage }/>
            </View> 
            <View style={{flexDirection:"row", alignItems:"center"}}>
                <Icon name="local-offer" size={24} style={{marginRight:30}}></Icon>
                <Button title="Tag People" color={"black"} onPress={ this.pickImage }/>
            </View> 
            <View style={{flexDirection:"row", alignItems:"center"}}>
                <Icon name="camera-alt" size={24} style={{marginRight:30}}></Icon>
                <Button title="Topic ategory" color={"black"} onPress={ this.pickImage }/>
            </View> 
            <View style={{flexDirection:"row", alignItems:"center"}}>
                <Icon name="navigation" size={24} style={{marginRight:30}}></Icon>
                <Button title="Add location" color={"black"} onPress={ this.pickImage }/>
            </View> 
        </View>
        )
    }
}

const styles = StyleSheet.create({
  posterSubject: {
    // height: 150,
    fontSize:20,
    paddingHorizontal:4,
    marginTop: 20,
    marginBottom: 20,
    fontWeight:"bold",
    alignItems:"flex-start"
  },
  postContent: {
    paddingHorizontal:4,
    fontSize:12,
    height:300 
  }
})


export default NewCommunityPost

