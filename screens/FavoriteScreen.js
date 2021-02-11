import React from 'react'
import { StyleSheet, View, Text,FlatList,Image } from 'react-native'
import {useSelector, useDispatch} from 'react-redux';
import RecipeItem from '../component/recipe-item';

const FavoriteRecipe = props =>{
    const recipeList = useSelector(state=>state.recipeReducer.allRecipe)
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