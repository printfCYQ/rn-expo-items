import { commonStyles } from '@/styles';
import * as Linking from 'expo-linking';
import React from 'react';
import { SafeAreaView, Text, TouchableOpacity } from 'react-native';

import { useRouter } from 'expo-router';

const App = () => {
    const router = useRouter();

    const onPress = () => {
        router.push('/items/scanner/scanner');
    };

    const goSetting = () => {
        Linking.openSettings();
    }

    return (
        <SafeAreaView style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
            <TouchableOpacity
                style={commonStyles.button}
                onPress={onPress}
            >
                <Text>Scan Code</Text>
            </TouchableOpacity>
            <TouchableOpacity
                style={[commonStyles.button, { marginTop: 10 }]}
                onPress={goSetting}
            >
                <Text>goSetting</Text>
            </TouchableOpacity>
        </SafeAreaView>
    );
};

export default App;