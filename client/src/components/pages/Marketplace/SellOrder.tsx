import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';

interface CryptoCardProps {
    avatarUrl: string;
    username: string;
    cryptoName: string;
    cryptoSymbol: string;
    volume: number;
    price: number;
    canBuy: boolean;
    handleBuy: () => void;
}

const SellOrder: React.FC<CryptoCardProps> = ({
    avatarUrl,
    username,
    cryptoName,
    cryptoSymbol,
    volume,
    price,
    canBuy,
    handleBuy,
}) => {
    return (
        <Card className="w-full h-full">
            <CardContent className="space-y-4 p-4">
                {/* User Profile */}
                <div className="flex items-center space-x-2">
                    <Avatar className="w-6 h-6">
                        <AvatarImage src={avatarUrl} alt={username} />
                        <AvatarFallback className="text-xs">{username.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <span className="text-xs text-muted-foreground">{username}</span>
                </div>

                {/* Muted Separator */}
                <Separator className="bg-muted" />

                {/* Cryptocurrency Information */}
                <div>
                    <div className="text-lg font-semibold">
                        {cryptoName}{' '}
                        <span className="text-muted-foreground text-sm">({cryptoSymbol})</span>
                    </div>
                    <div className="flex justify-between items-center mt-2">
                        <div>
                            <div className="text-sm text-muted-foreground">Volume</div>
                            <div className="font-bold">
                                {volume} {cryptoSymbol}
                            </div>
                        </div>
                        <div>
                            <div className="text-sm text-muted-foreground">Price</div>
                            <div className="font-bold">MGA{price.toFixed(2)}</div>
                        </div>
                    </div>
                </div>

                <Button onClick={handleBuy} className="w-full" disabled={!canBuy}>
                    BUY
                </Button>
            </CardContent>
        </Card>
    );
};

export default SellOrder;