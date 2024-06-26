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
  Alert,
} from 'react-native';

import {
  Colors,
  DebugInstructions,
  Header,
  LearnMoreLinks,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';

import { MAPLE_API_URL, MAPLE_API_KEY } from '@env';
import { Dropdown } from 'react-native-element-dropdown';
import CustomButton from './components/Button/CustomButton';

interface IUser {
  userId: string;
  name: string;
  class: string;
}

interface ISkills {
  name: string;
  wantLevel: number;
}[]

interface IDropDown {
  label: string;
  value: number;
}

const dropDownData: IDropDown[] = [
  { label: '30', value: 30 },
  { label: '60', value: 60 }
];

function App(): React.JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';
  const [userInfo, setUserInfo] = useState<IUser>({
    userId: '', name: '', class: ''
  })
  const [skill, setSkill] = useState<string>('');
  const [skills, setSkills] = useState<ISkills[]>([]);

  const [dropDownValue, setDropDownValue] = useState<IDropDown>({
    label: '', value: 0
  });
  const [isFocus, setIsFocus] = useState<boolean>(false);

  useEffect(() => {
    fetch(MAPLE_API_URL+'character/basic?ocid='+userInfo.userId+'&date='+'2024-03-23', {
      method: 'GET',
      headers: {
        "x-nxopen-api-key": MAPLE_API_KEY
      }
    })
    .then(res => res.json())
    .then(res =>{
      setUserInfo({
        ...userInfo,
        name: res.character_name,
        class: res.character_class,
      });
    })
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

  const addSkill = () => {
    const originSkills: ISkills[] = [...skills];
    originSkills.push({
      name: skill,
      wantLevel: dropDownValue.value
    })
    setSkills([...originSkills]);
  }
  const removeSkill = (idx: number) => {
    const originSkills: ISkills[] = [...skills];
    originSkills.splice(idx, 1);
    setSkills([...originSkills]);
  }

  const popAlert = (idx: number) => {
    Alert.alert(
      "정말 삭제하시겠습니까?",
      skills[idx].name,
      [
        {
          text: '네',
          onPress: () => removeSkill(idx),
          style: 'cancel'
        },
        { text: '아니요' }
      ],
      { cancelable: true }
    )
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
          style={styles.inputName}
        />
        <Button title='가져오기' onPress={getUserOcid}></Button>
      </View>
      <View style={{ marginBottom:'2%' }}>
        <Text>{userInfo.class}</Text>
      </View>
      <View style={{ flexDirection: 'row', justifyContent:'space-between' }}>
        <TextInput
          editable
          onChangeText={text => setSkill(text)}
          value={skill}
          style={styles.inputName}
        />
        <Dropdown
          style={[styles.dropdown, isFocus && { borderColor: 'blue' }]}
          placeholderStyle={styles.placeholderStyle}
          selectedTextStyle={styles.selectedTextStyle}
          inputSearchStyle={styles.inputSearchStyle}
          iconStyle={styles.iconStyle}
          data={dropDownData}
          search
          maxHeight={300}
          labelField="label"
          valueField="value"
          placeholder={!isFocus ? 'Select Level' : '...'}
          searchPlaceholder="Search..."
          value={dropDownValue}
          onFocus={() => setIsFocus(true)}
          onBlur={() => setIsFocus(false)}
          onChange={item => {
            setDropDownValue({
              ...dropDownValue,
              label: item.label,
              value: item.value
            });
            setIsFocus(false);
          }}
        />
        <CustomButton buttonColor='blue' innerText='입력하기' innerTextColor='red' onPress={addSkill} />
      </View>
      <View style={{ display:'flex', flexWrap:'wrap', flexDirection:'row', rowGap:5, columnGap:10, paddingHorizontal:'5%', paddingVertical:'2%' }}>
        {skills.map((v, idx) => (
          <View key={idx}>
            <Text onPress={() => popAlert(idx)}>{'스킬: ' + v.name + ' 레벨: ' + v.wantLevel}</Text>
          </View>
        ))}
      </View>
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
  inputName: {
    borderWidth: 1,
    borderColor: 'black',
    width: '50%',
  },
  placeholderStyle: {
    fontSize: 16,
  },
  selectedTextStyle: {
    fontSize: 16,
  },
  iconStyle: {
    width: 20,
    height: 20,
  },
  inputSearchStyle: {
    height: 40,
    fontSize: 16,
  },
  dropdown: {
    width: '30%',
    height: 50,
    borderColor: 'gray',
    borderWidth: 0.5,
    borderRadius: 8,
    paddingHorizontal: 8,
  },
});

export default App;
