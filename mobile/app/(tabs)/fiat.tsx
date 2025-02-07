// FiatScreen.tsx
import { FiatTransactionForm } from '@/components/FiatTransactionForm';
import { FiatTransactionHistory } from '@/components/FiatTransactionHistory';
import React from 'react';
import { SafeAreaView } from 'react-native';
import { YStack } from 'tamagui';

const FiatScreen = () => {
    const handleTransactionSubmit = (transaction: {}) => {
        // Handle the transaction submission
        console.log('Transaction submitted:', transaction);
    };

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <YStack flex={1}>
                <FiatTransactionForm onSubmit={handleTransactionSubmit} />
                <FiatTransactionHistory />
            </YStack>
        </SafeAreaView>
    );
};

export default FiatScreen;