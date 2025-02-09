import React, { useEffect, useState } from 'react';
import { LayoutChangeEvent } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import { Card, YStack, Text, XStack, Checkbox, Label, Spinner } from 'tamagui';
import { CryptoService, Cryptocurrency, XeHistory } from '../api/cryptoHistory';

const chartConfig = {
    backgroundGradientFrom: '#ffffff',
    backgroundGradientTo: '#ffffff',
    decimalPlaces: 2,
    color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
    style: {
        borderRadius: 16
    }
};

interface CryptoWithColor extends Cryptocurrency {
    color: string;
}

export const CryptoChart = () => {
    const [containerWidth, setContainerWidth] = useState(0);
    const [cryptocurrencies, setCryptocurrencies] = useState<CryptoWithColor[]>([]);
    const [selectedCryptos, setSelectedCryptos] = useState<Set<number>>(new Set());
    const [historyData, setHistoryData] = useState<Record<number, XeHistory[]>>({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Fetch available cryptocurrencies
    useEffect(() => {
        const fetchCryptos = async () => {
            try {
                const cryptos = await CryptoService.getAllCryptocurrencies();
                const cryptosWithColors = cryptos.map(crypto => ({
                    ...crypto,
                    color: CryptoService.generateRandomColor()
                }));
                setCryptocurrencies(cryptosWithColors);

                // Select first crypto by default
                if (cryptos.length > 0) {
                    setSelectedCryptos(new Set([cryptos[0].id]));
                }
            } catch (err) {
                setError('Failed to fetch cryptocurrencies');
                console.error(err);
            }
        };
        fetchCryptos();
    }, []);

    // Fetch history data for selected cryptocurrencies
    useEffect(() => {
        const fetchHistory = async () => {
            setLoading(true);
            try {
                const historyPromises = Array.from(selectedCryptos).map(cryptoId =>
                    CryptoService.getLatestHistoryForCrypto(cryptoId)
                );
                const histories = await Promise.all(historyPromises);

                const newHistoryData: Record<number, XeHistory[]> = {};
                Array.from(selectedCryptos).forEach((cryptoId, index) => {
                    newHistoryData[cryptoId] = histories[index];
                });

                setHistoryData(newHistoryData);
                setError(null);
            } catch (err) {
                setError('Failed to fetch history data');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        if (selectedCryptos.size > 0) {
            fetchHistory();
        }
    }, [selectedCryptos]);

    const onLayout = (event: LayoutChangeEvent) => {
        const { width } = event.nativeEvent.layout;
        setContainerWidth(width);
    };

    const toggleCrypto = (cryptoId: number) => {
        const newSelected = new Set(selectedCryptos);
        if (newSelected.has(cryptoId)) {
            if (newSelected.size > 1) {
                newSelected.delete(cryptoId);
            }
        } else {
            newSelected.add(cryptoId);
        }
        setSelectedCryptos(newSelected);
    };

    const getChartData = () => {
        const datasets = Array.from(selectedCryptos).map(cryptoId => {
            const crypto = cryptocurrencies.find(c => c.id === cryptoId);
            const history = historyData[cryptoId] || [];
            const set = history.map(h => parseFloat(h.fiatPrice)).reverse();
            return {
                data: set,
                color: (opacity = 1) => `${crypto?.color}${Math.round(opacity * 255).toString(16).padStart(2, '0')}`,
                strokeWidth: 2
            };
        });

        const labels = historyData[Array.from(selectedCryptos)[0]]?.map(h =>
            new Date(h.timestamp).toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit'
            })
        ).reverse() || [];
        // const labels = ["5min", "10mn", "15mn"];

        return { labels, datasets};
    };

    if (loading && cryptocurrencies.length === 0) {
        return (
            <Card elevate size="$4" bordered marginBottom="$4">
                <YStack padding="$4" alignItems="center" justifyContent="center" height={300}>
                    <Spinner size="large" />
                    <Text marginTop="$4">Loading cryptocurrencies...</Text>
                </YStack>
            </Card>
        );
    }

    return (
        <Card elevate size="$4" bordered marginBottom="$4">
            <YStack padding="$4" onLayout={onLayout}>
                <Text fontSize="$6" fontWeight="bold" marginBottom="$4">
                    Real-time Cryptocurrency Prices
                </Text>

                {error && (
                    <Text color="$red10" marginBottom="$4">{error}</Text>
                )}

                {containerWidth > 0 && selectedCryptos.size > 0 && !loading && (
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

                {loading && selectedCryptos.size > 0 && (
                    <YStack alignItems="center" padding="$4">
                        <Spinner size="small" />
                        <Text marginTop="$2">Updating chart...</Text>
                    </YStack>
                )}

                <XStack flexWrap="wrap" gap="$4" marginBottom="$4">
                    {cryptocurrencies.map((crypto) => (
                        <XStack
                            key={crypto.id}
                            alignItems="center"
                            gap="$2"
                        >
                            <Checkbox
                                id={crypto.id.toString()}
                                checked={selectedCryptos.has(crypto.id)}
                                onCheckedChange={() => toggleCrypto(crypto.id)}
                                backgroundColor={selectedCryptos.has(crypto.id) ? crypto.color : undefined}
                            >
                                <Checkbox.Indicator>
                                    <Text color={selectedCryptos.has(crypto.id) ? 'white' : undefined}>
                                        ✓
                                    </Text>
                                </Checkbox.Indicator>
                            </Checkbox>
                            <Label htmlFor={crypto.id.toString()} paddingLeft="$2">
                                {crypto.name}
                            </Label>
                        </XStack>
                    ))}
                </XStack>
            </YStack>
        </Card>
    );
};