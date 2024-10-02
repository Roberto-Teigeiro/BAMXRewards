import React from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import CustomCard from '@/components/ui/CustomCard';
const partners = [
  { id: '1', logo: require('@/assets/images/oxxo.png'), name: 'Oxxo' },
  { id: '2', logo: require('@/assets/images/walmart.png'), name: 'Walmart' },
  { id: '3', logo: require('@/assets/images/cinepolis.png'), name: 'Cinepolis' },
  { id: '4', logo: require('@/assets/images/soriana.png'), name: 'Soriana' },
  { id: '5', logo: require('@/assets/images/costco.png'), name: 'Costco' },
  { id: '6', logo: require('@/assets/images/merkabastos.png'), name: 'Merkabastos' },
  { id: '7', logo: require('@/assets/images/chedraui.png'), name: 'Chedraui' },
  { id: '8', logo: require('@/assets/images/okpasteleria.png'), name: 'OK Pastelería' },
  { id: '9', logo: require('@/assets/images/lagorda.png'), name: 'La Gorda' },
  { id: '10', logo: require('@/assets/images/elpanque.png'), name: 'El Panqué' },
  { id: '11', logo: require('@/assets/images/panbueno.png'), name: 'Pan Bueno' },
  { id: '12', logo: require('@/assets/images/manhattan.png'), name: 'Paletas Manhattan' },
  { id: '13', logo: require('@/assets/images/cinemex.png'), name: 'Cinemex' },
  { id: '14', logo: require('@/assets/images/ohlala.png'), name: 'Ohlala!' },
  // Add other partners here
];

const App = () => {
  return (
    <View style={styles.container}>
      <FlatList
        data={partners}
        renderItem={({ item }) => (
          <CustomCard logo={item.logo} name={item.name} />
        )}
        numColumns={2} // Change this as needed
        keyExtractor={item => item.id}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 20
  }
});

export default App;
