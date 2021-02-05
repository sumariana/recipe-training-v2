export const SET_FAVORITE = 'SET_FAVORITE';
export const GET_RECIPE = 'GET_RECIPE'

export const setFavorite = (data) =>{
    return {type: SET_FAVORITE,recipe=data}
}

export const getRecipeList = () =>{
    return {type: GET_RECIPE}
}