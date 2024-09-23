import React from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import CustomCard from '@/components/ui/CustomCard';
const partners = [
  { id: '1', logo: require('@/assets/images/favicon-scaled.png'), name: 'Oxxo' },
  { id: '2', logo: require('@/assets/images/favicon-scaled.png'), name: 'Walmart' },
  { id: '2', logo: require('@/assets/images/favicon-scaled.png'), name: 'Partner 2' },
  { id: '2', logo: require('@/assets/images/favicon-scaled.png'), name: 'Partner 2' },
  { id: '2', logo: require('@/assets/images/favicon-scaled.png'), name: 'Partner 2' },
  { id: '2', logo: require('@/assets/images/favicon-scaled.png'), name: 'Partner 2' },
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
