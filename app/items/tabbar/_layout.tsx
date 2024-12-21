import { Stack, useNavigation } from 'expo-router';
import { useLayoutEffect } from 'react';

export default function RootLayout() {
  const navigation = useNavigation();

  useLayoutEffect(() => {
    navigation.setOptions({
      title: 'Tabbar'
    });
  }, [navigation]);

  return (
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      </Stack>
  );
}
