import React, { useState, useEffect } from 'react';
import { FlatList, StyleSheet, Text, SafeAreaView, TouchableOpacity } from 'react-native';
import { createClient } from '@supabase/supabase-js';
import CustomCard from '@/components/ui/CustomCard';
import { supabase } from '@/utils/supabase'; 
import { useRouter } from 'expo-router'; 

const supabaseUrl = process.env.EXPO_PUBLIC_DATABASE_URL || "";
const supabaseKey = process.env.EXPO_PUBLIC_DATABASE_ANON_KEY || "";

const supabaseClient = createClient(supabaseUrl, supabaseKey);

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
  const [session, setSession] = useState(null);
  const router = useRouter(); // Initialize the router

  useEffect(() => {
    // Fetch the current session
    const getSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setSession(session);
    };

    getSession();

    // Subscribe to auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => {
      subscription?.unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (session) {
      fetchRetailers();
      checkUserPermissions();
    } else {
      console.log('No user logged in');
    }
  }, [session]);

  async function fetchRetailers() {
    const { data, error } = await supabaseClient
      .from('retailers')
      .select('*');
    if (error) {
      console.error('Error fetching retailers:', error);
    } else {
      setRetailers(data as Retailer[]);
    }
  }

  const checkUserPermissions = async () => {
    if (!session?.user) return;

    // Fetch user profile to check role
    const { data, error } = await supabase
      .from('profiles')
      .select('role, retailer_id')
      .eq('id', session.user.id)
      .single();

    if (error) {
      console.error('Error fetching user role:', error);
      return;
    }

    if (data) {
      // You can add additional logic for other roles here if needed
    }
  };

  const handleAdminRedirect = () => {
    router.replace('/admin'); // Redirect to the admin page when the button is pressed
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Button to navigate to admin */}
      <TouchableOpacity style={styles.adminButton} onPress={handleAdminRedirect}>
        <Text style={styles.adminButtonText}>Entra como administrador de tienda</Text>
      </TouchableOpacity>

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
  adminButton: {
    backgroundColor: '#E70020', // Change the button color as needed
    padding: 10,
    borderRadius: 5,
    margin: 10,
    alignItems: 'center',
  },
  adminButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default App;
