import React, { useEffect, useRef, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import FlipCard from './FlipCard';

interface FlipCard {
    currentNumber?: string,
    nextNumber?: string | undefined,
    isRunning: boolean,
    key?: number
}

const FlipClock = () => {
    const [flipCards, setFlipCards] = useState<FlipCard[]>([]);
    const duration = 500;
    const intervalRef = useRef<NodeJS.Timeout | null>(null);

    const getTimeFromDate = (date: Date) => {
        return date.toTimeString().slice(0, 8).replace(/:/g, '');
    };

    const refreshTime = () => {
        const now = new Date();
        const nowTimeStr = getTimeFromDate(new Date(now.getTime() - 1000));
        const nextTimeStr = getTimeFromDate(now);
        return { nowTimeStr, nextTimeStr };
    };

    const updateFlipCards = () => {
        const { nowTimeStr, nextTimeStr } = refreshTime();
        setFlipCards((prevFlipCards) =>
            prevFlipCards.map((item, index) => {
                const isRunning = nextTimeStr[index] !== nowTimeStr[index]
                return {
                    key: isRunning ? (new Date().getTime() + index) : item.key,
                    isRunning,
                    currentNumber: nowTimeStr[index],
                    nextNumber: nextTimeStr[index]
                }
            })
        );
    };

    useEffect(() => {
        const { nowTimeStr, nextTimeStr } = refreshTime();
        setFlipCards(
            nowTimeStr.split('').map((num, index) => ({
                currentNumber: num,
                nextNumber: nextTimeStr[index],
                isRunning: false,
                key: new Date().getTime() + index
            }))
        );
        intervalRef.current = setInterval(updateFlipCards, 1000);
        return () => clearInterval(intervalRef.current as NodeJS.Timeout);
    }, []);

    return (
        <View style={styles.flipClock}>
            {flipCards.map((item, index) => (
                <View key={item.key} style={styles.flipCardWrapper}>
                    <FlipCard
                        currentNumber={item.currentNumber}
                        nextNumber={item.nextNumber}
                        isRunning={item.isRunning}
                        duration={duration}
                    />
                    {(index === 1 || index === 3) && <Text style={styles.divider}>:</Text>}
                </View>
            ))}
        </View>
    );
};

const styles = StyleSheet.create({
    flipClock: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#151515',
        borderRadius: 20,
        paddingHorizontal: 15
    },
    flipCardWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    divider: {
        fontSize: 100,
        marginHorizontal: 10,
        color: '#BBBBBB',
    },
});

export default FlipClock;