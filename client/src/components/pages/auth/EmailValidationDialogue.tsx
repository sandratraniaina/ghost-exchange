import { useNavigate } from 'react-router-dom';
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Loader2, Mail } from "lucide-react";
import { useState } from 'react';

interface EmailValidationDialogProps {
  isOpen: boolean;
  email: string;
  onClose: () => void;
  onResendEmail: () => Promise<void>;
}

const EmailValidationDialog = ({
  isOpen,
  email,
  onClose,
  onResendEmail,
}: EmailValidationDialogProps) => {
  const navigate = useNavigate();
  const [isResending, setIsResending] = useState(false);

  const handleResendEmail = async () => {
    setIsResending(true);
    try {
      await onResendEmail();
    } finally {
      setIsResending(false);
    }
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent className="max-w-md">
        <AlertDialogHeader>
          <div className="mx-auto w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center mb-4">
            <Mail className="h-6 w-6 text-blue-600" />
          </div>
          <AlertDialogTitle className="text-center">Check Your Email</AlertDialogTitle>
          <AlertDialogDescription className="text-center space-y-2">
            <p>
              We've sent a verification link to:
              <br />
              <span className="font-medium text-black">{email}</span>
            </p>
            <p className="text-sm">
              Click the link in the email to verify your account. If you don't see the email, check your spam folder.
            </p>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="flex-col space-y-2">
          <Button
            onClick={() => navigate('/login')}
            className="w-full"
          >
            Go to Login
          </Button>
          <div className="flex items-center justify-center space-x-2">
            <span className="text-sm text-gray-500">Didn't receive the email?</span>
            <Button
              variant="link"
              onClick={handleResendEmail}
              disabled={isResending}
              className="p-0 h-auto"
            >
              {isResending ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-1" />
                  Resending...
                </>
              ) : (
                'Resend'
              )}
            </Button>
          </div>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default EmailValidationDialog;