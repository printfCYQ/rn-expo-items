import { Stack } from 'expo-router';
import { lockAsync, OrientationLock } from 'expo-screen-orientation';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import DateDisplay from './components/DateDisplay';
import FlipClock from './components/FlipClock';

const TurningClock = () => {
    useEffect(() => {
        const setLandscape = async () => {
            await lockAsync(OrientationLock.LANDSCAPE_LEFT);
        };
        setLandscape();

        return () => {
            const restorePortrait = async () => {
                await lockAsync(OrientationLock.PORTRAIT_UP);
            };
            restorePortrait();
        };
    }, []);

    return (
        <>
            <Stack.Screen options={{ headerShown: false }} />
            <StatusBar hidden />
            <View style={styles.container}>
                <DateDisplay></DateDisplay>
                {/* CYQ-fixme 动画和显示逻辑有问题 */}
                <FlipClock></FlipClock>
            </View>
        </>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'black',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: -50
    }
});

export default TurningClock;