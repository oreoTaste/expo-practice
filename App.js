import { useCallback, useEffect, useRef, useState } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, TextInput, useColorScheme, Button, Alert, Platform, Dimensions } from 'react-native';
import { StatusBar } from 'expo-status-bar';
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

    setTodos({...todos, [Date.now()]:{todo, working, finished: false, editing: false}})
    await storeTodos({...todos, [Date.now()]:{todo, working, finished: false, editing: false}})
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
  const onChangeText = (key, text) => {
    let todos_new = {...todos}
    todos_new[key].todo = text
    setTodos(todos_new)
    storeTodos(todos_new)
  }
  const finish = (key) => {
    let todos_new = {...todos}
    todos_new[key].finished = !todos_new[key].finished
    setTodos(todos_new)
    storeTodos(todos_new)
  }
  const editable = (key) => {
    let todos_new = {...todos}
    todos_new[key].editing = true
    setTodos(todos_new)
    storeTodos(todos_new)
  }
  const editDone = (key) => {
    let todos_new = {...todos}
    todos_new[key].editing = false
    setTodos(todos_new)
    storeTodos(todos_new)
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
        <TextInput onSubmitEditing={()=>save()}
                   onChangeText={setTodo}
                   returnKeyType='done'
                   placeholder={working ? 'What to check..':'Where to go..'}
                   value={todo}
                   style={{...styles.body__input, ...colorTheme, ...colorBorder}}/>
      </View>
      <ScrollView stickyHeaderIndices={true} style={styles.body}>
        {todos? Object.keys(todos).map((key) => 
          working == todos[key].working ? 
          <View key={key} style={{...styles.body__todo
                                , ...colorBorder
                                , ...colorTheme
                                , borderStyle: todos[key].editing ? 'dashed' : null
                                , backgroundColor: todos[key].editing ? theme.edit : null}}>
            <TextInput editable={todos[key].editing}
                       onSubmitEditing={()=>editDone(key)}
                       onChangeText={(text)=>onChangeText(key, text)}
                       style={{ minWidth: Dimensions.get('window').width - 220
                              , maxWidth: Dimensions.get('window').width - 190
                              , ...styles.body__todo__text
                              , ...colorTheme
                              , textDecorationLine: todos[key].finished ? 'line-through' : 'none', backgroundColor: 'transparent'}}
                       value={todos[key].todo}/>
            <View style={{flexDirection: 'row'}}>
              {todos[key].editing ? 
              <TouchableOpacity style={{marginLeft: 25}} >
                <FontAwesome5 name="spell-check" 
                              onPress={()=>editDone(key)}
                              size={24}
                              style={{...colorTheme, backgroundColor: 'transparent'}} />
              </TouchableOpacity>
              :
              <>
                <TouchableOpacity style={{marginLeft: 25}} >
                  <AntDesign name="tool"
                             onPress={()=>editable(key)}
                             size={24} style={{...colorTheme}} />
                </TouchableOpacity>
                <TouchableOpacity style={{marginLeft: 25}} >
                  <FontAwesome5 name="check"
                                onPress={()=>finish(key)}
                                size={24} style={{...colorTheme}} />
                </TouchableOpacity>
                <TouchableOpacity style={{marginLeft: 25}} >
                  <FontAwesome name="trash-o"
                                onPress={()=>remove(key)}
                                size={24} style={{...colorTheme}}/>
                </TouchableOpacity>
              </>
              }
            </View>
          </View> :
          null) : null}
      </ScrollView>
      <StatusBar style="auto" />
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
  },
  editing: {

  }
};
