// import React, { forwardRef, useEffect, useImperativeHandle, useState } from 'react';
// import { Image, Modal, Text, View } from 'react-native';
// import { GestureHandlerRootView, PanGestureHandler, PinchGestureHandler, State, TapGestureHandler } from 'react-native-gesture-handler';
// import Animated, {
//     useAnimatedStyle,
//     useSharedValue,
//     withSpring,
//     withTiming,
// } from 'react-native-reanimated';
// import styles from '../styles/index';

// const ModalB = forwardRef((_, ref) => {
//     const [visible, setVisible] = useState(false);
//     const [index, setIndex] = useState(0);
//     const [urls, setUrls] = useState<string[]>([]);

//     const scale = useSharedValue(1);
//     const savedScale = useSharedValue(1);
//     const translateX = useSharedValue(0);

//     const handlePinchGesture = (event: any) => {
//         if (event.nativeEvent.state === State.ACTIVE) {
//             scale.value = savedScale.value * event.nativeEvent.scale;
//         } else if (event.nativeEvent.state === State.END) {
//             savedScale.value = scale.value;
//         }
//     };

//     const handlePanGesture = (event: any) => {
//         if (event.nativeEvent.state === State.ACTIVE) {
//             translateX.value = event.nativeEvent.translationX;
//         } else if (event.nativeEvent.state === State.END) {
//             const translationX = event.nativeEvent.translationX;
//             if (translationX > 20) {
//                 handlePrev();
//             } else if (translationX < -20) {
//                 handleNext();
//             } else {
//                 animateReset();
//             }
//         }
//     };

//     const animateReset = () => {
//         'worklet';
//         translateX.value = withSpring(0);
//         scale.value = withTiming(1);
//     };

//     const animatedStyle = useAnimatedStyle(() => ({
//         transform: [{ scale: scale.value }, { translateX: translateX.value }],
//     }));

//     useImperativeHandle(ref, () => ({
//         show: ({ index, urls }: { index: number; urls: string[] }) => {
//             setIndex(index);
//             setUrls(urls);
//             setVisible(true);
//         },
//         hide: () => setVisible(false),
//     }));

//     useEffect(() => {
//         return () => {
//             scale.value = 1;
//             savedScale.value = 1;
//             translateX.value = 0;
//         };
//     }, []);

//     const handleNext = () => {
//         if (scale.value > 1) return
//         setIndex((prevIndex) => (prevIndex + 1) % urls.length);
//         animateReset();
//     };

//     const handlePrev = () => {
//         if (scale.value > 1) return
//         setIndex((prevIndex) => (prevIndex - 1 + urls.length) % urls.length);
//         animateReset();
//     };

//     const handleTap = (event: any) => {
//         if (event.nativeEvent.state === State.END) {
//             setVisible(false);
//         }
//     };

//     return (
//         <Modal
//             transparent={true}
//             animationType="slide"
//             visible={visible}
//             onRequestClose={() => setVisible(false)}
//         >
//             <GestureHandlerRootView>
//                 <TapGestureHandler onHandlerStateChange={handleTap}>
//                     <View style={styles.modalOverlay}>
//                         <PanGestureHandler onGestureEvent={handlePanGesture} onHandlerStateChange={handlePanGesture}>
//                             <PinchGestureHandler onGestureEvent={handlePinchGesture} onHandlerStateChange={handlePinchGesture}>
//                                 <Animated.View style={[styles.modalContent, animatedStyle]}>
//                                     <Image
//                                         style={styles.image}
//                                         resizeMode="contain"
//                                         source={{ uri: urls[index] }}
//                                     />
//                                 </Animated.View>
//                             </PinchGestureHandler>
//                         </PanGestureHandler>
//                         <View style={styles.indexTextContainer}>
//                             <Text style={styles.indexText}>{index + 1} / {urls.length}</Text>
//                         </View>
//                     </View>
//                 </TapGestureHandler>
//             </GestureHandlerRootView>
//         </Modal>
//     );
// });

// export default ModalB;

import React, { forwardRef, useEffect, useImperativeHandle, useState } from 'react';
import { Image, Modal, Text, View } from 'react-native';
import { Gesture, GestureDetector, GestureHandlerRootView, State } from 'react-native-gesture-handler';
import Animated, {
    useAnimatedStyle,
    useSharedValue,
    withSpring,
    withTiming,
} from 'react-native-reanimated';
import styles from '../styles/index';

