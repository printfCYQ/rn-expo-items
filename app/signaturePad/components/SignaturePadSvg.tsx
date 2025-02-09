import React, { forwardRef, useImperativeHandle, useRef, useState } from 'react';
import { GestureResponderEvent, StyleSheet, View } from 'react-native';
import Svg, { Path } from 'react-native-svg';

export interface SignaturePadRef {
    clearSignature: () => void;
}

const SignaturePad = forwardRef<SignaturePadRef, {}>((props, ref) => {
    // 存储所有绘制的路径
    const [paths, setPaths] = useState<string[]>([]);
    // 存储当前正在绘制的路径
    const currentPath = useRef('');

    const handleTouchStart = (event: GestureResponderEvent) => {
        const { locationX, locationY } = event.nativeEvent;
        currentPath.current = `M${locationX},${locationY}`;
    };

    const handleTouchMove = (event: GestureResponderEvent) => {
        const { locationX, locationY } = event.nativeEvent;

        // 更新当前路径
        currentPath.current += ` L${locationX},${locationY}`;
        setPaths((prevPaths) => [...prevPaths, currentPath.current]);
    };

    const handleTouchEnd = () => {
        if (currentPath.current) {
            setPaths((prevPaths) => [...prevPaths, currentPath.current]);
            currentPath.current = '';
        }
    };

    // 清空签字板的函数
    const clearSignature = () => {
        setPaths([]);
        currentPath.current = '';
    };

    useImperativeHandle(ref, () => ({
        clearSignature
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