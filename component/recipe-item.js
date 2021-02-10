import React,{ useEffect, useReducer,useState } from 'react'
import { TouchableOpacity } from 'react-native';
import { StyleSheet, View, Text,TextInput,ImageBackground } from 'react-native'
import { Icon } from 'react-native-elements'

const RecipeItem = props =>{
    return (
        <TouchableOpacity onPress={()=>{}} TouchableOpacity={0.1}>
            <View style={styles.card}>
                <ImageBackground style={styles.image} source={{ uri: props.image }} />
                <Text style={styles.name}>{props.title}</Text>
            </View>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    card:{
        shadowColor: 'black',
        shadowOpacity: 0.26,
        shadowOffset: {width: 0, height: 2},
        shadowRadius: 8,
        elevation: 6,
        borderRadius: 10,
        backgroundColor: 'white',
        height: 180,
        marginHorizontal: 20,
        marginVertical: 10,
        justifyContent:'flex-end',
        alignItems:'flex-start'
    },
    image:{
        width: '100%',
        height: '100%',
        borderRadius:10,
        overflow: 'hidden'
    },
    name:{
        width:'100%',
        fontSize:20,
        color:'white',
        position:'absolute',
        paddingStart:20,
        paddingVertical:5,
        backgroundColor:'black',
        opacity:0.8,
        borderBottomRightRadius:10,
        borderBottomLeftRadius:10,
        overflow: 'hidden'
    }
});

export default RecipeItem;