import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import TransactionDialog from './TransactionDialog';

interface FiatTransactionProps {
  balance?: number;
  currency?: string;
  onDeposit?: (amount: number, transactionType: string) => void;
  onWithdraw?: (amount: number, transactionType: string) => void;
}

const FiatTransaction: React.FC<FiatTransactionProps> = ({
  balance = 150000.00,
  currency = 'MGA',
  onDeposit = (amount: number, transactionType: string) => console.log(`Transaction (${transactionType}): ${amount}`),
  onWithdraw = (amount: number, transactionType: string) => console.log(`Transaction (${transactionType}): ${amount}`)
}) => {
  const [isDepositOpen, setIsDepositOpen] = useState(false);
  const [isWithdrawOpen, setIsWithdrawOpen] = useState(false);
  const [amount, setAmount] = useState('');

  const handleTransaction = (type: 'deposit' | 'withdraw') => {
    // TODO: Replace with API call in production
    const numAmount = parseFloat(amount);

    if (type === 'deposit') {
      onDeposit(numAmount, "DEPOSIT");
    } else {
      onWithdraw(numAmount, "WITHDRAW");
    }

    setAmount('');
    setIsDepositOpen(false);
    setIsWithdrawOpen(false);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Your Balance</CardTitle>
      </CardHeader>

      <CardContent>
        <div className="space-y-4">
          <div>
            <div className="text-sm text-gray-500">Available {currency}</div>

            <div className="text-2xl font-bold">
              {new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: currency
              }).format(balance)}
            </div>
          </div>

          <div className="flex space-x-2">
            <Button
              className="flex-1"
              onClick={() => setIsDepositOpen(true)}
            >
              Deposit
            </Button>

            <Button
              variant="outline"
              className="flex-1"
              onClick={() => setIsWithdrawOpen(true)}
            >
              Withdraw
            </Button>
          </div>
        </div>

        <TransactionDialog
          isOpen={isDepositOpen}
          setIsOpen={setIsDepositOpen}
          type="DEPOSIT"
          onAmountChange={setAmount}
          amount={amount}
          onSubmit={() => handleTransaction('deposit')}
        />

        <TransactionDialog
          isOpen={isWithdrawOpen}
          setIsOpen={setIsWithdrawOpen}
          type="WITHDRAW"
          onAmountChange={setAmount}
          amount={amount}
          onSubmit={() => handleTransaction('withdraw')}
        />
      </CardContent>
    </Card>
  );
};

export default FiatTransaction;