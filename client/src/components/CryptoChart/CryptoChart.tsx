import React, { useState, useEffect } from "react";
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface PriceData {
  date: string;
  price: number;
  volume: number;
}

interface CryptoOption {
  id: string;
  name: string;
  symbol: string;
  basePrice: number;
  baseVolume: number;
}

interface ChartDataConfig extends ChartConfig {
  price: {
    label: string;
    color: string;
  };
  volume: {
    label: string;
    color: string;
  };
}

type TimeRange = "90d" | "30d" | "7d";

// Simulated API call for crypto options
const fetchCryptoOptions = async (): Promise<CryptoOption[]> => {
  await new Promise(resolve => setTimeout(resolve, 300));
  
  return [
    { id: "bitcoin", name: "Bitcoin", symbol: "BTC", basePrice: 52000, baseVolume: 28000 },
    { id: "ethereum", name: "Ethereum", symbol: "ETH", basePrice: 3000, baseVolume: 15000 },
    { id: "solana", name: "Solana", symbol: "SOL", basePrice: 120, baseVolume: 8000 },
  ];
};

// Simulated API call for price data
const fetchCryptoData = async (cryptoId: string, timeRange: TimeRange): Promise<PriceData[]> => {
  await new Promise(resolve => setTimeout(resolve, 500));

  const options = await fetchCryptoOptions();
  const crypto = options.find(c => c.id === cryptoId);
  if (!crypto) throw new Error("Cryptocurrency not found");

  const data: PriceData[] = [];
  const endDate = new Date();
  const daysToGenerate = timeRange === "90d" ? 90 : timeRange === "30d" ? 30 : 7;
  
  let basePrice = crypto.basePrice;
  let baseVolume = crypto.baseVolume;

  for (let i = daysToGenerate; i >= 0; i--) {
    const date = new Date(endDate);
    date.setDate(date.getDate() - i);
    
    const randomPrice = basePrice * (1 + (Math.random() - 0.5) * 0.02);
    const randomVolume = baseVolume * (1 + (Math.random() - 0.5) * 0.1);
    
    data.push({
      date: date.toISOString().split('T')[0],
      price: Math.round(randomPrice),
      volume: Math.round(randomVolume)
    });

    basePrice *= (1 + (Math.random() - 0.5) * 0.01);
    baseVolume *= (1 + (Math.random() - 0.5) * 0.01);
  }

  return data;
};

const chartConfig: ChartDataConfig = {
  price: {
    label: "Price",
    color: "hsl(var(--chart-1))"
  },
  volume: {
    label: "Volume",
    color: "hsl(var(--chart-2))"
  }
};

const CryptoChart: React.FC = () => {
  const [timeRange, setTimeRange] = useState<TimeRange>("90d");
  const [selectedCryptoId, setSelectedCryptoId] = useState<string>("bitcoin");
  const [chartData, setChartData] = useState<PriceData[]>([]);
  const [cryptoOptions, setCryptoOptions] = useState<CryptoOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingOptions, setLoadingOptions] = useState(true);

  // Fetch crypto options on component mount
  useEffect(() => {
    const loadOptions = async () => {
      try {
        const options = await fetchCryptoOptions();
        setCryptoOptions(options);
      } catch (error) {
        console.error('Error fetching crypto options:', error);
      } finally {
        setLoadingOptions(false);
      }
    };

    loadOptions();
  }, []);

  // Fetch price data when selection changes
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const data = await fetchCryptoData(selectedCryptoId, timeRange);
        setChartData(data);
      } catch (error) {
        console.error('Error fetching price data:', error);
      } finally {
        setLoading(false);
      }
    };

    if (!loadingOptions) {
      loadData();
    }
  }, [timeRange, selectedCryptoId, loadingOptions]);

  const selectedCrypto = cryptoOptions.find(c => c.id === selectedCryptoId);

  const handleTimeRangeChange = (value: string) => {
    setTimeRange(value as TimeRange);
  };

  const handleCryptoChange = (value: string) => {
    setSelectedCryptoId(value);
  };

  const formatYAxis = (value: number) => {
    if (value >= 1000) {
      return `$${(value / 1000).toFixed(1)}k`;
    }
    return `$${value}`;
  };

  return (
    <Card>
      <CardHeader className="flex items-center gap-2 space-y-0 border-b py-5 sm:flex-row">
        <div className="grid flex-1 gap-1 text-center sm:text-left">
          <CardTitle>Cryptocurrency Price Chart</CardTitle>
          
          <CardDescription>
            {selectedCrypto ? `Showing price and volume data for ${selectedCrypto.name} (${selectedCrypto.symbol})` : 'Loading...'}
          </CardDescription>
        </div>
        
        <div className="flex gap-2">
          <Select value={selectedCryptoId} onValueChange={handleCryptoChange} disabled={loadingOptions}>
            <SelectTrigger className="w-[120px] rounded-lg">
              <SelectValue placeholder={loadingOptions ? "Loading..." : "Select Crypto"} />
            </SelectTrigger>
            
            <SelectContent className="rounded-xl">
              {cryptoOptions.map((crypto) => (
                <SelectItem key={crypto.id} value={crypto.id} className="rounded-lg">
                  {crypto.name} ({crypto.symbol})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={timeRange} onValueChange={handleTimeRangeChange}>
            <SelectTrigger className="w-[160px] rounded-lg">
              <SelectValue placeholder="Last 3 months" />
            </SelectTrigger>

            <SelectContent className="rounded-xl">
              <SelectItem value="90d" className="rounded-lg">Last 3 months</SelectItem>
              <SelectItem value="30d" className="rounded-lg">Last 30 days</SelectItem>
              <SelectItem value="7d" className="rounded-lg">Last 7 days</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>

      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        {loading || loadingOptions ? (
          <div className="flex h-[250px] items-center justify-center">
            Loading...
          </div>
        ) : (
          <ChartContainer
            config={chartConfig}
            className="aspect-auto h-[250px] w-full"
          >
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="fillVolume" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--color-volume)" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="var(--color-volume)" stopOpacity={0.1} />
                </linearGradient>
              </defs>
              
              <CartesianGrid vertical={false} />
              
              <XAxis
                dataKey="date"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                minTickGap={32}
                tickFormatter={(value: string) => {
                  const date = new Date(value);
                  return date.toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                  });
                }}
              />

              <YAxis
                yAxisId="price"
                orientation="right"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                tickFormatter={formatYAxis}
                domain={['auto', 'auto']}
              />
              
              <ChartTooltip
                cursor={false}
                content={
                  <ChartTooltipContent
                    labelFormatter={(value: string) => {
                      return new Date(value).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                      });
                    }}
                  />
                }
              />
              
              <Area
                dataKey="volume"
                type="natural"
                fill="url(#fillVolume)"
                stroke="var(--color-volume)"
                yAxisId="price"
              />
              
              <ChartLegend content={<ChartLegendContent />} />
            </AreaChart>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  );
};

export default CryptoChart;