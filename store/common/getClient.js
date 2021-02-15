import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import  * as authAction from '../auth/auth-action';

const getClient = axios.create({
    baseURL: "https://recipe.timedoor.id/api/v1/"
});

getClient.interceptors.request.use(
    async (config) => {
        config.headers.Accept = "application/json"
        const token = await AsyncStorage.getItem(authAction.KEY_ACCESS_TOKEN);
        if (token) {
            config.headers.Authorization = `Bearer ${token}`
        }
        return config;
    }, 
    (err) => {
        return Promise.reject(err);
    }
);

export default getClient;