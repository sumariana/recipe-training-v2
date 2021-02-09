import React from 'react'
import { StyleSheet, View, Text,Image,ScrollView } from 'react-native'
import { Button } from 'react-native-elements';

import TextInputLayout from '../component/input-layout'

const LoginScreen = props =>{
    return (
        <ScrollView contentContainerStyle = {styles.screen}>
            <View style={styles.imageContainer}>
                <Image style={styles.Image} source={require('../assets/images/logo.png')}/>
            </View>
            <View style={styles.inputContainer}>
                <TextInputLayout
                label = 'username'
                />
                <TextInputLayout
                label = 'password'
                isPassword = {true}
                />
            </View>
            <View style={styles.buttonContainer}>
            <Button
                title='LOGIN'
                containerStyle={{marginTop:50,width:'100%'}}
                buttonStyle={{borderRadius:20,backgroundColor:'#F3717F',marginHorizontal:20}}
                titleStyle={{fontSize:22}}
                />
                <Text style={{fontSize:16,marginTop:10,marginBottom:20}}>Don't have an account? 
                    <Text style={{color: '#F3717F'}} 
                      onPress={()=>console.log('we are pressing register')}>
                      Register Now!
                    </Text> 
                </Text>
            <View style={{
                borderStyle: 'dotted',
                borderColor: 'gray',
                borderWidth: 1,
                height:1,
                width:'100%',
                borderRadius: 1,
            }}>
            </View>
            <Button
                title='Sign in with another method'
                containerStyle={{marginTop:30,width:'100%'}}
                buttonStyle={{borderRadius:20,backgroundColor:'black',marginHorizontal:20}}
                titleStyle={{fontSize:22}}
                />
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    screen:{
        flexGrow:1
    },
    inputContainer:{
        marginTop: '15%',
        marginHorizontal:20
    },
    imageContainer:{
        width:'100%',
        marginTop: '20%'
    },
    Image:{
        width:'100%',
        resizeMode:'contain'

    },
    buttonContainer:{
        flexDirection:'column',
        justifyContent:'center',
        alignItems:'center'
    }
});

export default LoginScreen;