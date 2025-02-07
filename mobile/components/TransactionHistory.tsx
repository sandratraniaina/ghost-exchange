// TransactionHistory.tsx
import React from 'react';
import { ScrollView } from 'react-native';
import { Text, XStack, YStack, Stack, styled } from 'tamagui';

interface Transaction {
    type: 'BTC';
    action: 'buy' | 'sell';
    amount: number;
    value: number;
    date: string;
    fee: number;
}

const TransactionCard = styled(Stack, {
    borderRadius: 8,
    backgroundColor: 'white',
    padding: 16,
    marginVertical: 6,
    marginHorizontal: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
})

const TransactionItem = ({ transaction }: { transaction: Transaction }) => {
    return (
        <TransactionCard>
            <XStack justifyContent="space-between" alignItems="center">
                <YStack>
                    <XStack gap="$2" alignItems="center">
                        <Text fontSize={16} fontWeight="bold">{transaction.type}</Text>
                        <Text
                            fontSize={14}
                            color={transaction.action === 'buy' ? '#F01616' : '#16B6F0'}
                        >
                            {transaction.action} {transaction.amount}
                        </Text>
                    </XStack>
                    <Text fontSize={14} color="#919191">${transaction.value}</Text>
                </YStack>
                <YStack alignItems="flex-end">
                    <Text fontSize={12} color="#707070">{transaction.date}</Text>
                    <Text fontSize={14} color="#45D240">{transaction.fee}</Text>
                </YStack>
            </XStack>
        </TransactionCard>
    );
};

const TransactionHistory = () => {
    const transactions: Transaction[] = [
        {
            type: 'BTC',
            action: 'buy',
            amount: 0.01,
            value: 101,
            date: '2024-01-01: 12h16',
            fee: 1.01,
        },
        {
            type: 'BTC',
            action: 'sell',
            amount: 0.01,
            value: 101,
            date: '2024-01-01: 12h16',
            fee: 1.01,
        },
        {
            type: 'BTC',
            action: 'buy',
            amount: 0.01,
            value: 101,
            date: '2024-01-01: 12h16',
            fee: 1.01,
        },
        {
            type: 'BTC',
            action: 'sell',
            amount: 0.01,
            value: 101,
            date: '2024-01-01: 12h16',
            fee: 1.01,
        },
        {
            type: 'BTC',
            action: 'buy',
            amount: 0.01,
            value: 101,
            date: '2024-01-01: 12h16',
            fee: 1.01,
        },
        {
            type: 'BTC',
            action: 'sell',
            amount: 0.01,
            value: 101,
            date: '2024-01-01: 12h16',
            fee: 1.01,
        }
        // Add more transactions as needed
    ];

    return (
        <YStack flex={1}>
            <YStack padding="$4">
                <Text fontSize={24} fontWeight="bold" >
                    Crypto Transaction History
                </Text>
            </YStack>

            <ScrollView>
                {transactions.map((transaction, index) => (
                    <TransactionItem key={index + ""} transaction={transaction} />
                ))}
            </ScrollView>
        </YStack>
    );
};

export default TransactionHistory;