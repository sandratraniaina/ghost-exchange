import React from 'react';
import { LayoutChangeEvent } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import { Card, YStack, Text, XStack, Checkbox, Label } from 'tamagui';

// Define cryptocurrency data structure
type CryptoData = {
    id: string;
    name: string;
    data: {
        labels: string[];
        values: number[];
        color: string;
    };
};

// Sample data for different cryptocurrencies
const cryptoData: CryptoData[] = [
    {
        id: 'btc',
        name: 'Bitcoin',
        data: {
            labels: ['6h', '1h', '0.5h'],
            values: [65, 35, 45, 55, 65, 45, 55],
            color: '#f7931a', // Bitcoin orange
        },
    },
    {
        id: 'eth',
        name: 'Ethereum',
        data: {
            labels: ['6h', '1h', '0.5h'],
            values: [45, 65, 40, 50, 45, 55, 50],
            color: '#4e8bf1', // Ethereum blue
        },
    },
    {
        id: 'sol',
        name: 'Solana',
        data: {
            labels: ['6h', '1h', '0.5h'],
            values: [40, 55, 35, 45, 50, 60, 45],
            color: '#14f195', // Solana green
        },
    },
];

const chartConfig = {
    backgroundGradientFrom: '#ffffff',
    backgroundGradientTo: '#ffffff',
    decimalPlaces: 0,
    color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
    style: {
        borderRadius: 16
    }
};

export const CryptoChart = () => {
    const [containerWidth, setContainerWidth] = React.useState(0);
    const [selectedCryptos, setSelectedCryptos] = React.useState<Set<string>>(
        new Set([cryptoData[0].id]) // Initially select first crypto
    );

    const onLayout = (event: LayoutChangeEvent) => {
        const { width } = event.nativeEvent.layout;
        setContainerWidth(width);
    };

    const toggleCrypto = (cryptoId: string) => {
        const newSelected = new Set(selectedCryptos);
        if (newSelected.has(cryptoId)) {
            newSelected.delete(cryptoId);
        } else {
            newSelected.add(cryptoId);
        }
        // Ensure at least one crypto is selected
        if (newSelected.size > 0) {
            setSelectedCryptos(newSelected);
        }
    };

    const getChartData = () => {
        return {
            labels: cryptoData[0].data.labels,
            datasets: cryptoData
                .filter(crypto => selectedCryptos.has(crypto.id))
                .map(crypto => ({
                    data: crypto.data.values,
                    color: (opacity = 1) => `${crypto.data.color}${Math.round(opacity * 255).toString(16).padStart(2, '0')}`,
                    strokeWidth: 2
                }))
        };
    };

    return (
        <Card elevate size="$4" bordered marginBottom="$4">
            <YStack padding="$4" onLayout={onLayout}>
                <Text fontSize="$6" fontWeight="bold" marginBottom="$4">
                    Real time crypto currency
                </Text>

                {containerWidth > 0 && selectedCryptos.size > 0 && (
                    <LineChart
                        data={getChartData()}
                        width={containerWidth - 32}
                        height={220}
                        chartConfig={chartConfig}
                        bezier
                        style={{
                            marginVertical: 8,
                            borderRadius: 16
                        }}
                    />
                )}

                <XStack flexWrap="wrap" gap="$4" marginBottom="$4">
                    {cryptoData.map((crypto) => (
                        <XStack
                            key={crypto.id}
                            alignItems="center"
                            gap="$2"
                        >
                            <Checkbox
                                id={crypto.id}
                                checked={selectedCryptos.has(crypto.id)}
                                onCheckedChange={() => toggleCrypto(crypto.id)}
                                backgroundColor={selectedCryptos.has(crypto.id) ? crypto.data.color : undefined}
                            >
                                <Checkbox.Indicator>
                                    <Text color={selectedCryptos.has(crypto.id) ? 'white' : undefined}>
                                        ✓
                                    </Text>
                                </Checkbox.Indicator>
                            </Checkbox>
                            <Label htmlFor={crypto.id} paddingLeft="$2">
                                {crypto.name}
                            </Label>
                        </XStack>
                    ))}
                </XStack>
            </YStack>
        </Card>
    );
};