import { Canvas, Path } from "@shopify/react-native-skia";
import React, { forwardRef, useImperativeHandle, useState } from 'react';
import { GestureResponderEvent, StyleSheet, View } from 'react-native';

export interface SignaturePadRef {
    clearSignature: () => void;
}

const SignaturePad = forwardRef<SignaturePadRef, {}>((props, ref) => {
    const [pathString, setPathString] = useState('');
    const [currentPath, setCurrentPath] = useState('');

    const handleTouchStart = (event: GestureResponderEvent) => {
        const { locationX, locationY } = event.nativeEvent;
        setCurrentPath(`M ${locationX} ${locationY}`);
    };

    const handleTouchMove = (event: GestureResponderEvent) => {
        const { locationX, locationY } = event.nativeEvent;
        setCurrentPath(prev => `${prev} L ${locationX} ${locationY}`);
    };

    const handleTouchEnd = () => {
        setPathString(prev => `${prev} ${currentPath}`);
        setCurrentPath('');
    };

    const clearSignature = () => {
        setPathString('');
        setCurrentPath('');
    };

    useImperativeHandle(ref, () => ({
        clearSignature
    }));

    return (
        <View
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            style={styles.container}
        >
            <Canvas style={styles.canvas}>
                <Path
                    path={pathString}
                    color="lightblue"
                    style="stroke"
                    strokeJoin="round"
                    strokeCap="round"
                    strokeWidth={5}
                />
                <Path
                    path={currentPath}
                    color="lightblue"
                    style="stroke"
                    strokeJoin="round"
                    strokeCap="round"
                    strokeWidth={5}
                />
            </Canvas>
        </View>
    );
});

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'slategray'
    },
    canvas: {
        flex: 1
    }
});

export default SignaturePad;