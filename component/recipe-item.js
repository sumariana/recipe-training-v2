import React,{ useEffect, useReducer,useState } from 'react'
import { TouchableOpacity } from 'react-native';
import { StyleSheet, View, Text,TextInput,ImageBackground,Ima } from 'react-native'
import { Icon } from 'react-native-elements'
import { createShimmerPlaceholder } from 'react-native-shimmer-placeholder'
import LinearGradient from 'expo-linear-gradient';

const ShimmerPlaceHolder = createShimmerPlaceholder(LinearGradient)

const RecipeItem = props =>{
    return (
        <TouchableOpacity onPress={props.onSelectRecipe} activeOpacity={0.8}>
            <ShimmerPlaceHolder shimmerStyle ={[styles.card,{height:180,width:'91%'}]} visible={!props.isShimmering}>
                <View style={styles.card}>
                    <ImageBackground style={styles.image} source={{ uri: props.image }}>
                        <View style={{backgroundColor:'black',opacity:0.5,width:'100%',height:'100%'}} />
                    </ImageBackground>
                    <Text style={styles.name}>{props.title}</Text>
                </View>
            </ShimmerPlaceHolder>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    card:{
        flex:1,
        shadowColor: 'black',
        shadowOpacity: 0.26,
        shadowOffset: {width: 0, height: 2},
        shadowRadius: 8,
        elevation: 6,
        borderRadius: 10,
        backgroundColor: 'white',
        height: 210,
        marginHorizontal: 16,
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
        borderBottomRightRadius:10,
        borderBottomLeftRadius:10,
        overflow: 'hidden',
        fontFamily:'roboto-bold'
    }
});

export default RecipeItem;