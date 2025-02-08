import { useEffect, useState } from 'react';
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
import { useToast } from '@/hooks/use-toast';
import { acceptTransaction, declineTransaction, getOpenTransaction } from '@/api/dashboard';

const AdminDashboard = () => {
    const { toast } = useToast();
    const [transactions, setTransactions] = useState([]);

    useEffect(() => {
        const loadData = async () => {
            try {
                const data = await getOpenTransaction();
                setTransactions(data);
            } catch (error) {
                toast({
                    title: "Error",
                    description: error.message || "Error while fetching data",
                    variant: "destructive"
                });
            }
        }

        loadData();
    }, []);

    const [filters, setFilters] = useState({
        transactionType: 'all',
        userId: 'all'
    });

    const handleAccept = async (transactionId: number) => {
        await acceptTransaction(transactionId);
    };

    const handleDecline = async (transactionId: number) => {
        await declineTransaction(transactionId);
    };

    // Filter transactions based on selected filters
    const filteredTransactions = transactions.filter(transaction => {
        const matchesType = (filters.transactionType == "all") ? true : transaction.transactionType === filters.transactionType;
        const matchesUser = (filters.userId == "all") ? true :  transaction.user.id.toString() === filters.userId;
        console.log(matchesType);
        return (matchesType) && (matchesUser);
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
                            <SelectItem value="all">All Types</SelectItem>
                            <SelectItem value="DEPOSIT">Deposit</SelectItem>
                            <SelectItem value="WITHDRAW">Withdraw</SelectItem>
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
                            <SelectItem value="all">All Users</SelectItem>
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
                                            >
                                                <Check className="h-4 w-4" />
                                            </Button>
                                            <Button
                                                size="sm"
                                                variant="outline"
                                                className="w-8 h-8 p-0 hover:bg-red-100 hover:text-red-800 hover:border-red-800 text-red-800 border-red-800"
                                                onClick={() => handleDecline(transaction.id)}
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