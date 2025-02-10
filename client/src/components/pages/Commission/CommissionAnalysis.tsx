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
import { fetchCommissionsAnalysis } from '@/api/analysis';

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

const formatMGA = (value: number | null | undefined) => {
  if (value == null) return '0';
  const millions = value / 1000000;
  return millions >= 1
    ? `${millions.toFixed(1)}M`
    : `${(value / 1000).toFixed(0)}k`;
};

const formatCommission = (value: number | null | undefined) => {
  if (value == null) return '0';
  return value.toLocaleString();
};

export const CommissionAnalysis = () => {
  const [selectedAnalysis, setSelectedAnalysis] = useState<AnalysisType | ''>('');
  const [selectedCrypto, setSelectedCrypto] = useState<CryptoOption | null>(null);
  const [dateRange, setDateRange] = useState<DateRange>({ min: '', max: '' });
  const [cryptoOptions, setCryptoOptions] = useState<CryptoOption[]>([]);
  const [chartData, setChartData] = useState<ChartDataItem[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadOptions = async () => {
      const options = await fetchCryptoOptions();
      setCryptoOptions(options?.data ?? []);
    };

    loadOptions();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      if (!selectedAnalysis) {
        setChartData([]);
        return;
      }

      setLoading(true);

      const response = await fetchCommissionsAnalysis(
        selectedAnalysis,
        selectedCrypto,
        dateRange
      );

      if (response?.success) {
        const newChartData: ChartDataItem = {
          name: selectedCrypto?.name ?? 'All Cryptocurrencies',
          salesCommission: response.data?.totalSalesCommission ?? 0,
          purchaseCommission: response.data?.totalPurchasesCommission ?? 0
        };

        setChartData([newChartData]);
      }

      setLoading(false);
    };

    fetchData();
  }, [selectedAnalysis, selectedCrypto, dateRange]);

  const combinedCommission = chartData[0]
    ? (chartData[0].salesCommission ?? 0) + (chartData[0].purchaseCommission ?? 0)
    : 0;

  const renderContent = () => {
    if (!selectedAnalysis) {
      return (
        <div className="h-[600px] flex items-center justify-center">
          <div className="text-slate-500">Please select an analysis type to view the graph</div>
        </div>
      );
    }

    if (loading) {
      return (
        <div className="h-[600px] flex items-center justify-center">
          <div className="text-slate-500">Loading...</div>
        </div>
      );
    }

    return (
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
              formatter={(value: number) => [`${formatCommission(value)} MGA`, "Commission"]}
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
    );
  };

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
              <Select
                onValueChange={(value: AnalysisType) => setSelectedAnalysis(value)}
                value={selectedAnalysis}
              >
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
                onValueChange={(value) => {
                  const crypto = cryptoOptions.find(c => c?.id?.toString() === value);
                  setSelectedCrypto(crypto || null);
                }}
                value={selectedCrypto?.id?.toString() ?? ''}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select cryptocurrency" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="0">All Cryptocurrencies</SelectItem>
                  {cryptoOptions.map((crypto) => (
                    <SelectItem key={crypto?.id} value={crypto?.id?.toString() ?? ''}>
                      {crypto?.name ?? 'Unknown'}
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
            {chartData.length > 0 && selectedAnalysis && (
              <div className="space-y-2 pt-4 border-t">
                <h3 className="font-medium">Summary</h3>
                <div className="grid grid-cols-1 gap-2">
                  <div className="p-3 bg-slate-50 rounded-md">
                    <div className="text-sm text-slate-600">
                      Sales Commission
                    </div>
                    <div className="text-lg font-medium">
                      {formatCommission(chartData[0]?.salesCommission)} MGA
                    </div>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-md">
                    <div className="text-sm text-slate-600">
                      Purchase Commission
                    </div>
                    <div className="text-lg font-medium">
                      {formatCommission(chartData[0]?.purchaseCommission)} MGA
                    </div>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-md">
                    <div className="text-sm text-slate-600">Combined Commission</div>
                    <div className="text-lg font-medium">
                      {formatCommission(combinedCommission)} MGA
                    </div>
                  </div>
                </div>
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
              {selectedCrypto ? `${selectedCrypto.name} Commission Earnings (MGA)` : "Total Commission Earnings (MGA)"}
            </CardDescription>
          </CardHeader>

          <CardContent>
            {renderContent()}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};