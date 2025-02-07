import React, { useState, useEffect } from "react";
import { TrendingUp } from "lucide-react";
import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts";
import { fetchCryptoOptions } from "@/api/crypto";
import { fetchCryptoHistory } from "@/api/cryptoGraph";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent
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
}

interface CryptoOption {
  id: number;
  name: string;
  symbol: string;
  fiatPrice: number;
  firestoreCollectionName: string;
}

interface HistoryData {
  id: number,
  cryptocurrency: CryptoOption,
  fiatPrice: number,
  timestamp: string,
  firestoreCollectionName: string
}

interface ChartDataConfig extends ChartConfig {
  price: {
    label: string;
    color: string;
  };
}

type TimeRange = "15m" | "10m" | "5m";

// Fetch historical price data
const fetchCryptoData = async (exchangeId: number): Promise<PriceData[]> => {
  const response = await fetchCryptoHistory(exchangeId);

  if (!response.success) throw new Error("Error fetching cryptocurrency history");

  return response.data.map((entry: HistoryData) => ({
    date: entry.timestamp,
    price: entry.fiatPrice,
  }));
};

const filterDataByTimeRange = (data: PriceData[], timeRange: TimeRange): PriceData[] => {
  const now = new Date();
  const timeRangeMap = {
    "5m": 5 * 60 * 1000,     // 5 minutes
    "10m": 10 * 60 * 1000,   // 10 minutes
    "15m": 15 * 60 * 1000    // 15 minutes
  };

  return data
    .filter((point) => {
      const pointTime = new Date(point.date);
      return (now.getTime() - pointTime.getTime()) <= timeRangeMap[timeRange];
    })
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
};

