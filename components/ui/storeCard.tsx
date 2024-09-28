import { router } from 'expo-router';
import React from 'react';
import { View, Image, Text, StyleSheet, Pressable } from 'react-native';

const StoreCard = ({
  logo,
  name,
  description,
  onPress, // Nueva propiedad
}: {
  logo: any;
  name: string;
  description: string;
  onPress: () => void; // Tipo de la nueva propiedad
}) => {
  return (
    <Pressable style={styles.card} onPress={onPress}>
      <View>
        <Image source={logo} style={styles.logo} />
        <Text style={styles.name}>{name}</Text>
        <Text style={styles.description}>{description}</Text>
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  card: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    margin: 5,
    padding: 10,
    backgroundColor: '#FFF',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 3,
  },
  logo: {
    width: 200,
    height: 60,
    resizeMode: 'contain',
  },
  name: {
    marginTop: 8,
    fontSize: 14,
    color: '#333',
    textAlign: 'center',
  },
  description: {
    marginTop: 4,
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
  },
});

export default StoreCard;
