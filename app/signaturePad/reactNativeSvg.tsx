import { useNavigation } from 'expo-router';
import React, { useLayoutEffect, useRef } from 'react';
import { Button, View } from 'react-native';
import SignaturePad, { SignaturePadRef } from './components/SignaturePadSvg';
const App = () => {
    const navigation = useNavigation();
    const signaturePadRef = useRef<SignaturePadRef>(null);

    useLayoutEffect(() => {
        navigation.setOptions({ title: 'SignaturePad' });
    }, [navigation]);

    const clear = () => {
        signaturePadRef.current?.clearSignature();
    }

    return (
        <View className='w-screen h-screen items-center justify-center'>
            <View className='w-[300] h-[500]'>
                <SignaturePad ref={signaturePadRef}></SignaturePad>
                <View className='mt-10'>
                    <Button title="clear" onPress={clear}></Button>
                </View>
            </View>
        </View>
    );
};
export default App;