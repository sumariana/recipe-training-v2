import AsyncStorage from "@react-native-async-storage/async-storage";
import getClient from '../common/getClient';
import { getErrorMessage } from "../common/errorHandler";
import { Platform } from "react-native";
import FormData from 'form-data';
import axios from 'axios';

export const DO_LOGIN = 'DO_LOGIN';
export const DO_REGISTER = 'DO_REGISTER';
export const FETCH_PROFILE = 'FETCH_PROFILE';
export const UPDATE_PROFILE = 'UPDATE_PROFILE';

export const KEY_ACCESS_TOKEN = "KEY_ACCESS_TOKEN";

export const doLogin = (email,password) =>{
    return async (dispatch) =>{
        try{
            const response = await getClient.post('/login',{
                email: email,
                password: password
            });
            const data = response.data.data
            console.log(data)
            await AsyncStorage.setItem(KEY_ACCESS_TOKEN, data.access_token);
        }catch(error){
            getErrorMessage(error)
        }
    }
}

export const doRegister = (value) =>{
    return async (dispatch) =>{
        try{
            const response = await getClient.post('/register',{
                name: value.name,
                email: value.email,
                phone: value.phone,
                password: value.password,
                password_confirmation: value.password_confirmation
            });
            const data = response.data.data
            await AsyncStorage.setItem(KEY_ACCESS_TOKEN, data.access_token);
        }catch(error){
            getErrorMessage(error)
        }
    }
}

export const fetchProfile = async() =>{
    try{
        const response = await getClient.get('/profile');
        const data = response.data.data
        return data;
        //dispatch({type: FETCH_PROFILE,profile: data})
    }catch(error){
        getErrorMessage(error)
    }
}

const createFormData = (photo) => {
    const data = new FormData();
    data.append('image', {
        name: 'photo.jpg',
        uri: Platform.OS === 'android' ? photo : photo.replace('file://', ''),
    });

    // Object.keys(body).forEach(key => {
    //     data.append(key, body[key]);
    // });

    return data;
};

export const updateImage = async(image) => {
    const formData = createFormData(image)
    console.log(formData)
    try{
        const token = await AsyncStorage.getItem(KEY_ACCESS_TOKEN);
        const response = await axios.post('https://recipe.timedoor.id/api/v1/profile/image',formData,{
            headers:{
                Accept: 'application/json',
                'Content-Type': 'multipart/form-data; charset=utf-8;',
                Authorization : `Bearer ${token}`
            }
        });
        //const data = response.data.data
        console.log(response)
        return data;
        //dispatch({type: FETCH_PROFILE,profile: data})
    }catch(err){
        console.log(err)
        getErrorMessage(err)
    }
}

export const updateProfile = async(email,name,phone) =>{
    try{
        const response = await getClient.patch('/profile',{
            name: name,
            email: email,
            phone: phone,
        });
        const data = response.data.data
        //dispatch({type: FETCH_PROFILE,profile: data})
        return data;
    }catch(error){
        getErrorMessage(error)
    }
}