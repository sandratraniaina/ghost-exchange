import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Percent } from "lucide-react";
import { fetchCommissions } from '@/api/commission';
import { useToast } from '@/hooks/use-toast';

interface CommissionRates {
    buyCommission: number;
    sellCommission: number;
}

export const CommissionRate = () => {
    const [commissionRates, setCommissionRates] = useState<CommissionRates>({ buyCommission: 0, sellCommission: 0 });
    const [isEditing, setIsEditing] = useState(false);

    const { toast } = useToast();

    useEffect(() => {
        const fetchCommissionRates = async () => {
            const rates = await fetchCommissions();

            if (rates) {
                setCommissionRates({ buyCommission: rates.data.purchasesCommission, sellCommission: rates.data.salesCommission });
            } else {
                toast({
                    title: "Error",
                    description: "Failed to fetch commission rates. Please check your connection and try again.",
                    variant: "destructive",
                });
            }
        };

        fetchCommissionRates();
    });

    const handleChange = (key: keyof CommissionRates, value: number) => {
        setCommissionRates({
            ...commissionRates,
            [key]: value,
        });
    };

    const handleSubmit = (e: React.MouseEvent) => {
        // TODO: Replace with API call in production
        e.preventDefault();
        // Here you would typically save the values to your backend
        console.log('Saving commission values:', commissionRates);
        // TODO: Handle isEditing when submitting to server
        setIsEditing(false);
    };

    return (
        <Card className="w-full">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Percent className="h-5 w-5" />
                    Commission Values
                </CardTitle>
                <CardDescription>
                    Manage buy and sell commission percentages
                </CardDescription>
            </CardHeader>
            <CardContent>
                <div className="space-y-6">
                    <div className="space-y-4">
                        {/* Buy Commission Input */}
                        <div className="space-y-2">
                            <Label htmlFor="buyCommission">Buy Commission (%)</Label>
                            <div className="relative">
                                <Input
                                    id="buyCommission"
                                    name="buyCommission"
                                    type="number"
                                    step="0.1"
                                    min="0"
                                    max="100"
                                    value={commissionRates?.buyCommission}
                                    onChange={(e) => handleChange("buyCommission", parseFloat(e.target.value))}
                                    disabled={!isEditing}
                                    className="pr-8"
                                />
                                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-gray-500">
                                    %
                                </span>
                            </div>
                        </div>

                        {/* Sell Commission Input */}
                        <div className="space-y-2">
                            <Label htmlFor="sellCommission">Sell Commission (%)</Label>
                            <div className="relative">
                                <Input
                                    id="sellCommission"
                                    name="sellCommission"
                                    type="number"
                                    step="0.1"
                                    min="0"
                                    max="100"
                                    value={commissionRates?.sellCommission}
                                    onChange={(e) => handleChange("sellCommission", parseFloat(e.target.value))}
                                    disabled={!isEditing}
                                    className="pr-8"
                                />
                                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-gray-500">
                                    %
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="flex gap-4">
                        {!isEditing ? (
                            <Button
                                type="button"
                                onClick={() => setIsEditing(true)}
                                className="w-full"
                            >
                                Edit Values
                            </Button>
                        ) : (
                            <>
                                <Button
                                    type="button"
                                    onClick={(e) => handleSubmit(e)}
                                    className="w-full"
                                >
                                    Save Changes
                                </Button>
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => setIsEditing(false)}
                                    className="w-full"
                                >
                                    Cancel
                                </Button>
                            </>
                        )}
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};