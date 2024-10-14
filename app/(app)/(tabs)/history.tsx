import React, { useEffect, useState } from 'react'; 
import { SafeAreaView, Text, FlatList, StyleSheet, ActivityIndicator } from 'react-native';
import { supabase } from '@/utils/supabase';
import { Session } from '@supabase/supabase-js';

const VoucherHistory = () => {
  const [session, setSession] = useState<Session | null>(null);
  const [vouchers, setVouchers] = useState([]);
  const [loading, setLoading] = useState(true);

  // Handle session and auth state changes
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setLoading(false);
    });

    return () => {
      subscription?.unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (session) {
      fetchVoucherHistory(session.user.id);
    }
  }, [session]);

  const fetchVoucherHistory = async (userId: string) => {
    setLoading(true);

    const { data, error } = await supabase
      .from('used_vouchers')
      .select('vouchernumber, used_at')
      .eq('user_id', userId)
      .order('used_at', { ascending: false });

    if (error) {
      console.error('Error fetching vouchers:', error);
      alert('Hubo un error obteniendo tu historial de cupones.');
    } else {
      setVouchers(data);
    }
    setLoading(false);
  };

  // Función para restar 5 horas a la fecha original
  const subtractFiveHours = (dateString) => {
    const date = new Date(dateString);
    date.setHours(date.getHours() - 6);
    return date;
  };

  const renderItem = ({ item }) => (
    <Text style={styles.voucherItem}>
      Cupón: {item.vouchernumber} - Fecha: {subtractFiveHours(item.used_at).toLocaleDateString()} {subtractFiveHours(item.used_at).toLocaleTimeString()}
    </Text>
  );

  if (loading) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#E70020" />
        <Text>Cargando historial...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Historial de Cupones Usados</Text>
      <FlatList
        data={vouchers}
        keyExtractor={(item) => item.vouchernumber}
        renderItem={renderItem}
        ListEmptyComponent={<Text>No has canjeado ningún cupón aún.</Text>}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#E70020',
  },
  voucherItem: {
    fontSize: 18,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default VoucherHistory;