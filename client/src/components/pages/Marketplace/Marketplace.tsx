import { useState } from 'react';
import SellOrder from './SellOrder';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';

interface SellOrderData {
    id: number;
    username: string;
    avatarUrl: string;
    volume: number;
    price: number;
    cryptoName: string;
    cryptoSymbol: string;
}

const mockSellOrders: SellOrderData[] = [
    {
        id: 1,
        username: 'John Doe',
        avatarUrl: 'https://randomuser.me/api/portraits/men/1.jpg',
        volume: 16.5,
        price: 15.0,
        cryptoName: 'Bitcoin',
        cryptoSymbol: 'BTC',
    },
    {
        id: 2,
        username: 'Jane Smith',
        avatarUrl: 'https://randomuser.me/api/portraits/women/2.jpg',
        volume: 8.2,
        price: 25.0,
        cryptoName: 'Ethereum',
        cryptoSymbol: 'ETH',
    },
    {
        id: 3,
        username: 'Alice Johnson',
        avatarUrl: 'https://randomuser.me/api/portraits/women/3.jpg',
        volume: 5.0,
        price: 40.0,
        cryptoName: 'Litecoin',
        cryptoSymbol: 'LTC',
    },
    {
        id: 4,
        username: 'Bob Williams',
        avatarUrl: 'https://randomuser.me/api/portraits/men/4.jpg',
        volume: 12.0,
        price: 20.0,
        cryptoName: 'Bitcoin',
        cryptoSymbol: 'BTC',
    },
];

export const Marketplace = () => {
    // Set default value to "all" instead of an empty string.
    const [selectedCrypto, setSelectedCrypto] = useState<string>('all');

    // Filter orders: if "all" is selected, show all orders.
    const filteredSellOrders =
        selectedCrypto === 'all'
            ? mockSellOrders
            : mockSellOrders.filter((order) => order.cryptoSymbol === selectedCrypto);

    // Get unique crypto symbols for the dropdown options
    const cryptoOptions = Array.from(
        new Set(mockSellOrders.map((order) => order.cryptoSymbol))
    );

    return (
        <div className="p-4 space-y-4">
            {/* Cryptocurrency Filter */}
            <div className="max-w-xs">
                <Select onValueChange={setSelectedCrypto} value={selectedCrypto}>
                    <SelectTrigger className="w-full">
                        <SelectValue placeholder="Filter by cryptocurrency" />
                    </SelectTrigger>
                    <SelectContent>
                        {/* Option for "All" cryptocurrencies */}
                        <SelectItem value="all">All</SelectItem>
                        {cryptoOptions.map((symbol) => (
                            <SelectItem key={symbol} value={symbol}>
                                {symbol}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>

            {/* Sell Orders Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {filteredSellOrders.length > 0 ? (
                    filteredSellOrders.map((order) => (
                        <SellOrder
                            key={order.id}
                            username={order.username}
                            avatarUrl={order.avatarUrl}
                            volume={order.volume}
                            price={order.price}
                            cryptoName={order.cryptoName}
                            cryptoSymbol={order.cryptoSymbol}
                            handleBuy={() => console.log(`Buying from ${order.username}`)}
                        />
                    ))
                ) : (
                    <p className="text-muted-foreground text-center col-span-full">
                        No sell orders available.
                    </p>
                )}
            </div>
        </div>
    );
};
