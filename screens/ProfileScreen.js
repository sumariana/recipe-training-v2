import React,{useCallback,useReducer,useState,useEffect} from 'react'
import { StyleSheet, View, Text,ScrollView } from 'react-native';
import {Image} from 'react-native-elements'
import { useSelector, useDispatch } from 'react-redux';

import TextInputLayout from '../component/input-layout';
import * as AuthAction from '../store/auth/auth-action';
import * as errorHandler from '../store/common/errorHandler';

const UPDATE = 'UPDATE';

const formReducer = (state,action)=>{
    if(action.type===UPDATE){
        const updatedValues = {
            ...state.inputValues,
            [action.input]: action.value
        }
        const updatedValidities={
            ...state.inputValidities,
            [action.input]: action.isValid
        }
        let updatedFormIsValid = true
        for (const key in updatedValidities) {
            updatedFormIsValid = updatedFormIsValid && updatedValidities[key];
        }
        return {
            formIsValid : updatedFormIsValid,
            inputValues: updatedValues,
            inputValidities: updatedValidities
        };
    }
    return state
}

const ProfileScreen = props =>{
    const dispatch = useDispatch()
    const [formState, dispatchFormState]=useReducer(formReducer,{
        inputValues:{
            name:'',
            phone:'',
            email: ''
        },
        inputValidities:{
            name:false,
            phone:false,
            email:false
        },
        formIsValid:false
    });

    const inputChangeHandler = useCallback((inputIdentifier, inputValue,inputValidity)=>{
        dispatchFormState({type: UPDATE,value: inputValue,isValid: inputValidity,input:inputIdentifier});
    },[dispatchFormState]);

    return (
        <ScrollView contentContainerStyle={styles.screen}>
            <View style={styles.imageContainer}>
                <Image style={styles.Image} source={require('../assets/images/user.png')}/>
            </View>
            <View style={styles.inputContainer}>
                <TextInputLayout
                id = 'name'
                label = 'name'
                required = {true}
                onInputChange={inputChangeHandler}
                />
                <TextInputLayout
                id = 'phone'
                label = 'phone'
                required = {true}
                onInputChange={inputChangeHandler}
                />
                <TextInputLayout
                id = 'email'
                label = 'Email'
                email = {true}
                required = {true}
                onInputChange={inputChangeHandler}
                />
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    screen:{
        flexGrow:1,
        backgroundColor:'white'
    },
    inputContainer:{
        marginTop: '15%',
        marginHorizontal:20
    },
    imageContainer:{
        width:'100%',
        marginTop: '20%',
        alignItems:'center'
    },
    Image:{
        width:150,
        height:150,
        resizeMode:'contain'

    },
});

export default ProfileScreen;