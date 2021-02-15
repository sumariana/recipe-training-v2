export const SET_FAVORITE = 'SET_FAVORITE';
export const REMOVE_FAV= 'REMOVE_FAV'
export const GET_RECIPE = 'GET_RECIPE';
export const GET_FAV = 'GET_FAV';
export const GET_DETAIL_RECIPE = 'DETAIL_RECIPE';

import getClient from '../common/getClient';
import { getErrorMessage } from "../common/errorHandler";

export const setFavorite = (data) =>{
    return {type: SET_FAVORITE,recipe:data}
}

export const removeFavorite = (data) =>{
    return {type: REMOVE_FAV,recipe:data}
}

export const getFavoriteList = () =>{
    return {type: GET_FAV}
}

export const getRecipeList = () =>{
    return async (dispatch) =>{
        try{
            const response = await getClient.get('/recipe');
            const data = response.data.data
            dispatch({type: GET_RECIPE,list: data})
        }catch(error){
            getErrorMessage(error)
        }
    }
}

export const getRecipeDetail = (id)=>{
    return async (dispatch) =>{
        try{
            const response = await getClient.get(`/recipe/${id}`);
            const data = response.data.data
            console.log(data)
            dispatch({type: GET_DETAIL_RECIPE,data: data})
        }catch(error){
            getErrorMessage(error)
        }
    }
}