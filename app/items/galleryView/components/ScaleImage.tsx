import React, { useEffect } from 'react';
import { StyleSheet } from 'react-native';
import { Gesture, GestureDetector, GestureHandlerRootView } from 'react-native-gesture-handler';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';

interface Props {
  uri: string;
  minScale?: number;
  maxScale?: number;
}

const ScaleImage = ({
  uri,
  minScale = 0.8,
  maxScale = 3,
}: Props) => {
  const scaleImg = useSharedValue(1);
  const lastScale = useSharedValue(1);

  const pinchGesture = Gesture.Pinch()
    .onUpdate((e) => {
      let newScale = lastScale.value * e.scale;
      if (newScale < minScale) {
        newScale = minScale;
      } else if (newScale > maxScale) {
        newScale = maxScale;
      }
      scaleImg.value = newScale;
    })
    .onEnd(() => {
      lastScale.value = scaleImg.value;
    });

  const doubleTap = Gesture.Tap()
    .maxDuration(250)
    .numberOfTaps(2)
    .onStart(() => {
      scaleImg.value = withSpring(1);
      lastScale.value = withSpring(1);
    });

  const gesture = Gesture.Exclusive(doubleTap, pinchGesture);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: withSpring(scaleImg.value) }],
    };
  });

  useEffect(() => {
    scaleImg.value = withSpring(1);
    lastScale.value = withSpring(1);
  }, [uri]);

  return (
    <GestureHandlerRootView style={styles.container}>
      <GestureDetector gesture={gesture}>
        <Animated.Image
          source={{ uri }}
          style={[styles.image, animatedStyle]}
          resizeMode="contain"
        />
      </GestureDetector>
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#666',
  },
  image: {
    width: '100%',
    height: '100%',
  },
});

export default ScaleImage;