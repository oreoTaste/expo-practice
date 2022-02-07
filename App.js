import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { Ionicons, Feather, Fontisto } from '@expo/vector-icons';
import * as Location from 'expo-location';
import { useEffect, useState } from 'react';
import {theme} from './color';

export default function App() {
  const [working, setWorking] = useState(true)
  const [todo, setTodo] = useState()
  const [todos, setTodos] = useState({})

  const save = () => {
    if(todo == '') {
      return;
    }

    setTodos({...todos, [Date.now()]:{todo, working}})
    setTodo('')
  }
  const remove = (key) => {
    let todos_new = {...todos}
    delete todos_new[key]
    setTodos(todos_new)
  }
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={()=>setWorking(true)}>
          <Text style={{...styles.header__text, color: working ? 'black' : theme.grey}}>Work</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={()=>setWorking(false)}>
          <Text style={{...styles.header__text, color: !working ? 'black' : theme.grey}}>Travel</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.body}>        
        <TextInput onSubmitEditing={save} returnKeyType='done' style={styles.body__input} onChangeText={setTodo} value={todo} placeholder='Please type what you need to do.'/>
        {Object.keys(todos).map((key) => 
          working == todos[key].working ? 
          <TouchableOpacity key={key} onPress={()=>remove(key)}>
            <Text style={styles.body__todo}>{todos[key].todo}</Text>
            </TouchableOpacity> :
          null)}
      </View>
      <StatusBar backgroundColor='black'/>
    </View>
  );
}

const styles = StyleSheet.create({
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
    borderColor: theme.grey,
    padding: 10,
  }
});
