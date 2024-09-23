import React, { useState } from 'react'
import { Alert, StyleSheet, View, AppState, Button, Image } from 'react-native'
import {TextInput , ScrollView } from 'react-native';
import { supabase } from '@/utils/supabase'
import { Input } from './ui/input'
import { useSession } from '@/context'
import { router } from 'expo-router'
import { Text } from './ui/text'
import ParallaxScrollView from './ParallaxScrollView'

// Tells Supabase Auth to continuously refresh the session automatically if
// the app is in the foreground. When this is added, you will continue to receive
// `onAuthStateChange` events with the `TOKEN_REFRESHED` or `SIGNED_OUT` event
// if the user's session is terminated. This should only be registered once.
AppState.addEventListener('change', (state) => {
  if (state === 'active') {
    supabase.auth.startAutoRefresh()
  } else {
    supabase.auth.stopAutoRefresh()
  }
})

export default function Auth() {
  const { signIn } = useSession();
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [showregister, setshowregister] = useState(false)

  async function signInWithEmail() {
    setLoading(true)
    const { error } = await signIn(email,password);
    
    if (error) {
      Alert.alert(error.message)
      setLoading(false)
      return
    }
    
    router.replace('/');
    setLoading(false)
  }

  async function signUpWithEmail() {
    setLoading(true)
    const {
      data: { session },
      error,
    } = await supabase.auth.signUp({
      email: email,
      password: password,
    })

    if (error) Alert.alert(error.message)
    if (!session) Alert.alert('Please check your inbox for email verification!')
    setLoading(false)
  }
if (!showregister){
  return (
    <ScrollView style={styles.container}>
      <Image
        source={require('@/assets/images/favicon-scaled.png')} // Update this path to where your actual logo is stored
        style={styles.logo}
      />
      <Text style={styles.title}>Bienvenido de Nuevo</Text>
      <Text style={styles.subtitle}>Inicia Sesión</Text>
      
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Escribe tu correo electrónico"
          onChangeText={setEmail}
          value={email}
          autoCapitalize="none"
        />
        <TextInput
          style={styles.input}
          placeholder="Escribe tu contraseña"
          onChangeText={setPassword}
          value={password}
          secureTextEntry={true}
          autoCapitalize="none"
        />
        <Button title="Iniciar Sesión" disabled={loading} onPress={signInWithEmail} color="#FF5858" />
        <Text style={styles.forgotPassword}>¿Olvidaste tu contraseña?</Text>
      </View>
      
      <Text style={styles.orText}>O usa una de tus redes</Text>
      
      <Button title="Google" disabled={loading} onPress={() => {Alert.alert("Work in progress")}} color="#DB4437" />
      <Button title="Facebook" disabled={loading} onPress={() => {Alert.alert("Work in progress")}} color="#4267B2" />

      <Text style={styles.signupPrompt}>
        ¿No tienes una cuenta? <Text style={styles.signupLink} onPress={() => setshowregister(prev => !prev)}        >Regístrate gratis</Text>
      </Text>
    </ScrollView>
  );
}

if(showregister){
  return(
    <ScrollView style={styles.container}>
       <Image
        source={require('@/assets/images/favicon-scaled.png')}
        style={styles.logo}
      />
      <Text style={styles.title}>Registrate</Text>
       <TextInput
          style={styles.input}
          placeholder="Escribe tu correo electrónico"
          onChangeText={setEmail}
          value={email}
          autoCapitalize="none"
        />
      <TextInput
          style={styles.input}
          placeholder="Escribe tu contraseña"
          onChangeText={setPassword}
          value={password}
          secureTextEntry={true}
          autoCapitalize="none"
        />
       <Button title="Registrarme" disabled={loading} onPress={signUpWithEmail} color="#FF5858" />
       <Text style={styles.signupPrompt}>
        ¿Ya tienes cuenta? <Text style={styles.signupLink} onPress={() => setshowregister(prev => !prev)}        >Entra con tu email</Text>
      </Text>
      </ScrollView>
  )
}
}
;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff'
  },
  logo: {
    height: 110,
    width: 120,
    alignSelf: 'center',
    margin: 50
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center'
  },
  subtitle: {
    fontSize: 18,
    color: '#666',
    textAlign: 'center',
    marginBottom: 20
  },
  inputContainer: {
    marginBottom: 20
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    borderRadius: 5,
    marginBottom: 10
  },
  forgotPassword: {
    color: '#FF5858',
    textAlign: 'center',
    marginBottom: 20
  },
  orText: {
    textAlign: 'center',
    marginVertical: 20
  },
  signupPrompt: {
    textAlign: 'center',
    marginTop: 20
  },
  signupLink: {
    color: '#FF5858',
    fontWeight: 'bold'
  }
});