const ModalB = forwardRef((_, ref) => {
    const [visible, setVisible] = useState(false);
    const [index, setIndex] = useState(0);
    const [urls, setUrls] = useState<string[]>([]);

    const scale = useSharedValue(1);
    const savedScale = useSharedValue(1);
    const translateX = useSharedValue(0);
    const translateY = useSharedValue(0);
    const isDraggingInside = useSharedValue(false);

    // 捏合手势处理函数
    const handlePinchGesture = (event: any) => {
        // 当手势处于ACTIVE状态时，更新图片的缩放比例
        if (event.state === State.ACTIVE) {
            scale.value = savedScale.value * event.scale;
        }
        // 当手势结束时，保存当前的缩放比例
        else if (event.state === State.END) {
            savedScale.value = scale.value;
        }
    };

    // 平移手势处理函数
    const handlePanGesture = (event: any) => {
        // 当手势处于ACTIVE状态时
        if (event.state === State.ACTIVE) {
            // 如果图片已经放大，标记为正在图片内部拖动
            if (scale.value > 1) {
                isDraggingInside.value = true;
                // 更新图片在X轴和Y轴方向的平移量
                translateY.value = event.translationY;
            } else {
                translateX.value = event.translationX;
            }
        }
        // 当手势结束时
        else if (event.state === State.END) {
            // 如果图片没有放大，进行图片切换相关操作
            if (scale.value <= 1) {
                const translationX = event.translationX;
                // 如果平移距离大于20，切换到上一张图片
                if (translationX > 20) {
                    handlePrev();
                    animateReset();
                }
                // 如果平移距离小于 -20，切换到下一张图片
                else if (translationX < -20) {
                    handleNext();
                    animateReset();
                }
                // 否则，重置图片的位置和缩放
                else {
                    // animateReset();
                }
            }
        }
    };

    // 点击手势处理函数
    const handleTap = () => {
        console.log('handleTap');
        // 如果当前不在图片内部拖动且图片缩放比例为1，关闭模态框
        if (!isDraggingInside.value && scale.value === 1) {
            setVisible(false);
        }
    };

    // 双击手势处理函数 重置图片的位置和缩放
    const handleDoubleTap = () => {
        animateReset();
    };

    // 重置动画函数
    const animateReset = () => {
        'worklet';
        // 使用withSpring动画效果将图片在X轴方向的平移量重置为0
        translateX.value = withSpring(0);
        // 使用withSpring动画效果将图片在Y轴方向的平移量重置为0
        translateY.value = withSpring(0);
        // 使用withTiming动画效果将图片的缩放比例重置为1
        scale.value = withTiming(1);
    };

    // 创建动画样式
    const animatedStyle = useAnimatedStyle(() => ({
        transform: [
            { scale: scale.value },
            { translateX: translateX.value },
            { translateY: translateY.value },
        ],
    }));

    // 创建点击手势
    const tapGesture = Gesture.Tap().onEnd(handleTap).runOnJS(true);
    // 创建双击手势
    const doubleTapGesture = Gesture.Tap().numberOfTaps(2).onEnd(handleDoubleTap).runOnJS(true);
    // 创建平移手势，在手势更新和结束时调用handlePanGesture
    const panGesture = Gesture.Pan().onUpdate(handlePanGesture).onEnd(handlePanGesture).runOnJS(true);
    // 创建捏合手势，在手势更新和结束时调用handlePinchGesture
    const pinchGesture = Gesture.Pinch().onUpdate(handlePinchGesture).onEnd(handlePinchGesture).runOnJS(true);

    // 组合手势
    const combinedGesture = Gesture.Simultaneous(
        // 排他性组合双击手势和点击手势，即这两个手势不会同时触发
        Gesture.Exclusive(doubleTapGesture, tapGesture),
        panGesture,
        pinchGesture
    );

    useImperativeHandle(ref, () => ({
        show: ({ index, urls }: { index: number; urls: string[] }) => {
            setIndex(index);
            setUrls(urls);
            setVisible(true);
        },
        hide: () => setVisible(false),
    }));

    useEffect(() => {
        return () => {
            scale.value = 1;
            savedScale.value = 1;
            translateX.value = 0;
            translateY.value = 0;
            isDraggingInside.value = false;
        };
    }, []);

    const handleNext = () => {
        setIndex((prevIndex) => (prevIndex + 1) % urls.length);
    };

    const handlePrev = () => {
        setIndex((prevIndex) => (prevIndex - 1 + urls.length) % urls.length);
    };

    return (
        <Modal
            transparent={true}
            animationType="slide"
            visible={visible}
            onRequestClose={() => setVisible(false)}
        >
            <GestureHandlerRootView>
                <GestureDetector gesture={combinedGesture}>
                    <View style={styles.modalOverlay}>
                        <Animated.View style={[styles.modalContent, animatedStyle]}>
                            <Image
                                style={styles.image}
                                resizeMode="contain"
                                source={{ uri: urls[index] }}
                            />
                        </Animated.View>
                        <View style={styles.indexTextContainer}>
                            <Text style={styles.indexText}>{index + 1} / {urls.length}</Text>
                        </View>
                    </View>
                </GestureDetector>
            </GestureHandlerRootView>
        </Modal>
    );
});

export default ModalB;