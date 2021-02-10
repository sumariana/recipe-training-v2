import React from 'react'
import { StyleSheet, View, Text,ScrollView } from 'react-native'
import { Button, CheckBox } from 'react-native-elements';

import TextInputLayout from '../component/input-layout'

const RegisterScreen = props =>{
    return (
        <View style={{ flexDirection:'column' ,backgroundColor:'white',flex:1}}>
            <ScrollView containerStyle={styles.screen}>
            <View style ={styles.inputContainer}>
                <TextInputLayout
                    label = 'Name'
                    required = {true}
                />
                <TextInputLayout
                    label = 'Phone'
                    required = {true}
                />
                <TextInputLayout
                    label = 'Email'
                    email = {true}
                    required = {true}
                />
                <TextInputLayout
                    label = 'Password'
                    required = {true}
                    isPassword = {true}
                />
                <TextInputLayout
                    label = 'Re-Password'
                    required = {true}
                    isPassword = {true}
                />
                <View style={{flexDirection:'row',alignItems:'center'}}>
                    <CheckBox
                        containerStyle={{backgroundColor:'transparent',borderColor:'transparent'}}
                        checked={false}
                        onPress={()=>{}}
                        disabled={false}
                        checkedColor='#FF1969'
                        uncheckedColor = {props.isDisabled ? 'gray' : 'black'}
                        textStyle={{color: props.isDisabled ?'gray' : 'black',fontSize:12}}
                    />
                    <Text style={{color: 'black',fontWeight: 'bold',marginStart:-10}}>i have read the <Text style={{color:'#F3717F',fontWeight:'bold'}} onPress={()=>{}}>Terms of Service</Text></Text>
                </View>
        </View>
        </ScrollView>
        <Button
            title='Register'
            containerStyle={{width:'100%',marginVertical:20}}
            buttonStyle={{borderRadius:20,backgroundColor:'#F3717F',marginHorizontal:20}}
            titleStyle={{fontSize:22}}
        />
        </View>
    );
};

RegisterScreen.navigationOptions = navData => {
    return {
      headerTitle: navData.navigation.getParam('Register')
    };
  };

const styles = StyleSheet.create({
    screen:{
        flexGrow:1,
        borderWidth:1,
        borderColor:'black'
    },
    inputContainer:{
        marginTop:20,
        marginHorizontal:20
    }
});

export default RegisterScreen;