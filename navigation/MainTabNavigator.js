import React from 'react';
import { Platform, Text } from 'react-native';
import { createStackNavigator, createBottomTabNavigator } from 'react-navigation';

import TabBarIcon from '../components/TabBarIcon';
import HomeScreen from '../screens/HomeScreen';
import RecipeScreen from '../screens/RecipeScreen';
import CameraScreen from '../screens/CameraScreen';

const HomeStack = createStackNavigator({
        Home: HomeScreen,
    },
);

HomeStack.navigationOptions = {
    tabBarLabel: 'MY',
//    tabBarIcon: ({ focused }) => ( <
//        TabBarIcon focused = { focused }
//        name = {
//            Platform.OS === 'ios' ? `ios-nutrition` : 'md-nutrition'
////              'food-apple'
//        }
//        />
//    ),
    tabBarOptions: {
      labelStyle: {
        fontSize: 20,
        marginBottom: 10,
      },
      activeTintColor: '#3D2D0E',
      inactiveTintColor: '#E8E1D3',
      activeBackgroundColor: '#E8E1D3',
      style: {
        backgroundColor: '#60C14F',
      }
    }
};

HomeStack.path = '';

const RecipeStack = createStackNavigator({
        Recipe: RecipeScreen,
    },
);

RecipeStack.navigationOptions = {
    tabBarLabel: 'RECIPE',
//    tabBarIcon: ({ focused }) => ( <
//        TabBarIcon focused = { focused }
//        name = { 
//          Platform.OS === 'ios' ? 'ios-ice-cream' : 'md-ice-cream'
////            'food-variant'
//        }
//        />
//    ),
    tabBarOptions: {
      labelStyle: {
        fontSize: 20,
        marginBottom: 10,
      },
      activeTintColor: '#3D2D0E',
      inactiveTintColor: '#E8E1D3',
      activeBackgroundColor: '#E8E1D3',
      style: {
        backgroundColor: '#60C14F',
      }
    }
};

RecipeStack.path = '';


//const CameraStack = createStackNavigator({
//        Camera: CameraScreen,
//    },
//);
//
//CameraStack.navigationOptions = {
//    tabBarLabel: 'Camera',
//
//};
//
//CameraStack.path = '';




const tabNavigator = createBottomTabNavigator({
    HomeStack,
    RecipeStack,
});

tabNavigator.path = '';

export default tabNavigator;