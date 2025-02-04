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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface TransactionDialogProps {
    isOpen: boolean;
    setIsOpen: (open: boolean) => void;
    type: 'deposit' | 'withdraw';
    onAmountChange: (value: string) => void;
    onMethodChange: (value: string) => void;
    amount: string;
    method: string;
    onSubmit: () => void;
  }

const TransactionDialog: React.FC<TransactionDialogProps> = ({
    isOpen,
    setIsOpen,
    type,
    onAmountChange,
    onMethodChange,
    amount,
    method,
    onSubmit
  }) => (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{type === 'deposit' ? 'Deposit Funds' : 'Withdraw Funds'}</DialogTitle>
          <DialogDescription>
            {type === 'deposit' 
              ? 'Add funds to your account using your preferred payment method.'
              : 'Withdraw funds to your linked payment method.'}
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
          <div className="space-y-2">
            <label htmlFor={`${type}-method`} className="text-sm font-medium">
              Payment Method
            </label>
            <Select value={method} onValueChange={onMethodChange}>
              <SelectTrigger id={`${type}-method`}>
                <SelectValue placeholder="Select payment method" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="bank">Bank Transfer</SelectItem>
                <SelectItem value="card">Credit/Debit Card</SelectItem>
                <SelectItem value="paypal">PayPal</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button 
            className="w-full" 
            onClick={onSubmit}
            disabled={!amount || !method}
          >
            {type === 'deposit' ? 'Deposit' : 'Withdraw'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );

export default TransactionDialog;