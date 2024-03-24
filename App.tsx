/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, { useEffect, useState } from 'react';
import type { PropsWithChildren } from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
  Button,
  TextInput,
} from 'react-native';

import {
  Colors,
  DebugInstructions,
  Header,
  LearnMoreLinks,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';

import { MAPLE_API_URL, MAPLE_API_KEY } from '@env';

type SectionProps = PropsWithChildren<{
  title: string;
}>;

function Section({children, title}: SectionProps): React.JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';
  return (
    <View style={styles.sectionContainer}>
      <Text
        style={[
          styles.sectionTitle,
          {
            color: isDarkMode ? Colors.white : Colors.black,
          },
        ]}>
        {title}
      </Text>
      <Text
        style={[
          styles.sectionDescription,
          {
            color: isDarkMode ? Colors.light : Colors.dark,
          },
        ]}>
        {children}
      </Text>
    </View>
  );
}

interface IUser {
  userId: string;
  name: string;
  class: string;
}

function App(): React.JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';
  const [userInfo, setUserInfo] = useState<IUser>({
    userId: '', name: '', class: ''
  })

  useEffect(() => {
    fetch(MAPLE_API_URL+'character/basic?ocid='+userInfo.userId+'&date='+'2024-03-23', {
      method: 'GET',
      headers: {
        "x-nxopen-api-key": MAPLE_API_KEY
      }
    })
    .then(res => res.json())
    .then(res => console.log(res))
    .catch(err => console.log(err))
  }, [userInfo.userId]);

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  const getUserOcid = async () => {
    fetch(MAPLE_API_URL+'id?'+'character_name='+userInfo.name, {
      method: 'GET',
      headers: {
        "x-nxopen-api-key": MAPLE_API_KEY
      }
    })
    .then(res => res.json())
    .then(res => setUserInfo({
        ...userInfo,
        userId: res.ocid
      })
    )
    .catch(err => console.log(err))
  }

  return (
    <SafeAreaView style={backgroundStyle}>
      <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor={backgroundStyle.backgroundColor}
      />
      <View style={{ flexDirection: 'row', justifyContent:'space-between', marginBottom:'2%' }}>
        <TextInput
          editable
          onChangeText={text => setUserInfo({
            ...userInfo,
            name: text
          })}
          value={userInfo.name}
          style={{width:'80%'}}
        />
        <Button title='가져오기' onPress={getUserOcid}></Button>
      </View>
      <Text>{userInfo.userId}</Text>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
  },
  highlight: {
    fontWeight: '700',
  },
});

export default App;
