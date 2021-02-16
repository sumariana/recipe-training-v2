export const SET_FAVORITE = 'SET_FAVORITE';
export const REMOVE_FAV= 'REMOVE_FAV'
export const GET_RECIPE = 'GET_RECIPE';
export const GET_FAV = 'GET_FAV';
export const GET_DETAIL_RECIPE = 'DETAIL_RECIPE';

import getClient from '../common/getClient';
import { getErrorMessage } from "../common/errorHandler";

export const setFavorite = (id) =>{
    return async (dispatch) =>{
        try{
            const response = await getClient.post(`/favorite/${id}`);
            const data = response.data.data
            dispatch({type: SET_FAVORITE})
        }catch(error){
            getErrorMessage(error)
        }
    }
}

export const removeFavorite = (id) =>{
    return async (dispatch) =>{
        try{
            const response = await getClient.delete(`/favorite/${id}`);
            const data = response.data.data
            dispatch({type: REMOVE_FAV})
        }catch(error){
            getErrorMessage(error)
        }
    }
}

export const getFavoriteList = () =>{
    return async (dispatch) =>{
        try{
            const response = await getClient.get('/favorite');
            const data = response.data.data
            dispatch({type: GET_FAV,list: data})
        }catch(error){
            getErrorMessage(error)
        }
    }
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
            const favResponse = await getClient.get('/favorite');
            const favList = favResponse.data.data
            const data = response.data.data
            dispatch({type: GET_DETAIL_RECIPE,data: data,favList:favList})
        }catch(error){
            getErrorMessage(error)
        }
    }
}