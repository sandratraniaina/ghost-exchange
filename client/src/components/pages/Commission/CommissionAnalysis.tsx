import { useEffect, useState } from 'react';
import { AlertTriangle, TrendingUp } from "lucide-react";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { CryptoOption, DateRange } from '../Analysis/Analysis';
import { fetchCryptoOptions } from '@/api/crypto';

type AnalysisType = 'sum' | 'average';

interface ChartDataItem {
  crypto: string;
  commission: number;
}

const analysisTypes = [
  { value: 'sum' as AnalysisType, label: 'Sum (Somme)' },
  { value: 'average' as AnalysisType, label: 'Average (Moyenne)' }
];

// Sample commission data in MGA
const chartData: ChartDataItem[] = [
  { crypto: 'Bitcoin', commission: 1250000 },
  { crypto: 'Ethereum', commission: 850000 },
  { crypto: 'Tether', commission: 120000 },
  { crypto: 'Binance Coin', commission: 450000 },
  { crypto: 'Solana', commission: 380000 },
  { crypto: 'Cardano', commission: 180000 },
  { crypto: 'XRP', commission: 220000 },
  { crypto: 'Polkadot', commission: 290000 },
  { crypto: 'Dogecoin', commission: 150000 },
  { crypto: 'Avalanche', commission: 320000 }
];

const formatMGA = (value: number) => {
  return value >= 1000000
    ? `${(value / 1000000).toFixed(1)}M`
    : `${(value / 1000).toFixed(0)}k`;
};

export const CommissionAnalysis = () => {
  const [selectedAnalysis, setSelectedAnalysis] = useState<AnalysisType | ''>('');
  const [selectedCrypto, setSelectedCrypto] = useState<string>('all');
  const [dateRange, setDateRange] = useState<DateRange>({ min: '', max: '' });
  const [cryptoOptions, setCryptoOptions] = useState<CryptoOption[]>([]);

  useEffect(() => {
    const loadOptions = async () => {
      const options = await fetchCryptoOptions();
      setCryptoOptions(options.data);
    };

    loadOptions();
  }, []);

  // Filter chart data based on selected cryptocurrency
  const filteredChartData = selectedCrypto === 'all'
    ? chartData
    : chartData.filter(item => item.crypto === selectedCrypto);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Left Column - Filters */}
      <div className="lg:col-span-1">
        <Card className="w-full h-full">
          <CardHeader>
            <CardTitle>Analysis Filters</CardTitle>
            <CardDescription>
              Configure your analysis parameters
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Analysis Type Select */}
            <div className="space-y-2">
              <Label>Analysis Type</Label>
              <Select onValueChange={(value: AnalysisType) => setSelectedAnalysis(value)} value={selectedAnalysis}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select analysis type" />
                </SelectTrigger>
                <SelectContent>
                  {analysisTypes.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Cryptocurrency Select */}
            <div className="space-y-2">
              <Label>Cryptocurrency</Label>
              <Select
                onValueChange={(value: string) => setSelectedCrypto(value)}
                value={selectedCrypto}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select cryptocurrency" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Cryptocurrencies</SelectItem>
                  {cryptoOptions.map((crypto: CryptoOption) => (
                    <SelectItem key={crypto.id} value={crypto.name}>
                      {crypto.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Date Range */}
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Start Date</Label>
                <input
                  type="datetime-local"
                  className="w-full rounded-md border p-2"
                  value={dateRange.min}
                  onChange={(e) => setDateRange({ ...dateRange, min: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>End Date</Label>
                <input
                  type="datetime-local"
                  className="w-full rounded-md border p-2"
                  value={dateRange.max}
                  onChange={(e) => setDateRange({ ...dateRange, max: e.target.value })}
                />
              </div>
            </div>

            {!(dateRange.min || dateRange.max) && (
              <div className="flex items-center space-x-2 bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4" role="alert">
                <AlertTriangle className="h-5 w-5" />
                <p>No date range was provided, displaying data within the last 24 hours.</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Right Column - Chart */}
      <div className="lg:col-span-2">
        <Card className="w-full h-full">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              Commission Earnings
            </CardTitle>
            <CardDescription>
              {selectedCrypto === 'all'
                ? "Total Commission Earnings (MGA) for all cryptocurrencies"
                : `Commission Earnings (MGA) for ${selectedCrypto}`}
            </CardDescription>
          </CardHeader>

          <CardContent>
            <div className="w-full h-[600px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={filteredChartData} margin={{ top: 20, right: 30, left: 35, bottom: 50 }}>
                  <CartesianGrid vertical={false} />
                  <XAxis
                    dataKey="crypto"
                    tickLine={false}
                    tickMargin={10}
                    axisLine={false}
                    fontSize={12}
                    angle={-45}
                    textAnchor="end"
                  />
                  <YAxis
                    tickFormatter={formatMGA}
                    tickLine={false}
                    axisLine={false}
                    fontSize={12}
                    width={35}
                  />
                  <Tooltip
                    formatter={(value) => [`${value.toLocaleString()} MGA`, "Commission"]}
                  />
                  <Bar
                    dataKey="commission"
                    fill="hsl(var(--primary))"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};