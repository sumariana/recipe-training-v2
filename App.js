import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { Text, View } from 'react-native';

import { createStore, combineReducers, applyMiddleware } from 'redux';
import { Provider, useSelector } from 'react-redux';
import ReduxThunk from 'redux-thunk';

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
  return (
    <Provider store = {store}>
        <MainNavigator ref={(nav)=>{setNavigator(nav)}} />
    </Provider>
  );
}
