import {router} from 'expo-router';
import React from 'react';
import { View, Image, Text, StyleSheet, Pressable } from 'react-native';

const CustomCard = ({ logo, name } : {logo: any, name:string}) => {


const openStore = () =>{
  router.replace(`/store/${name}`)
}
   
  return (
    <Pressable style={styles.card} onPress={openStore}>
    <View >
      
      <Image source={logo} style={styles.logo} />
      <Text style={styles.name}>{name}</Text>
      
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
    backgroundColor: '#FFF', // White background
    borderRadius: 12, // Rounded corners
    shadowColor: '#000', // Shadow for iOS
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 3, // Shadow for Android
  },
  logo: {
    width: 60, // Set your desired width
    height: 60, // Set your desired height
    resizeMode: 'contain' // Keep the image aspect ratio
  },
  name: {
    marginTop: 8,
    fontSize: 14,
    color: '#333', // Dark grey color for the text
    textAlign: 'center' // Center the text
  }
});

export default CustomCard;
