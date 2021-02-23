import React,{useState,useEffect,useCallback} from 'react';
import AppLoading from 'expo-app-loading';
import * as Font from 'expo-font';
import { createStore, combineReducers, applyMiddleware } from 'redux';
import { Provider, useSelector } from 'react-redux';
import ReduxThunk from 'redux-thunk';
import {ActivityIndicator,View} from 'react-native'

import authReducer from './store/auth/auth-reducers';
import recipeReducer from './store/recipe/recipe-reducers';
import MainNavigator from './navigation/MainNavigator';
import { setNavigator } from './navigation/navigationRef';

const rootReducer = combineReducers({
  auth: authReducer,
  recipeReducer:recipeReducer
});

const store = createStore(rootReducer,applyMiddleware(ReduxThunk))

export default function App() {
  const [fontLoaded, setFontLoaded] = useState(false);

  // if (!fontLoaded) {
  //   return (
  //       <AppLoading
  //           startAsync={fetchFont}
  //           onError={ err => {} }
  //           onFinish={() => {
  //               setFontLoaded(true)
  //       }}/>
  //   )
  // }

  const loadFonts = useCallback(async()=>{
    await Font.loadAsync({
      'roboto-medium': require('./assets/fonts/Roboto-Medium.ttf'),
      'roboto-bold': require('./assets/fonts/Roboto-Bold.ttf'),
      'roboto-regular': require('./assets/fonts/Roboto-Regular.ttf'),
    })
    setFontLoaded(true)
  },[])

  useEffect(()=>{
    loadFonts()
  },[])

  if(!fontLoaded){
    return (
      <View style={{flex:1,justifyContent:'center',alignItems:'center',backgroundColor:'white'}}>
            <ActivityIndicator size="large" color="#F3717F" />
      </View>
    );
  }

  return (
    <Provider store = {store}>
        <MainNavigator ref={(nav)=>{setNavigator(nav)}} />
    </Provider>
  );
}
