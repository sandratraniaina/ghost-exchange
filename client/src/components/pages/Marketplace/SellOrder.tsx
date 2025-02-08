import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';

interface CryptoCardProps {
    avatarUrl: string;
    username: string;
    cryptoName: string;
    cryptoSymbol: string;
    volume: number;
    price: number;
    canBuy: boolean;
    isLoading: boolean;
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
    isLoading,
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
                    {isLoading && (
                        <svg
                            className="animate-spin h-5 w-5 text-white absolute"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                        >
                            <circle
                                className="opacity-25"
                                cx="12"
                                cy="12"
                                r="10"
                                stroke="currentColor"
                                strokeWidth="4"
                            />
                            <path
                                className="opacity-75"
                                fill="currentColor"
                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c3.042 0 5.61 2.185 6.291 5.291l.33 1.005A8.002 8.002 0 0112 20v-2.001c.47-.001.933-.017 1.404-.052A8.005 8.005 0 0120 12a8 8 0 01-8-8V4a8 8 0 01-7.995 7.995L12 17.291z"
                            />
                        </svg>
                    )}
                    <span className={cn(isLoading && "opacity-0")}>
                        BUY
                    </span>
                </Button>
            </CardContent>
        </Card>
    );
};

export default SellOrder;