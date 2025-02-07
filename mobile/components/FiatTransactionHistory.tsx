import { styled, YStack, Text, XStack, ScrollView } from "tamagui";

const TransactionItem = styled(YStack, {
    backgroundColor: 'white',
    padding: 16,
    marginHorizontal: 16,
    marginVertical: 6,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4
})

interface Transaction {
    type: string;
    amount: number;
    date: string;
}

export const FiatTransactionHistory = () => {
    const transactions: Transaction[] = [
        {
            type: 'Deposit',
            amount: 100,
            date: '2024-01-01: 12h16'
        },
        {
            type: 'Withdraw',
            amount: -100,
            date: '2024-01-01: 12h16'
        },
        // Add more transactions as needed
    ];

    const balance = 500;

    return (
        <YStack flex={1}>
            <YStack padding="$4" gap="$2">
                <Text fontSize={18} fontWeight={"bold"}>Fiat transaction history</Text>
                <Text fontSize={16}>
                    Balance: <Text fontWeight="bold">{balance}$</Text>
                </Text>
            </YStack>

            <ScrollView>
                {transactions.map((transaction, index) => (
                    <TransactionItem key={index+""}>
                        <XStack justifyContent="space-between" alignItems="center">
                            <Text fontSize={16}>{transaction.type}</Text>
                            <YStack alignItems="flex-end">
                                <Text fontSize={12} color="#707070">
                                    {transaction.date}
                                </Text>
                                <Text
                                    fontSize={16}
                                    color={transaction.amount > 0 ? '#16B6F0' : '#F01616'}
                                >
                                    {transaction.amount > 0 ? '+' : ''}{transaction.amount}$
                                </Text>
                            </YStack>
                        </XStack>
                    </TransactionItem>
                ))}
            </ScrollView>
        </YStack>
    );
};
