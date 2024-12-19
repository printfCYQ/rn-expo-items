import BottomSheet, { BottomSheetView } from "@gorhom/bottom-sheet";
import { useNavigation } from "expo-router";
import React, { useCallback, useLayoutEffect, useMemo, useRef } from "react";
import { Button, StyleSheet, Text } from "react-native";
import { GestureHandlerRootView } from 'react-native-gesture-handler';

const BottomSheetViewCom = () => {
  const navigation = useNavigation();

  useLayoutEffect(() => {
    navigation.setOptions({
      title: 'BottomSheetView'
    });
  }, [navigation]);
  // hooks
  const sheetRef = useRef<BottomSheet>(null);

  // variables
  const snapPoints = useMemo(() => ["25%", "50%", "90%"], []);

  // callbacks
  const handleSheetChange = useCallback((index: number) => {
    console.log("handleSheetChange", index);
  }, []);
  const handleSnapPress = useCallback((index: number) => {
    sheetRef.current?.snapToIndex(index);
  }, []);
  const handleClosePress = useCallback(() => {
    sheetRef.current?.close();
  }, []);

  // render
  return (
    <GestureHandlerRootView style={styles.container}>
      <Button title="Snap To 90%" onPress={() => handleSnapPress(2)} />
      <Button title="Snap To 50%" onPress={() => handleSnapPress(1)} />
      <Button title="Snap To 25%" onPress={() => handleSnapPress(0)} />
      <Button title="Close" onPress={() => handleClosePress()} />
      <BottomSheet
        ref={sheetRef}
        snapPoints={snapPoints}
        enableDynamicSizing={false}
        onChange={handleSheetChange}
      >
        <BottomSheetView style={styles.contentContainer}>
          <Text>Awesome 🔥</Text>
        </BottomSheetView>
      </BottomSheet>
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 200,
  },
  contentContainer: {
    flex: 1,
    padding: 36,
    alignItems: 'center',
  },
});

export default BottomSheetViewCom;