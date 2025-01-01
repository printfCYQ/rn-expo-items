import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

const DateDisplay = () => {
    const [currentDate, setCurrentDate] = useState('');
    const [currentDay, setCurrentDay] = useState('');

    useEffect(() => {
        const updateDate = () => {
            const now = new Date();
            const dateStr = `${now.getFullYear()}年${String(now.getMonth() + 1).padStart(2, '0')}月${String(now.getDate()).padStart(2, '0')}日`;
            const daysOfWeek = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'];
            const dayStr = daysOfWeek[now.getDay()];
            setCurrentDate(dateStr);
            setCurrentDay(dayStr);
        };

        updateDate();
        const interval = setInterval(updateDate, 60000); // Update every minute

        return () => clearInterval(interval);
    }, []);

    return (
        <View style={styles.container}>
            <View style={styles.dateContainer}>
                <Text style={styles.dateText}>{currentDate}</Text>

            </View>
            <View style={styles.dayContainer}>
                <Text style={styles.dayText}>{currentDay}</Text>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginBottom: 30,
        flexDirection: 'row'
    },
    dateContainer: {
        backgroundColor: '#151515',
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 10,
        alignItems: 'center',
    },
    dayContainer: {
        backgroundColor: '#151515',
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 10,
        alignItems: 'center',
        marginLeft: 20
    },
    dateText: {
        fontSize: 30,
        color: '#BBBBBB',
    },
    dayText: {
        fontSize: 30,
        color: '#BBBBBB',
    },
});

export default DateDisplay;