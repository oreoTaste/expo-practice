import { useCallback, useEffect, useRef, useState } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, TextInput, useColorScheme, Button, Alert, Platform, Dimensions } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { FontAwesome, FontAwesome5, AntDesign } from '@expo/vector-icons';
import {theme} from './color';
import React from "react";

const store = async (data, keyword) => {
  try {
    await AsyncStorage.setItem(keyword, JSON.stringify(data))
  } catch (e) {
    // saving error
  }
}
const load = async (keyword) => {
  try {
    const jsonValue = await AsyncStorage.getItem(keyword)
    return jsonValue != null ? JSON.parse(jsonValue) : null;
  } catch(e) {
    // error reading value
  }
}
const storeTodos = async (todos) => store(todos, '@storage_Todos')
const storeStatus = async (working) => store(working, '@storage_Working')
const loadTodos = async () => load('@storage_Todos')
const loadStatus = async () => load('@storage_Working')

const checkScheme = () => {
  if(useColorScheme() == "light") {
    return [styles.light, styles.lightBorder]
  } else {
    return [styles.dark, styles.darkBorder]
  }
}

export default function App() {
  const [colorTheme, colorBorder] = checkScheme()
  const [working, setWorking] = useState(true)
  const [todo, setTodo] = useState()
  const [todos, setTodos] = useState({})

  useEffect(async () => {
    setTodos(await loadTodos() || {})
    setWorking(await loadStatus())
  }, [])
  const saveWorking = async (working) => {
    setWorking(working)
    await storeStatus(working)
  }
  const save = async () => {
    if(todo == '') {
      return;
    }

    setTodos({...todos, [Date.now()]:{todo, working, finished: false}})
    await storeTodos({...todos, [Date.now()]:{todo, working, finished: false}})
    setTodo('')
  }

  const remove = (key) => {
    if(Platform.OS == 'web' && confirm("Do you want to delete?")) {
      let todos_new = {...todos}
      delete todos_new[key]
      setTodos(todos_new)
      storeTodos(todos_new)
      return;
    }
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
          storeTodos(todos_new)
        },
        style: 'destructive'
      },
    ]);
  }
  const finish = (key) => {
    let todos_new = {...todos}
    
    todos_new[key].finished = !todos_new[key].finished
    setTodos(todos_new)
    storeTodos(todos_new)
  }
  const edit = () => {
    // 작성중
  }
  return (
    <View style={{...styles.container, ...colorTheme}}>
      <View style={styles.header}>
        <TouchableOpacity onPress={()=>saveWorking(true)}>
          <Text style={{...styles.header__text, ...colorTheme, opacity: working ? 1 : 0.2}}>Work</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={()=>saveWorking(false)}>
          <Text style={{...styles.header__text, ...colorTheme, opacity: !working ? 1 : 0.2}}>Travel</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.body}>
        <TextInput onSubmitEditing={()=>save()} returnKeyType='done' style={{...styles.body__input, ...colorTheme, ...colorBorder}} onChangeText={setTodo} value={todo} placeholder='Please type what you need to do.'/>
      </View>
      <ScrollView stickyHeaderIndices={true} style={styles.body}>
        {todos? Object.keys(todos).map((key) => 
          working == todos[key].working ? 
          <View key={key} style={{...styles.body__todo, ...colorBorder, ...colorTheme}}>
            <Text editable={false} style={{maxWidth: Dimensions.get('window').width - 190, ...styles.body__todo__text, ...colorTheme, textDecorationLine: todos[key].finished ? 'line-through' : 'none'}}>
              {todos[key].todo}
            </Text>
            <TextInput style={{maxWidth:0}}></TextInput>
            <View style={{flexDirection: 'row'}}>
              <TouchableOpacity style={{marginLeft: 25}} >
                <AntDesign name="tool" size={24} style={{...colorTheme}} />
              </TouchableOpacity>
              <TouchableOpacity style={{marginLeft: 25}} >
                <FontAwesome5 name="check" onPress={()=>finish(key)}  size={24} style={{...colorTheme}} />
              </TouchableOpacity>
              <TouchableOpacity style={{marginLeft: 25}} >
                <FontAwesome name="trash-o" onPress={()=>remove(key)}  size={24} style={{...colorTheme}}/>
              </TouchableOpacity>
            </View>
          </View> :
          null) : null}
      </ScrollView>
    </View>
  );
}

// const styles = StyleSheet.create({
const styles = {
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
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 5,
    borderWidth: 1,
    padding: 10,
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  body__todo__text: {
    fontSize: 22,
  }
};
