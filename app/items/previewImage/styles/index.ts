import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
    modalOverlay: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
    },
    modalContent: {
        width: '100%',
        height: '100%',
    },
    image: {
        width: '100%',
        height: '100%',
    },
    indexTextContainer: {
        position: 'absolute',
        bottom: 30,
    },
    indexText: {
        fontSize: 20,
        color: 'white',
    },
});

export default styles;