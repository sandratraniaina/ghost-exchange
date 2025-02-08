import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Percent } from "lucide-react";
import { fetchCommissions, updateCommissions } from '@/api/commission';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

interface CommissionRates {
  buyCommission: number;
  sellCommission: number;
}

export const CommissionRate = () => {
  const [commissionRates, setCommissionRates] = useState<CommissionRates>({ buyCommission: 0, sellCommission: 0 });
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

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

  const handleSubmit = async () => {
    setIsLoading(true);
    const result = await updateCommissions(
      commissionRates.sellCommission,
      commissionRates.buyCommission
    );

    setIsLoading(false);

    if (result) {
      toast({
        title: "Success",
        description: "Commission values saved successfully!",
        className: "bg-green-600 text-white"
      });
      setIsEditing(false);
    } else {
      toast({
        title: "Error",
        description: "Failed to update commission rates. Please check your connection and try again.",
        variant: "destructive",
      });
    }
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
                  onClick={() => handleSubmit()}
                  className="w-full relative flex items-center justify-center"
                >
                  {isLoading && (
                    <svg
                      className="animate-spin h-5 w-5 text-white absolute"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c3.042 0 5.61 2.185 6.291 5.291l.33 1.005A8.002 8.002 0 0112 20v-2.001c.47-.001.933-.017 1.404-.052A8.005 8.005 0 0120 12a8 8 0 01-8-8V4a8 8 0 01-7.995 7.995L12 17.291z"
                      />
                    </svg>
                  )}
                  <span className={cn(isLoading && "opacity-0")}>
                    Save Changes
                  </span>
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