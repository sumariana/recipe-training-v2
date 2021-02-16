import AsyncStorage from '@react-native-async-storage/async-storage';
import React,{useCallback, useReducer,useState,useEffect} from 'react';
import { StyleSheet, View, Text,Image,ScrollView } from 'react-native';
import { Button } from 'react-native-elements';
import { useSelector, useDispatch } from 'react-redux';

import TextInputLayout from '../component/input-layout';
import * as AuthAction from '../store/auth/auth-action';
import * as errorHandler from '../store/common/errorHandler';


const LOGIN = 'LOGIN';

const formReducer = (state,action)=>{
    if(action.type===LOGIN){
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

const LoginScreen = props =>{
    const dispatch = useDispatch()
    const [token,setToken] = useState()
    const [isLoading,setIsLoading]=useState(false)
    const [formState, dispatchFormState]=useReducer(formReducer,{
        inputValues:{
            email: '',
            password:''
        },
        inputValidities:{
            email:false,
            password:false
        },
        formIsValid:false
    });

    // useEffect(async()=>{
    //     try{
    //         setToken(await AsyncStorage.getItem(authAction.KEY_ACCESS_TOKEN))
    //         if(token){
    //             props.navigation.navigate('Recipe')
    //         }
    //     }catch(err){
    //         console.log(err)
    //     }
    // },[token])

    const inputChangeHandler = useCallback((inputIdentifier, inputValue,inputValidity)=>{
        dispatchFormState({type: LOGIN,value: inputValue,isValid: inputValidity,input:inputIdentifier});
    },[dispatchFormState]);

    const doLogin = async() =>{
        setIsLoading(true)
        try{
            await dispatch(AuthAction.doLogin(formState.inputValues.email,formState.inputValues.password))
            setIsLoading(false)
            props.navigation.navigate('Recipe')
        }catch(err){
            setIsLoading(false)
            errorHandler.showErrorAlert(err.message)
        }
    }

    return (
        <ScrollView contentContainerStyle = {styles.screen}>
            <View style={styles.imageContainer}>
                <Image style={styles.Image} source={require('../assets/images/logo.png')}/>
            </View>
            <View style={styles.inputContainer}>
                <TextInputLayout
                id = 'email'
                label = 'Email'
                email = {true}
                required = {true}
                onInputChange={inputChangeHandler}
                />
                <TextInputLayout
                id='password'
                label = 'password'
                isPassword = {true}
                required = {true}
                onInputChange={inputChangeHandler}
                />
            </View>
            <View style={styles.buttonContainer}>
            <Button
                title='LOGIN'
                containerStyle={{marginTop:50,width:'100%'}}
                buttonStyle={{borderRadius:20,backgroundColor:'#F3717F',marginHorizontal:20}}
                titleStyle={{fontSize:22}}
                disabled = {!formState.formIsValid}
                loading={isLoading}
                loadingStyle={{width:24,height:24}}
                onPress={doLogin}
                />
                <Text style={{fontSize:16,marginTop:10,marginBottom:20}}>Don't have an account? <Text style={{color: '#F3717F',fontWeight:'bold'}} 
                      onPress={()=>
                        props.navigation.navigate('Register')
                      }>Register Now!</Text> 
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
                containerStyle={{marginVertical:30,width:'100%'}}
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