import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import TransactionDialog from './TransactionDialog';
import { createTransaction } from '@/api/fiat';
import { useAuth } from '@/hooks/useAuth';

interface FiatTransactionProps {
  balance?: number;
  currency?: string;
}

const FiatTransaction: React.FC<FiatTransactionProps> = ({
  balance = 0,
  currency = 'MGA'
}) => {
  const [isDepositOpen, setIsDepositOpen] = useState(false);
  const [isWithdrawOpen, setIsWithdrawOpen] = useState(false);
  const [amount, setAmount] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const { user } = useAuth();

  const handleTransaction = async (type: 'deposit' | 'withdraw') => {
    setIsLoading(true);
    const numAmount = parseFloat(amount);

    if (type === 'deposit') {
      await createTransaction(parseInt(user.id), numAmount, "DEPOSIT");
    } else {
      await createTransaction(parseInt(user.id), numAmount, "WITHDRAW");
    }

    setAmount('');
    setIsDepositOpen(false);
    setIsWithdrawOpen(false);
    setIsLoading(false);
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
              {
                new Intl.NumberFormat('en-US', {
                  style: 'currency',
                  currency: currency
                }).format(balance)
              }
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
          isLoading={isLoading}
        />

        <TransactionDialog
          isOpen={isWithdrawOpen}
          setIsOpen={setIsWithdrawOpen}
          type="WITHDRAW"
          onAmountChange={setAmount}
          amount={amount}
          onSubmit={() => handleTransaction('withdraw')}
          isLoading={isLoading}
        />
      </CardContent>
    </Card>
  );
};

export default FiatTransaction;