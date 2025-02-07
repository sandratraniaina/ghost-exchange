import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface TransactionDialogProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  type: 'DEPOSIT' | 'WITHDRAW';
  onAmountChange: (value: string) => void;
  amount: string;
  onSubmit: () => void;
}

const TransactionDialog: React.FC<TransactionDialogProps> = ({
  isOpen,
  setIsOpen,
  type,
  onAmountChange,
  amount,
  onSubmit
}) => (
  <Dialog open={isOpen} onOpenChange={setIsOpen}>
    <DialogContent className="sm:max-w-md">
      <DialogHeader>
        <DialogTitle>{type === 'DEPOSIT' ? 'Deposit Funds' : 'Withdraw Funds'}</DialogTitle>

        <DialogDescription>
          {type === 'DEPOSIT'
            ? 'Add funds to your account'
            : 'Withdraw funds from your account'}
        </DialogDescription>
      </DialogHeader>

      <div className="space-y-4 py-4">
        <div className="space-y-2">
          <label htmlFor={`${type}-amount`} className="text-sm font-medium">
            Amount
          </label>

          <Input
            id={`${type}-amount`}
            type="number"
            placeholder="Enter amount"
            value={amount}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => onAmountChange(e.target.value)}
          />
        </div>

        <Button
          className="w-full"
          onClick={onSubmit}
          disabled={!amount}
        >
          {type === 'DEPOSIT' ? 'Deposit' : 'Withdraw'}
        </Button>
      </div>
    </DialogContent>
  </Dialog>
);

export default TransactionDialog;