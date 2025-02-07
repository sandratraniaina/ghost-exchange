import FiatTransaction from "../../FiatTransaction/FiatTransaction";
import CryptoChart from "../../CryptoChart/CryptoChart";
import { Toaster } from "@/components/ui/toaster";

export const Dashboard = () => {
  return (
    <>
      <FiatTransaction />
      <CryptoChart />
      <Toaster />
    </>
  )
}