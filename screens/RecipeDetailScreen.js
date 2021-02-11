import React,{useEffect,useState} from 'react'
import { StyleSheet, View, Text,Dimensions,Animated,ScrollView,Image,TouchableOpacity } from 'react-native'
import { useSelector } from 'react-redux';

const HEADER_EXPANDED_HEIGHT = 200
const HEADER_COLLAPSED_HEIGHT = 80

const RecipeDetailScreen = props =>{
    const recipe = useSelector(state=>state.recipeReducer.Recipe)
    const recipeId = props.navigation.getParam('recipe_id')
    const [isFavorite,setIsFavorite] = useState(false)
    
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

    return (
        <View style={{flex:1}}>
            <Animated.View style={{height: headerHeight,width:SCREEN_WIDTH,position:'absolute',zIndex: 9999}}>
                <Animated.Image style={{height: headerHeight,width:'100%'}} source={{ uri: recipe.imageUrl }} />
                <Animated.View style={{flexDirection:'row',position: 'absolute',width:'100%',height:'100%',backgroundColor:'black',opacity:showTranslucent}}/>
                <Animated.View style={{flexDirection:'row',position: 'absolute',paddingStart:16,paddingEnd:10, marginTop:38,width:'100%',alignItems:'center'}}>
                    <TouchableOpacity onPress={()=>{
                        props.navigation.goBack()
                    }} >
                        <Image source={require('../assets/images/back_arrow.png')}/>
                    </TouchableOpacity>
                    <View style={{flex:1,marginEnd:10}}>
                        <Animated.Text style={{opacity:showItem,marginLeft:10,color:'white',fontWeight:'bold'}} numberOfLines={1}>{recipe.name}</Animated.Text>
                    </View>
                    <Image source={isFavorite ? require('../assets/images/fav.png') : require('../assets/images/unfav.png')}/>
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
                <Animated.Text style={{fontSize:16,fontWeight:'bold',opacity:hideItem}}>{recipe.name}</Animated.Text>
                <Text style={{fontSize:16}}>{recipe.description}</Text>
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    image:{
        height: 200
    }
});

export default RecipeDetailScreen;