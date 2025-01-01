import React, { useEffect, useRef } from 'react';
import { Animated, Easing, StyleSheet, Text, View } from 'react-native';

interface Props {
    currentNumber?: string,
    nextNumber?: string,
    isRunning: boolean,
    duration: number
}

const FlipCard = ({ currentNumber, nextNumber, isRunning, duration }: Props) => {
    const frontAnimatedValue = useRef(new Animated.Value(0)).current;
    const backAnimatedValue = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        if (isRunning) {
            Animated.timing(frontAnimatedValue, {
                toValue: 1,
                duration: duration / 2,
                easing: Easing.linear,
                useNativeDriver: true,
            }).start(() => {
                frontAnimatedValue.setValue(0);
            });

            Animated.timing(backAnimatedValue, {
                toValue: 1,
                duration: duration / 2,
                easing: Easing.linear,
                useNativeDriver: true,
            }).start(() => {
                backAnimatedValue.setValue(0);
            });
        }
    });

    const frontInterpolate = frontAnimatedValue.interpolate({
        inputRange: [0, 1],
        outputRange: ['0deg', '180deg'],
    });

    const backInterpolate = backAnimatedValue.interpolate({
        inputRange: [0, 1],
        outputRange: ['180deg', '360deg'],
    });

    const frontStyle = {
        transform: [{ rotateX: frontInterpolate }],
    };

    const backStyle = {
        transform: [{ rotateX: backInterpolate }],
    };

    return (
        <View style={styles.flipCard}>
            <Animated.View style={[styles.flipCardInner, frontStyle]}>
                <View style={[styles.digital, styles.front]}>
                    <Text style={styles.digitalText}>{currentNumber}</Text>
                </View>
            </Animated.View>
            <Animated.View style={[styles.flipCardInner, styles.flipCardBack, backStyle]}>
                <View style={[styles.digital, styles.back]}>
                    <Text style={styles.digitalText}>{nextNumber}</Text>
                </View>
            </Animated.View>
        </View>
    );
};

const styles = StyleSheet.create({
    flipCard: {
        width: 70,
        height: 140,
        margin: 1,
        position: 'relative',
    },
    flipCardInner: {
        width: '100%',
        height: '100%',
        position: 'absolute',
        backfaceVisibility: 'hidden',
    },
    flipCardBack: {
        transform: [{ rotateX: '180deg' }],
    },
    digital: {
        width: '100%',
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#151515',
        color: '#BBBBBB',
    },
    digitalText: {
        color: '#BBBBBB',
        fontSize: 100,
    },
    front: {
        // backgroundColor: 'red'
    },
    back: {
        // backgroundColor: "green"
    }
});

export default FlipCard;