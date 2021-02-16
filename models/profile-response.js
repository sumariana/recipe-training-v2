class ProfileResponse{
    constructor(id,name,phone,email,image){
        this.email = email? email : '';
        this.name = name? name : '';
        this.id = id? id : '';
        this.phone = phone? phone : '';
        this.image = image? image : '';
    }
}

export default ProfileResponse;