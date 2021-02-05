import React from 'react'
import { StyleSheet, View, Text,Image,ScrollView } from 'react-native'

const LoginScreen = props =>{
    return (
        <ScrollView contentContainerStyle = {styles.screen}>
            <View style={styles.imageContainer}>
                <Image style={styles.Image} source={require('../assets/images/logo.png')}/>
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    screen:{
        flexGrow:1
    },
    imageContainer:{
        width:'100%',
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth:1,
        borderColor:'black'
    },
    Image:{
        width:'80%'
    }
});

export default LoginScreen;