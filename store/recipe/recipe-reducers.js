import RECIPE from '../../models/recipe_dummy';

const initialState = {
    allRecipe: RECIPE,
    allFavoriteRecipe: []
};

export default(state = initialState,action)=>{
    return state;
}