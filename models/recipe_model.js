class RecipeResponse{
    constructor(id,name,description,imageUrl,isFavorite){
        this.id = id? id : -1;
        this.name = name? name : '';
        this.description = description? description : '';
        this.imageUrl = imageUrl? imageUrl : '';
        this.isFavorite = isFavorite ? isFavorite : false
    }
}

export default RecipeResponse;