import AntDesign from '@expo/vector-icons/AntDesign';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { Canvas, DiffRect, rect, rrect } from "@shopify/react-native-skia";
import React from "react";
import { Dimensions, Platform, Pressable, StyleSheet, View } from "react-native";
interface Props {
  toggleCameraFacing: () => void;
  toggleEnableTorch: () => void;
  enableTorch: boolean;
}

const Overlay = ({ toggleCameraFacing, toggleEnableTorch, enableTorch }: Props) => {
  const { width, height } = Dimensions.get("window");

  const innerDimension = width * 0.75;

  const outer = rrect(rect(0, 0, width, height), 0, 0);
  const inner = rrect(
    rect(
      width / 2 - innerDimension / 2,
      (height / 2 - innerDimension / 2) / 2,
      innerDimension,
      innerDimension
    ),
    50,
    50
  );

  return (
    <View style={{ flex: 1 }}>
      <Canvas
        style={
          Platform.OS === "ios" ? StyleSheet.absoluteFillObject : { flex: 1 }
        }
      >
        <DiffRect inner={inner} outer={outer} color="black" opacity={0.7} />
      </Canvas>
      <View style={styles.buttonContainer}>
        <Pressable style={styles.button} onPress={toggleEnableTorch}>
          <MaterialIcons name={enableTorch ? "flashlight-on" : 'flashlight-off'} size={30} color="#EAEAEA" />
        </Pressable>
        <Pressable style={styles.button} onPress={toggleCameraFacing}>
          <AntDesign name="sync" size={30} color="#EAEAEA" />
        </Pressable>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  buttonContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 80,
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 10,
  },
  button: {
    backgroundColor: '#5F5F5F',
    borderRadius: 50,
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5, // For shadow on Android
    shadowColor: 'black', // For shadow on iOS
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
  }
});

export default Overlay;