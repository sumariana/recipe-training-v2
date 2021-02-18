import React,{useCallback,useReducer,useState,useEffect} from 'react'
import { StyleSheet, View, Text,ScrollView,Alert } from 'react-native';
import {Image,Button} from 'react-native-elements'
import { useSelector, useDispatch } from 'react-redux';
import { HeaderBackButton } from 'react-navigation-stack';
import BottomSheet from 'reanimated-bottom-sheet';
import { TouchableOpacity } from 'react-native-gesture-handler';
import * as ImagePicker from 'expo-image-picker';
import * as Permissions from 'expo-permissions';

import TextInputLayout from '../component/input-layout';
import * as AuthAction from '../store/auth/auth-action';
import * as errorHandler from '../store/common/errorHandler';
import OptionsMenu from "react-native-option-menu";
import CustomDialog from '../component/custom-dialog';


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
    const preLoadedData = useSelector(state=>state.auth.profile)
    const sheetRef = React.useRef(null);
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
        setIsLoading(true)
        try{
            await dispatch(AuthAction.fetchProfile());
            setIsLoading(false)
        }catch(err){
            setIsLoading(false)
            errorHandler.showErrorAlert(err.message)
        }
    },[])

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

    const bottomSheet = () => (
        <View style={styles.bottomSlider}>
            <Image containerStyle={{ width:40,height:10,marginTop:0 }} source={require('../assets/images/slider.png')}/>
            { Platform.OS === 'android' ? 
            <View style={{alignItems:'center',width:'100%',marginTop:10}}>
            <TouchableOpacity
            containerStyle={{width:'100%'}}
            onPress={takeImageHandler}
            >
                <Button
                    title='Take Picture'
                    containerStyle={{marginTop:20,width:'100%'}}
                    buttonStyle={{borderRadius:20,backgroundColor:'transparent',marginHorizontal:20,borderWidth:1,borderColor:'black'}}
                    titleStyle={{fontSize:16, color: 'black'}}
                    icon = {<Image style={{width:24,height:24,marginRight:5}} resizeMode="contain" source={require('../assets/images/photo.png')}/>}
                    />
            </TouchableOpacity>
            <TouchableOpacity
            containerStyle={{width:'100%'}}
            onPress={chooseImageHandler} 
            >
            <Button
                title='Choose from Gallery'
                containerStyle={{marginTop:10,width:'100%'}}
                buttonStyle={{borderRadius:20,backgroundColor:'transparent',marginHorizontal:20,borderWidth:1,borderColor:'black'}}
                titleStyle={{fontSize:16, color: 'black'}}
                icon = {<Image style={{width:24,height:24,marginRight:5}} resizeMode="contain" source={require('../assets/images/gallery.png')}/>}
                />
            </TouchableOpacity>
            </View> : 
            <View style={{alignItems:'center',width:'100%'}} >
                <Button
                title='Take Picture'
                containerStyle={{marginTop:20,width:'100%'}}
                buttonStyle={{borderRadius:20,backgroundColor:'transparent',marginHorizontal:20,borderWidth:1,borderColor:'black'}}
                titleStyle={{fontSize:16, color: 'black'}}
                icon = {<Image style={{width:24,height:24,marginRight:5}} resizeMode="contain" source={require('../assets/images/photo.png')}/>}
                onPress={takeImageHandler}
                />
            <Button
                title='Choose from Gallery'
                containerStyle={{marginTop:10,width:'100%'}}
                buttonStyle={{borderRadius:20,backgroundColor:'transparent',marginHorizontal:20,borderWidth:1,borderColor:'black'}}
                titleStyle={{fontSize:16, color: 'black'}}
                icon = {<Image style={{width:24,height:24,marginRight:5}} resizeMode="contain" source={require('../assets/images/gallery.png')}/>}
                onPress={chooseImageHandler} 
                />
            </View>
            }
        </View>
    );
    const verifyPermissions = async () => {
        const result = await Permissions.askAsync(Permissions.CAMERA_ROLL,Permissions.CAMERA);
        if (result.status !== 'granted') {
          Alert.alert(
            'Insufficient permissions!',
            'You need to grant camera permissions to use this app.',
            [{ text: 'Okay' }]
          );
          return false;
        }
        return true;
      };
    const openImageSelector = () =>{
        if(isEditing){
            sheetRef.current.snapTo(0)
        }else{
            console.log('do nothing')
        }
    }

    const takeImageHandler = async() =>{
        const hasPermission = await verifyPermissions();
        if (!hasPermission) {
        return;
        }
        const image = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.5
        });
        uploadImage(image.uri)
    }

    const chooseImageHandler = async() =>{
        const hasPermission = await verifyPermissions();
        if (!hasPermission) {
        return;
        }
        const image = await ImagePicker.launchImageLibraryAsync({
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.5
        });
        uploadImage(image.uri)
    }


    const uploadImage = async(image)=>{
        setIsLoading(true);
        try{
            await dispatch(AuthAction.updateImage(image));
            setIsLoading(false);
            Alert.alert( "Update Success", "Updating Profile is Success", [
                { 
                    text: "OK"
                }
            ]);
        }catch(error){
            setIsLoading(false)
            errorHandler.showErrorAlert(error.message)
        }
    }

    return (
        <View style={{flex:1}}>
        <ScrollView contentContainerStyle={styles.screen}>
            <View style={styles.imageContainer}>
                {formState.inputValues.image==='' ? <Image style={styles.Image} source={require('../assets/images/user.png')} onPress={openImageSelector}/> :  
                <Image style={styles.Image} source={{uri: formState.inputValues.image}} onPress={openImageSelector}/>}
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
        <BottomSheet
            ref = {sheetRef}
            snapPoints={[200, 0]}
            initialSnap ={1}
            renderContent={bottomSheet}
        />
        </View>
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
    bottomSlider:{
        height:'100%',
        width:'100%',
        flexDirection:'column',
        backgroundColor:'white',
        alignItems:'center',
        justifyContent:'center',
        borderTopRightRadius:10,
        borderTopLeftRadius:10,
        shadowColor: 'black',
        shadowOpacity: 0.56,
        shadowOffset: {width: 0, height: 2},
        shadowRadius: 8,
        elevation: 10,
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