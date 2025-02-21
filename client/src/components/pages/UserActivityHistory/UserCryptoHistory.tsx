import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { TableHeader, TableRow, TableHead, TableBody, TableCell, Table } from "@/components/ui/table";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { useState } from "react";
import { Input } from "@/components/ui/input";

export const UserCryptoHistory = () => {
    const [transactions] = useState([
        {
            id: 1,
            user: {
                username: "john_doe",
                email: "john@example.com",
                avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=john"
            },
            transactionType: "BUY",
            cryptoType: "BTC",
            quantity: 0.5,
            timestamp: "2024-02-06T10:30:00"
        }
    ]);

    const [filters, setFilters] = useState({
        transactionType: '',
        userId: '',
        cryptoType: '',
        startDate: '',
        endDate: ''
    });

    const filteredTransactions = transactions.filter(transaction => {
        const matchesType = !filters.transactionType || filters.transactionType === "0" ||
            transaction.transactionType === filters.transactionType;
        const matchesUser = !filters.userId || filters.userId === "0" ||
            transaction.user.username === filters.userId;
        const matchesCrypto = !filters.cryptoType || filters.cryptoType === "0" ||
            transaction.cryptoType === filters.cryptoType;

        const transactionDate = new Date(transaction.timestamp);
        const matchesStartDate = !filters.startDate ||
            transactionDate >= new Date(filters.startDate);
        const matchesEndDate = !filters.endDate ||
            transactionDate <= new Date(filters.endDate + 'T23:59:59');

        return matchesType && matchesUser && matchesCrypto && matchesStartDate && matchesEndDate;
    });

    const uniqueUsers = [...new Set(transactions.map(t => t.user.username))];
    const uniqueCryptos = [...new Set(transactions.map(t => t.cryptoType))];

    return (
        <Card className="w-full">
            <CardHeader>
                <CardTitle>Crypto Transaction History</CardTitle>
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
                            <SelectItem value="BUY">Buy</SelectItem>
                            <SelectItem value="SALE">Sale</SelectItem>
                        </SelectContent>
                    </Select>

                    <Select
                        value={filters.cryptoType}
                        onValueChange={(value) =>
                            setFilters(prev => ({ ...prev, cryptoType: value }))
                        }
                    >
                        <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Crypto Type" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="0">All Cryptocurrencies</SelectItem>
                            {uniqueCryptos.map(crypto => (
                                <SelectItem key={crypto} value={crypto}>
                                    {crypto}
                                </SelectItem>
                            ))}
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
                                <TableHead>Crypto</TableHead>
                                <TableHead className="text-right">Quantity</TableHead>
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
                                            className={`px-2 py-1 rounded-full text-xs font-semibold ${transaction.transactionType === 'BUY'
                                                    ? 'bg-green-100 text-green-800'
                                                    : 'bg-blue-100 text-blue-800'
                                                }`}
                                        >
                                            {transaction.transactionType}
                                        </span>
                                    </TableCell>
                                    <TableCell>{transaction.cryptoType}</TableCell>
                                    <TableCell className="text-right">
                                        {transaction.quantity}
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