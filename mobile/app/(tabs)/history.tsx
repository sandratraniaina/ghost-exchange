import TransactionHistory from '@/components/TransactionHistory';
import React from 'react';
import { SafeAreaView } from 'react-native';
import { Stack } from 'tamagui';

const HistoryScreen = () => {
    return (
        <SafeAreaView style={{ flex: 1 }}>
            <Stack flex={1}>
                <TransactionHistory />
            </Stack>
        </SafeAreaView>
    );
};

export default HistoryScreen;