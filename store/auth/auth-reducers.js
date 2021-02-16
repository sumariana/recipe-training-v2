import LoginData from "../../models/login-data";
import LoginResponse from "../../models/login-response";
import ProfileResponse from "../../models/profile-response";
import { FETCH_PROFILE } from "./auth-action";

const initialState = {
    profile: new ProfileResponse()
};

export default(state = initialState,action)=>{
    switch(action.type){
        case FETCH_PROFILE :
            return{
                ...state,
                profile: new ProfileResponse(action.profile.id,action.profile.name,action.profile.phone,action.profile.email,action.profile.image)
            }
    }
    return state;
}