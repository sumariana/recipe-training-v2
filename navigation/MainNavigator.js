import React from 'react';
import { Platform } from 'react-native';
import { createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';

import LoginScreen from '../screens/LoginScreens';
import RegisterScreen from '../screens/RegisterScreen';
import RecipeScreen from '../screens/RecipeScreen';
import RecipeDetailScreen from '../screens/RecipeDetailScreen';
import FavoriteScreen from '../screens/FavoriteScreen';
import ProfileScreen from '../screens/ProfileScreen';

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
        screen: RecipeDetailScreen,
        navigationOptions:{
            header : null
        }
      },
      FavoriteScreen:{
        screen: FavoriteScreen,
        navigationOptions:{
          headerTitleAlign:'center'
        }
      },
      ProfileScreen:{
        screen: ProfileScreen,
        navigationOptions:{
          headerTitleAlign:'center'
        }
      }
  },{
      defaultNavOptions: defaultNavOptions
  });

  export default createAppContainer(MainNavigator);