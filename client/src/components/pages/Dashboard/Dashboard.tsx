import FiatTransaction from "../../FiatTransaction/FiatTransaction";
import CryptoChart from "../../CryptoChart/CryptoChart";
import { useAuth } from "@/hooks/useAuth";
import { useEffect, useState } from "react";
import { fetchUserBalance } from "@/api/wallet";
import { useToast } from "@/hooks/use-toast";

export const Dashboard = () => {
  const [balance, setBalance] = useState<number>(0);

  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    const loadUserBalance = async () => {
      const response = await fetchUserBalance(parseInt(user.id));

      if (!response) {
        toast({
          title: "Error",
          description: "Failed to fetch user balance. Please check your connection and try again.",
          variant: "destructive",
        });
        return;
      }

      setBalance(parseFloat(response.data));
    }

    loadUserBalance();
  }, [user?.id, toast]);

  return (
    <>
      <FiatTransaction balance={balance} />
      <CryptoChart />
    </>
  )
}