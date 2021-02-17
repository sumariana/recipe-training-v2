import React,{useCallback,useReducer,useState,useEffect} from 'react'
import { StyleSheet, View, Text,ScrollView,Alert } from 'react-native';
import {Image,Button} from 'react-native-elements'
import { useSelector, useDispatch } from 'react-redux';
import { HeaderBackButton } from 'react-navigation-stack';

import TextInputLayout from '../component/input-layout';
import * as AuthAction from '../store/auth/auth-action';
import * as errorHandler from '../store/common/errorHandler';
import OptionsMenu from "react-native-option-menu";
import CustomDialog from '../component/custom-dialog';
import RecipeResponse from '../models/recipe_model';

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
    const [preLoadedData, setPreloadedData] = useState()
    const [isLoading,setIsLoading]= useState(false)
    const [showDialog,setShowDialog] = useState(false)
    const [isEditing,setIsEditing] = useState(false)
    const [isLoggingOut,setIsLoggingOut] = useState(false)
    const [formState, dispatchFormState]=useReducer(formReducer,{
        inputValues:{
            name:preLoadedData ? preLoadedData.name : '',
            phone:preLoadedData ? preLoadedData.phone: '',
            email: preLoadedData ? preLoadedData.email:'',
            image:preLoadedData ? preLoadedData.image:'',
        },
        inputValidities:{
            name:preLoadedData ? true: false,
            phone:preLoadedData ? true: false,
            email:preLoadedData ? true: false,
            image:preLoadedData ? true: true
        },
        formIsValid: preLoadedData ? true: false
    });

    const loadProfile = useCallback(async()=>{
        //setIsLoading(true)
        try{
            const response = await AuthAction.fetchProfile();
            console.log(response)
            setPreloadedData(response)
            //setIsLoading(false)
        }catch(err){
            //setIsLoading(false)
            errorHandler.showErrorAlert(err.message)
        }
    },[])

    const retrieveData = ()=>{
        formState.inputValues.name = preLoadedData.name
        formState.inputValues.phone = preLoadedData.phone
        formState.inputValues.email = preLoadedData.email
    }

    useEffect(()=>{
        loadProfile()
    },[dispatch,loadProfile])
    

    const doLogout = async()=>{
        try{
            await AsyncStorage.removeItem(KEY_ACCESS_TOKEN)
            setIsLoggingOut(false)
            props.navigation.popToTop();
        }catch(err){
            errorHandler.showErrorAlert(err.message)
        }
    }

    const openEditingMode = useCallback(()=>{
        if(isEditing){
            //custom alert
            setShowDialog(true)
        }else{
            setIsEditing(!isEditing)
        }
    },[isEditing,setIsEditing]);

    const OpenLogoutModal = useCallback(()=>{
        setIsLoggingOut(true)
    },[isLoggingOut,setIsLoggingOut]);

    useEffect(()=>{
        props.navigation.setParams({editMode: openEditingMode})
    },[openEditingMode,isEditing])

    useEffect(()=>{
        props.navigation.setParams({isEditingMode: isEditing});
    },[isEditing])

    useEffect(()=>{
        props.navigation.setParams({logout: OpenLogoutModal});
    },[OpenLogoutModal,isLoggingOut])

    const handleGoBack = useCallback(()=>{
        if(isEditing){
            setShowDialog(true)
        }else{
            props.navigation.goBack()
        }
    },[isEditing])

    useEffect(()=>{
        props.navigation.setParams({back: handleGoBack});
    },[handleGoBack])

    const inputChangeHandler = useCallback((inputIdentifier, inputValue,inputValidity)=>{
        dispatchFormState({type: UPDATE,value: inputValue,isValid: inputValidity,input:inputIdentifier});
    },[dispatchFormState]);

    const doUpdate = async()=>{
        setIsLoading(true);
        try{
            await dispatch(AuthAction.updateProfile(formState.inputValues.email,formState.inputValues.name,formState.inputValues.phone));
            setIsLoading(false);
            Alert.alert( "Update Success", "Updating Profile is Success", [
                { 
                    text: "OK",
                    onPress: ()=>{
                        setIsEditing(false)
                    }
                }
            ]);
        }catch(error){
            setIsLoading(false)
            errorHandler.showErrorAlert(error.message)
        }
    }

    return (
        <ScrollView contentContainerStyle={styles.screen}>
            <View style={styles.imageContainer}>
                {formState.inputValues.image==='' ? <Image style={styles.Image} source={require('../assets/images/user.png')} onPress={()=>{
                    if(isEditing){
                        console.log('openBottomSheet')
                    }else{
                        console.log('do nothing')
                    }
                }}/> :  
                <Image style={styles.Image} source={{uri: formState.inputValues.image}} onPress={()=>{
                    if(isEditing){
                        console.log('openBottomSheet')
                    }else{
                        console.log('do nothing')
                    }
                }}/>}
            </View>
            <View style={styles.inputContainer}>
                <TextInputLayout
                id = 'name'
                label = 'name'
                initialValue = {formState.inputValues.name}
                initialValidated = {!!preLoadedData}
                required = {true}
                isEditing = {isEditing}
                onInputChange={inputChangeHandler}
                />
                <TextInputLayout
                id = 'phone'
                label = 'phone'
                isNumOnly={true}
                initialValue = {formState.inputValues.phone}
                initialValidated = {!!preLoadedData}
                keyboardType = 'numeric'
                required = {true}
                isEditing = {isEditing}
                onInputChange={inputChangeHandler}
                />
                <TextInputLayout
                id = 'email'
                label = 'Email'
                email = {true}
                required = {true}
                isEditing = {isEditing}
                initialValue = { preLoadedData? formState.inputValues.email : ''}
                initialValidated = {!!preLoadedData}
                onInputChange={inputChangeHandler}
                />
            </View>
            {isEditing && <Button
                title='Change Profile'
                containerStyle={{marginTop:20,width:'100%'}}
                buttonStyle={{borderRadius:20,backgroundColor:'#F3717F',marginHorizontal:20}}
                titleStyle={{fontSize:22}}
                disabled = {!formState.formIsValid}
                loading={isLoading}
                loadingStyle={{width:24,height:24}}
                onPress={doUpdate}
            />}
            {showDialog && 
            <CustomDialog
            message = 'Are you sure want to discard changes?'
            yesTitle = 'Yes'
            noTitle = 'No'
            onOk ={()=>{
                loadProfile()
                setIsEditing(!isEditing)
                setShowDialog(false)
            }}
            onCancel = {()=>{
                setShowDialog(false)
            }}
            />}
            {isLoggingOut &&
                <CustomDialog
                message = 'Are you sure want to exit?'
                yesTitle = 'Yes'
                noTitle = 'No'
                onOk ={doLogout}
                onCancel = {()=>{
                    setIsLoggingOut(false)
                }}
                />
            }
        </ScrollView>
    );
};

