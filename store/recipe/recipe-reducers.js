import RecipeResponse from '../../models/recipe_model'
import { GET_DETAIL_RECIPE, GET_FAV, GET_RECIPE, REMOVE_FAV, SET_FAVORITE } from './recipe-action';

const initialState = {
    allRecipe: [],
    allFavoriteRecipe: [],
    Recipe: new RecipeResponse(),
    isFavorite: false
};

export default(state = initialState,action)=>{
    switch(action.type){
        case SET_FAVORITE:
            return{
                ...state,
                isFavorite: true
            };
        case REMOVE_FAV:
            return{
                ...state,
                isFavorite: false
            };
        case GET_RECIPE:
            return {
                ...state,
                allRecipe: action.list
            };
        case GET_DETAIL_RECIPE:
            let isFav = false;
            const listFavorite = action.favList;
            for(const key in listFavorite){
                if(listFavorite[key].id==action.data.id){
                    isFav=true;
                }
            }
            return{
                ...state,
                Recipe: action.data,
                isFavorite: isFav
            };
        case GET_FAV :
            return{
                ...state,
                allFavoriteRecipe: action.list
            };
    }
    return state;
}