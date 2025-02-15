import { CryptoChart } from '@/components/CryptoChart';
import { CryptoWallet } from '@/components/CryptoWallet';
import React from 'react';
import { ScrollView } from 'react-native';
import { YStack } from 'tamagui';

// Main App Component
const CryptoApp = () => {
    return (
        <ScrollView style={{ flex: 1 }}>
            <YStack padding="$4" gap="$4">
                <CryptoChart />
                <CryptoWallet />
            </YStack>
        </ScrollView>
    );
};

export default CryptoApp;