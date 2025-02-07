import React, { useState, useEffect } from "react";
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";
import { fetchCryptoOptions } from "@/api/crypto";

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
}

interface CryptoOption {
  id: string;
  name: string;
  symbol: string;
  fiatPrice: number;
  firestoreCollectionName: string;
}

interface ChartDataConfig extends ChartConfig {
  price: {
    label: string;
    color: string;
  };
}

type TimeRange = "15m" | "10m" | "5m";

// Simulated API call for price data (modified to handle minutes)
const fetchCryptoData = async (cryptoId: string, timeRange: TimeRange): Promise<PriceData[]> => {
  await new Promise(resolve => setTimeout(resolve, 500));

  const options = await fetchCryptoOptions();
  const crypto = options.find((c: CryptoOption) => c.id.toString() === cryptoId); // Type added to parameter 'c'
  if (!crypto) throw new Error("Cryptocurrency not found");

  const data: PriceData[] = [];
  const endDate = new Date();

  let minutesToGenerate;
  if (timeRange === "15m") {
    minutesToGenerate = 15;
  } else if (timeRange === "10m") {
    minutesToGenerate = 10;
  } else {
    minutesToGenerate = 5;
  }

  let basePrice = crypto.fiatPrice;

  for (let i = minutesToGenerate; i >= 0; i--) {
    const date = new Date(endDate);
    date.setMinutes(date.getMinutes() - i); // Use setMinutes

    const randomPrice = basePrice * (1 + (Math.random() - 0.5) * 0.02);

    data.push({
      date: date.toISOString().split('T')[0] + " " + date.toTimeString().slice(0, 5), // Include time
      price: Math.round(randomPrice)
    });

    basePrice *= (1 + (Math.random() - 0.5) * 0.01);
  }

  return data;
};

const chartConfig: ChartDataConfig = {
  price: {
    label: "Price",
    color: "hsl(var(--chart-1))"
  }
};

const CryptoChart: React.FC = () => {
  const [timeRange, setTimeRange] = useState<TimeRange>("15m"); // Default to 15m
  const [selectedCryptoId, setSelectedCryptoId] = useState<string>("1");
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

  const selectedCrypto = cryptoOptions.find(c => c.id.toString() === selectedCryptoId);

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
  }

  return (
    <Card>
      <CardHeader className="flex items-center gap-2 space-y-0 border-b py-5 sm:flex-row">
        <div className="grid flex-1 gap-1 text-center sm:text-left">
          <CardTitle>Cryptocurrency Price Chart</CardTitle>

          <CardDescription>
            {selectedCrypto ? `Showing price data for ${selectedCrypto.name} (${selectedCrypto.symbol})` : 'Loading...'}
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
              <SelectValue placeholder="Last 15 minutes" /> {/* Updated placeholder */}
            </SelectTrigger>

            <SelectContent className="rounded-xl">
              <SelectItem value="15m" className="rounded-lg">Last 15 minutes</SelectItem> {/* Updated values and labels */}
              <SelectItem value="10m" className="rounded-lg">Last 10 minutes</SelectItem>
              <SelectItem value="5m" className="rounded-lg">Last 5 minutes</SelectItem>
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
              <CartesianGrid vertical={false} />

              <XAxis
                dataKey="date"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                minTickGap={32}
                tickFormatter={(value: string) => {
                  const date = new Date(value);
                  return date.toLocaleTimeString("en-US", { // Format as time
                    hour: "2-digit",
                    minute: "2-digit",
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
                      return new Date(value).toLocaleTimeString("en-US", { // Format as time
                        hour: "2-digit",
                        minute: "2-digit",
                      });
                    }}
                  />
                }
              />

              <Area
                dataKey="price"
                type="natural"
                stroke="var(--color-price)"
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