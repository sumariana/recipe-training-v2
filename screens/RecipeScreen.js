import React,{useCallback, useEffect,useState} from 'react'
import { StyleSheet, View, Text,FlatList,Modal,Platform } from 'react-native'
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
import ProfileResponse from '../models/profile-response';
import RECIPE_DUMMY from '../models/recipe-dummy';

const isCloseToBottom = ({layoutMeasurement, contentOffset, contentSize}) => {
    const paddingToBottom = 0;
    return layoutMeasurement.height + contentOffset.y >= contentSize.height - paddingToBottom;
};

const RecipeScreen = props =>{
    const [recipeList,setRecipeList] = useState([])
    const [profile,setProfile] = useState(new ProfileResponse)
    const [isShowModal,setIsShowModal] = useState(false)
    const [isLoggingOut,setIsLoggingOut] = useState(false)
    const [selectedItem,setSelectedItem] = useState(new RecipeResponse())
    const [swipeRefresh, setSwipeRefresh] = useState(false);
    const [isShimmering, setIsShimmering] = useState(false);
    const [page, setPage] = useState(1);
    const sheetRef = React.useRef(null);
    const bottomSheet = () => (
        <View style={{paddingTop:10}}>
            <View style={styles.bottomSlider}>
                <Image containerStyle={{ width:50,height:10,marginTop:-20 }} source={require('../assets/images/slider.png')}/>
                <Text style={{fontSize:18,marginTop:10, fontFamily:'roboto-bold'}}>MENU</Text>
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
                    sheetRef.current.snapTo(0)
                    props.navigation.navigate('ProfileScreen',{
                        name: profile.name,
                        email: profile.email,
                        phone: profile.phone,
                        image: profile.image
                    })
                }}
                >
                    <Button
                        title='PROFILE'
                        containerStyle={{marginTop:20,width:'100%'}}
                        buttonStyle={{borderRadius:20,backgroundColor:'transparent',marginHorizontal:20,borderWidth:1,borderColor:'black'}}
                        titleStyle={{fontSize:14, color: 'black',fontFamily:'roboto-bold'}}
                        />
                </TouchableOpacity>
                <TouchableOpacity
                containerStyle={{width:'100%'}}
                onPress={()=>{
                    sheetRef.current.snapTo(0)
                    props.navigation.navigate('FavoriteScreen')
                }} 
                >
                <Button
                    title='FAVORITE'
                    containerStyle={{marginTop:10,width:'100%'}}
                    buttonStyle={{borderRadius:20,backgroundColor:'transparent',marginHorizontal:20,borderWidth:1,borderColor:'black'}}
                    titleStyle={{fontSize:14, color: 'black',fontFamily:'roboto-bold'}}
                    />
                </TouchableOpacity>
                <TouchableOpacity
                containerStyle={{width:'100%'}}
                onPress={OpenLogoutModal}>
                <Button
                    title='LOG OUT'
                    containerStyle={{marginVertical:10,width:'100%'}}
                    buttonStyle={{borderRadius:20,backgroundColor:'red',marginHorizontal:20,borderWidth:1,borderColor:'transparent'}}
                    titleStyle={{fontSize:14, color: 'white',fontFamily:'roboto-bold'}}
                    />
                </TouchableOpacity>
                </View> : 
                <View style={{alignItems:'center',width:'100%'}} >
                    <Button
                    title='PROFILE'
                    containerStyle={{marginTop:20,width:'100%'}}
                    buttonStyle={{borderRadius:20,backgroundColor:'transparent',marginHorizontal:20,borderWidth:1,borderColor:'black'}}
                    titleStyle={{fontSize:14, color: 'black',fontFamily:'roboto-bold'}}
                    onPress={()=>{
                        sheetRef.current.snapTo(0)
                        props.navigation.navigate('ProfileScreen',{
                            name: profile.name,
                            email: profile.email,
                            phone: profile.phone,
                            image: profile.image
                        })
                    }}
                    />
                <Button
                    title='FAVORITE'
                    containerStyle={{marginTop:10,width:'100%'}}
                    buttonStyle={{borderRadius:20,backgroundColor:'transparent',marginHorizontal:20,borderWidth:1,borderColor:'black'}}
                    titleStyle={{fontSize:14, color: 'black',fontFamily:'roboto-bold'}}
                    onPress={()=>{
                        sheetRef.current.snapTo(0)
                        props.navigation.navigate('FavoriteScreen')
                    }} 
                    />
                <Button
                    title='LOG OUT'
                    containerStyle={{marginVertical:10,width:'100%'}}
                    buttonStyle={{borderRadius:20,backgroundColor:'red',marginHorizontal:20,borderWidth:1,borderColor:'transparent'}}
                    titleStyle={{fontSize:14, color: 'white',fontFamily:'roboto-bold'}}
                    onPress={OpenLogoutModal}
                    />
                </View>
                }
            </View>
        </View>
    );

    const loadProfile = async()=>{
        try{
            const response = await AuthAction.fetchProfile();
            setProfile(response)
        }catch(err){
            errorHandler.showErrorAlert(err.message)
        }
    }

    const loadProducts = useCallback(async()=>{
        sheetRef.current.snapTo(0)
        setIsShimmering(true)
        try{
            const response = await recipeAction.getRecipeList(1);
            const next = getNextPage(response.links.next)
            setPage(next)
            setRecipeList(response.data);
        }catch(err){
            errorHandler.showErrorAlert(err.message)
        }
        setSwipeRefresh(false)
        setIsShimmering(false)
    },[]);

    const loadMore = async()=>{
        sheetRef.current.snapTo(0)
        try{
            const response = await recipeAction.getRecipeList(page);
            const next = getNextPage(response.links.next)
            setPage(next)
            setRecipeList(recipeList.concat(response.data));
        }catch(err){
            errorHandler.showErrorAlert(err.message)
        }
    }

    useEffect(()=>{
        setIsShimmering(true)
        loadProfile()
        loadProducts()
    },[])

    useEffect(()=>{
        const willFocusSub = props.navigation.addListener(
            'willFocus',
            ()=>{
                loadProfile()
                loadProducts()
            }
          );
          return () => {
            willFocusSub.remove();
          };
    },[loadProfile,loadProducts])

    const OpenLogoutModal = useCallback(()=>{
        sheetRef.current.snapTo(0)
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
                data={isShimmering ? RECIPE_DUMMY : recipeList}
                keyExtractor={item=> item.id.toString()}
                renderItem={(itemData)=>(
                    <RecipeItem
                    image = {itemData.item.imageUrl}
                    title = {itemData.item.name}
                    isShimmering = {isShimmering}
                    onSelectRecipe={()=>{
                        sheetRef.current.snapTo(0)
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
                     <View style={{backgroundColor:'black',flex:1,opacity:0.5,height:'100%',width:'100%'}}/>
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