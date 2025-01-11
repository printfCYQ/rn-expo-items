import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { View } from 'react-native';
// import GalleryView from './components/GalleryView';
import GalleryViewBasic from './components/GalleryViewBasic';
const App = () => {
    return (
        // https://youtu.be/klze7umsznA?si=Y2PznXBZCuSqTBhG
        <View className='w-screen h-screen flex justify-center items-center flex-1'>
            <Stack.Screen options={{ headerShown: false }} />
            <StatusBar hidden />
            {/* <GalleryView></GalleryView> */}
            <GalleryViewBasic></GalleryViewBasic>
        </View>
    );
};
export default App;