import React, { useState, useEffect, useRef } from 'react';
import {
  StyleSheet,
  SafeAreaView,
  Text, View,
  TextInput, FlatList,
  TouchableOpacity,
  Keyboard,
} from 'react-native';

import firebase from './src/services/firebaseConnection';

import Feather from 'react-native-vector-icons/Feather';

import Message from './src/components/Message/index';
import Login from './src/components/Login/index';
import Task from './src/components/Task/index';

function App() {

  const [user, setUser] = useState(null);

  const [editKey, setEditKey] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  const [newTask, setNewTask] = useState('');
  const [tasks, setTasks] = useState([]);

  const [message, setMessage] = useState(null);

  const refInput = useRef(null);

  let messages = {
    editWarning:{
      prevMessage:message,
      functions:{
        close:(message)=>setMessage(message),
      },
      iconName:'x-circle',
      text:`Termine de editar primeiro.`,
      color:'#34a4f4',
      name:'editing-Warning',
      timer:2000,
    },
    deleteWarning:{
      prevMessage:message,
      functions:{
        close:(message)=>setMessage(message),
      },
      iconName:'x-circle',
      text:`Segure para deletar.`,
      color:'#34a4f4',
      name:'delete-Warning',
      timer:2000,
    },
    editing:{
      prevMessage:null,
      functions:{
        close:(message)=>editTask(message),
      },
      iconName:'x-circle',
      text:`Você está editando "`,
      color:'#f00',
      name:'editing',
      timer:false,
    },
    newTaskWarning:{
      prevMessage:message,
      functions:{
        close:(message)=>setMessage(message),
      },
      iconName:'x-circle',
      text:`Digite algo.`,
      color:'#34a4f4',
      name:'newTask-Warning',
      timer:2000,
    },
  }

  useEffect(() => {

    function loadUserTasks() {
      if (user === null) {
        return;
      }

      firebase.database().ref('tasks').child(user).once('value', (snapshot) => {
        console.log(snapshot);
        setTasks([]);
        snapshot?.forEach((childItem) => {

          let data = {
            key: childItem.key,
            nome: childItem.val().nome,
          };
          setTasks(tasksOld => [...tasksOld, data]);
        });

      });

    }

    loadUserTasks();
  }, [user]);


  function deleteTask(key) {
    if (editKey) {
      (message?.name!==messages.editWarning.name)&&
      setMessage(messages.editWarning);
      return false;
    }
    if (key === null) {
      setMessage(messages.deleteWarning);
      return false;
    }
    firebase.database().ref('tasks').child(user).child(key).remove()
      .then(() => {
        setTasks(tasksOld =>
          tasksOld.filter((item) => {
            return item.key !== key;
          })
        );
      });
    return true;
  }

  function editTask(data) {
    if (data) {
      refInput.current.focus();
      messages.editing.text+=`${data.nome}"!`;
      setMessage(messages.editing);
      setNewTask(data.nome);
      setEditKey(data.key);
      setIsEditing(true);
      return true;
    }

    setNewTask('');
    setMessage(null);
    setEditKey(null);
    setIsEditing(false);
    Keyboard.dismiss();

    return false;
  }

  function saveEdit() {
    if (newTask === '') {
      (message?.name !== messages.newTaskWarning.name)&&
      setMessage(messages.newTaskWarning);
      return;
    }
    firebase.database().ref('tasks').child(user)
      .child(editKey).update({ nome: newTask }).
      then(() => {
        let taskIndex = tasks.findIndex((item) => item.key === editKey);
        let tasksEdited = tasks;
        tasksEdited[taskIndex].nome = newTask;
        setTasks([...tasksEdited]);
        // setTasks(tasksOld => tasksOld.map((value)=>{
        //   (value.key===editKey)&&(value.nome = newTask);
        //   return value;
        // }));
      })
      .then(() => {
        setEditKey(null);
      });
    setNewTask('');
    setMessage(null);
    setIsEditing(false);
    Keyboard.dismiss();
  }

  function addTask() {
    if (newTask === '') {
      setMessage(messages.newTaskWarning);
      return;
    }
    let taskData = firebase.database().ref('tasks').child(user);
    let key = taskData.push().key;

    taskData.child(key).set({
      nome: newTask,
    })
      .then(() => {
        const data = {
          key: key,
          nome: newTask,
        };
        setTasks(tasksOld => [...tasksOld, data]);
      })

    setNewTask('');
    Keyboard.dismiss();
  }


  if (user === null) {
    return <Login changeStatus={(user) => setUser(user)} />
  }

  return (
    <SafeAreaView style={[styles.container]} >

      {message &&
        <Message
          message={message}
        />
      }

      <View style={[styles.containerTask]} >

        <TextInput
          style={[styles.input]}
          ref={refInput}
          value={newTask}
          placeholder='Adicionar Tarefa'
          onChangeText={(text) => setNewTask(text)}
        />

        <TouchableOpacity
          style={[
            styles.addBtn,
            { 
              backgroundColor: isEditing ? '#34a4f4' : '#141414', 
              paddingHorizontal: isEditing ? 11 : 15,
            }
          ]}
          onPress={
            isEditing ?
              saveEdit :
              addTask
          }
        >
          { isEditing ?

            <Feather name='edit-3' size={20} color='#fff' />
            :
            <Text style={[styles.addBtnText]}>+</Text>
          }

        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.addBtn,
            { backgroundColor: '#f45434', }
          ]}
          onPress={() => editTask()}
        >
          <Text style={[styles.addBtnText, {fontSize:19}]} >
            X
          </Text>
        </TouchableOpacity>
      </View>


      <FlatList
        data={tasks}
        keyExtractor={(item) => item.key}
        renderItem={({ item }) =>
          <Task
            data={item}
            editKey={editKey}
            handleEdit={editTask}
            handleDelete={deleteTask}
          />
        }
      />

    </SafeAreaView>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 25,
    paddingHorizontal: 10,
    backgroundColor: '#f2f6fc',
  },
  containerTask: {
    flexDirection: 'row',
  },
  input: {
    flex: 1,
    height: 45,
    marginBottom: 10,
    padding: 10,
    backgroundColor: '#fff',
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#141414',
  },
  addBtn: {
    height: 45,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 5,
    paddingHorizontal: 15,
    borderRadius: 4,
  },
  addBtnText: {
    color: '#fff',
    fontSize: 22,
  },
});

export default App;
