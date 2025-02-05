import { useNavigate } from 'react-router-dom';
import {
    AlertDialog,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogCancel,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Loader2, Mail, X } from "lucide-react";
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
                <AlertDialogCancel className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-white transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-slate-950 focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-slate-100 data-[state=open]:text-slate-500 dark:ring-offset-slate-950 dark:focus:ring-slate-300 dark:data-[state=open]:bg-slate-800 dark:data-[state=open]:text-slate-400">
                    <X className="h-4 w-4" />
                    <span className="sr-only">Close</span>
                </AlertDialogCancel>
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
                <div className="flex flex-col space-y-2">
                    <Button
                        onClick={() => navigate('/login')}
                        className="w-full"
                    >
                        Go to Login
                    </Button>
                    <div className="flex items-center justify-center space-x-2">
                        <span className="text-sm text-gray-500">Didn't receive the email?</span>
                        <Button
                            onClick={handleResendEmail}
                            disabled={isResending}
                            className="p-2 h-auto"
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
                </div>
            </AlertDialogContent>
        </AlertDialog>
    );
};

export default EmailValidationDialog;