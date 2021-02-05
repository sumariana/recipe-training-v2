export const DO_LOGIN = 'DO_LOGIN';
export const DO_REGISTER = 'DO_REGISTER';

export const doLogin = (data) =>{
    return {type: DO_LOGIN,loginData=data}
}

export const doRegister = (data) =>{
    return {type: DO_REGISTER,registerData=data}
}