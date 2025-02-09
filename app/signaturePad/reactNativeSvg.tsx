import { useNavigation } from 'expo-router';
import React, { useLayoutEffect, useRef } from 'react';
import { Button, GestureResponderEvent, View } from 'react-native';
import SignaturePad, { SignaturePadRef } from './components/SignaturePadSvg';
const App = () => {
    const navigation = useNavigation();
    const signaturePadRef = useRef<SignaturePadRef>(null);
    const padViewRef = useRef<View>(null);

    useLayoutEffect(() => {
        navigation.setOptions({ title: 'SignaturePadSvg' });
    }, [navigation]);

    const clear = () => {
        signaturePadRef.current?.clearSignature();
    }

    const handleTouchMove = (event: GestureResponderEvent) => {
        const nativeEvent = event.nativeEvent;
        const { pageX, pageY } = nativeEvent;
        padViewRef.current?.measure((fx, fy, width, height, px, py) => {
            console.log('padViewRef', fx, fy, width, height, px, py, pageX, pageY);
            if (
                pageX > px + 5 &&
                pageX < px + width &&
                pageY > py + 5 &&
                pageY < py + height) {
                console.log('画板内部');
                signaturePadRef.current?.startDraw();
            } else {
                signaturePadRef.current?.stopDraw();
                console.log('画板外部');
            }
        });
    };



    return (
        <View className='w-screen h-screen items-center justify-center'
            onTouchMove={handleTouchMove}
        >
            <View className='w-[300] h-[500]' ref={padViewRef}>
                <SignaturePad ref={signaturePadRef}></SignaturePad>
            </View>
            <View className='mt-10'>
                <Button title="clear" onPress={clear}></Button>
            </View>
        </View>
    );
};
export default App;