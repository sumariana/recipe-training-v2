class RecipeResponse{
    constructor(id,name,description,imageUrl){
        this.id = id? id : -1;
        this.name = name? name : '';
        this.description = description? description : '';
        this.imageUrl = imageUrl? imageUrl : ''
    }
}

export default RecipeResponse;