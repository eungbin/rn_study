import React, {  } from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
} from 'react-native';

interface IProps {
  buttonColor: string;
  onPress?: any;
  innerText?: string;
  innerTextColor?: string;
}

export default function CustomButton(props: IProps) {
  return (
    <TouchableOpacity style={[
      styles.button,
      {backgroundColor: props.buttonColor}
      ]}
      onPress={props.onPress}>
      <Text style={[
        styles.title,
        {color: props.innerTextColor}
      ]}>
        {props.innerText}
      </Text>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  button: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: 10,
      borderRadius: 5,
    },
    title: {
      fontSize: 15,
    },
});