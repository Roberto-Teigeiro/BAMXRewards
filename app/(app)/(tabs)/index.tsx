import React from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import CustomCard from '@/components/ui/CustomCard';
const partners = [
  { id: '1', logo: require('@/assets/images/oxxo.png'), name: 'Oxxo' },
  { id: '2', logo: require('@/assets/images/walmart.png'), name: 'Walmart' },
  { id: '3', logo: require('@/assets/images/cinepolis.png'), name: 'Cinepolis' },
  { id: '4', logo: require('@/assets/images/soriana.png'), name: 'Soriana' },
  { id: '5', logo: require('@/assets/images/costco.png'), name: 'Costco' },
  { id: '6', logo: require('@/assets/images/favicon-scaled.png'), name: 'Partner 2' },
  { id: '7', logo: require('@/assets/images/favicon-scaled.png'), name: 'Partner 2' },
  { id: '8', logo: require('@/assets/images/favicon-scaled.png'), name: 'Partner 2' },
  { id: '9', logo: require('@/assets/images/favicon-scaled.png'), name: 'Partner 2' },
  { id: '10', logo: require('@/assets/images/favicon-scaled.png'), name: 'Partner 2' },
  { id: '11', logo: require('@/assets/images/favicon-scaled.png'), name: 'Partner 2' },
  { id: '12', logo: require('@/assets/images/favicon-scaled.png'), name: 'Partner 2' },
  { id: '13', logo: require('@/assets/images/favicon-scaled.png'), name: 'Partner 2' },
  { id: '14', logo: require('@/assets/images/favicon-scaled.png'), name: 'Partner 2' },
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