const CryptoChart: React.FC = () => {
  const [timeRange, setTimeRange] = useState<TimeRange>("15m");
  const [selectedCryptoId, setSelectedCryptoId] = useState<string>("1");
  const [chartData, setChartData] = useState<PriceData[]>([]);
  const [cryptoOptions, setCryptoOptions] = useState<CryptoOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingOptions, setLoadingOptions] = useState(true);
  const [priceChange, setPriceChange] = useState<number | null>(null);

  const chartConfig: ChartDataConfig = {
    price: {
      label: "Price",
      color: "hsl(232 47% 38%)"
    },
  };

  // Fetch crypto options on component mount
  useEffect(() => {
    const loadOptions = async () => {
      try {
        const options = await fetchCryptoOptions();
        setCryptoOptions(options.data);
      } catch (error) {
        console.error("Error fetching crypto options:", error);
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
        const data = await fetchCryptoData(parseInt(selectedCryptoId));
        const filteredData = filterDataByTimeRange(data, timeRange);
        setChartData(filteredData);

        // Calculate price change percentage using previous point
        if (filteredData.length >= 2) {
          const previousPrice = filteredData[filteredData.length - 2].price;
          const currentPrice = filteredData[filteredData.length - 1].price;
          const changePercentage = ((currentPrice - previousPrice) / previousPrice) * 100;
          setPriceChange(changePercentage);
        }
      } catch (error) {
        console.error("Error fetching price data:", error);
      } finally {
        setLoading(false);
      }
    };

    if (!loadingOptions) {
      loadData();
    }
  }, [timeRange, selectedCryptoId, loadingOptions]);

  // Fetch data every 10 seconds
  useEffect(() => {
    const intervalId = setInterval(async () => {
      try {
        const data = await fetchCryptoData(parseInt(selectedCryptoId));
        const filteredData = filterDataByTimeRange(data, timeRange);
        setChartData(filteredData);

        // Calculate price change percentage using previous point
        if (filteredData.length >= 2) {
          const previousPrice = filteredData[filteredData.length - 2].price;
          const currentPrice = filteredData[filteredData.length - 1].price;
          const changePercentage = ((currentPrice - previousPrice) / previousPrice) * 100;
          setPriceChange(changePercentage);
        }
      } catch (error) {
        console.error("Error fetching price data:", error);
      }
    }, 10000);

    return () => clearInterval(intervalId);
  }, [selectedCryptoId, timeRange]);

  const selectedCrypto = cryptoOptions.find((c) => c.id.toString() === selectedCryptoId);

  const handleTimeRangeChange = (value: string) => {
    setTimeRange(value as TimeRange);
  };

  const handleCryptoChange = (value: string) => {
    setSelectedCryptoId(value);
  };

  const formatYAxis = (value: number) => {
    if (value >= 1000) {
      return `Ar${(value / 1000).toFixed(1)}k`;
    }
    return `Ar${value}`;
  };

  return (
    <Card>
      <CardHeader className="flex items-center gap-2 space-y-0 border-b py-5 sm:flex-row">
        <div className="grid flex-1 gap-1 text-center sm:text-left">
          <CardTitle>Cryptocurrency Price Chart</CardTitle>
          <CardDescription>
            {selectedCrypto ? `Showing price data for ${selectedCrypto.name} (${selectedCrypto.symbol})` : "Loading..."}
          </CardDescription>
        </div>

        <div className="flex gap-2">
          <Select value={selectedCryptoId} onValueChange={handleCryptoChange} disabled={loadingOptions}>
            <SelectTrigger className="w-[120px] rounded-lg">
              <SelectValue placeholder={loadingOptions ? "Loading..." : "Select Crypto"} />
            </SelectTrigger>
            <SelectContent className="rounded-xl">
              {cryptoOptions.map((crypto) => (
                <SelectItem key={crypto.id} value={crypto.id.toString()} className="rounded-lg">
                  {crypto.name} ({crypto.symbol})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={timeRange} onValueChange={handleTimeRangeChange}>
            <SelectTrigger className="w-[160px] rounded-lg">
              <SelectValue placeholder="Last 15 minutes" />
            </SelectTrigger>
            <SelectContent className="rounded-xl">
              <SelectItem value="15m" className="rounded-lg">Last 15 minutes</SelectItem>
              <SelectItem value="10m" className="rounded-lg">Last 10 minutes</SelectItem>
              <SelectItem value="5m" className="rounded-lg">Last 5 minutes</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>

      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        {loading || loadingOptions ? (
          <div className="flex h-[250px] items-center justify-center">Loading...</div>
        ) : (
          <ChartContainer config={chartConfig} className="aspect-auto h-[250px] w-full">
            <LineChart
              accessibilityLayer
              data={chartData}
              margin={{
                left: 12,
                right: 12,
              }}
            >
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="date"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                minTickGap={32}
                tickFormatter={(value: string) => {
                  const date = new Date(value);
                  return date.toLocaleTimeString("en-US", {
                    hour: "2-digit",
                    minute: "2-digit",
                    second: "2-digit",
                  });
                }}
              />
              <YAxis
                orientation="right"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                tickFormatter={formatYAxis}
                domain={["dataMin - 10", "auto"]}
              />
              <ChartTooltip
                cursor={false}
                content={
                  <ChartTooltipContent
                    hideLabel
                    labelFormatter={(value: string) => {
                      return new Date(value).toLocaleTimeString("en-US", {
                        hour: "2-digit",
                        minute: "2-digit",
                        second: "2-digit",
                      });
                    }}
                  />
                }
              />
              <Line
                dataKey="price"
                type="linear"
                stroke="var(--color-price)"
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          </ChartContainer>
        )}
      </CardContent>

      <CardFooter className="flex-col items-start gap-2 text-sm">
        {priceChange !== null && (
          <div className="flex gap-2 font-medium leading-none">
            {priceChange >= 0 ? 'Trending up' : 'Trending down'} by {Math.abs(priceChange).toFixed(1)}%
            <TrendingUp className={`h-4 w-4 ${priceChange >= 0 ? 'text-green-500' : 'text-red-500'}`} />
          </div>
        )}
        <div className="leading-none text-muted-foreground">
          Showing trend based on the previous price data
        </div>
      </CardFooter>
    </Card>
  );
};

export default CryptoChart;