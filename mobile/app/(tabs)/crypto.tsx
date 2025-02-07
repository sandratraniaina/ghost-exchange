import React, { useState } from 'react';
import { XStack, YStack, Text, ScrollView, Card } from 'tamagui';

interface CryptoItem {
    id: string;
    name: string;
    symbol: string;
    isFavorite: boolean;
}

export default function CryptoPage() {
    const [cryptos, setCryptos] = useState<CryptoItem[]>(
        Array(10).fill(null).map((_, index) => ({
            id: `btc-${index}`,
            name: 'Bitcoin',
            symbol: `BTC-${index}`,
            isFavorite: false,
        }))
    );

    const toggleFavorite = (id: string) => {
        setCryptos(prevCryptos => {
            const updatedCryptos = prevCryptos.map(crypto =>
                crypto.id === id ? { ...crypto, isFavorite: !crypto.isFavorite } : crypto
            );

            return [...updatedCryptos].sort((a, b) => {
                if (a.isFavorite === b.isFavorite) return 0;
                return a.isFavorite ? -1 : 1;
            });
        });
    };

    return (
        <YStack flex={1} backgroundColor="white">
            <Text
                fontSize={20}
                fontWeight="600"
                paddingVertical={16}
                paddingHorizontal={16}
            >
                Favorite crypto
            </Text>

            <ScrollView>
                {/* <XStack flexWrap="wrap" padding={8} flex={1} gap={10}> */}
                <XStack padding={8} gap={10} flex={1} flexWrap={"wrap"} justifyContent='center'>
                    {cryptos.map((crypto) => (
                        <Card
                            key={crypto.id}
                            onPress={() => toggleFavorite(crypto.id)}
                            animation="slow"
                            pressStyle={{ scale: 0.95 }}
                            elevate
                            bordered
                            size="$4"
                            width="fit-content"
                            padding={8}
                        >
                            <Card.Background>
                                <YStack
                                    borderRadius={8}
                                    padding={16}
                                    backgroundColor={crypto.isFavorite ? '#ebbe41' : 'white'}
                                    flex={1}
                                />
                            </Card.Background>

                            <Card.Footer padded>
                                <YStack>
                                    <Text
                                        fontSize={14}
                                        marginBottom={4}
                                    >
                                        {crypto.name}
                                    </Text>
                                    <Text
                                        fontSize={18}
                                        fontWeight="900"
                                    >
                                        {crypto.symbol}
                                    </Text>
                                </YStack>
                            </Card.Footer>
                        </Card>
                    ))}
                </XStack>
            </ScrollView>
        </YStack>
    );
}