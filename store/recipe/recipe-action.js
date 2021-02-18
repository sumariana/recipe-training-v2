export const SET_FAVORITE = 'SET_FAVORITE';
export const REMOVE_FAV= 'REMOVE_FAV'
export const GET_RECIPE = 'GET_RECIPE';
export const GET_FAV = 'GET_FAV';
export const GET_DETAIL_RECIPE = 'DETAIL_RECIPE';

import getClient from '../common/getClient';
import { getErrorMessage } from "../common/errorHandler";

export const setFavorite = async(id) =>{
    try{
        const response = await getClient.post(`/favorite/${id}`);
        const data = response.data.data
        return data
    }catch(error){
        getErrorMessage(error)
    }
}

export const removeFavorite = async(id) =>{
    try{
        const response = await getClient.delete(`/favorite/${id}`);
        const data = response.data.data
        return data
    }catch(error){
        getErrorMessage(error)
    }
}

export const getFavoriteList = async(page) =>{
    try{
        const response = await getClient.get('/favorite',{
            params:{
                page: page ? page : 1
            }
        });
        const data = response.data
        return data
    }catch(error){
        getErrorMessage(error)
    }
}

export const getRecipeList = async(page) =>{
    try{
        const response = await getClient.get('/recipe',{
            params:{
                page: page ? page : 1
            }
        });
        const data = response.data
        return data
    }catch(error){
        getErrorMessage(error)
    }
}

export const getRecipeDetail = async(id)=>{
    try{
        const response = await getClient.get(`/recipe/${id}`);
        const favResponse = await getClient.get('/favorite');
        const data = response.data.data
        const favList = favResponse.data.data

        let isFav = false;
        for(const key in favList){
            if(favList[key].id===data.id){
                isFav=true;
            }
        }

        const objects = {
            recipe : data,
            fav: isFav
        }
        return objects;
        //dispatch({type: GET_DETAIL_RECIPE,data: data,favList:favList})
    }catch(error){
        getErrorMessage(error)
    }
}