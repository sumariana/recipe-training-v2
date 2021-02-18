import LoginData from "../../models/login-data";
import AsyncStorage from "@react-native-async-storage/async-storage";
import getClient from '../common/getClient';
import { getErrorMessage } from "../common/errorHandler";

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

export const fetchProfile = () =>{
    return async (dispatch) =>{
        try{
            const response = await getClient.get('/profile');
            const data = response.data.data
            dispatch({type: FETCH_PROFILE,profile: data})
        }catch(error){
            getErrorMessage(error)
        }
    }
}

export const updateImage = (image) => {
    const photo = {
        uri: image,
        type: 'image/jpeg',
        name: 'phot.jpg'
    }
    let form = new FormData()
    form.append("image",photo)
    return async(dispatch)=>{
        try{
            const response = await getClient.post('/profile',{
                image : form
            }
            );
            const data = response.data.data
            console.log(data)
            //dispatch({type: FETCH_PROFILE,profile: data})
        }catch(err){
            getErrorMessage(err)
        }
    }
}

// export const fetchProfile = async() =>{
//     try{
//         const response = await getClient.get('/profile');
//         return response.data.data;
//     }catch(error){
//         getErrorMessage(error)
//     }
// }

export const updateProfile = (email,name,phone) =>{
    return async (dispatch) =>{
        try{
            const response = await getClient.patch('/profile',{
                name: name,
                email: email,
                phone: phone,
            });
            const data = response.data.data
            dispatch({type: FETCH_PROFILE,profile: data})
        }catch(error){
            getErrorMessage(error)
        }
    }
}