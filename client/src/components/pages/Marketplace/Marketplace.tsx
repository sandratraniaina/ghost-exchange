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
import { buyCrypto, fetchSellOrders } from '@/api/sellOrder';
import { useAuth } from '@/hooks/useAuth';

interface CryptoOption {
    id: number;
    name: string;
    symbol: string;
    fiatPrice: number;
    firestoreCollectionName: string;
}

interface SellOrder {
    id: number;
    seller: {
        id: number;
        fiatBalance: number;
        username: string;
        email: string;
        accountRole: string;
        firestoreCollectionName: string;
    };
    cryptocurrency: {
        id: number;
        name: string;
        symbol: string;
        fiatPrice: number;
        firestoreCollectionName: string;
    };
    amount: number;
    fiatPrice: number;
    timestamp: string;
    isOpen: boolean;
    firestoreCollectionName: string;
}

export const Marketplace = () => {
    const [cryptoOptions, setCryptoOptions] = useState<CryptoOption[]>([]);
    const [sellOrders, setSellOrders] = useState<SellOrder[]>([]);
    const [selectedCrypto, setSelectedCrypto] = useState<string>('all');
    const [loadingOptions, setLoadingOptions] = useState(true);
    const [isLoading, setIsLoading] = useState<boolean[]>([]);

    const { user } = useAuth();
    const { toast } = useToast();

    const handleBuy = async (sellOrderId: number, buyerId: number, sellOrderIndex: number) => {
        try {
            setIsLoading(prevLoading => {
                const newLoading = [...prevLoading];
                newLoading[sellOrderIndex] = true;
                return newLoading;
            });

            const response = await buyCrypto(sellOrderId, buyerId);

            if (response?.status != 200) {
                throw new Error;
            } else if (response?.status == 200 && !response?.success) {
                toast({
                    title: "Denied",
                    description: "Operation denied. You have insufficient balance.",
                    className: "bg-yellow-500 text-black",
                });
            } else {
                toast({
                    title: "Success",
                    description: "Cryptocurrency bought successfully!",
                    className: "bg-green-600 text-white"
                });
            }
        } catch {
            toast({
                title: "Error",
                description: "Failed to buy cryptocurrency. Please check your connection and try again.",
                variant: "destructive",
            });
        } finally {
            setIsLoading(prevLoading => {
                const newLoading = [...prevLoading];
                newLoading[sellOrderIndex] = false;
                return newLoading;
            });
        }
    }

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
        const loadSellOrders = async () => {
            const options = await fetchSellOrders();

            if (!options?.success) {
                toast({
                    title: "Error",
                    description: "Failed to fetch sell orders. Please check your connection and try again.",
                    variant: "destructive",
                });
                return;
            }

            setSellOrders(options.data);

            // Preserve existing isLoading state if it exists and matches the new data length
            if (isLoading.length === options.data.length) {
                return; // Do nothing, keep the current isLoading state
            }

            // Otherwise, reset isLoading to match the new data
            setIsLoading(Array(options.data.length).fill(false));
        };

        loadSellOrders();
    });

    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const cryptoParam = urlParams.get('crypto');

        if (cryptoParam) {
            const selectedCryptosFromUrl = cryptoParam.split(',');

            if (selectedCryptosFromUrl.length === 1) {
                setSelectedCrypto(selectedCryptosFromUrl[0].toUpperCase());
            } else {
                setSelectedCrypto('all');
            }

        } else {
            setSelectedCrypto('all');
        }
    }, []);

    const filteredSellOrders =
        selectedCrypto === 'all'
            ? sellOrders
            : sellOrders.filter((order: SellOrder) => order.cryptocurrency.symbol === selectedCrypto);

    return (
        <div className="p-4 space-y-4">
            <div className="max-w-xs">
                <Select value={selectedCrypto} onValueChange={setSelectedCrypto} disabled={loadingOptions}>
                    <SelectTrigger className="w-[120px] rounded-lg">
                        <SelectValue placeholder={loadingOptions ? "Loading..." : "Filter by cryptocurrency"} />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl">
                        <SelectItem value="all">All</SelectItem>
                        {cryptoOptions.map((crypto) => (
                            <SelectItem key={crypto.id} value={crypto.symbol} className="rounded-lg">
                                {crypto.name} ({crypto.symbol})
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {filteredSellOrders.length > 0 ? (
                    filteredSellOrders.map((order, index) => (
                        <SellOrder
                            key={order.id}
                            username={order.seller.username}
                            avatarUrl={"https://randomuser.me/api/portraits/men/1.jpg"}
                            volume={order.amount}
                            price={order.fiatPrice}
                            cryptoName={order.cryptocurrency.name}
                            cryptoSymbol={order.cryptocurrency.symbol}
                            canBuy={order.fiatPrice <= user.fiatBalance}
                            isLoading={isLoading[index]}
                            handleBuy={() => handleBuy(order.id, parseInt(user.id), index)}
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