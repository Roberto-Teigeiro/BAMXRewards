import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, SafeAreaView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { supabase } from '@/utils/supabase';
import { useRouter } from 'expo-router';
import { Session } from '@supabase/supabase-js';

const AdminDashboard = () => {
  const [session, setSession] = useState<Session | null>(null);
  const [userProfile, setUserProfile] = useState(null);
  const [retailer, setRetailer] = useState(null);
  const [loading, setLoading] = useState(true); // Loading state
  const router = useRouter(); // Initialize the router

  useEffect(() => {
    // Get the session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false); // Set loading to false after session is fetched
    });

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setLoading(false); // Set loading to false when auth state changes
    });

    return () => {
      subscription?.unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (session) {
      fetchUserProfile();
    }
  }, [session]);

  const fetchUserProfile = async () => {
    if (!session?.user) {
      console.log('No user in session, skipping user profile fetch');
      return;
    }

    console.log('Fetching user profile for user ID:', session.user.id);
    const { data, error } = await supabase
      .from('profiles')
      .select('role, retailer_id')
      .eq('id', session.user.id)
      .single();

    if (error) {
      console.error('Error fetching user profile:', error);
      return;
    }

    setUserProfile(data);

    if (data?.retailer_id) {
      fetchRetailer(data.retailer_id); // Fetch retailer if retailer ID exists
    }
  };

  const fetchRetailer = async (retailerId) => {
    console.log('Fetching retailer for retailer ID:', retailerId);
    const { data, error } = await supabase
      .from('retailers')
      .select('*')
      .eq('id', retailerId)
      .single();

    if (error) {
      console.error('Error fetching retailer:', error);
      return;
    }

    setRetailer(data);
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.replace('/'); // Redirect to the home page after sign out
  };

  // Show loading indicator if loading
  if (loading) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <ActivityIndicator size="large" color="#E70020" />
        <Text>Cargando...</Text>
      </SafeAreaView>
    );
  }

  // Handle case where user profile or retailer is not found
  if (!userProfile) {
    console.log('User profile not found:', userProfile);
    return (
      <SafeAreaView style={styles.safeArea}>
        <Text>No se encontró el perfil del usuario. Inténtalo de nuevo.</Text>
      </SafeAreaView>
    );
  }

  if (!retailer) {
    console.log('Retailer not found for user profile:', userProfile);
    return (
      <SafeAreaView style={styles.safeArea}>
        <Text>No se encontró el minorista. Inténtalo de nuevo.</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <Text style={styles.title}>Bienvenido, Administrador</Text>
      <Text style={styles.description}>
        Este es el panel de administración. Aquí podrás gestionar la aplicación.
      </Text>
      <Text style={styles.role}>Rol: {userProfile.role}</Text>
      <Text style={styles.retailer}>Minorista: {retailer.name}</Text>
      <Text style={styles.retailerId}>Retailer ID: {userProfile.retailer_id}</Text>

      {/* Button to sign out */}
      <TouchableOpacity style={styles.signOutButton} onPress={handleSignOut}>
        <Text style={styles.signOutButtonText}>Cerrar sesión</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#E70020',
  },
  description: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 30,
  },
  role: {
    fontSize: 18,
    marginBottom: 10,
  },
  retailer: {
    fontSize: 18,
    marginBottom: 10,
  },
  retailerId: {
    fontSize: 18,
    marginBottom: 20,
  },
  signOutButton: {
    backgroundColor: '#E70020',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  signOutButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default AdminDashboard;
