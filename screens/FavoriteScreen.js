import React,{useCallback,useEffect,useState} from 'react'
import { StyleSheet, View, Text,FlatList,Image } from 'react-native'
import {useSelector, useDispatch} from 'react-redux';
import RecipeItem from '../component/recipe-item';

import * as recipeAction from '../store/recipe/recipe-action';
import * as errorHandler from '../store/common/errorHandler';
import { getNextPage } from '../store/common/Helper';
import RECIPE_DUMMY from '../models/recipe-dummy';

const isCloseToBottom = ({layoutMeasurement, contentOffset, contentSize}) => {
    const paddingToBottom = 0;
    return layoutMeasurement.height + contentOffset.y >= contentSize.height - paddingToBottom;
};

const FavoriteRecipe = props =>{
    const [recipeList,setRecipeList] = useState([])
    const [page, setPage] = useState(1);
    const [swipeRefresh, setSwipeRefresh] = useState(false);
    const [isShimmering, setIsShimmering] = useState(false);
    const [hasLoad,setHasLoad] = useState(false)


    const loadProducts = useCallback(async()=>{
        setIsShimmering(true)
        try{
            const response = await recipeAction.getFavoriteList(1);
            const next = getNextPage(response.links.next)
            setPage(next)
            setRecipeList(response.data);
        }catch(err){
            errorHandler.showErrorAlert(err.message)
        }
        setSwipeRefresh(false)
        setIsShimmering(false)
        setHasLoad(true)
    },[])

    const loadMore = async()=>{
        try{
            const response = await recipeAction.getFavoriteList(page);
            const next = getNextPage(response.links.next)
            setPage(next)
            setRecipeList(recipeList.concat(response.data));
        }catch(err){
            errorHandler.showErrorAlert(err.message)
        }
    }

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
    },[])

    return (
        <View style={{flex:1,backgroundColor:'white'}}>
            {
                hasLoad && recipeList.length===0 ? 
                <View style={{flex:1,justifyContent: 'center', alignItems: 'center',backgroundColor:'white'}}>
                    <Text>No Recipe Favorite, add some!</Text>
                </View> :
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
                        props.navigation.navigate('RecipeDetail',{recipe_id: itemData.item.id})
                    }}
                    />
                )}
                onScroll={({nativeEvent}) => {
                    if (isCloseToBottom(nativeEvent) && page!==null) {
                        loadMore();
                    }
                }}
            />
            }
        </View>
    );
};

FavoriteRecipe.navigationOptions = navData => {
    return {
      headerTitle: 'Favorite Screen'
    };
  };

const styles = StyleSheet.create({});

export default FavoriteRecipe;