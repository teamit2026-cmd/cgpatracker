import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

const HexonyxFooter = () => {
    const navigation = useNavigation();

    const handlePress = () => {
        navigation.navigate('About');
    };

    return (
        <TouchableOpacity onPress={handlePress} activeOpacity={0.7}>
            <View style={styles.footerContainer}>
                <Text style={styles.footerText}>Developed by</Text>
                <View style={styles.brandContainer}>
                    <Text style={styles.brandName}>Team </Text>
                    <Text style={[styles.brandName, styles.brandHighlight]}>Hexonyx</Text>
                    <MaterialIcons name="auto-awesome" size={14} color="#64b5f6" style={styles.brandIcon} />
                </View>
            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    footerContainer: {
        paddingHorizontal: 20,
        marginTop: 5,
        marginBottom: 15,
        alignItems: 'center',
        justifyContent: 'center',
    },
    footerText: {
        fontSize: 9,
        color: '#64748b',
        fontWeight: '600',
        letterSpacing: 1,
        textTransform: 'uppercase',
        marginBottom: 1,
    },
    brandContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    brandName: {
        fontSize: 14,
        fontWeight: '900',
        color: '#232867',
        letterSpacing: 0.5,
    },
    brandHighlight: {
        color: '#64b5f6',
    },
    brandIcon: {
        marginLeft: 4,
    },
});

export default HexonyxFooter;
