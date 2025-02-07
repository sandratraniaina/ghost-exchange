import React from 'react';
import { Card, XStack, YStack, Text } from 'tamagui';

const WalletCard = ({ balance = "0.5 BTC", totalValue = "$1000" }) => {
    return (
        <Card elevate size="$4" bordered marginBottom="$2">
            <XStack padding="$4" justifyContent="space-between">
                <YStack>
                    <Text fontSize="$3">BTC balance</Text>
                    <Text fontSize="$6" fontWeight="bold">{balance}</Text>
                </YStack>
                <YStack alignItems="flex-end">
                    <Text fontSize="$3">Total value</Text>
                    <Text fontSize="$5">{totalValue}</Text>
                </YStack>
            </XStack>
        </Card>
    );
};

export const CryptoWallet = () => {
    const wallets = [
        { balance: "0.5 BTC", totalValue: "$1000" },
        { balance: "0.5 BTC", totalValue: "$1000" },
        { balance: "0.5 BTC", totalValue: "$1000" },
        { balance: "0.5 BTC", totalValue: "$1000" }
    ];

    return (
        <YStack marginTop="$4">
            <Text fontSize="$6" fontWeight="bold" marginBottom="$4">
                Currency wallet
            </Text>
            {wallets.map((wallet, index) => (
                <WalletCard
                    key={index + ''}
                    balance={wallet.balance}
                    totalValue={wallet.totalValue}
                />
            ))}
        </YStack>
    );
};
