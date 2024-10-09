import React, { useState } from 'react'
import { Alert, StyleSheet, View, AppState, Button, Image, YellowBox } from 'react-native'
import {TextInput , ScrollView } from 'react-native';
import { supabase } from '@/utils/supabase'
import { Input } from './ui/input'
import { useSession } from '@/context'
import { router } from 'expo-router'
import { Text } from './ui/text'
import ParallaxScrollView from './ParallaxScrollView'

const RecoverPassword = () => {
    const [email, setEmail] = useState('');
  
    const handleRecoverPassword = () => {
      // Aquí enviarías el correo electrónico al backend
      console.log('Enviar correo para recuperar contraseña:', email);
      // Implementar la lógica para comunicarse con el backend

      
    };
  
    return (
      <View style={styles.container}>
        <Text style={styles.header}>Recuperar contraseña</Text>
        <TextInput
          style={styles.input}
          onChangeText={setEmail}
          value={email}
          placeholder="Correo electrónico vinculado"
          keyboardType="email-address"
        />
        
        <Button
          title="Enviar código"
          onPress={handleRecoverPassword}
          color="#E63946"
        />
      </View>
    );
  };
  
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      padding: 20,
    },
    header: {
      fontSize: 20,
      marginBottom: 20,
    },
    input: {
      height: 40,
      width: '100%',
      marginVertical: 10,
      borderWidth: 1,
      padding: 10,
      borderColor: '#cccccc',
      borderRadius: 5,
    },
    linkText: {
      marginTop: 20,
      color: '#E63946',
    }
  });
  
  export default RecoverPassword;