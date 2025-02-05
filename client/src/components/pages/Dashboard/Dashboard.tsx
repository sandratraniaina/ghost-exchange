import FiatTransaction from "../../FiatTransaction/FiatTransaction";
import CryptoChart from "../../CryptoChart/CryptoChart";

export const Dashboard = () => {
    return (
        <>
            <FiatTransaction />
            <CryptoChart />
        </>
    )
}