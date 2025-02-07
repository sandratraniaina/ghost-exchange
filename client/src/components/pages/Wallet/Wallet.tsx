import { useState, useEffect } from 'react';
import CryptoBalance from "./CryptoBalance";
import { getUserWallet } from '@/api/wallet';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';

interface CryptoData {
    symbol: string;
    balance: number;
    currentPrice: number;
}

export const Wallet = () => {
    const [cryptoData, setCryptoData] = useState<CryptoData[]>([]);
    const [loading, setLoading] = useState(true);

    const { user } = useAuth();
    const { toast } = useToast();

    useEffect(() => {
        const fetchWalletData = async () => {
            const response = await getUserWallet(parseInt(user.id));

            if (!response?.success) {
                toast({
                    title: "Error",
                    description: "Failed to fetch wallet. Please check your connection and try again.",
                    variant: "destructive",
                });
                return;
            }

            setCryptoData(response);
        };

        setLoading(true);
        fetchWalletData();
        setLoading(false);
    }, [user.id, toast]);

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4">
            {cryptoData.map((crypto) => (
                <CryptoBalance
                    key={crypto.symbol}
                    symbol={crypto.symbol}
                    balance={crypto.balance}
                    currentPrice={crypto.currentPrice}
                />
            ))}
        </div>
    );
}