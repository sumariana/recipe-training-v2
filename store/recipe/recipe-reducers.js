import RecipeResponse from '../../models/recipe_model'
import { GET_DETAIL_RECIPE, GET_FAV, GET_RECIPE, REMOVE_FAV, SET_FAVORITE } from './recipe-action';

const initialState = {
    
};

export default(state = initialState,action)=>{
    switch(action.type){
        case SET_FAVORITE:
            return{
                ...state
            };
        case REMOVE_FAV:
            return{
                ...state
            };
        
    }
    return state;
}