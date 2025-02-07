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
import { cn } from "@/lib/utils";

interface TransactionDialogProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  type: 'DEPOSIT' | 'WITHDRAW';
  onAmountChange: (value: string) => void;
  amount: string;
  onSubmit: () => void;
  isLoading: boolean;
}

const TransactionDialog: React.FC<TransactionDialogProps> = ({
  isOpen,
  setIsOpen,
  type,
  onAmountChange,
  amount,
  onSubmit,
  isLoading,
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
          className="w-full relative flex items-center justify-center"
          onClick={onSubmit}
          disabled={!amount || isLoading}
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
            {type === 'DEPOSIT' ? 'Deposit' : 'Withdraw'}
          </span>
        </Button>
      </div>
    </DialogContent>
  </Dialog>
);

export default TransactionDialog;