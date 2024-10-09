import React from 'react';
import { router } from 'expo-router';
import { View, Text, Image, StyleSheet, Pressable, ImageSourcePropType, SafeAreaView } from 'react-native';

// Definir los tipos de las props
interface CustomCardProps {
  logo: ImageSourcePropType;
  name: string;
}

// Objeto que define colores específicos para cada tienda
const storeColors: { [key: string]: string } = {
  Oxxo: '#c32421',      
  Walmart: '#1a75cf', 
  Cinepolis: '#08285b', 
  Soriana: '#fff',    
  Costco: '#fff', 
  Merkabastos: "#fff",    
  Chedraui: '#fff', 
  "OK Pastelería": '#f08273', 
  "La Gorda": "#cad8d1",
  "El Panqué": "#fff",
  "Pan Bueno": "#231f20",
  Manhattan: "#fff", // Corregido: faltaba el símbolo de # para el color
  Cinemex: "#fc1543",
  Ohlala: "#fff", // Corregido: agregado un color por defecto
};

// Componente CustomCard que recibe logo y name como props
const CustomCard: React.FC<CustomCardProps> = ({ logo, name }) => {
  // Obtener el color correspondiente para la tienda o usar un color por defecto
  const backgroundColor = storeColors[name] || '#FFFFFF';  // Blanco por defecto si no hay coincidencia

  const openStore = () => {
    router.replace(`/store/${name}`);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <Pressable style={[styles.card, { backgroundColor }]} onPress={openStore}>
        {/* Logo de la tienda */}
        <Image source={logo} style={styles.logo} />
      </Pressable>
      {/* Nombre del partner debajo del logo */}
      <Text style={styles.name}>{name}</Text>
    </SafeAreaView>
  );
};

// Estilos para el componente
const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  card: {
    margin: 10,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
    padding: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 5,
    paddingTop: 10,
    marginBottom: 5,
    marginTop: 30,
  },
  logo: {
    width: 150,
    height: 100,
    resizeMode: 'contain',
  },
  name: {
    marginTop: 10,
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default CustomCard;
