import React, { useState } from 'react';
import { Alert, StyleSheet, View, AppState, Button, Image, ScrollView, TextInput, Text } from 'react-native';
import { supabase } from '@/utils/supabase';
import { useSession } from '@/context';
import { router } from 'expo-router';

// Escucha cambios de estado de la app para gestionar la actualización automática de tokens
AppState.addEventListener('change', (state) => {
  if (state === 'active') {
    supabase.auth.startAutoRefresh();
  } else {
    supabase.auth.stopAutoRefresh();
  }
});

export default function Auth() {
  const { signIn } = useSession();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const [showLostPassword, setShowLostPassword] = useState(false);

  // Función para iniciar sesión con email y contraseña
  async function signInWithEmail() {
    setLoading(true);
    const { error } = await signIn(email, password);
    
    if (error) {
      Alert.alert(error.message);
      setLoading(false);
      return;
    }

    router.replace('/');
    setLoading(false);
  }

  // Función para registrar un nuevo usuario
  async function signUpWithEmail() {
    setLoading(true);
    const { data: { session }, error } = await supabase.auth.signUp({ email, password });

    if (error) Alert.alert(error.message);
    if (!session) Alert.alert('Por favor, revisa tu bandeja de entrada para verificar tu email');
    setLoading(false);
  }

  if (showLostPassword) {
    return (
      <ScrollView style={styles.container}>
        <Image
          source={require('@/assets/images/favicon-scaled.png')}
          style={styles.logo}
        />
        <Text style={styles.title}>Recuperar Contraseña</Text>
        <TextInput
          style={styles.input}
          placeholder="Escribe tu correo electrónico"
          onChangeText={setEmail}
          value={email}
          autoCapitalize="none"
        />
        <Button title="Recuperar" disabled={loading} onPress={signUpWithEmail} color="#FF5858" />
        <Text style={styles.signupPrompt}>
          ¿Ya tienes cuenta? <Text style={styles.signupLink} onPress={() => setShowLostPassword(false)}>Inicia sesión</Text>
        </Text>
      </ScrollView>
    );
  }

  if (!showRegister) {
    return (
      <ScrollView style={styles.container}>
        <Image
          source={require('@/assets/images/favicon-scaled.png')}
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
          <Text style={styles.forgotPassword} onPress={() => setShowLostPassword(true)}>¿Olvidaste tu contraseña?</Text>
        </View>
        
        <Text style={styles.orText}>O usa una de tus redes</Text>
        
        <Button title="Google" onPress={() => Alert.alert('Work in progress')} color="#DB4437" />
        <Button title="Facebook" onPress={() => Alert.alert('Work in progress')} color="#4267B2" />

        <Text style={styles.signupPrompt}>
          ¿No tienes una cuenta? <Text style={styles.signupLink} onPress={() => setShowRegister(true)}>Regístrate gratis</Text>
        </Text>
      </ScrollView>
    );
  }

  if (showRegister) {
    return (
      <ScrollView style={styles.container}>
        <Image
          source={require('@/assets/images/favicon-scaled.png')}
          style={styles.logo}
        />
        <Text style={styles.title}>Regístrate</Text>
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
          ¿Ya tienes cuenta? <Text style={styles.signupLink} onPress={() => setShowRegister(false)}>Inicia sesión</Text>
        </Text>
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  logo: {
    height: 110,
    width: 120,
    alignSelf: 'center',
    margin: 50,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 18,
    color: '#666',
    textAlign: 'center',
    marginBottom: 20,
  },
  inputContainer: {
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
  forgotPassword: {
    color: '#FF5858',
    textAlign: 'center',
    marginBottom: 20,
  },
  orText: {
    textAlign: 'center',
    marginVertical: 20,
  },
  signupPrompt: {
    textAlign: 'center',
    marginTop: 20,
  },
  signupLink: {
    color: '#FF5858',
    fontWeight: 'bold',
  },
});
