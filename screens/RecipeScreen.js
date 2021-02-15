import React,{useCallback, useEffect} from 'react'
import { StyleSheet, View, Text,FlatList,Image } from 'react-native'
import {useSelector, useDispatch} from 'react-redux';
import RecipeItem from '../component/recipe-item';
import BottomSheet from 'reanimated-bottom-sheet';
import { Button } from 'react-native-elements';
import {TouchableOpacity} from 'react-native-gesture-handler';

import * as recipeAction from '../store/recipe/recipe-action';
import * as errorHandler from '../store/common/errorHandler';

const RecipeScreen = props =>{
    const recipeList = useSelector(state=>state.recipeReducer.allRecipe)
    const sheetRef = React.useRef(null);
    const dispatch = useDispatch()
    const bottomSheet = () => (
        <View style={styles.bottomSlider}>
            <Image style={{ width:40,height:10,marginTop:-20 }} source={require('../assets/images/slider.png')}/>
            <Text style={{fontSize:18,marginTop:10, fontWeight:'bold'}}>MENU</Text>
            <View style={{
                borderStyle: 'dotted',
                borderColor: 'gray',
                borderWidth: 1,
                height:1,
                width:'100%',
                borderRadius: 1,
                marginTop:20
            }}>
            </View>
            <TouchableOpacity
            containerStyle={{width: '100%'}}
            onPress={()=>{
                props.navigation.navigate('ProfileScreen')
            }} >
            <Button
                title='Profile'
                containerStyle={{marginTop:20,width:'100%'}}
                buttonStyle={{borderRadius:20,backgroundColor:'transparent',marginHorizontal:20,borderWidth:1,borderColor:'black'}}
                titleStyle={{fontSize:16, color: 'black'}}
                />
            </TouchableOpacity>
            <TouchableOpacity
            containerStyle={{width: '100%'}}
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
            containerStyle={{width: '100%'}}
            onPress={()=>{
                props.navigation.goBack()
            }} >
            <Button
                title='Log out'
                containerStyle={{marginVertical:10,width:'100%'}}
                buttonStyle={{borderRadius:20,backgroundColor:'red',marginHorizontal:20,borderWidth:1,borderColor:'transparent'}}
                titleStyle={{fontSize:16, color: 'white'}}
                />
            </TouchableOpacity>
        </View>
    );

    const loadProducts = useCallback(async()=>{
        try{
            await dispatch(recipeAction.getRecipeList());
        }catch(err){
            errorHandler.showErrorAlert(err.message)
        }
    },[dispatch,loadProducts])

    useEffect(()=>{
        loadProducts()
    },[dispatch,loadProducts])

    return (
        <View style={{flex:1}}>
            <FlatList
            contentContainerStyle={{paddingBottom:50}}
                data={recipeList}
                keyExtractor={item=> item.id}
                renderItem={(itemData)=>(
                    <RecipeItem
                    image = {itemData.item.imageUrl}
                    title = {itemData.item.name}
                    onSelectRecipe={()=>{
                        props.navigation.navigate('RecipeDetail',{recipe_id: itemData.item.id})
                    }}
                    />
                )}
            />
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
      headerTitle: 'Recipe'
    };
  };

const styles = StyleSheet.create({
    bottomSlider:{
        height:'100%',
        width:'100%',
        flexDirection:'column',
        backgroundColor:'white',
        alignItems:'center',
        justifyContent:'center',
        borderTopRightRadius:10,
        borderTopLeftRadius:10,
        shadowColor: 'black',
        shadowOpacity: 0.56,
        shadowOffset: {width: 0, height: 2},
        shadowRadius: 8,
        elevation: 10,
    }
});

export default RecipeScreen;