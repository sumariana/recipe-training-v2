import React from 'react';
import {View,StyleSheet} from 'react-native';
import { WebView } from 'react-native-webview';

const WebViewScreen = props =>{
    return(
        <WebView
        source ={{uri: 'https://www.npmjs.com/package/react-native-webview'}}
        />
    );
};
WebViewScreen.navigationOptions = navData => {
    return {
      title: 'Term & Conditions'
    };
  };
const styles = StyleSheet.create({});
export default WebViewScreen;