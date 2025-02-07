import React, { useState } from 'react';
import {
    YStack,
    Text,
    Input,
    Button,
    XStack,
    RadioGroup,
    Label,
    styled
} from 'tamagui';

const FormCard = styled(YStack, {
    backgroundColor: 'white',
    padding: 16,
    margin: 16,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4
})

interface TransactionFormPropsType {
    onSubmit: ({}) => void;
}

export const FiatTransactionForm: React.FC<TransactionFormPropsType> = ({ onSubmit }) => {
    const [amount, setAmount] = useState('');
    const [type, setType] = useState('deposit');

    const handleSubmit = () => {
        onSubmit({
            amount: parseFloat(amount),
            type
        });
        setAmount('');
    };

    return (
        <FormCard gap="$4">
            <Text fontSize={18} fontWeight="bold">Fiat Transaction</Text>

            <YStack gap="$2">
                <Text fontSize={14}>Amount</Text>
                <Input
                    value={amount}
                    onChangeText={setAmount}
                    keyboardType="numeric"
                    placeholder="Enter amount"
                />
            </YStack>

            <YStack gap="$2">
                <Text fontSize={14}>Transaction type</Text>
                <RadioGroup
                    value={type}
                    onValueChange={setType}
                >
                    <XStack gap="$4">
                        <XStack alignItems="center" gap="$2">
                            <RadioGroup.Item value="deposit" id="deposit">
                                <RadioGroup.Indicator />
                            </RadioGroup.Item>
                            <Label htmlFor="deposit">Deposit</Label>
                        </XStack>

                        <XStack alignItems="center" gap="$2">
                            <RadioGroup.Item value="withdraw" id="withdraw">
                                <RadioGroup.Indicator />
                            </RadioGroup.Item>
                            <Label htmlFor="withdraw">Withdraw</Label>
                        </XStack>
                    </XStack>
                </RadioGroup>
            </YStack>

            <Button
                backgroundColor="#1D88AF"
                color="white"
                onPress={handleSubmit}
            >
                Submit
            </Button>
        </FormCard>
    );
};
