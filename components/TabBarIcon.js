import React from 'react';
import Ionicons from 'react-native-vector-icons/Ionicons';

import Colors from '../constants/Colors';

export default function TabBarIcon(props) {
  return (
    <Ionicons
      name={props.name}
      size={28}
      style={{ marginBottom: -3, paddingBottom: 5 }}
      color={props.focused ? Colors.tabIconSelected : Colors.tabIconDefault}
    />
  );
}
