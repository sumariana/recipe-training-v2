import React,{useCallback, useEffect,useState} from 'react'
import { StyleSheet, View, Text,Dimensions,Animated,ScrollView,Image,TouchableOpacity } from 'react-native'

const HEADER_EXPANDED_HEIGHT = 200
const HEADER_COLLAPSED_HEIGHT = 80

import * as recipeAction from '../store/recipe/recipe-action';
import * as errorHandler from '../store/common/errorHandler';
import LoadingDialog from '../component/loading-dialog';
import RecipeResponse from '../models/recipe_model';

const RecipeDetailScreen = props =>{
    const recipeId = props.navigation.getParam('recipe_id')
    const [recipe,setRecipe] = useState(new RecipeResponse())
    const [isFavorite,setIsFavorite] = useState(false)
    const [isLoading,setLoading] = useState(false)
    
    const { width: SCREEN_WIDTH } = Dimensions.get("screen")
    const [scrollY,setScrollY] = useState(new Animated.Value(0))
    const headerHeight = scrollY.interpolate({
        inputRange: [0, HEADER_EXPANDED_HEIGHT - HEADER_COLLAPSED_HEIGHT],
        outputRange: [HEADER_EXPANDED_HEIGHT, HEADER_COLLAPSED_HEIGHT],
        extrapolate:'clamp'
    })
    const showItem = scrollY.interpolate({
    inputRange: [0, HEADER_EXPANDED_HEIGHT-HEADER_COLLAPSED_HEIGHT],
    outputRange: [0, 1],
    extrapolate: 'clamp'
    });
    const hideItem = scrollY.interpolate({
    inputRange: [0, HEADER_EXPANDED_HEIGHT-HEADER_COLLAPSED_HEIGHT],
    outputRange: [1, 0],
    extrapolate: 'clamp'
    });
    const showTranslucent = scrollY.interpolate({
    inputRange: [0, HEADER_EXPANDED_HEIGHT-HEADER_COLLAPSED_HEIGHT],
    outputRange: [0, 0.5],
    extrapolate: 'clamp'
    });

      const loadDetail = useCallback(async()=>{
          setLoading(true)
          try{
              const response = await recipeAction.getRecipeDetail(recipeId)
              setRecipe(response.recipe)
              setIsFavorite(response.fav)
            console.log(response)
          }catch(err){
            errorHandler.showErrorAlert(err.message)
          }
          setLoading(false)
      },[]);

      useEffect(()=>{
          loadDetail()
      },[])

      const handleFavorite = async()=>{
          setLoading(true)
          try{
              if(isFavorite){
                  const response = await recipeAction.removeFavorite(recipeId);
                  
              }else{
                  const response = await recipeAction.setFavorite(recipeId);
              }
              setIsFavorite(!isFavorite)
          }catch(err){
            errorHandler.showErrorAlert(err.message)
          }
          setLoading(false)
      }

    return (
        <View style={{flex:1}}>
            <Animated.View style={{...styles.headerAnim,width:SCREEN_WIDTH,height: headerHeight}}>
                <Animated.Image style={{height: headerHeight,width:'100%'}} source={{ uri: recipe.imageUrl }} />
                <Animated.View style={{...styles.headerAnim2,opacity:showTranslucent}}/>
                <Animated.View style={styles.headerContent}>
                    <TouchableOpacity onPress={()=>{
                        props.navigation.goBack()
                    }} >
                        <Image source={require('../assets/images/back_arrow.png')}/>
                    </TouchableOpacity>
                    <View style={{flex:1,marginEnd:10}}>
                        <Animated.Text style={{...styles.titleToolbar,opacity:showItem}} numberOfLines={1}>{recipe.name}</Animated.Text>
                    </View>
                    <TouchableOpacity onPress={handleFavorite}>
                        <Image source={isFavorite ? require('../assets/images/fav.png') : require('../assets/images/unfav.png')}/>
                    </TouchableOpacity>
                </Animated.View>
            </Animated.View>
            <ScrollView 
                contentContainerStyle={{padding:16,paddingTop:HEADER_EXPANDED_HEIGHT+20}}
                onScroll={Animated.event([{ nativeEvent: {
                    contentOffset: {
                    y: scrollY
                    }
                }
                }])}
                scrollEventThrottle={16}
            >
                <Animated.Text style={{fontSize:20,fontFamily:'roboto-bold',opacity:hideItem}}>{recipe.name}</Animated.Text>
                <Text style={{fontSize:14,fontFamily:'roboto-regular',textAlign:'justify',marginTop:20}}>{recipe.description}</Text>
            </ScrollView>
            <LoadingDialog
            isShowModal={isLoading}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    headerAnim:{
        position:'absolute',zIndex: 9999
    },
    headerAnim2:{
        flexDirection:'row',position: 'absolute',width:'100%',height:'100%',backgroundColor:'black'
    },
    headerContent:{
        flexDirection:'row',position: 'absolute',paddingStart:16,paddingEnd:10, marginTop:34,width:'100%',alignItems:'center'
    },
    titleToolbar:{
        marginLeft:10,color:'white',fontFamily:'roboto-bold',fontSize:20
    },
    image:{
        height: 200
    }
});

export default RecipeDetailScreen;