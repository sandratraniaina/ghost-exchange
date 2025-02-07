import React from 'react';
import { LayoutChangeEvent } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import { Card, YStack, Text } from 'tamagui';

// Sample data for the chart
const chartData = {
    labels: ['6h', '1h', '0.5h'],
    datasets: [
        {
            data: [65, 35, 45, 55, 65, 45, 55],
            color: (opacity = 1) => `rgba(255, 0, 0, ${opacity})`,
            strokeWidth: 2
        },
        {
            data: [45, 65, 40, 50, 45, 55, 50],
            color: (opacity = 1) => `rgba(0, 188, 212, ${opacity})`,
            strokeWidth: 2
        }
    ]
};

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

    const onLayout = (event: LayoutChangeEvent) => {
        const { width } = event.nativeEvent.layout;
        setContainerWidth(width);
    };

    return (
        <Card elevate size="$4" bordered marginBottom="$4">
            <YStack padding="$4" onLayout={onLayout}>
                <Text fontSize="$6" fontWeight="bold" marginBottom="$4">
                    Real time crypto currency
                </Text>
                {containerWidth > 0 && (
                    <LineChart
                        data={chartData}
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
            </YStack>

        </Card>
    );
};