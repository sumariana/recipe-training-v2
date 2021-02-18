import React,{useCallback, useEffect,useState} from 'react'
import { StyleSheet, View, Text,FlatList,Modal,Platform } from 'react-native'
import {useSelector, useDispatch} from 'react-redux';
import RecipeItem from '../component/recipe-item';
import BottomSheet from 'reanimated-bottom-sheet';
import { Button,Image } from 'react-native-elements';

import * as recipeAction from '../store/recipe/recipe-action';
import * as AuthAction from '../store/auth/auth-action';
import * as errorHandler from '../store/common/errorHandler';
import RecipeResponse from '../models/recipe_model';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { KEY_ACCESS_TOKEN } from '../store/auth/auth-action';
import CustomDialog from '../component/custom-dialog';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { getNextPage } from '../store/common/Helper';

const isCloseToBottom = ({layoutMeasurement, contentOffset, contentSize}) => {
    const paddingToBottom = 0;
    return layoutMeasurement.height + contentOffset.y >= contentSize.height - paddingToBottom;
};

const RecipeScreen = props =>{
    const [recipeList,setRecipeList] = useState([])
    const [isShowModal,setIsShowModal] = useState(false)
    const [isLoggingOut,setIsLoggingOut] = useState(false)
    const [selectedItem,setSelectedItem] = useState(new RecipeResponse())
    const [swipeRefresh, setSwipeRefresh] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isShimmering, setIsShimmering] = useState(false);
    const [page, setPage] = useState(1);
    const sheetRef = React.useRef(null);
    const dispatch = useDispatch()
    const bottomSheet = () => (
        <View style={{paddingTop:10}}>
            <View style={styles.bottomSlider}>
                <Image containerStyle={{ width:50,height:10,marginTop:-20 }} source={require('../assets/images/slider.png')}/>
                <Text style={{fontSize:18,marginTop:10, fontWeight:'bold'}}>MENU</Text>
                <View style={{
                    borderStyle: 'dotted',
                    borderColor: 'gray',
                    borderWidth: 1,
                    height:1,
                    width:'100%',
                    borderRadius: 1,
                    marginTop:20
                }}/>
                { Platform.OS === 'android' ? 
                <View style={{alignItems:'center',width:'100%'}}>
                <TouchableOpacity
                containerStyle={{width:'100%'}}
                onPress={()=>{
                    props.navigation.navigate('ProfileScreen')
                }}
                >
                    <Button
                        title='Profile'
                        containerStyle={{marginTop:20,width:'100%'}}
                        buttonStyle={{borderRadius:20,backgroundColor:'transparent',marginHorizontal:20,borderWidth:1,borderColor:'black'}}
                        titleStyle={{fontSize:16, color: 'black'}}
                        />
                </TouchableOpacity>
                <TouchableOpacity
                containerStyle={{width:'100%'}}
                onPress={()=>{
                    props.navigation.navigate('FavoriteScreen')
                }} 
                >
                <Button
                    title='Favorite'
                    containerStyle={{marginTop:10,width:'100%'}}
                    buttonStyle={{borderRadius:20,backgroundColor:'transparent',marginHorizontal:20,borderWidth:1,borderColor:'black'}}
                    titleStyle={{fontSize:16, color: 'black'}}
                    />
                </TouchableOpacity>
                <TouchableOpacity
                containerStyle={{width:'100%'}}
                onPress={OpenLogoutModal}>
                <Button
                    title='Log out'
                    containerStyle={{marginVertical:10,width:'100%'}}
                    buttonStyle={{borderRadius:20,backgroundColor:'red',marginHorizontal:20,borderWidth:1,borderColor:'transparent'}}
                    titleStyle={{fontSize:16, color: 'white'}}
                    />
                </TouchableOpacity>
                </View> : 
                <View style={{alignItems:'center',width:'100%'}} >
                    <Button
                    title='Profile'
                    containerStyle={{marginTop:20,width:'100%'}}
                    buttonStyle={{borderRadius:20,backgroundColor:'transparent',marginHorizontal:20,borderWidth:1,borderColor:'black'}}
                    titleStyle={{fontSize:16, color: 'black'}}
                    onPress={()=>{
                        props.navigation.navigate('ProfileScreen')
                    }}
                    />
                <Button
                    title='Favorite'
                    containerStyle={{marginTop:10,width:'100%'}}
                    buttonStyle={{borderRadius:20,backgroundColor:'transparent',marginHorizontal:20,borderWidth:1,borderColor:'black'}}
                    titleStyle={{fontSize:16, color: 'black'}}
                    onPress={()=>{
                        props.navigation.navigate('FavoriteScreen')
                    }} 
                    />
                <Button
                    title='Log out'
                    containerStyle={{marginVertical:10,width:'100%'}}
                    buttonStyle={{borderRadius:20,backgroundColor:'red',marginHorizontal:20,borderWidth:1,borderColor:'transparent'}}
                    titleStyle={{fontSize:16, color: 'white'}}
                    onPress={OpenLogoutModal}
                    />
                </View>
                }
            </View>
        </View>
    );

    const loadProfile = useCallback(async()=>{
        try{
            await dispatch(AuthAction.fetchProfile());
        }catch(err){
            errorHandler.showErrorAlert(err.message)
        }
    },[])

    const loadProducts = useCallback(async()=>{
        setIsLoading(true)
        try{

            const response = await recipeAction.getRecipeList(1);
            const next = getNextPage(response.links.next)
            setPage(next)
            setRecipeList(response.data);
        }catch(err){
            errorHandler.showErrorAlert(err.message)
        }
        setIsLoading(false)
        setSwipeRefresh(false)
    },[]);

    const loadMore = async()=>{
        setIsLoading(true)
        try{
            console.log(page)
            const response = await recipeAction.getRecipeList(page);
            const next = getNextPage(response.links.next)
            setPage(next)
            setRecipeList(recipeList.concat(response.data));
        }catch(err){
            errorHandler.showErrorAlert(err.message)
        }
        setIsLoading(false)
    }

    useEffect(()=>{
        loadProducts()
        loadProfile()
    },[])

    useEffect(()=>{
        const willFocusSub = props.navigation.addListener(
            'willFocus',
            ()=>{
                loadProducts()
                loadProfile()
            }
          );
          return () => {
            willFocusSub.remove();
          };
    },[])

    const OpenLogoutModal = useCallback(()=>{
        setIsLoggingOut(true)
    },[isLoggingOut,setIsLoggingOut]);

    const doLogout = async()=>{
        try{
            await AsyncStorage.removeItem(KEY_ACCESS_TOKEN)
            props.navigation.navigate('intro') 
        }catch(err){
            errorHandler.showErrorAlert(err.message)
        }
    }
    

    return (
        <View style={{flex:1,backgroundColor:'white'}}>
            <FlatList
                onRefresh={loadProducts}
                refreshing = {swipeRefresh}
                contentContainerStyle={{paddingBottom:50}}
                data={recipeList}
                keyExtractor={item=> item.id.toString()}
                renderItem={(itemData)=>(
                    <RecipeItem
                    image = {itemData.item.imageUrl}
                    title = {itemData.item.name}
                    onSelectRecipe={()=>{
                        setSelectedItem(itemData.item)
                        setIsShowModal(true)
                    }}
                    />
                )}
                onScroll={({nativeEvent}) => {
                    if (isCloseToBottom(nativeEvent) && page!==null) {
                        loadMore();
                    }
                }}
            />
            <Modal
             animationType='fade'
             transparent={true}
             visible={isShowModal}
             >
                 <View style={styles.modalView}>
                     <View style={{backgroundColor:'black',flex:1,opacity:0.5}}>

                     </View>
                     <View style={styles.modalCard}>
                        <Image containerStyle={styles.image} source={{ uri:  selectedItem.imageUrl}} />
                        <View style={{position:'absolute',height:20,width:'100%',alignItems:'flex-end',padding:10}}>
                            <Image containerStyle={{width:24,height:24}} source={require('../assets/images/close.png')} onPress={()=>{
                                setIsShowModal(false)
                            }}/>
                        </View>
                        <View style={{marginHorizontal:25,marginTop:15,marginBottom:25}}>
                            <Text style={{fontSize:16, textAlign:'center'}}>{selectedItem.description}</Text>
                            <Button
                                title='Detail'
                                containerStyle={{marginTop:10}}
                                buttonStyle={{borderRadius:20,backgroundColor:'#F3717F',marginHorizontal:20}}
                                titleStyle={{fontSize:16}}
                                onPress={()=>{
                                    setIsShowModal(false)
                                    props.navigation.navigate('RecipeDetail',{recipe_id: selectedItem.id})
                                }}
                                />
                        </View>
                     </View>
                 </View>
            </Modal>
            {isLoggingOut &&
                <CustomDialog
                message = 'Are you sure want to exit?'
                yesTitle = 'Yes'
                noTitle = 'No'
                onOk ={doLogout}
                onCancel = {()=>{
                    setIsLoggingOut(false)
                }}
                />
            }
            <BottomSheet
            ref = {sheetRef}
            snapPoints={[30, 300, 30]}
            initialSnap={0}
            renderContent={bottomSheet}
            />
        </View>
    );
};

RecipeScreen.navigationOptions = navData => {
    return {
      title: 'Recipes'
    };
  };

const styles = StyleSheet.create({
    modalView:{
        flex: 1,
        justifyContent:'center'
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
        position:'absolute'
    },
    bottomSlider:{
        height:'100%',
        width:'100%',
        flexDirection:'column',
        backgroundColor:'white',
        alignItems:'center',
        justifyContent:'center',
        borderTopRightRadius:20,
        borderTopLeftRadius:20,
        shadowColor: 'black',
        shadowOpacity: 0.56,
        shadowOffset: {width: 0, height: 2},
        shadowRadius: 8,
        elevation: 15
    },
    image:{
        width: '100%',
        height:180,
        borderTopLeftRadius:10,
        borderTopRightRadius:10,
        overflow: 'hidden'
    },
});

export default RecipeScreen;