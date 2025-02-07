import { useEffect, useState } from 'react';
import SellOrder from './SellOrder';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { fetchCryptoOptions } from '@/api/crypto';
import { useToast } from '@/hooks/use-toast';

interface CryptoOption {
    id: number;
    name: string;
    symbol: string;
    fiatPrice: number;
    firestoreCollectionName: string;
}

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
    const [cryptoOptions, setCryptoOptions] = useState<CryptoOption[]>([]);
    const [loadingOptions, setLoadingOptions] = useState(true);
    const [selectedCrypto, setSelectedCrypto] = useState<string>('all');

    const { toast } = useToast();

    useEffect(() => {
        const loadOptions = async () => {
            const options = await fetchCryptoOptions();

            if (!options?.success) {
                toast({
                    title: "Error",
                    description: "Failed to fetch crypto options. Please check your connection and try again.",
                    variant: "destructive",
                });
                return;
            }

            setLoadingOptions(false);
            setCryptoOptions(options.data);
        };

        loadOptions();
    });

    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const cryptoParam = urlParams.get('crypto'); // Use get() to get the value

        if (cryptoParam) {
            const selectedCryptosFromUrl = cryptoParam.split(','); // Split by comma if multiple

            if (selectedCryptosFromUrl.length === 1) {
                setSelectedCrypto(selectedCryptosFromUrl[0].toUpperCase());
            } else {
                setSelectedCrypto('all');
            }

        } else {
            setSelectedCrypto('all');
        }
    }, []);

    // Filter orders: if "all" is selected, show all orders.
    const filteredSellOrders =
        selectedCrypto === 'all'
            ? mockSellOrders
            : mockSellOrders.filter((order) => order.cryptoSymbol === selectedCrypto);

    return (
        <div className="p-4 space-y-4">
            {/* Cryptocurrency Filter */}
            <div className="max-w-xs">
                <Select value={selectedCrypto} onValueChange={setSelectedCrypto} disabled={loadingOptions}>
                    <SelectTrigger className="w-[120px] rounded-lg">
                        <SelectValue placeholder={loadingOptions ? "Loading..." : "Filter by cryptocurrency"} />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl">
                        <SelectItem value="all">All</SelectItem>
                        {cryptoOptions.map((crypto) => (
                            <SelectItem key={crypto.id} value={crypto.id.toString()} className="rounded-lg">
                                {crypto.name} ({crypto.symbol})
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
