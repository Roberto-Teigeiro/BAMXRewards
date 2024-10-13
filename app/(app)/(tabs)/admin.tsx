import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, SafeAreaView, TouchableOpacity, ActivityIndicator, View, Button } from 'react-native';
import { supabase } from '@/utils/supabase';
import { useRouter } from 'expo-router';
import { Session } from '@supabase/supabase-js';
import { CameraView, CameraType, FlashMode, CameraMode, useCameraPermissions } from 'expo-camera';

const AdminDashboard = () => {
  const [session, setSession] = useState<Session | null>(null);
  const [userProfile, setUserProfile] = useState(null);
  const [retailer, setRetailer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [cameraPermission, requestCameraPermission] = useCameraPermissions();
  const [facing, setFacing] = useState<CameraType>('back');
  const [scanned, setScanned] = useState(false);
  const router = useRouter();
  const [torchEnabled, setTorchEnabled] = useState(false); // Manage torch state

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
      fetchRetailer(data.retailer_id);
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
    router.replace('/');
  };

  const handleBarcodeScanned = async ({ data }: { data: string }) => {
    console.log(data)
    setScanned(true);

    // Assuming the QR code format is 'voucherId,userId'
    const [voucherId, userId] = data.split(',');
    if (voucherId && userId) {
      const { error } = await supabase
        .from('used_vouchers')
        .insert({ vouchernumber: voucherId, user_id: userId, used_at: new Date() });

      if (error) {
        console.error('Error redeeming voucher:', error);
        alert('Hubo un error canjeando el cupon.');
      } else {
        alert('Cupon canjeado correctamente!');
      }
    } else {
      alert('QR Invalido');
    }
  };

  if (!cameraPermission) {
    return <View />;
  }

  if (!cameraPermission.granted) {
    return (
      <View style={styles.permissionContainer}>
        <Text style={styles.message}>Necesitamos permiso para acceder a tu cámara</Text>
        <Button onPress={requestCameraPermission} title="Grant permission" />
      </View>
    );
  }
  

  if (loading) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <ActivityIndicator size="large" color="#E70020" />
        <Text>Cargando...</Text>
      </SafeAreaView>
    );
  }

  if (!userProfile) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <Text>No se encontró el perfil del usuario. Inténtalo de nuevo.</Text>
      </SafeAreaView>
    );
  }

  if (!retailer) {
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

      {/* QR Code Scanner */}
      {!scanned && (
        <CameraView
          style={styles.camera}
          facing={facing}
          barcodeScannerSettings={{
            barcodeTypes: ['qr'],
          }}
          onBarcodeScanned={!scanned ? handleBarcodeScanned : undefined} // Use the correct prop name
        />
      )}

      {scanned && (
        <Button title="Escanear otra vez" onPress={() => setScanned(false)} />
      )}

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
  permissionContainer: {
    flex: 1,
    justifyContent: 'center', // Center content vertically
    alignItems: 'center', // Center content horizontally
    padding: 20, // Add some padding for better appearance
    backgroundColor: '#fff', // Background color
  },
  message: {
    fontSize: 18,
    marginBottom: 20, // Space between message and button
    textAlign: 'center', // Center text
  },
  camera: {
    width: '100%',
    height: 400,
  },
  signOutButton: {
    backgroundColor: '#E70020',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 20,
  },
  signOutButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  torchButton: {
    backgroundColor: '#E70020',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 20,
  },
  torchButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default AdminDashboard;
