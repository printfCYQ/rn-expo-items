import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { Text, View } from 'react-native';

const App = () => {
    return (
        <View className='w-screen h-screen flex justify-center items-center'>
            <Stack.Screen options={{ headerShown: false }} />
            <StatusBar hidden />
            <Text>galleryView</Text>
        </View>
    );
};
export default App;