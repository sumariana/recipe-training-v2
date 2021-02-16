import React,{useCallback,useReducer,useState} from 'react'
import { StyleSheet, View, Text,ScrollView, Alert } from 'react-native'
import { Button, CheckBox } from 'react-native-elements';
import { useSelector, useDispatch } from 'react-redux';

import TextInputLayout from '../component/input-layout'
import * as AuthAction from '../store/auth/auth-action';

const REGISTER = 'REGISTER';

const formReducer = (state,action)=>{
    if(action.type===REGISTER){
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

const RegisterScreen = props =>{
    const [isChecked,setIsChecked]=useState(false)
    const dispatch = useDispatch()
    const [isLoading,setIsLoading]=useState(false)
    const [formState, dispatchFormState]=useReducer(formReducer,{
        inputValues:{
            name:'',
            email: '',
            phone:'',
            password:'',
            password_confirmation:''
        },
        inputValidities:{
            name:false,
            email: false,
            phone:false,
            password:false,
            password_confirmation:false
        },
        formIsValid:false
    });

    const inputChangeHandler = useCallback((inputIdentifier, inputValue,inputValidity)=>{
        dispatchFormState({type: REGISTER,value: inputValue,isValid: inputValidity,input:inputIdentifier});
    },[dispatchFormState]);

    const doRegister = async() =>{
        setIsLoading(true)
        try{
            await dispatch(AuthAction.doRegister(formState.inputValues))
            setIsLoading(false)
            Alert.alert( "Register Success", "Register success you will redirect to login page", [
                { 
                    text: "OK",onPress: ()=>{
                        props.navigation.goBack()
                    }
                }
            ]);
        }catch(err){
            setIsLoading(false)
            errorHandler.showErrorAlert(err.message)
        }
    }

    return (
        <View style={{ flexDirection:'column' ,backgroundColor:'white',flex:1}}>
            <ScrollView containerStyle={styles.screen}>
            <View style ={styles.inputContainer}>
                <TextInputLayout
                    id='name'
                    label = 'Name'
                    required = {true}
                    onInputChange={inputChangeHandler}
                />
                <TextInputLayout
                    id ='phone'
                    label = 'Phone'
                    required = {true}
                    minLength = {13}
                    maxlength = {13}
                    keyboardType = 'number-pad'
                    onInputChange={inputChangeHandler}
                />
                <TextInputLayout
                    id='email'
                    label = 'Email'
                    email = {true}
                    required = {true}
                    onInputChange={inputChangeHandler}
                />
                <TextInputLayout
                    id='password'
                    label = 'Password'
                    required = {true}
                    isPassword = {true}
                    minLength = {6}
                    onInputChange={inputChangeHandler}
                />
                <TextInputLayout
                    id='password_confirmation'
                    label = 'Re-Password'
                    required = {true}
                    isPassword = {true}
                    isRepassword = {true}
                    passwordValue = {formState.inputValues.password}
                    minLength = {6}
                    onInputChange={inputChangeHandler}
                />
                <View style={{flexDirection:'row',alignItems:'center'}}>
                    <CheckBox
                        containerStyle={{backgroundColor:'transparent',borderColor:'transparent'}}
                        checked={isChecked}
                        onPress={()=>{
                            setIsChecked(!isChecked)
                        }}
                        checkedColor='#FF1969'
                        uncheckedColor = 'black'
                        textStyle={{color: props.isDisabled ?'gray' : 'black',fontSize:12}}
                    />
                    <Text style={{color: 'black',fontWeight: 'bold',marginStart:-10}}>i have read the <Text style={{color:'#F3717F',fontWeight:'bold'}} onPress={()=>{}}>Terms of Service</Text></Text>
                </View>
        </View>
        </ScrollView>
        <Button
            title='Register'
            containerStyle={{width:'100%',marginVertical:20}}
            buttonStyle={{borderRadius:20,backgroundColor:'#F3717F',marginHorizontal:20}}
            titleStyle={{fontSize:22}}
            disabled={!(formState.formIsValid && isChecked)}
            onPress={doRegister}
            loading={isLoading}
            loadingStyle={{width:24,height:24}}
        />
        </View>
    );
};

RegisterScreen.navigationOptions = navData => {
    return {
      headerTitle: 'Register'
    };
  };

const styles = StyleSheet.create({
    screen:{
        flexGrow:1,
        borderWidth:1,
        borderColor:'black'
    },
    inputContainer:{
        marginTop:20,
        marginHorizontal:20
    }
});

export default RegisterScreen;