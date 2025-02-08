import { useEffect, useState } from 'react';
import { AlertTriangle, TrendingUp } from "lucide-react";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from "recharts";
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
  name: string;
  salesCommission: number;
  purchaseCommission: number;
}

const analysisTypes = [
  { value: 'sum' as AnalysisType, label: 'Sum (Somme)' },
  { value: 'average' as AnalysisType, label: 'Average (Moyenne)' }
];

// Sample data for individual cryptocurrencies
const rawData: ChartDataItem[] = [
  { name: 'Bitcoin', salesCommission: 1250000, purchaseCommission: 980000 },
  { name: 'Ethereum', salesCommission: 850000, purchaseCommission: 720000 },
  { name: 'Tether', salesCommission: 120000, purchaseCommission: 95000 },
  { name: 'Binance Coin', salesCommission: 450000, purchaseCommission: 380000 },
  { name: 'Solana', salesCommission: 380000, purchaseCommission: 320000 },
  { name: 'Cardano', salesCommission: 180000, purchaseCommission: 150000 },
  { name: 'XRP', salesCommission: 220000, purchaseCommission: 190000 },
  { name: 'Polkadot', salesCommission: 290000, purchaseCommission: 250000 },
  { name: 'Dogecoin', salesCommission: 150000, purchaseCommission: 130000 },
  { name: 'Avalanche', salesCommission: 320000, purchaseCommission: 280000 }
];

// Calculate total commissions
const totalData: ChartDataItem = {
  name: 'Total',
  salesCommission: rawData.reduce((sum, item) => sum + item.salesCommission, 0),
  purchaseCommission: rawData.reduce((sum, item) => sum + item.purchaseCommission, 0)
};

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

  // Get chart data based on selection
  const chartData = selectedCrypto === 'all'
    ? [totalData]
    : rawData.filter(item => item.name === selectedCrypto);

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

            {/* Summary Statistics */}
            <div className="space-y-2 pt-4 border-t">
              <h3 className="font-medium">Summary</h3>
              <div className="grid grid-cols-1 gap-2">
                <div className="p-3 bg-slate-50 rounded-md">
                  <div className="text-sm text-slate-600">
                    {selectedCrypto === 'all' ? 'Total' : selectedCrypto} Sales Commission
                  </div>
                  <div className="text-lg font-medium">
                    {chartData[0].salesCommission.toLocaleString()} MGA
                  </div>
                </div>
                <div className="p-3 bg-slate-50 rounded-md">
                  <div className="text-sm text-slate-600">
                    {selectedCrypto === 'all' ? 'Total' : selectedCrypto} Purchase Commission
                  </div>
                  <div className="text-lg font-medium">
                    {chartData[0].purchaseCommission.toLocaleString()} MGA
                  </div>
                </div>
                <div className="p-3 bg-slate-50 rounded-md">
                  <div className="text-sm text-slate-600">Combined Commission</div>
                  <div className="text-lg font-medium">
                    {(chartData[0].salesCommission + chartData[0].purchaseCommission).toLocaleString()} MGA
                  </div>
                </div>
              </div>
            </div>
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
                ? "Total Sales and Purchase Commission Earnings (MGA)"
                : `${selectedCrypto} Sales and Purchase Commission Earnings (MGA)`}
            </CardDescription>
          </CardHeader>

          <CardContent>
            <div className="w-full h-[600px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 20, right: 30, left: 35, bottom: 20 }}>
                  <CartesianGrid vertical={false} />
                  <XAxis
                    dataKey="name"
                    tickLine={false}
                    axisLine={false}
                    fontSize={12}
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
                  <Legend
                    verticalAlign="top"
                    height={36}
                  />
                  <Bar
                    name="Sales Commission"
                    dataKey="salesCommission"
                    fill="hsl(var(--primary))"
                    radius={[4, 4, 0, 0]}
                  />
                  <Bar
                    name="Purchase Commission"
                    dataKey="purchaseCommission"
                    fill="hsl(var(--primary) / 0.5)"
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