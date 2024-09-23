
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { Card } from '@/components/ui/CustomCard';
import UserCard from '@/components/userCard';
import { Stack, useLocalSearchParams } from 'expo-router';

import { Image, StyleSheet, Text } from 'react-native';

export default function Page() {

  const { id } = useLocalSearchParams();
  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#A1CEDC', dark: '#1D3D47' }}
      headerImage={
        <Image
          source={{
            uri: "",
          }}
          className='h-full'
        />
      }>
      <Stack.Screen options={{ title: id as string }} />
      <Text>Blog post: {id}</Text>
      <UserCard
        avatar=""
        name=""
        role="Software Engineer"
        id="1"
      />
    </ParallaxScrollView>
  );
}
