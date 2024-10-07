import { useRouter, useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { Button, View, Alert, Text, FlatList } from 'react-native';
import { supabase } from '@/utils/supabase';
import { Session } from '@supabase/supabase-js';
import { useSession } from '@/context';
import StoreCard from "@/components/ui/storeCard"; 
import QRCodeComponent from '@/components/ui/QRCode'; 

export default function MyComponent() {
  const { param } = useLocalSearchParams();
  const [session, setSession] = useState<Session | null>(null);
  const { signOut } = useSession();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });
  }, []);

  const [loading, setLoading] = useState(true);
  const [username, setUsername] = useState('');
  const [website, setWebsite] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');
  const [fullName, setfullName] = useState('');
  const [qrVisible, setQrVisible] = useState(false);
  const [selectedProductData, setSelectedProductData] = useState('');

  const productos: { [key: string]: { [key: string]: { description: string; logo: any } } } = {
    "Oxxo": {
      "Doritos": { description: "Description of Product 1", logo: require('@/assets/images/doritos.png') },
      "Pringles": { description: "Description of Product 2", logo: require('@/assets/images/pringles.png') },
      "Papas Sabritas": { description: "Description of Product 3", logo: require('@/assets/images/papas.png') },
      "Chocolate Abuelita": { description: "Description of Product 4", logo: require('@/assets/images/chocolate.png') },
      "Gatorlyte": { description: "Description of Product 5", logo: require('@/assets/images/gatorlyte.png') },
    },
    "Walmart": {
      "Nombre1": { description: "Description of Product 1", logo: require('@/assets/images/favicon-scaled.png') },
      "Nombre2": { description: "Description of Product 2", logo: require('@/assets/images/favicon-scaled.png') },
      "Nombre3": { description: "Description of Product 3", logo: require('@/assets/images/favicon-scaled.png') },
    },
    "Cinepolis": {
      "Nombre1": { description: "Description of Product 1", logo: require('@/assets/images/favicon-scaled.png') },
      "Nombre2": { description: "Description of Product 2", logo: require('@/assets/images/favicon-scaled.png') },
    },
    "Soriana": {
      "Nombre1": { description: "Description of Product 1", logo: require('@/assets/images/favicon-scaled.png') },
      "Nombre2": { description: "Description of Product 2", logo: require('@/assets/images/favicon-scaled.png') },
      "Nombre3": { description: "Description of Product 3", logo: require('@/assets/images/favicon-scaled.png') },
    },
    "Costco": {
      "Nombre1": { description: "Description of Product 1", logo: require('@/assets/images/favicon-scaled.png') },
      "Nombre2": { description: "Description of Product 2", logo: require('@/assets/images/favicon-scaled.png') },
    },
    "Merkabastos": {
      "Nombre1": { description: "Description of Product 1", logo: require('@/assets/images/favicon-scaled.png') },
      "Nombre2": { description: "Description of Product 2", logo: require('@/assets/images/favicon-scaled.png') },
    }
  };

  useEffect(() => {
    if (session) getProfile();
  }, [session]);

  async function getProfile() {
    try {
      setLoading(true);
      if (!session?.user) throw new Error('No user on the session!');

      const { data, error, status } = await supabase
        .from('profiles')
        .select(`username, website, avatar_url, full_name`)
        .eq('id', session?.user.id)
        .single();
      if (error && status !== 406) {
        throw error;
      }

      if (data) {
        setUsername(data.username);
        setWebsite(data.website);
        setAvatarUrl(data.avatar_url);
        setfullName(data.full_name);
      }
    } catch (error) {
      if (error instanceof Error) {
        Alert.alert(error.message);
      }
    } finally {
      setLoading(false);
    }
  }

  // Check if param is a string or an array of strings
  const paramValue = Array.isArray(param) ? param[0] : param;

  // Get products for the corresponding store
  const storeProducts = paramValue && productos[paramValue] 
    ? Object.entries(productos[paramValue]) 
    : [];

  const handleProductPress = (productName: string) => {
    setSelectedProductData(productName);
    setQrVisible(true);
  };

  return (
    <View>
      {paramValue && storeProducts.length > 0 ? (
        <FlatList
          data={storeProducts}
          numColumns={2} 
          keyExtractor={([key]) => key} 
          renderItem={({ item }) => (
            <StoreCard 
              logo={item[1].logo} 
              name={item[0]} 
              description={item[1].description} 
              onPress={() => handleProductPress(item[0])} 
            />
          )}
        />
      ) : (
        <Text>No valid param or no products available</Text>
      )}

      {/* QR Code modal for selected product */}
      <QRCodeComponent 
        visible={qrVisible} 
        onClose={() => setQrVisible(false)} 
        productData={selectedProductData} 
      />

      <Text>{session?.user?.email}</Text>
      <Button title="Go to Store" onPress={() => console.log("Navigating to Store...")} />
    </View>
  );
}