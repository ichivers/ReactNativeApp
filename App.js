/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, { useEffect } from 'react';
import type { Node } from 'react';
import {
  Image,
} from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import 'node-libs-react-native/globals';
import 'react-native-get-random-values';
import 'react-native-url-polyfill/auto';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { faEdit } from '@fortawesome/free-regular-svg-icons'
import LottieView from 'lottie-react-native';
import Welcome from './src/components/Welcome'
import Splash from './src/components/Splash'
import Login from './src/components/Login'
import Callback from './src/components/Callback'
import Chat from './src/components/Chat'
import ChatThreads from './src/components/ChatThreads'
import EncryptedStorage from 'react-native-encrypted-storage';
import { ChatClient } from '@azure/communication-chat';
import { AzureCommunicationTokenCredential } from '@azure/communication-common';

const Stack = createNativeStackNavigator();

const config = {
  screens: {
    Callback: {
      path: 'com.retail_manager.metro/callback'
    }
  },
};

const linking = {
  prefixes: ['https://spokeauth', 'spokeauth://'],
  config,
};

const App: () => Node = () => {
  
  return (
    <NavigationContainer linking={linking} fallback={<LottieView source={require('./src/animation.json')} autoPlay />}>
      <Stack.Navigator
        initialRouteName="SplashComponent"
        screenOptions={{
          headerShown: true,
          headerLeft: () => (
            <Image source={{
              uri: "https://pbs.twimg.com/profile_images/1021680352740499456/61CD38PN_400x400.jpg"
            }}
            style={{
              width: 40, 
              height: 40,
              borderRadius: 40/ 2,
              marginRight: 10
            }} />
          ),
          headerRight: () => (
            <FontAwesomeIcon icon={ faEdit } size={ 24 }/>
          )
        }}>
        <Stack.Screen 
          name="Splash" 
          component={Splash}
          options={{
            headerShown: false
          }} />
        <Stack.Screen 
          name="Login" 
          component={Login} 
          options={{
            headerShown: false
          }}/>
        <Stack.Screen
          name="Welcome"
          component={ChatThreads}
          options={{
            title: "Chat",
          }} />
        <Stack.Screen
          name="Chat"
          component={Chat}
          options={{
            title: "Chat",
          }} />
        <Stack.Screen 
          name="Callback"
          options={{
            headerShown: false
          }}>
          {props => (<Callback {...props} />)}
        </Stack.Screen>
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
