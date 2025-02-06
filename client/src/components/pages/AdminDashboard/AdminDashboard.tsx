import React, { useState } from 'react';
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
import { Button } from "@/components/ui/button";
import { Check, X } from "lucide-react";

const AdminDashboard = () => {
    const [transactions, setTransactions] = useState([
        {
            "id": 3,
            "user": {
                "id": 2,
                "fiatBalance": 100.50,
                "username": "john_doe",
                "email": "john@example.com",
                "accountRole": "CLIENT",
                "avatar": "https://api.dicebear.com/7.x/avataaars/svg?seed=john"
            },
            "amount": 250.00,
            "transactionType": "DEBIT",
            "timestamp": "2024-01-02T12:34:56",
            "validationTimestamp": null,
            "status": "PENDING"
        },
        {
            "id": 4,
            "user": {
                "id": 3,
                "fiatBalance": 500.75,
                "username": "jane_smith",
                "email": "jane@example.com",
                "accountRole": "CLIENT",
                "avatar": "https://api.dicebear.com/7.x/avataaars/svg?seed=jane"
            },
            "amount": 1000.00,
            "transactionType": "CREDIT",
            "timestamp": "2024-01-03T09:15:22",
            "validationTimestamp": "2024-01-03T09:30:00",
            "status": "COMPLETED"
        },
        {
            "id": 5,
            "user": {
                "id": 4,
                "fiatBalance": 0.00,
                "username": "alice_w",
                "email": "alice@example.com",
                "accountRole": "ADMIN",
                "avatar": "https://api.dicebear.com/7.x/avataaars/svg?seed=alice"
            },
            "amount": 750.00,
            "transactionType": "CREDIT",
            "timestamp": "2024-01-04T16:45:10",
            "validationTimestamp": null,
            "status": "PENDING"
        },
        {
            "id": 6,
            "user": {
                "id": 5,
                "fiatBalance": 1200.00,
                "username": "bob_b",
                "email": "bob@example.com",
                "accountRole": "CLIENT",
                "avatar": "https://api.dicebear.com/7.x/avataaars/svg?seed=bob"
            },
            "amount": 300.00,
            "transactionType": "DEBIT",
            "timestamp": "2024-01-05T14:20:30",
            "validationTimestamp": "2024-01-05T14:25:00",
            "status": "COMPLETED"
        },
        {
            "id": 7,
            "user": {
                "id": 6,
                "fiatBalance": 50.00,
                "username": "charlie_c",
                "email": "charlie@example.com",
                "accountRole": "CLIENT",
                "avatar": "https://api.dicebear.com/7.x/avataaars/svg?seed=charlie"
            },
            "amount": 200.00,
            "transactionType": "CREDIT",
            "timestamp": "2024-01-06T11:11:11",
            "validationTimestamp": null,
            "status": "PENDING"
        },
        {
            "id": 8,
            "user": {
                "id": 7,
                "fiatBalance": 800.00,
                "username": "diana_d",
                "email": "diana@example.com",
                "accountRole": "CLIENT",
                "avatar": "https://api.dicebear.com/7.x/avataaars/svg?seed=diana"
            },
            "amount": 1500.00,
            "transactionType": "CREDIT",
            "timestamp": "2024-01-07T08:05:45",
            "validationTimestamp": "2024-01-07T08:10:00",
            "status": "COMPLETED"
        },
        {
            "id": 9,
            "user": {
                "id": 8,
                "fiatBalance": 300.00,
                "username": "edward_e",
                "email": "edward@example.com",
                "accountRole": "CLIENT",
                "avatar": "https://api.dicebear.com/7.x/avataaars/svg?seed=edward"
            },
            "amount": 100.00,
            "transactionType": "DEBIT",
            "timestamp": "2024-01-08T17:55:20",
            "validationTimestamp": null,
            "status": "PENDING"
        },
        {
            "id": 10,
            "user": {
                "id": 9,
                "fiatBalance": 0.00,
                "username": "fiona_f",
                "email": "fiona@example.com",
                "accountRole": "CLIENT",
                "avatar": "https://api.dicebear.com/7.x/avataaars/svg?seed=fiona"
            },
            "amount": 500.00,
            "transactionType": "CREDIT",
            "timestamp": "2024-01-09T10:10:10",
            "validationTimestamp": "2024-01-09T10:15:00",
            "status": "COMPLETED"
        },
        {
            "id": 11,
            "user": {
                "id": 10,
                "fiatBalance": 2000.00,
                "username": "george_g",
                "email": "george@example.com",
                "accountRole": "CLIENT",
                "avatar": "https://api.dicebear.com/7.x/avataaars/svg?seed=george"
            },
            "amount": 200.00,
            "transactionType": "DEBIT",
            "timestamp": "2024-01-10T13:25:40",
            "validationTimestamp": null,
            "status": "PENDING"
        },
        {
            "id": 12,
            "user": {
                "id": 11,
                "fiatBalance": 150.00,
                "username": "hannah_h",
                "email": "hannah@example.com",
                "accountRole": "CLIENT",
                "avatar": "https://api.dicebear.com/7.x/avataaars/svg?seed=hannah"
            },
            "amount": 50.00,
            "transactionType": "DEBIT",
            "timestamp": "2024-01-11T19:30:00",
            "validationTimestamp": "2024-01-11T19:35:00",
            "status": "COMPLETED"
        }
    ]);

    const [filters, setFilters] = useState({
        transactionType: '',
        userId: ''
    });

    const handleAccept = (transactionId: number) => {
        // TODO: Handle accept
    };

    const handleDecline = (transactionId: number) => {
        // TODO: Hande decline
    };

    // Filter transactions based on selected filters
    const filteredTransactions = transactions.filter(transaction => {
        const matchesType = !filters.transactionType ||
            transaction.transactionType === filters.transactionType;
        const matchesUser = !filters.userId ||
            transaction.user.id.toString() === filters.userId;
        return matchesType && matchesUser;
    });

    // Get unique user IDs for the filter
    const uniqueUserIds = [...new Set(transactions.map(t => t.user.id))];

    const formatDateTime = (dateString: string) => {
        return new Date(dateString).toLocaleString();
    };

    return (
        <Card className="w-full">
            <CardHeader>
                <CardTitle>Transaction Management</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="flex gap-4 mb-6">
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
                            {uniqueUserIds.map(id => (
                                <SelectItem key={id} value={id.toString()}>
                                    User ID: {id}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

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
                                <TableHead className="text-right">Actions</TableHead>
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
                                            className={`px-2 py-1 rounded-full text-xs font-semibold ${transaction.transactionType === 'CREDIT'
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
                                        {formatDateTime(transaction.timestamp)}
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex justify-end gap-2">
                                            <Button
                                                size="sm"
                                                variant="outline"
                                                className="w-8 h-8 p-0 hover:bg-green-100 hover:text-green-800 hover:border-green-800 text-green-800 border-green-800"
                                                onClick={() => handleAccept(transaction.id)}
                                                disabled={transaction.status !== 'PENDING'}
                                            >
                                                <Check className="h-4 w-4" />
                                            </Button>
                                            <Button
                                                size="sm"
                                                variant="outline"
                                                className="w-8 h-8 p-0 hover:bg-red-100 hover:text-red-800 hover:border-red-800 text-red-800 border-red-800"
                                                onClick={() => handleDecline(transaction.id)}
                                                disabled={transaction.status !== 'PENDING'}
                                            >
                                                <X className="h-4 w-4" />
                                            </Button>
                                        </div>
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

export default AdminDashboard;