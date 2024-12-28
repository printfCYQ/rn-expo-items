import { BarcodeScanningResult, CameraType, CameraView, PermissionStatus, useCameraPermissions } from 'expo-camera';
import { Stack, useRouter } from 'expo-router';
import { useState } from 'react';
import { Alert, Linking, SafeAreaView, StyleSheet, View } from 'react-native';
import Overlay from './components/Overlay';

export default function App() {
    const [facing, setFacing] = useState<CameraType>('back');
    const [enableTorch, setEnableTorch] = useState<boolean>(false);
    const [permission, requestPermission] = useCameraPermissions();
    const router = useRouter();

    if (permission?.granted) {
        // 已授权
    } else {
        if (permission?.status === PermissionStatus.UNDETERMINED) {
            // 用户尚未授予或拒绝权限
            requestPermission();
        } else if (permission?.status === PermissionStatus.DENIED) {
            // 用户拒绝了权限
            Alert.alert(
                '权限不足',
                '您已拒绝相机权限，如需使用该功能，请在应用设置中开启。',
                [
                    {
                        text: '取消',
                        style: 'cancel',
                        onPress: () => {
                            router.back()
                        }
                    },
                    {
                        text: '前往设置',
                        onPress: async () => {
                            const res = await Linking.openSettings();
                            if (Boolean(res)) {
                                requestPermission();
                            }
                        }
                    }
                ]
            );
        }
        return <View></View>
    }

    const toggleCameraFacing = () => {
        setFacing(current => (current === 'back' ? 'front' : 'back'));
    }

    const toggleEnableTorch = () => {
        setEnableTorch(current => !current); // 切换手电筒状态
    }

    const onBarcodeScanned = ({ data }: BarcodeScanningResult) => {
        console.log('onBarcodeScanned', data)
    }

    return (
        <>
            <Stack.Screen options={{ headerShown: false }} />
            {/* {Platform.OS === "android" ? <StatusBar hidden /> : null} */}
            <SafeAreaView style={[styles.container, StyleSheet.absoluteFillObject]}>
                <CameraView
                    style={[styles.camera, StyleSheet.absoluteFillObject]}
                    facing={facing}
                    enableTorch={enableTorch}
                    onBarcodeScanned={onBarcodeScanned}
                />
                <Overlay
                    toggleCameraFacing={toggleCameraFacing}
                    toggleEnableTorch={toggleEnableTorch}
                    enableTorch={enableTorch}
                />
            </SafeAreaView>
        </>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        backgroundColor: 'transparent'
    },
    message: {
        textAlign: 'center',
        paddingBottom: 10,
    },
    camera: {
        flex: 1,
        backgroundColor: 'transparent'
    },
});