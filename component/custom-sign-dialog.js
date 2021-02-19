import React from 'react'
import { StyleSheet, View, Modal,ActivityIndicator,Text,TouchableOpacity } from 'react-native'
import { Image,Button } from 'react-native-elements';

const SignInDialog = props =>{
    return (
        <Modal
            animationType='fade'
            transparent={true}
            visible={props.isShowModal}
            >
                <View style={styles.modalView}>
                    <TouchableOpacity 
                    onPress={props.onOutsideTouch} 
                    activeOpacity={0} 
                    style={{width:'100%',height:'100%',justifyContent:'center',alignItems:'center'}} >
                        <View style={{backgroundColor:'black',flex:1,opacity:0.5,width:'100%',height:'100%'}}/>
                        <View style={styles.modalCard}>
                            <View style={{width:'100%',alignItems:'center',justifyContent:'center'}}>
                                <View style={{borderColor:'#707070',borderWidth:0.5,height:1,width:'100%'}} />
                                <Text style={{backgroundColor:'white',position:'absolute',paddingHorizontal:5,fontFamily:'roboto-regular'}}>Sign In method</Text>
                            </View>
                            <Button 
                            title='Sign In With Google'
                            containerStyle={{width:'100%',marginTop:40}}
                            buttonStyle={{borderRadius:20,backgroundColor:'transparent',marginHorizontal:20,borderWidth:1,borderColor:'black',paddingHorizontal:10}}
                            titleStyle={{fontSize:14, color: 'black'}}
                            icon = {<Image style={{width:24,height:24,marginRight:5}} resizeMode="contain" source={require('../assets/images/ui.png')}/>}
                            />
                            <Button 
                            title='Continue With Facebook'
                            containerStyle={{width:'100%',marginTop:20}}
                            buttonStyle={{borderRadius:20,backgroundColor:'#0057EC',marginHorizontal:20,paddingHorizontal:10}}
                            titleStyle={{fontSize:14, color: 'white'}}
                            icon = {<Image style={{width:24,height:24,marginRight:5}} resizeMode="contain" source={require('../assets/images/facebook.png')}/>}
                            />
                        </View>
                    </TouchableOpacity>
                </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    image:{
        width:100,
        height:100
    },
    modalView:{
        flex: 1,
        justifyContent:'center',
        alignItems:'center'
    },
    modalCard:{
        margin: 20,
        backgroundColor: "white",
        borderRadius: 20,
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: {width: 0,height: 2},
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
        padding: 30,
        position:'absolute'
    },
});
export default SignInDialog;