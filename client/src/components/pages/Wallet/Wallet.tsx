import { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import CryptoBalance from "./CryptoBalance";
import { getUserWallet } from '@/api/wallet';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';

interface CryptoData {
    id: number;
    symbol: string;
    balance: number;
    currentPrice: number;
}

interface WalletItem {
    id: number;
    user: {
        id: number;
        fiatBalance: number;
        username: string;
        email: string;
        accountRole: string;
    };
    cryptocurrency: {
        id: number;
        name: string;
        symbol: string;
        fiatPrice: number;
    };
    balance: number;
}

export const Wallet = () => {
    const [cryptoData, setCryptoData] = useState<CryptoData[]>(Array(5).fill({
        symbol: "",
        balance: 0,
        currentPrice: 0,
    }));
    const [loading, setLoading] = useState(true);
    const [refetchTrigger, setRefetchTrigger] = useState(0);

    const { user } = useAuth();
    const { toast } = useToast();

    useEffect(() => {
        const fetchWalletData = async () => {
            setLoading(true);
            const response = await getUserWallet(parseInt("1"));

            if (!response?.success) {
                toast({
                    title: "Error",
                    description: "Failed to fetch wallet. Please check your connection and try again.",
                    variant: "destructive",
                });
                return;
            }

            // Remap the response to CryptoData[]
            const mappedData: CryptoData[] = response.data.map((item: WalletItem) => ({
                id: item.cryptocurrency.id,
                symbol: item.cryptocurrency.symbol,
                balance: item.balance,
                currentPrice: item.cryptocurrency.fiatPrice,
            }));

            setCryptoData(mappedData);
            setLoading(false);
        };

        fetchWalletData();
    }, [user?.id, toast, refetchTrigger]);

    const handleSellSuccess = () => {
        setRefetchTrigger(prev => prev + 1);
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4">
            {
                cryptoData.map((crypto) => (
                    <CryptoBalance
                        key={crypto.symbol || uuidv4()}
                        crypto={crypto}
                        isLoading={loading}
                        onSellSuccess={handleSellSuccess}
                    />
                ))
            }
        </div>
    );
}