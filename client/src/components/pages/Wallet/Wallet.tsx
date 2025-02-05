import CryptoBalance from "./CryptoBalance"

export const Wallet = () => {
    // TODO: Fetch data from API
    const cryptoData = [
        { symbol: 'BTC', balance: 0.5, currentPrice: 50000 },
        { symbol: 'ETH', balance: 10, currentPrice: 3000 },
        { symbol: 'USDC', balance: 5000, currentPrice: 1 }
    ];

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