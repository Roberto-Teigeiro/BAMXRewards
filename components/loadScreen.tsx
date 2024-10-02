import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';

export default function LoadingScreen() {
  const navigation = useNavigation();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigation.reset({
        index: 0,
        routes: [{ name: 'Home' }], // Reemplaza con el nombre correcto de tu ruta
      });
    }, 2000);

    return () => clearTimeout(timer); // Limpieza del temporizador
  }, [navigation]);

  return (
    <View style={styles.container}>
      <Image source={require('@/assets/images/favicon-scaled.png')} style={styles.logo} />
      <Text style={styles.text}>¡Bienvenido!</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FF5858',
  },
  logo: {
    width: 120,
    height: 120,
    marginBottom: 20,
  },
  text: {
    fontSize: 24,
    color: '#fff',
  },
});
