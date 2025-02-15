import React, { useEffect, useState } from 'react';
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
import { getUserActivity } from '@/api/userActivity';
import { toast } from '@/hooks/use-toast';


export const UserActivity = () => {
    const [dateRange, setDateRange] = React.useState({
        min: '',
        max: ''
    });

    const [datas, setDatas] = useState([]);

    const loadActivities = async () => {
        const data = await getUserActivity(dateRange.min, dateRange.max)
        setDatas(data);
        return data;
    }

    useEffect(() => {
        loadActivities();
    }, []);

    const handleFilter = async () => {
        try {
            await loadActivities();
            toast({
                title: "Success",
                description: "Data fetched succesfully",
                className: "bg-green-600 text-white"
            });
        } catch (error) {
            toast({
                title: "Error",
                description: error?.message || "Error while fetching data",
                variant: "destructive"
            });
        }
    }

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
                        {datas.map((data) => (
                            <TableRow key={data.user.username}>
                                <TableCell>
                                    <div className="flex items-center gap-2">
                                        <Avatar className="h-8 w-8 mr-2">
                                            <AvatarImage src={data.user.avatar} alt={data.user.username} />
                                            <AvatarFallback>{data.user.username}</AvatarFallback>
                                        </Avatar>

                                        <span className="font-medium">{data.user.username}</span>
                                    </div>
                                </TableCell>
                                <TableCell className="text-right">
                                    {data.totalSale.toLocaleString()}
                                </TableCell>
                                <TableCell className="text-right">
                                    {data.totalPurchase.toLocaleString()}
                                </TableCell>
                                <TableCell className="text-right">
                                    {data.portfolioValue.toLocaleString()}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    );
};