import React, { useState } from 'react';
import { Dimensions, Text, View } from 'react-native';
import { PanGestureHandler, State } from 'react-native-gesture-handler';

const { width, height } = Dimensions.get('window');

interface DraggableButtonProps {
    top?: number;
    left?: number;
    bottom?: number;
    right?: number;
    children: JSX.Element
}

// TODO 定位有点问题
const DraggableButton = ({ top, left, bottom, right, children }: DraggableButtonProps) => {
    const initialX = left !== undefined ? left : (right !== undefined ? width - right - 100 : 0);
    const initialY = top !== undefined ? top : (bottom !== undefined ? height - bottom - 100 : 0);

    const [position, setPosition] = useState({ x: initialX, y: initialY });
    const [offset, setOffset] = useState({ x: initialX, y: initialY });

    const onGestureEvent = (event: any) => {
        const { translationX, translationY } = event.nativeEvent;
        setPosition({
            x: offset.x + translationX,
            y: offset.y + translationY
        });
    };

    const onHandlerStateChange = (event: any) => {
        if (event.nativeEvent.state === State.END) {
            const { translationX, translationY } = event.nativeEvent;
            const newX = Math.max(0, Math.min(offset.x + translationX, width - 100));
            const newY = Math.max(0, Math.min(offset.y + translationY, height - 100));
            setOffset({ x: newX, y: newY });
            setPosition({ x: newX, y: newY });
        }
    };

    return (
        <PanGestureHandler
            onGestureEvent={onGestureEvent}
            onHandlerStateChange={onHandlerStateChange}
        >
            <View
                style={[
                    {
                        position: 'absolute',
                    },
                    {
                        left: position.x,
                        top: position.y,
                    },
                ]}
            >
                {children}
            </View>
        </PanGestureHandler>
    );
};

const App = () => {
    return (
        <View style={{ backgroundColor: 'red', flex: 1, position: 'relative' }}>
            <DraggableButton
                top={50}
                left={50}
                children={
                    <View style={{
                        width: 100,
                        height: 100,
                        borderRadius: 100,
                        backgroundColor: 'green',
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}>
                        <Text style={{ color: 'white' }}>Top Left</Text>
                    </View>
                }
            />
            <DraggableButton
                bottom={150}
                right={50}
                children={
                    <View style={{
                        width: 100,
                        height: 100,
                        borderRadius: 100,
                        backgroundColor: 'green',
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}>
                        <Text style={{ color: 'white' }}>Bottom Right</Text>
                    </View>
                }
            />
        </View>
    );
};

export default App;