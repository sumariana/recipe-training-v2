import React,{useCallback,useEffect} from 'react'
import { StyleSheet, View, Text,FlatList,Image } from 'react-native'
import {useSelector, useDispatch} from 'react-redux';
import RecipeItem from '../component/recipe-item';

import * as recipeAction from '../store/recipe/recipe-action';
import * as errorHandler from '../store/common/errorHandler';

const FavoriteRecipe = props =>{
    const recipeList = useSelector(state=>state.recipeReducer.allFavoriteRecipe)
    const dispatch = useDispatch()
    const loadProducts = useCallback(async()=>{
        try{
            await dispatch(recipeAction.getFavoriteList());
        }catch(err){
            errorHandler.showErrorAlert(err.message)
        }
    },[dispatch,loadProducts])

    useEffect(()=>{
        const willFocusSub = props.navigation.addListener(
            'willFocus',
            loadProducts
          );
      
          return () => {
            willFocusSub.remove();
          };
    },[loadProducts])

    useEffect(()=>{
        loadProducts()
    },[dispatch,loadProducts])

    if(recipeList.length===0){
        return(
            <View style={{flex:1,justifyContent: 'center', alignItems: 'center',backgroundColor:'white'}}>
                <Text>No Recipe Favorite, add some!</Text>
            </View>
        );
    }

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
        </View>
    );
};

FavoriteRecipe.navigationOptions = navData => {
    return {
      headerTitle: 'Favorite Screen'
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

export default FavoriteRecipe;