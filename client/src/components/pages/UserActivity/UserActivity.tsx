import React from 'react';
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";

// Sample data type
type UserData = {
    username: string;
    avatarUrl?: string;
    totalSales: number;
    totalPurchase: number;
    portfolioValue: number;
};

// TODO: Replace mock data with API call in production
const sampleData: UserData[] = [
    {
        username: "alice_crypto",
        avatarUrl: "/api/placeholder/32/32",
        totalSales: 25000,
        totalPurchase: 22000,
        portfolioValue: 35000,
    },
    {
        username: "bob_trader",
        avatarUrl: "/api/placeholder/32/32",
        totalSales: 18000,
        totalPurchase: 20000,
        portfolioValue: 28000,
    },
    {
        username: "carol_investor",
        avatarUrl: "/api/placeholder/32/32",
        totalSales: 32000,
        totalPurchase: 30000,
        portfolioValue: 42000,
    },
];

export const UserActivity = () => {
    const [dateRange, setDateRange] = React.useState({
        min: '',
        max: ''
    });

    const handleFilter = () => {
        // TODO: Replace with API call in production
        // Add filter logic here
        console.log("Filtering data for date range:", dateRange);
    };

    // Function to get initials from username
    const getInitials = (username: string) => {
        return username
            .split('_')
            .map(part => part[0])
            .join('')
            .toUpperCase();
    };
    return (
        <Card className="w-full">
            <CardHeader>
                <CardTitle>User Activity Dashboard</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-4 mb-6">
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
                    <Button onClick={handleFilter} className="w-full sm:w-auto">
                        Apply Filter
                    </Button>
                </div>

                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>User</TableHead>
                            <TableHead className="text-right">Total Sales (MGA)</TableHead>
                            <TableHead className="text-right">Total Purchase (MGA)</TableHead>
                            <TableHead className="text-right">Portfolio Value (MGA)</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {sampleData.map((user) => (
                            <TableRow key={user.username}>
                                <TableCell>
                                    <div className="flex items-center gap-2">
                                        <Avatar className="h-8 w-8 mr-2">
                                            <AvatarImage src={user.avatarUrl} alt={user.username} />
                                            <AvatarFallback>{getInitials(user.username)}</AvatarFallback>
                                        </Avatar>

                                        <span className="font-medium">{user.username}</span>
                                    </div>
                                </TableCell>
                                <TableCell className="text-right">
                                    {user.totalSales.toLocaleString()}
                                </TableCell>
                                <TableCell className="text-right">
                                    {user.totalPurchase.toLocaleString()}
                                </TableCell>
                                <TableCell className="text-right">
                                    {user.portfolioValue.toLocaleString()}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    );
};