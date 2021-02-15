import RECIPE from '../../models/recipe_dummy';
import RecipeResponse from '../../models/recipe_model'
import { GET_DETAIL_RECIPE, GET_RECIPE } from './recipe-action';

const initialState = {
    allRecipe: [],
    allFavoriteRecipe: [],
    Recipe: new RecipeResponse()
    
};

export default(state = initialState,action)=>{
    switch(action.type){
        case GET_RECIPE:
            return {
                ...state,
                allRecipe: action.list
            };
        case GET_DETAIL_RECIPE:
            return{
                ...state,
                Recipe: new RecipeResponse(action.data.id,action.data.name,action.data.description,action.data.imageUrl)
            };
    }
    return state;
}