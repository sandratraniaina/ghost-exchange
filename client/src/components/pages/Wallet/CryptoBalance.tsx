import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Skeleton } from "@/components/ui/skeleton";


interface CryptoBalanceProps {
  symbol: string;
  balance: number;
  currentPrice: number;
  isLoading: boolean;
}

const CryptoBalance: React.FC<CryptoBalanceProps> = ({ symbol, balance, currentPrice, isLoading }) => {
  const [sellVolume, setSellVolume] = useState<number>(0);

  const handleBuy = () => {
    window.location.href = `/marketplace?${symbol.toLowerCase()}`;
  };

  return (
    <Card className="w-full h-full">
      <CardHeader>
        <CardTitle>{isLoading ? <Skeleton className="h-6 w-24" /> : `${symbol} Balance`}</CardTitle>
      </CardHeader>

      <CardContent>
        {isLoading ? (
          <div className="flex flex-col space-y-4">
            <Skeleton className="h-8 w-32" />
            <Skeleton className="h-6 w-48" />
            <div className="flex space-x-4">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
            </div>
          </div>
        ) : (
          <div className="flex flex-col space-y-4">
            <div className="text-2xl font-bold">
              {balance} {symbol}
            </div>

            <div className="text-sm text-muted-foreground">
              Total Value: ${(balance * currentPrice).toFixed(2)}
            </div>

            <div className="flex space-x-4">
              <Button onClick={handleBuy} className="w-full">BUY</Button>

              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="secondary" className="w-full">SELL</Button>
                </DialogTrigger>

                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Sell {symbol}</DialogTitle>
                  </DialogHeader>

                  <div className="space-y-4">
                    <div>
                      <Label>Volume</Label>
                      <Input
                        type="number"
                        value={sellVolume}
                        max={balance}
                        onChange={(e) => setSellVolume(Number(e.target.value))}
                        placeholder={`Max: ${balance} ${symbol}`}
                      />
                    </div>

                    <div>
                      <Label>Current Price</Label>
                      <Input
                        type="text"
                        value={`$${currentPrice.toFixed(2)}`}
                        readOnly
                      />
                    </div>

                    <div>
                      <Label>Total Value</Label>
                      <Input
                        type="text"
                        value={`$${(sellVolume * currentPrice).toFixed(2)}`}
                        readOnly
                      />
                    </div>

                    <Button className="w-full">Confirm Sell</Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default CryptoBalance;