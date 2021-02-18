import React from 'react'
import { StyleSheet, View, Modal,ActivityIndicator } from 'react-native'
import { Image } from 'react-native-elements';

const LoadingDialog = props =>{
    return (
        <Modal
            animationType='fade'
            transparent={true}
            visible={props.isShowModal}
            >
                <View style={styles.modalView}>
                    <View style={{backgroundColor:'black',flex:1,opacity:0.5,width:'100%',height:'100%'}}/>
                    <View style={styles.modalCard}>
                        <ActivityIndicator size="large" color="#F3717F" />
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
export default LoadingDialog;