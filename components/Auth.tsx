import React, { useState } from 'react';
import { Alert, StyleSheet, View, AppState, Button, Image, ScrollView, TextInput, Text } from 'react-native';
import { supabase } from '@/utils/supabase';
import { useSession } from '@/context';
import { router } from 'expo-router';
import { FadeInRight } from 'react-native-reanimated';

// Escucha cambios de estado de la app para manejar la actualización automática de tokens
AppState.addEventListener('change', (state) => {
  if (state === 'active') {
    // Comienza a refrescar el token automáticamente cuando la app esté activa
    supabase.auth.startAutoRefresh();
  } else {
    // Detiene el refresco automático cuando la app esté inactiva
    supabase.auth.stopAutoRefresh();
  }
});

export default function Auth() {
  const { signIn } = useSession(); // Hook para manejar la sesión
  const [email, setEmail] = useState(''); // Estado para almacenar el email
  const [password, setPassword] = useState(''); // Estado para almacenar la contraseña
  const [loading, setLoading] = useState(false); // Estado para manejar el indicador de carga
  const [showRegister, setShowRegister] = useState(false); // Estado para alternar entre login y registro
  const [showLostPassword, setShowLostPassword] = useState(false); // Estado para alternar la vista de recuperación de contraseña

  // Función para iniciar sesión con email y contraseña
  async function signInWithEmail() {
    setLoading(true); // Inicia el indicador de carga
    const { error } = await signIn(email, password); // Llama a la función de inicio de sesión

    if (error) {
      Alert.alert(error.message); // Muestra un error si ocurre
      setLoading(false); // Finaliza el indicador de carga si hay error
      return;
    }

    router.replace('/'); // Redirecciona al home después de iniciar sesión
    setLoading(false); // Finaliza el indicador de carga
  }

  // Función para registrar un nuevo usuario
  async function signUpWithEmail() {
    setLoading(true); // Inicia el indicador de carga
    const { data: { session }, error } = await supabase.auth.signUp({ email, password }); // Llama a la función de registro de Supabase

    if (error) Alert.alert(error.message); // Muestra un error si ocurre
    if (!session) Alert.alert('Por favor, revisa tu bandeja de entrada para verificar tu email'); // Pide al usuario verificar su correo
    setLoading(false); // Finaliza el indicador de carga
  }

  // Vista de recuperación de contraseña
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

  // Vista de inicio de sesión
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

  // Vista de registro
  if (showRegister) {
    return (
      <ScrollView style={styles.container}>
        <Image
          source={require('@/assets/images/favicon-scaled.png')}
          style={styles.logo}
        />
        <Text style={styles.title}>Crea tu cuenta</Text>
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
    height: 150,
    width: 180,
    alignSelf: 'center',
    margin: 50,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    paddingBottom: 10,
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
    color: '#FFB330',
    textAlign: 'right',
    marginBottom: 20,
    textDecorationLine: 'underline',
    fontWeight: 'bold',
  },
  orText: {
    textAlign: 'center',
    marginVertical: 20,
    fontWeight: 'bold',
  },
  signupPrompt: {
    textAlign: 'center',
    marginTop: 20,
  },
  signupLink: {
    color: '#FFB330',
    fontWeight: 'bold',
    textDecorationLine: 'underline',
  },
});