ProfileScreen.navigationOptions = navData => {
    const gotoEditMode = navData.navigation.getParam('editMode')
    const isEditingMode = navData.navigation.getParam('isEditingMode')
    const isLoggingOutMode = navData.navigation.getParam('logout')
    const goback = navData.navigation.getParam('back')
    const MoreIcon = require("../assets/images/menu.png");
  
    return {
      title: 'Profile',
      headerRight: ()=> !isEditingMode ? (
        <OptionsMenu
        button={MoreIcon}
        buttonStyle={{ width: 20, height: 20,marginHorizontal:8, resizeMode: "contain" }}
        options={['Edit Profile','Logout','Cancel']}
        destructiveIndex={-1}
        actions={[gotoEditMode,isLoggingOutMode]}/>
      ) :null,
      headerLeft: () =>(
        <HeaderBackButton
        onPress={goback}
      />
      )
    };
  };

const styles = StyleSheet.create({
    screen:{
        flexGrow:1,
        backgroundColor:'white',
        paddingBottom:30
    },
    inputContainer:{
        marginTop: '10%',
        marginHorizontal:20
    },
    imageContainer:{
        width:'100%',
        marginTop: '15%',
        alignItems:'center'
    },
    Image:{
        width:150,
        height:150,
        resizeMode:'contain'

    },
});

export default ProfileScreen;