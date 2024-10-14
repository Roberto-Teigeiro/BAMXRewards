import { useState, useEffect } from 'react'
import { supabase } from '@/utils/supabase'
import { StyleSheet, View, Alert, TouchableOpacity, SafeAreaView, Text, ScrollView } from 'react-native'
import { Session } from '@supabase/supabase-js'
import { Input } from './ui/input'
import AvatarUploader from './AvatarUploader'
import { useSession } from '@/context'
import { useRouter } from 'expo-router'; 

export default function Account() {
  const [session, setSession] = useState<Session | null>(null)
  const { signOut } = useSession();
  const router = useRouter(); // Initialize the router

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
    })

    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })
  }, [])

  const [loading, setLoading] = useState(true)
  const [username, setUsername] = useState('')
  const [avatarUrl, setAvatarUrl] = useState('')
  const [fullName, setfullName] = useState('')

  useEffect(() => {
    if (session) getProfile()
  }, [session])

  const handleHistoryRedirect = () => {
    router.replace('/history'); // Redirect to the admin page when the button is pressed
  };


  async function getProfile() {
    try {
      setLoading(true)
      if (!session?.user) throw new Error('No user on the session!')

      const { data, error, status } = await supabase
        .from('profiles')
        .select(`username, avatar_url, full_name`)
        .eq('id', session?.user.id)
        .single()

      if (error && status !== 406) {
        throw error
      }

      if (data) {
        setUsername(data.username)
        setAvatarUrl(data.avatar_url)
        setfullName(data.full_name)
      }
    } catch (error) {
      if (error instanceof Error) {
        Alert.alert(error.message)
      }
    } finally {
      setLoading(false)
    }
  }

  async function updateProfile({
    username,
    avatar_url,
    fullName
  }: {
    username: string
    avatar_url: string,
    fullName: string
  }) {
    try {
      setLoading(true)
      if (!session?.user) throw new Error('No user on the session!')

      const updates = {
        id: session?.user.id,
        username,
        avatar_url,
        updated_at: new Date(),
        full_name: fullName
      }

      const { error } = await supabase.from('profiles').upsert(updates)

      if (error) {
        throw error
      }
    } catch (error) {
      if (error instanceof Error) {
        Alert.alert(error.message)
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <SafeAreaView style={styles.container}> 
      {/* Hacer scrollable el contenido */}
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.contentContainer}>
          {/* Título de la página */}
          <Text style={styles.title}>{session?.user.id}</Text>
          <Text style={styles.title}>Perfil</Text>

          {/* Avatar */}
          <View style={styles.avatarContainer}>
            <AvatarUploader
              size={80}
              url={avatarUrl}
              onUpload={(url: string) => {
                setAvatarUrl(url)
                updateProfile({ username, avatar_url: url, fullName })
              }}
            />
          </View>

          {/* Nombre completo */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Nombre</Text>
            <Input
              placeholder="Nombre"
              value={fullName}
              onChangeText={(text) => setfullName(text)}
              style={styles.input}
            />
          </View>

          {/* Nombre de usuario */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Usuario</Text>
            <Input
              placeholder="Nombre de usuario"
              value={username}
              onChangeText={(text) => setUsername(text)}
              style={styles.input}
            />
          </View>

          {/* Correo electrónico */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Correo electrónico vinculado</Text>
            <Input
              placeholder="Correo electrónico"
              value={session?.user?.email || 'No disponible'}
              editable={false}
              style={styles.input}
            />
          </View>

          {/* Contraseña */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Contraseña</Text>
            <Input
              placeholder="********"
              value="********"
              editable={false}
              style={styles.input}
            />
          </View>

          {/* Ver historial de cupones */}  
          <TouchableOpacity style={styles.linkContainer} onPress={() => handleHistoryRedirect()} >
            <Text style={styles.linkText}>Ver historial de cupones</Text>
          </TouchableOpacity>

          {/* Botón de cerrar sesión */}
          <TouchableOpacity style={styles.signOutButton} onPress={() => signOut()}>
            <Text style={styles.signOutButtonText}>Cerrar sesión</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollContainer: {
    alignItems: 'center',
    paddingVertical: 20, // Asegura que el contenido tenga espacio superior e inferior
  },
  contentContainer: {
    maxWidth: 400,
    width: '100%',
    paddingHorizontal: 20, // Añade algo de padding horizontal
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20, 
    alignSelf: 'flex-start',
    color: '#E70020',
    
  },
  avatarContainer: {
    alignItems: 'center',
    marginBottom: 30,
    marginTop: 40,
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  input: {
    borderColor: '#E0E0E0',
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    backgroundColor: '#F5F5F5',
  },
  linkContainer: {
    marginTop: 20,
    marginBottom: 40,
    alignItems: 'center',
  },
  linkText: {
    color: '#FF9900',
    fontSize: 14,
    textDecorationLine: 'underline',
  },
  signOutButton: {
    backgroundColor: '#E00034',
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  signOutButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
})
