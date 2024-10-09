import React, { useState, useEffect } from 'react';
import { FlatList, StyleSheet, Text, SafeAreaView, Image } from 'react-native';
import { createClient } from '@supabase/supabase-js';
import CustomCard from '@/components/ui/CustomCard';

// Asegúrate de reemplazar estos valores con tus propias credenciales de Supabase
const supabaseUrl = 'https://lihzaprklohfdxnnudzh.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxpaHphcHJrbG9oZmR4bm51ZHpoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjY2NzQzMzcsImV4cCI6MjA0MjI1MDMzN30.b8i2VyqTGQgxZ2tndE11H0xTAjEKVtHLYkzAs__WOSw';

const supabase = createClient(supabaseUrl, supabaseKey);

interface Retailer {
  id: number;
  name: string;
  logo_path: string;
}

// Objeto de mapeo para las imágenes
const images = {
  'oxxo.png': require('@/assets/images/oxxo.png'),
  'walmart.png': require('@/assets/images/walmart.png'),
  'cinepolis.png': require('@/assets/images/cinepolis.png'),
  'soriana.png': require('@/assets/images/soriana.png'),
  'costco.png': require('@/assets/images/costco.png'),
  'merkabastos.png': require('@/assets/images/merkabastos.png'),
  'chedraui.png': require('@/assets/images/chedraui.png'),
  'okpasteleria.png': require('@/assets/images/okpasteleria.png'),
  'lagorda.png': require('@/assets/images/lagorda.png'),
  'elpanque.png': require('@/assets/images/elpanque.png'),
  'panbueno.png': require('@/assets/images/panbueno.png'),
  'manhattan.png': require('@/assets/images/manhattan.png'),
  'cinemex.png': require('@/assets/images/cinemex.png'),
  'ohlala.png': require('@/assets/images/ohlala.png'),
};

const App = () => {
  const [retailers, setRetailers] = useState<Retailer[]>([]);

  useEffect(() => {
    fetchRetailers();
  }, []);

  async function fetchRetailers() {
    const { data, error } = await supabase
      .from('retailers')
      .select('*');
    if (error) {
      console.error('Error fetching retailers:', error);
    } else {
      console.log('Retailers:', data);
      setRetailers(data as Retailer[]);
    }
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <FlatList
        ListHeaderComponent={<Text style={styles.title}>Nuestros Aliados</Text>}
        data={retailers}
        renderItem={({ item }: { item: Retailer }) => (
          <CustomCard 
            logo={images[item.logo_path as keyof typeof images]}
            name={item.name} 
          />
        )}
        numColumns={2}
        keyExtractor={(item: Retailer) => item.id.toString()}
        contentContainerStyle={styles.contentContainer}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    marginTop: 20,
    paddingHorizontal: 10,
    color: '#E70020',
    alignSelf: 'flex-start',
  },
  contentContainer: {
    paddingHorizontal: 10,
  },
});

export default App;