import { useRouter, useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { Button, View, Alert, Text, FlatList } from 'react-native';
import { supabase } from '@/utils/supabase';
import { Session } from '@supabase/supabase-js';
import { useSession } from '@/context';
import StoreCard from "@/components/ui/storeCard"; 
import QRCodeComponent from '@/components/ui/QRCode'; 

interface Product {
  id: number;
  name: string;
  description: string;
  logo_path: string;
}

export default function MyComponent() {
  const { param } = useLocalSearchParams();
  const [session, setSession] = useState<Session | null>(null);
  const { signOut } = useSession();
  const [loading, setLoading] = useState(true);
  const [qrVisible, setQrVisible] = useState(false);
  const [selectedProductData, setSelectedProductData] = useState('');
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });
  }, []);

  useEffect(() => {
    if (param) {
      fetchProductsByRetailerNameOrId(param as string);
    } else {
      console.error('No retailer parameter provided');
    }
  }, [param]);

  async function fetchProductsByRetailerNameOrId(retailerParam: string) {
    try {
      setLoading(true);
      let retailerId: number | null = null;

      // Primero, intentamos convertir el parámetro a un número
      const parsedId = parseInt(retailerParam, 10);
      if (!isNaN(parsedId)) {
        retailerId = parsedId;
      } else {
        // Si no es un número, asumimos que es un nombre y buscamos el ID correspondiente
        const { data: retailers, error: retailerError } = await supabase
          .from('retailers')
          .select('id')
          .eq('name', retailerParam)
          .single();

        if (retailerError) throw retailerError;
        if (retailers) retailerId = retailers.id;
      }

      if (retailerId === null) {
        throw new Error(`No retailer found for: ${retailerParam}`);
      }

      const { data: products, error } = await supabase
        .from('products')
        .select('*')
        .eq('retailer_id', retailerId);

      if (error) throw error;
      console.log(`Products for retailer ${retailerParam}:`, products);
      setProducts(products || []);
    } catch (error) {
      console.error(`Error fetching products for retailer ${retailerParam}:`, error);
      Alert.alert('Error', 'Unable to fetch products. Please try again later.');
    } finally {
      setLoading(false);
    }
  }

  const handleProductPress = (productName: string) => {
    setSelectedProductData(productName);
    setQrVisible(true);
  };

  // Objeto de mapeo para las imágenes de los productos
  const productImages: { [key: string]: any } = {
    'doritos.png': require('@/assets/images/doritos.png'),
    'pringles.png': require('@/assets/images/pringles.png'),
    'papas.png': require('@/assets/images/papas.png'),
    'chocolate.png': require('@/assets/images/chocolate.png'),
    'gatorlyte.png': require('@/assets/images/gatorlyte.png'),
    'favicon-scaled.png': require('@/assets/images/favicon-scaled.png'),
  };

  // Suponiendo que quieres obtener el nombre de la tienda de los productos
  const storeName = param as string; // Puedes ajustar esto según cómo obtengas el nombre de la tienda

  return (
    <View>
      {loading ? (
        <Text>Loading products...</Text>
      ) : products.length > 0 ? (
        <FlatList
          data={products}
          numColumns={2} 
          keyExtractor={(item) => item.id.toString()} 
          renderItem={({ item }) => (
            <StoreCard 
              logo={productImages[item.logo_path] || require('@/assets/images/favicon-scaled.png')}
              name={item.name} 
              description={item.description} 
              onPress={() => handleProductPress(item.name)} 
            />
          )}
        />
      ) : (
        <Text>No products available for this store</Text>
      )}

      <QRCodeComponent 
        visible={qrVisible} 
        onClose={() => setQrVisible(false)} 
        productData={selectedProductData} 
        store={storeName}
      />

      <Button title="Go to Store" onPress={() => console.log("Navigating to Store...")} />
    </View>
  );
}
