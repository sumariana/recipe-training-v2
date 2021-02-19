import AsyncStorage from '@react-native-async-storage/async-storage';
import React,{useCallback, useReducer,useState,useEffect} from 'react';
import { StyleSheet, View, Text,Image,ScrollView } from 'react-native';
import { Button } from 'react-native-elements';
import { useSelector, useDispatch } from 'react-redux';

import TextInputLayout from '../component/input-layout';
import LoadingDialog from '../component/loading-dialog';
import SignInDialog from '../component/custom-sign-dialog';
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
    const [openDialog,setOpenDialog]=useState(false)
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

    const getToken = useCallback(async()=>{
        setIsLoading(true)
        try{
            const tkn = await AsyncStorage.getItem(AuthAction.KEY_ACCESS_TOKEN);
            setToken(tkn)
            if(token){
                props.navigation.navigate('mainFlow') 
            }
        }catch(err){
            console.log(err)
        }
        setIsLoading(false)
    },[])

    useEffect(()=>{
        getToken()
    },[])

    const inputChangeHandler = useCallback((inputIdentifier, inputValue,inputValidity)=>{
        dispatchFormState({type: LOGIN,value: inputValue,isValid: inputValidity,input:inputIdentifier});
    },[dispatchFormState]);

    const doLogin = async() =>{
        setIsLoading(true)
        try{
            await dispatch(AuthAction.doLogin(formState.inputValues.email,formState.inputValues.password));
            setIsLoading(false)
            props.navigation.navigate('mainFlow')
        }catch(err){
            setIsLoading(false)
            errorHandler.showErrorAlert(err.message)
        }
    }

    return (
        <View style={{flex:1}}>
        <ScrollView contentContainerStyle = {styles.screen} keyboardShouldPersistTaps="always" >
            <View style={styles.imageContainer}>
                <Image style={styles.Image} source={require('../assets/images/logo.png')}/>
            </View>
            <View style={styles.inputContainer}>
                <TextInputLayout
                id = 'email'
                label = 'Email'
                email = {true}
                required = {true}
                inputType="email"
                onInputChange={inputChangeHandler}
                />
                <TextInputLayout
                id='password'
                label = 'password'
                isPassword = {true}
                required = {true}
                minLength ={6}
                inputType="password"
                onInputChange={inputChangeHandler}
                />
            </View>
            <View style={styles.buttonContainer}>
            <Button
                title='LOGIN'
                containerStyle={{marginTop:50,width:'100%'}}
                buttonStyle={{borderRadius:20,backgroundColor:'#F3717F',marginHorizontal:20}}
                titleStyle={{fontSize:18,fontFamily:'roboto-medium'}}
                disabled = {!formState.formIsValid}
                onPress={doLogin}
            />
                <Text style={{fontSize:14,marginTop:10,marginBottom:20,fontFamily:'roboto-regular'}}>Don't have an account? <Text style={{color: '#F3717F',fontFamily:'roboto-bold'}} 
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
                titleStyle={{fontSize:18,fontFamily:'roboto-medium'}}
                onPress={()=>{
                    setOpenDialog(true)
                }}
                />
            </View>
        </ScrollView>
        <LoadingDialog
        isShowModal = {isLoading}
        />
        <SignInDialog
        isShowModal = {openDialog}
        onOutsideTouch ={()=>{
            setOpenDialog(false)
        }}
        />
        </View>
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