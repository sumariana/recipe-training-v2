import React from 'react'
import { StyleSheet, View, Text,FlatList,Image } from 'react-native'
import {useSelector, useDispatch} from 'react-redux';
import RecipeItem from '../component/recipe-item';
import Animated from 'react-native-reanimated';
import BottomSheet from 'reanimated-bottom-sheet';
import { Button } from 'react-native-elements';

const RecipeScreen = props =>{
    const recipeList = useSelector(state=>state.recipeReducer.allRecipe)
    const sheetRef = React.useRef(null);
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
            <Button
                title='Profile'
                containerStyle={{marginTop:20,width:'100%'}}
                buttonStyle={{borderRadius:20,backgroundColor:'transparent',marginHorizontal:20,borderWidth:1,borderColor:'black'}}
                titleStyle={{fontSize:16, color: 'black'}}
                />
            <Button
                title='Favorite'
                containerStyle={{marginTop:10,width:'100%'}}
                buttonStyle={{borderRadius:20,backgroundColor:'transparent',marginHorizontal:20,borderWidth:1,borderColor:'black'}}
                titleStyle={{fontSize:16, color: 'black'}}
                />
            <Button
                title='Log out'
                containerStyle={{marginVertical:10,width:'100%'}}
                buttonStyle={{borderRadius:20,backgroundColor:'red',marginHorizontal:20,borderWidth:1,borderColor:'transparent'}}
                titleStyle={{fontSize:16, color: 'white'}}
                />
        </View>
    )
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
      headerTitle: navData.navigation.getParam('Recipe')
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