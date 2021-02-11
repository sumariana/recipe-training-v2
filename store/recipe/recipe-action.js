export const SET_FAVORITE = 'SET_FAVORITE';
export const REMOVE_FAV= 'REMOVE_FAV'
export const GET_RECIPE = 'GET_RECIPE';
export const GET_FAV = 'GET_FAV';
export const GET_DETAIL_RECIPE = 'DETAIL_RECIPE';

export const setFavorite = (data) =>{
    return {type: SET_FAVORITE,recipe=data}
}

export const removeFavorite = (data) =>{
    return {type: REMOVE_FAV,recipe = data}
}

export const getFavoriteList = () =>{
    return {type: GET_FAV}
}

export const getRecipeList = () =>{
    return {type: GET_RECIPE}
}

export const getRecipeDetail = (data)=>{
    return {type: GET_DETAIL_RECIPE,recipe = data}
}