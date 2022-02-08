import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, TextInput, useColorScheme, Button, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {theme} from './color';

const storeData = async (todos) => {  
  try {
    await AsyncStorage.setItem('@storage_Key', JSON.stringify(todos))
  } catch (e) {
    // saving error
  }
}
const loadData = async (todos) => {  
  try {
    const jsonValue = await AsyncStorage.getItem('@storage_Key')
    return jsonValue != null ? JSON.parse(jsonValue) : null;
  } catch(e) {
    // error reading value
  }
}


export default function App() {
  const colorScheme = useColorScheme();
  let colorTheme = colorScheme === "dark" ? styles.dark : styles.light
  let colorBorder = colorScheme === "dark" ? styles.darkBorder : styles.lightBorder

  const [working, setWorking] = useState(true)
  const [todo, setTodo] = useState()
  const [todos, setTodos] = useState({})

  useEffect(async () => {
    let data = await loadData();
    setTodos(data || {})
  }, [])

  const save = async () => {
    if(todo == '') {
      return;
    }

    setTodos({...todos, [Date.now()]:{todo, working}})
    await storeData({...todos, [Date.now()]:{todo, working}})
    setTodo('')
  }

  const remove = (key) => {
    Alert.alert('Do you want to delete?', null, [
      {
        text: 'Cancel',
        style: 'cancel',
      },
      { text: 'OK',
        onPress: async () => {
          let todos_new = {...todos}
          delete todos_new[key]
          setTodos(todos_new)
          storeData(todos_new)
        },
        style: 'destructive'
      },
    ]);
  }
  return (
    <View style={{...styles.container, ...colorTheme}}>
      <View style={styles.header}>
        <TouchableOpacity onPress={()=>setWorking(true)}>
          <Text style={{...styles.header__text, ...colorTheme, opacity: working ? 1 : 0.2}}>Work</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={()=>setWorking(false)}>
          <Text style={{...styles.header__text, ...colorTheme, opacity: !working ? 1 : 0.2}}>Travel</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.body}>
        <TextInput onSubmitEditing={save} returnKeyType='done' style={{...styles.body__input, ...colorTheme, ...colorBorder}} onChangeText={setTodo} value={todo} placeholder='Please type what you need to do.'/>
      </View>
      <ScrollView stickyHeaderIndices={true} style={styles.body}>
        {todos? Object.keys(todos).map((key) => 
          working == todos[key].working ? 
          <TouchableOpacity key={key} onPress={()=>remove(key)}>
            <Text style={{...styles.body__todo, ...colorBorder, ...colorTheme}}>{todos[key].todo}</Text>
            </TouchableOpacity> :
          null) : null}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  dark: {
    backgroundColor: theme["black"],
    color: theme["white"]
  },
  darkBorder: {
    borderColor: theme["white"]
  },
  light: {
    backgroundColor: theme["white"],
    color: theme["black"]
  },
  lightBorder: {
    borderColor: theme["black"]
  },
  container: {
    flex: 1,
    paddingVertical: 30,
    paddingHorizontal: 15,
  },
  header: {
    marginTop: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  header__text: {
    fontSize: 45,
    fontWeight: '600',
  },
  body: {
    marginTop: 5,
  },
  body__input: {
    marginTop: 10,
    fontSize: 22,
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 20,
    fontWeight: '600',
    borderWidth: 1,
  },
  body__todo: {
    marginTop: 10,
    fontSize: 22,
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 5,
    borderWidth: 1,
    padding: 10,
  }
});
