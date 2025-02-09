import React, { forwardRef, useImperativeHandle, useRef, useState } from 'react';
import { GestureResponderEvent, StyleSheet, View } from 'react-native';
import Svg, { Path } from 'react-native-svg';

export interface SignaturePadRef {
    clearSignature: () => void;
    stopDraw: () => void;
    startDraw: () => void;
}

const SignaturePad = forwardRef<SignaturePadRef, {}>((props, ref) => {
    // 存储所有绘制的路径
    const [paths, setPaths] = useState<string[]>([]);
    // 存储当前正在绘制的路径
    const currentPath = useRef('');

    const canDraw = useRef(false);

    const handleTouchStart = (event: GestureResponderEvent) => {
        // canDraw.current = true;
        const { locationX, locationY } = event.nativeEvent;
        currentPath.current = `M${locationX},${locationY}`;
    };

    const handleTouchMove = (event: GestureResponderEvent) => {
        if (!canDraw.current) return;
        const { locationX, locationY, pageX, pageY } = event.nativeEvent;

        console.log('handleTouchMove', pageX, pageY);

        // 更新当前路径
        currentPath.current += ` L${locationX},${locationY}`;
        setPaths((prevPaths) => [...prevPaths, currentPath.current]);
    };

    const handleTouchEnd = () => {
        if (!canDraw.current || !currentPath.current) return;
        setPaths((prevPaths) => [...prevPaths, currentPath.current]);
        currentPath.current = '';
    };

    // 清空签字板的函数
    const clearSignature = () => {
        setPaths([]);
        currentPath.current = '';
    };

    const stopDraw = () => {
        canDraw.current = false;
    }

    const startDraw = () => {
        canDraw.current = true;
    }

    useImperativeHandle(ref, () => ({
        clearSignature,
        stopDraw,
        startDraw
    }));

    return (
        <View
            style={styles.signatureArea}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
        >
            <Svg width="100%" height="100%">
                {paths.map((path, index) => (
                    <Path
                        key={index}
                        d={path}
                        stroke="black"
                        strokeWidth={3}
                        fill="none"
                    />
                ))}
                {/* 绘制当前正在绘制的路径 */}
                {currentPath.current && (
                    <Path
                        d={currentPath.current}
                        stroke="black"
                        strokeWidth={3}
                        fill="none"
                    />
                )}
            </Svg>
        </View>
    );
});

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    signatureArea: {
        flex: 1,
        borderWidth: 1,
        borderColor: 'gray',
    },
    buttonContainer: {
        alignItems: 'center',
        padding: 10,
    },
    clearButton: {
        backgroundColor: 'red',
        padding: 10,
        borderRadius: 5,
    },
});

export default SignaturePad;