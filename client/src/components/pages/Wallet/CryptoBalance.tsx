import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Skeleton } from "@/components/ui/skeleton";
import { sellCrypto } from '@/api/crypto';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

interface CryptoData {
  id: number,
  symbol: string,
  balance: number,
  currentPrice: number
}

interface CryptoBalanceProps {
  crypto: CryptoData;
  isLoading: boolean;
}

const CryptoBalance: React.FC<CryptoBalanceProps> = ({ crypto, isLoading }) => {
  const [sellVolume, setSellVolume] = useState<number>(0);
  const [loading, setLoading] = useState(false);
  const isVolumeValid = sellVolume >= 0 && sellVolume <= crypto.balance;

  const { user } = useAuth();
  const { toast } = useToast();

  const handleBuy = () => {
    window.location.href = `/marketplace?${crypto.symbol.toLowerCase()}`;
  };

  const handleSell = async () => {
    setLoading(true);
    const response = await sellCrypto(parseInt(user.id), crypto.id, crypto.currentPrice, sellVolume);

    if (!response?.success) {
      toast({
        title: "Error",
        description: "Failed to complete sell operation. Please check your connection and try again.",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Success",
        description: "Cryptocurrency sold successfully!",
        className: "bg-green-600 text-white"
      });
    }

    setSellVolume(0);
    setLoading(false);
  }

  return (
    <Card className="w-full h-full">
      <CardHeader>
        <CardTitle>{isLoading ? <Skeleton className="h-6 w-24" /> : `${crypto.symbol} Balance`}</CardTitle>
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
              {crypto.balance} {crypto.symbol}
            </div>

            <div className="text-sm text-muted-foreground">
              Total Value: MGA{(crypto.balance * crypto.currentPrice).toFixed(2)}
            </div>

            <div className="flex space-x-4">
              <Button onClick={handleBuy} className="w-full">BUY</Button>

              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="secondary" className="w-full">SELL</Button>
                </DialogTrigger>

                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Sell {crypto.symbol}</DialogTitle>
                  </DialogHeader>

                  <div className="space-y-4">
                    <div>
                      <Label>Volume</Label>
                      <Input
                        type="number"
                        step="any"
                        value={sellVolume}
                        min={0}
                        max={crypto.balance}
                        onChange={(e) => setSellVolume(Number(e.target.value))}
                        placeholder={`Max: ${crypto.balance} ${crypto.symbol}`}
                        className="[&:invalid]:border-red-500 [&:invalid]:text-red-600 [&:invalid]:ring-red-500 [&:invalid]:focus-visible:ring-red-500 [&:invalid]:focus-visible:border-red-500"
                      />
                    </div>

                    <div>
                      <Label>Current Price</Label>
                      <Input
                        type="text"
                        value={`MGA${crypto.currentPrice.toFixed(2)}`}
                        readOnly
                      />
                    </div>

                    <div>
                      <Label>Total Value</Label>
                      <Input
                        type="text"
                        value={`MGA${(sellVolume * crypto.currentPrice).toFixed(2)}`}
                        readOnly
                      />
                    </div>

                    <Button onClick={() => { handleSell() }} className="w-full" disabled={!isVolumeValid}>
                      {loading && (
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
                      <span className={cn(loading && "opacity-0")}>
                        Confirm Sell
                      </span>
                    </Button>
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