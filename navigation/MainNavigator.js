import React from 'react';
import { Platform } from 'react-native';
import { createAppContainer,createSwitchNavigator } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';

import LoginScreen from '../screens/LoginScreens';
import RegisterScreen from '../screens/RegisterScreen';
import RecipeScreen from '../screens/RecipeScreen';
import RecipeDetailScreen from '../screens/RecipeDetailScreen';
import FavoriteScreen from '../screens/FavoriteScreen';
import ProfileScreen from '../screens/ProfileScreen';
import WebViewScreen from '../screens/WebViewScreen';

const defaultNavOptions = {
    headerTitleAlign: 'center',
    headerStyle: {
      elevation: 0,
      shadowOpacity: 0,
      backgroundColor: Platform.OS === 'android' ? 'white' : 'white'
    },
    headerTitleStyle: {
      fontSize: 20,
      color: 'black',
      textTransform: 'uppercase',
      fontFamily:'roboto-bold'
    },
    headerTintColor: 'black'
  };

  const MainNavigator = createSwitchNavigator({
    intro: createStackNavigator({
        Login:{
            screen: LoginScreen,
            navigationOptions:{
              headerShown:false
          }
        },
        Register:{
          screen: RegisterScreen
        },
        WebView: WebViewScreen 
    },{
      defaultNavigationOptions: defaultNavOptions
    }),
    mainFlow: createStackNavigator({
      Recipe:{
        screen: RecipeScreen,
        navigationOptions:{
          headerLeft: ()=>null
        }
      },
      RecipeDetail:{
        screen: RecipeDetailScreen,
        navigationOptions:{
          headerShown:false
        }
      },
      FavoriteScreen:FavoriteScreen,
      ProfileScreen:ProfileScreen
    },{
      defaultNavigationOptions: defaultNavOptions
    })
  })

  export default createAppContainer(MainNavigator);