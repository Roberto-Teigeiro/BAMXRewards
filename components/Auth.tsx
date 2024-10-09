import React, { useState, useEffect } from 'react';
import { Alert, StyleSheet, View, Image, ScrollView, TextInput, Text, TouchableOpacity, AppState } from 'react-native'; // Importa AppState
import { supabase } from '@/utils/supabase';
import { useSession } from '@/context';
import { router } from 'expo-router';
import { FadeInRight } from 'react-native-reanimated';

export default function Auth() {
  const { signIn } = useSession();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const [showLostPassword, setShowLostPassword] = useState(false);

  // Escucha cambios de estado de la app para manejar la actualización automática de tokens
  useEffect(() => {
    const subscription = AppState.addEventListener('change', (state) => {
      if (state === 'active') {
        // Comienza a refrescar el token automáticamente cuando la app esté activa
        supabase.auth.startAutoRefresh();
      } else {
        // Detiene el refresco automático cuando la app esté inactiva
        supabase.auth.stopAutoRefresh();
      }
    });

    // Limpia el event listener cuando el componente se desmonte
    return () => {
      subscription.remove();
    };
  }, []);

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

  if (showLostPassword) {
    return (
      <ScrollView contentContainerStyle={styles.container}>
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
        <TouchableOpacity style={styles.signInButton} onPress={signInWithEmail} disabled={loading}>
          <Text style={styles.signInButtonText}>Recuperar</Text>
        </TouchableOpacity>
        <Text style={styles.signupPrompt}>
          ¿Ya tienes cuenta?{' '}
          <Text style={styles.signupLink} onPress={() => setShowLostPassword(false)}>
            Inicia sesión
          </Text>
        </Text>
      </ScrollView>
    );
  }

  if (!showRegister) {
    return (
      <ScrollView contentContainerStyle={styles.container}>
        {/* Logo grande centrado */}
        <Image
          source={require('@/assets/images/favicon-scaled.png')}
          style={styles.logo}
        />

        {/* Texto de bienvenida */}
        <Text style={styles.title}>Bienvenido de Nuevo</Text>
        <Text style={styles.subtitle}>Inicia Sesión</Text>

        {/* Campos de entrada */}
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
        </View>

        {/* Botón de inicio de sesión */}
        <TouchableOpacity style={styles.signInButton} onPress={signInWithEmail} disabled={loading}>
          <Text style={styles.signInButtonText}>Iniciar Sesión</Text>
        </TouchableOpacity>

        {/* Olvidaste tu contraseña */}
        <Text style={styles.forgotPassword} onPress={() => setShowLostPassword(true)}>
          ¿Olvidaste tu contraseña?
        </Text>

        {/* Texto "O usa una de tus redes" */}
        <Text style={styles.orText}>O usa una de tus redes</Text>

        {/* Botones de redes sociales */}
        <View style={styles.socialButtonsContainer}>
          <TouchableOpacity style={styles.socialButton}>
            <Image source={require('@/assets/images/google-icon.png')} style={styles.socialIcon} />
            <Text style={styles.socialButtonText}>Google</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.socialButton}>
            <Image source={require('@/assets/images/facebook-icon.png')} style={styles.socialIcon} />
            <Text style={styles.socialButtonText}>Facebook</Text>
          </TouchableOpacity>
        </View>

        {/* Registro */}
        <Text style={styles.signupPrompt}>
          ¿No tienes una cuenta?{' '}
          <Text style={styles.signupLink} onPress={() => setShowRegister(true)}>
            Regístrate gratis
          </Text>
        </Text>
      </ScrollView>
    );
  }

  if (showRegister) {
    return (
      <ScrollView contentContainerStyle={styles.container}>
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
        <TouchableOpacity style={styles.signInButton} onPress={signInWithEmail} disabled={loading}>
          <Text style={styles.signInButtonText}>Registrarme</Text>
        </TouchableOpacity>
        <Text style={styles.signupPrompt}>
          ¿Ya tienes cuenta?{' '}
          <Text style={styles.signupLink} onPress={() => setShowRegister(false)}>
            Inicia sesión
          </Text>
        </Text>
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,  // Important for ScrollView content to grow and allow centering
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#fff',
  },
  logo: {
    height: 150,
    width: 180,
    alignSelf: 'center',
    marginBottom: 30,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    paddingBottom: 10,
  },
  subtitle: {
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 30,
  },
  inputContainer: {
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 15,
    borderRadius: 8,
    marginBottom: 15,
  },
  signInButton: {
    backgroundColor: '#FF5858',
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 15,
  },
  signInButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
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
  socialButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 20,
  },
  socialButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    borderRadius: 8,
    width: 150,
    justifyContent: 'center',
  },
  socialIcon: {
    width: 20,
    height: 20,
    marginRight: 10,
  },
  socialButtonText: {
    fontSize: 16,
    color: '#333',
  },
});
