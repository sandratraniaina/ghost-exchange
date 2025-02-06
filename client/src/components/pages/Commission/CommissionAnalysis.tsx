import { useState } from 'react';
import { TrendingUp } from "lucide-react";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";

type AnalysisType = 'sum' | 'average';
type CryptoId = 'btc' | 'eth' | 'usdt' | 'bnb' | 'sol' | 'ada' | 'xrp' | 'dot' | 'doge' | 'avax';

interface DateRange {
    min: string;
    max: string;
}

interface ChartDataItem {
    crypto: string;
    commission: number;
}

const analysisTypes = [
    { value: 'sum' as AnalysisType, label: 'Sum (Somme)' },
    { value: 'average' as AnalysisType, label: 'Average (Moyenne)' }
];

// TODO: Replace mock data with API call in production
const cryptocurrencies = [
    { id: 'btc' as CryptoId, label: 'Bitcoin' },
    { id: 'eth' as CryptoId, label: 'Ethereum' },
    { id: 'usdt' as CryptoId, label: 'Tether' },
    { id: 'bnb' as CryptoId, label: 'Binance Coin' },
    { id: 'sol' as CryptoId, label: 'Solana' },
    { id: 'ada' as CryptoId, label: 'Cardano' },
    { id: 'xrp' as CryptoId, label: 'XRP' },
    { id: 'dot' as CryptoId, label: 'Polkadot' },
    { id: 'doge' as CryptoId, label: 'Dogecoin' },
    { id: 'avax' as CryptoId, label: 'Avalanche' }
];

// TODO: Replace mock data with API call in production
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

// Format large numbers with commas and shortened MGA
const formatMGA = (value: number) => {
    return value >= 1000000
        ? `${(value / 1000000).toFixed(1)}M`
        : `${(value / 1000).toFixed(0)}k`;
};

export const CommissionAnalysis = () => {
    const [selectedAnalysis, setSelectedAnalysis] = useState<AnalysisType | ''>('');
    const [selectedCryptos, setSelectedCryptos] = useState<CryptoId[]>([]);
    const [dateRange, setDateRange] = useState<DateRange>({ min: '', max: '' });

    const handleAnalyze = () => {
        // TODO: Replace with API call in production
        console.log('Commission analysis parameters:', {
            type: selectedAnalysis,
            cryptocurrencies: selectedCryptos,
            dateRange
        });
    };

    return (
        <Card className="w-full">
            <CardHeader>
                <CardTitle>Commission Analysis</CardTitle>
                <CardDescription>
                    Analyze cryptocurrency commission earnings
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

                {/* Cryptocurrency Checkboxes */}
                <div className="space-y-2">
                    <Label>Cryptocurrencies</Label>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                        {cryptocurrencies.map((crypto) => (
                            <div key={crypto.id} className="flex items-center space-x-2">
                                <Checkbox
                                    id={crypto.id}
                                    checked={selectedCryptos.includes(crypto.id)}
                                    onCheckedChange={(checked) => {
                                        if (checked) {
                                            setSelectedCryptos([...selectedCryptos, crypto.id]);
                                        } else {
                                            setSelectedCryptos(selectedCryptos.filter(id => id !== crypto.id));
                                        }
                                    }}
                                />
                                <Label htmlFor={crypto.id} className="text-sm">{crypto.label}</Label>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Date Range */}
                <div className="flex flex-col sm:flex-row gap-4">
                    <div className="space-y-2 w-full">
                        <Label>Start Date</Label>
                        <input
                            type="datetime-local"
                            className="w-full rounded-md border p-2"
                            value={dateRange.min}
                            onChange={(e) => setDateRange({ ...dateRange, min: e.target.value })}
                        />
                    </div>
                    <div className="space-y-2 w-full">
                        <Label>End Date</Label>
                        <input
                            type="datetime-local"
                            className="w-full rounded-md border p-2"
                            value={dateRange.max}
                            onChange={(e) => setDateRange({ ...dateRange, max: e.target.value })}
                        />
                    </div>
                </div>

                {/* Analyze Button */}
                <Button
                    className="w-full"
                    onClick={handleAnalyze}
                >
                    Analyze Commissions
                </Button>

                {/* Bar Chart */}
                <Card className="mt-6">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <TrendingUp className="h-4 w-4" />
                            Commission Earnings
                        </CardTitle>
                        <CardDescription>Total Commission Earnings (MGA)</CardDescription>
                    </CardHeader>

                    <CardContent>
                        <div className="w-full h-[400px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={chartData} margin={{ top: 20, right: 30, left: 35, bottom: 50 }}>
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
            </CardContent>
        </Card>
    );
};