import React,{ useEffect, useReducer,useState } from 'react'
import { StyleSheet, View, Text,TextInput } from 'react-native'
import { Icon } from 'react-native-elements'

const INPUT_CHANGE ='INPUT_CHANGE';
const INPUT_BLUR = 'INPUT_BLUR'

const inputReducer = (state,action) =>{
    switch(action.type){
        case INPUT_CHANGE: return{
            ...state,
            value: action.value,
            isValid: action.isValid,
            errorMessage: action.errorMessage
        }
        case INPUT_BLUR: return{
            ...state,
            touched : true
        }
        default : return state;
    }
};

const TextInputLayout = props =>{
    
    const [inputState,dispatchInput] = useReducer(inputReducer,{
        value: props.initialValue ? props.initialValue : '',
        isValid: props.initialValidated ? props.initialValidated : false,
        errorMessage: '',
        touched: false
    });

    const textChangeHandler = text =>{
        const emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        let isValidated = true;
        let errorMessage = ''
        let t = text

        if(props.isNumOnly){
            t = text.replace(/[- #*;,.<>\{\}\[\]\\\/]/gi, '');
        }

        if (props.required && t.trim().length === 0) {
            isValidated = false;
            errorMessage = 'field can\'t be empty'
        }else{
            if (props.minLength != null && t.length < props.minLength) {
                isValidated = false;
                errorMessage = `field must be at least ${props.minLength} character`
            }
            if (props.maxLength != null && t.length < props.maxLength) {
                isValidated = false;
                errorMessage = `field max of ${props.maxLength} character`
            }
            if (props.email && !emailRegex.test(t.toLowerCase())) {
                isValidated = false;
                errorMessage = 'Email format is wrong'
            }
            if(props.isRepassword && t.toLowerCase() !== props.passwordValue.toLowerCase()){
                isValidated = false
                errorMessage = 'Password is not matched'
            }
        }

        dispatchInput({type: INPUT_CHANGE,
        value: text,
        isValid: isValidated,
        errorMessage: errorMessage
        })
    };

    const { onInputChange,id } = props

    useEffect(()=>{
        if(inputState.touched){
            onInputChange(id,inputState.value, inputState.isValid)
        }
    },[inputState,onInputChange,id])

    const FocusHandler = () =>{
        dispatchInput({
            type: INPUT_BLUR
        });
    }

    const [secure, setSecure] = useState(props.isPassword!=null ? true : false)

    const colorVert = () =>{
        let def = 'black'

        if(props.isEditing!==null){
            if(!props.isEditing) def = 'gray'
        }
        if(!inputState.isValid && inputState.touched && inputState.errorMessage!==''){
            def = 'red'
        }
        return def;
    }

    return(
        <View style={styles.container}>
            <Text style={{...styles.label,color: colorVert()}}>{props.label}</Text>
            <View style={{...styles.inputContainer,borderColor: colorVert()}}>
                <TextInput
                    {...props}
                    style={styles.input}
                    value={inputState.value}
                    onChangeText={textChangeHandler}
                    onTouchStart={FocusHandler}
                    placeholder={props.label}
                    editable={props.isEditing!==null ? props.isEditing : true}
                    secureTextEntry = {secure}
                    
                />
                {
                props.isPassword &&
                <Icon
                containerStyle={{paddingEnd: 10}}
                name={secure ? 'eye' : 'eye-slash'}
                type = 'font-awesome'
                onPress={() => setSecure(!secure)} />
                }
            </View>
            {!inputState.isValid && inputState.touched && inputState.errorMessage!=='' && (
            <Text style={{marginStart: 20,color:'red'}}>
                {inputState.errorMessage}
            </Text>)}
        </View>
    );
};

const styles = StyleSheet.create({
    container:{
        flexDirection: 'column'
    },
    label: {
        fontSize:18,
        marginStart:20,
        paddingVertical:5
    },
    inputContainer:{
        width: '100%',
        flexDirection:'row',
        alignItems:'center',
        borderWidth: 1,
        borderRadius: 20,
    },
    input: {
        flex:1,
        fontSize:18,
        paddingHorizontal:20,
        paddingVertical:5
    }
});
export default TextInputLayout;
