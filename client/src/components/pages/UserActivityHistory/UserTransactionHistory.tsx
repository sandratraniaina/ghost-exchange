import { useState } from 'react';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from '@/components/ui/input';

export const UserTransactionHistory = () => {
    const [transactions] = useState([
        {
            id: 1,
            user: {
                username: "john_doe",
                email: "john@example.com",
                avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=john"
            },
            amount: 1000.00,
            transactionType: "CREDIT",
            timestamp: "2024-02-06T10:30:00"
        }
    ]);

    const [filters, setFilters] = useState({
        transactionType: '',
        userId: '',
        startDate: '',
        endDate: ''
    });

    const filteredTransactions = transactions.filter(transaction => {
        const matchesType = !filters.transactionType || filters.transactionType === "0" ||
            transaction.transactionType === filters.transactionType;
        const matchesUser = !filters.userId || filters.userId === "0" ||
            transaction.user.username === filters.userId;
        
        const transactionDate = new Date(transaction.timestamp);
        const matchesStartDate = !filters.startDate || 
            transactionDate >= new Date(filters.startDate);
        const matchesEndDate = !filters.endDate || 
            transactionDate <= new Date(filters.endDate + 'T23:59:59');

        return matchesType && matchesUser && matchesStartDate && matchesEndDate;
    });

    const uniqueUsers = [...new Set(transactions.map(t => t.user.username))];

    return (
        <Card className="w-full">
            <CardHeader>
                <CardTitle>Transaction History</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="flex flex-wrap gap-4 mb-6">
                    <Select
                        value={filters.transactionType}
                        onValueChange={(value) =>
                            setFilters(prev => ({ ...prev, transactionType: value }))
                        }
                    >
                        <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Transaction Type" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="0">All Types</SelectItem>
                            <SelectItem value="CREDIT">Credit</SelectItem>
                            <SelectItem value="DEBIT">Debit</SelectItem>
                        </SelectContent>
                    </Select>

                    <Select
                        value={filters.userId}
                        onValueChange={(value) =>
                            setFilters(prev => ({ ...prev, userId: value }))
                        }
                    >
                        <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Select User" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="0">All Users</SelectItem>
                            {uniqueUsers.map(username => (
                                <SelectItem key={username} value={username}>
                                    {username}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>

                    <div className="flex gap-2 items-center">
                        <Input
                            type="date"
                            value={filters.startDate}
                            onChange={(e) =>
                                setFilters(prev => ({ ...prev, startDate: e.target.value }))
                            }
                            className="w-[180px]"
                        />
                        <span className="text-sm text-gray-500">to</span>
                        <Input
                            type="date"
                            value={filters.endDate}
                            onChange={(e) =>
                                setFilters(prev => ({ ...prev, endDate: e.target.value }))
                            }
                            className="w-[180px]"
                        />
                    </div>
                </div>

                {/* Rest of the table code remains the same */}
                <div className="rounded-md border">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-12">Avatar</TableHead>
                                <TableHead>Username</TableHead>
                                <TableHead>Email</TableHead>
                                <TableHead>Transaction Type</TableHead>
                                <TableHead className="text-right">Amount</TableHead>
                                <TableHead className="text-right">Timestamp</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredTransactions.map((transaction) => (
                                <TableRow key={transaction.id}>
                                    <TableCell>
                                        <img
                                            src={transaction.user.avatar}
                                            alt={`${transaction.user.username}'s avatar`}
                                            className="w-8 h-8 rounded-full"
                                        />
                                    </TableCell>
                                    <TableCell className="font-medium">
                                        {transaction.user.username}
                                    </TableCell>
                                    <TableCell>{transaction.user.email}</TableCell>
                                    <TableCell>
                                        <span
                                            className={`px-2 py-1 rounded-full text-xs font-semibold ${
                                                transaction.transactionType === 'CREDIT'
                                                    ? 'bg-green-100 text-green-800'
                                                    : 'bg-red-100 text-red-800'
                                            }`}
                                        >
                                            {transaction.transactionType}
                                        </span>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        ${transaction.amount.toFixed(2)}
                                    </TableCell>
                                    <TableCell className="text-right">
                                        {new Date(transaction.timestamp).toLocaleString()}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            </CardContent>
        </Card>
    );
};