import SellOrder from './SellOrder';

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
];

export const Marketplace = () => {
    // TODO: Replace mock data with API call in production
    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4">
            {mockSellOrders.map((order) => (
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
            ))}
        </div>
    );
};
