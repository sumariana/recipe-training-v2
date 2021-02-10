import React from 'react';
import { Platform } from 'react-native';
import { createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';

import LoginScreen from '../screens/LoginScreens';
import RegisterScreen from '../screens/RegisterScreen';
import RecipeScreen from '../screens/RecipeScreen';
import RecipeDetailScreen from '../screens/RecipeDetailScreen';
import FavoriteScreen from '../screens/LoginScreens';

const defaultNavOptions = {
    headerStyle: {
      backgroundColor: Platform.OS === 'android' ? '#C39EAA' : ''
    },
    headerTintColor: Platform.OS === 'android' ? 'transparent' : 'black',

  };

  const MainNavigator = createStackNavigator({
      Login:{
          screen: LoginScreen,
          navigationOptions:{
            header : null
        }
      },
      Register:{
        screen: RegisterScreen
      },
      Recipe:{
        screen: RecipeScreen,
        navigationOptions:{
          headerLeft: null,
          headerTitleAlign:'center'
        }
      },
      RecipeDetail:{
        screen: RecipeDetailScreen
      },
      FavoriteScreen:{
        screen: FavoriteScreen
      },
  },{
      defaultNavOptions: defaultNavOptions
  });

  export default createAppContainer(MainNavigator);