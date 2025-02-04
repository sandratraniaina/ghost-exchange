import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import TransactionDialog from './TransactionDialog';

interface FiatTransactionProps {
  balance?: number;
  currency?: string;
  onDeposit?: (amount: number, method: string) => void;
  onWithdraw?: (amount: number, method: string) => void;
}

const FiatTransaction: React.FC<FiatTransactionProps> = ({ 
  balance = 150000.00,
  currency = 'MGA',
  onDeposit = (amount: number, method: string) => console.log('Deposit:', amount, method),
  onWithdraw = (amount: number, method: string) => console.log('Withdraw:', amount, method)
}) => {
  const [isDepositOpen, setIsDepositOpen] = useState(false);
  const [isWithdrawOpen, setIsWithdrawOpen] = useState(false);
  const [amount, setAmount] = useState('');
  const [method, setMethod] = useState('');

  const handleTransaction = (type: 'deposit' | 'withdraw') => {
    // TODO: Implement handleTransaction
    const numAmount = parseFloat(amount);
    
    if (type === 'deposit') {
      onDeposit(numAmount, method);
    } else {
      onWithdraw(numAmount, method);
    }
    
    setAmount('');
    setMethod('');
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
          type="deposit"
          onAmountChange={setAmount}
          onMethodChange={setMethod}
          amount={amount}
          method={method}
          onSubmit={() => handleTransaction('deposit')}
        />
        
        <TransactionDialog 
          isOpen={isWithdrawOpen}
          setIsOpen={setIsWithdrawOpen}
          type="withdraw"
          onAmountChange={setAmount}
          onMethodChange={setMethod}
          amount={amount}
          method={method}
          onSubmit={() => handleTransaction('withdraw')}
        />
      </CardContent>
    </Card>
  );
};

export default FiatTransaction;