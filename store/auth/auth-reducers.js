import LoginData from "../../models/login-data";
import LoginResponse from "../../models/login-response";

const initialState = {
    loginData: new LoginData(),
    loginResponse: new LoginResponse()
};

export default(state = initialState,action)=>{
    return state;
}