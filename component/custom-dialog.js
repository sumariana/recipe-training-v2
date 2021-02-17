import React from 'react'
import { StyleSheet, View, Text,Modal,TouchableHighlight } from 'react-native'
import { Image } from 'react-native-elements';

const CustomDialog = props =>{
    return (
        <Modal
            animationType='fade'
            transparent={true}
            visible={props.isShowModal}
            >
                <View style={styles.modalView}>
                    <View style={{backgroundColor:'black',flex:1,opacity:0.5,width:'100%',height:'100%'}}/>
                    <View style={styles.modalCard}>
                        <Image containerStyle={styles.image} resizeMode='contain' source={require('../assets/images/alert.png')} />
                        <Text style={{fontSize:16, textAlign:'center',marginTop:10}}>{props.message}</Text>
                        <View style={{flexDirection:'row',width:'100%',height:30,marginTop:20}}>
                            <Text style={{fontSize:16,textAlign:'center',fontWeight:'bold',flex:1}} onPress={props.onOk}>{props.yesTitle}</Text>
                            <Text style={{fontSize:16,textAlign: 'center',fontWeight:'bold',flex:1}} onPress={props.onCancel}>{props.noTitle}</Text>
                        </View>
                    </View>
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
export default CustomDialog;