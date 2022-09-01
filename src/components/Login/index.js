import React, {useState} from 'react';
import {
  StyleSheet,
  SafeAreaView, TouchableOpacity,
  Text, View, TextInput,
} from 'react-native';

import firebase from '../../services/firebaseConnection';

function Login({changeStatus}){

    const [type, setType] = useState('login');
    
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    function handleLogin(){
        if(type){
          //login

          const user = firebase.auth().signInWithEmailAndPassword(email, password)
          .then((user)=>{
            changeStatus(user.user.uid);
          }).catch((error)=>{
            alert('Algo deu errado!');
            return;
          });

        }else{
          //cadastro

          const user = firebase.auth().createUserWithEmailAndPassword(email, password)
          .then((user)=>{
            changeStatus(user.user.uid);
          }).catch((error)=>{
            alert('Algo deu errado!');
            return;
          });
        }
    }

    return(
        <SafeAreaView style={[styles.container]} >
          
            <TextInput
                placeholder='Seu email'
                style={[styles.input]}
                value={email}
                onChangeText={(value)=>setEmail(value)}
            />

            <TextInput
                secureTextEntry = {true}
                placeholder='Sua senha'
                style={[styles.input]}
                value={password}
                onChangeText={(value)=>setPassword(value)}
            />

            <TouchableOpacity
                style={[styles.handleLogin, {backgroundColor:type?'#34a4f4':'#141414'}]}
                onPress={handleLogin}
            >
                <Text style={[styles.loginBtnText]} >
                  {type?"Acessar":"Cadastrar"}
                </Text>
            </TouchableOpacity>
          
            <TouchableOpacity
                style={[styles.handleNewAccount]}
                onPress={()=>{type?setType(null):setType('login')}}
            >
                <Text style={[styles.newAccBtnText]} >
                  {type?"Criar uma conta":"Já possuo uma conta"}
                </Text>
            </TouchableOpacity>

        </SafeAreaView>
    );
}


const styles = StyleSheet.create({
  container:{
    flex:1,
    paddingTop:40,
    paddingHorizontal:10,
    backgroundColor:'#f2f6fc',
  },
  input:{
    marginBottom:10,
    backgroundColor:'#fff',
    borderRadius:4,
    height:45,
    padding:10,
    borderWidth:1,
    borderColor:"#141414",
  },
  handleLogin:{
    alignItems:'center',
    justifyContent:'center',
    height:45,
    marginBottom:10,
    borderRadius:2,
  },
  loginBtnText:{
    color:'#fff',
    fontSize:17,
  },
  newAccBtnText:{
    color:'#141414',
    textAlign:'right',
    paddingRight: 5,
  },
});

export default Login;