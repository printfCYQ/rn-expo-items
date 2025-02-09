import React, { useRef } from 'react';
import { GestureResponderEvent, StyleSheet, TouchableWithoutFeedback, View } from 'react-native';

const BoxExample = () => {
    const smallBoxRef = useRef<View>(null);

    const handlePress = (event: GestureResponderEvent) => {
        const nativeEvent = event.nativeEvent;
        const { pageX, pageY } = nativeEvent;

        smallBoxRef.current?.measure((fx, fy, width, height, px, py) => {
            console.log('smallBoxRef', fx, fy, width, height, px, py, pageX, pageY);
            if (
                pageX > px &&
                pageX < px + width &&
                pageY > py &&
                pageY < py + height) {
                console.log('小盒子内部');
            }
        });
    };

    return (
        <TouchableWithoutFeedback onPress={handlePress}>
            <View style={styles.bigBox}>
                <View ref={smallBoxRef} style={styles.smallBox} />
            </View>
        </TouchableWithoutFeedback>
    );
};

const styles = StyleSheet.create({
    bigBox: {
        width: 300,
        height: 300,
        backgroundColor: 'lightblue',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 50
    },
    smallBox: {
        width: 100,
        height: 100,
        backgroundColor: 'lightgreen'
    },
    infoText: {
        marginTop: 20,
        fontSize: 18
    }
});

export default BoxExample;