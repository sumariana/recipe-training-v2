import LoginData from "../../models/login-data";
import AsyncStorage from "@react-native-async-storage/async-storage";
import getClient from '../common/getClient';
import { getErrorMessage } from "../common/errorHandler";

export const DO_LOGIN = 'DO_LOGIN';
export const DO_REGISTER = 'DO_REGISTER';
export const FETCH_PROFILE = 'FETCH_PROFILE';

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
    console.log(value)
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

export const fetchProfile = (accessToken) =>{
    return {type: FETCH_PROFILE,profile:accessToken}
}