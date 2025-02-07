import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2 } from 'lucide-react';
import { validatePIN } from '@/api/auth';
import { useAuth } from '@/hooks/useAuth';

interface PinValidationProps {
    email: string;
    onSuccess: () => void;
    onCancel: () => void;
}

const PinValidation = ({ email, onSuccess, onCancel }: PinValidationProps) => {
    const [pins, setPins] = useState(['', '', '', '', '', '']);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [timeLeft, setTimeLeft] = useState(90); // 5 minutes in seconds

    const { user } = useAuth();

    useEffect(() => {
        const timer = setInterval(() => {
            setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
        }, 1000);

        return () => clearInterval(timer);
    }, []);

    const formatTime = (seconds: number) => {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
    };

    const handlePinChange = (index: number, value: string) => {
        if (value.length > 1) return; // Prevent multiple digits
        if (!/^\d*$/.test(value)) return; // Only allow digits

        const newPins = [...pins];
        newPins[index] = value;
        setPins(newPins);

        // Auto-focus next input
        if (value && index < 5) {
            const nextInput = document.getElementById(`pin-${index + 1}`);
            nextInput?.focus();
        }
    };

    const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Backspace' && !pins[index] && index > 0) {
            // Focus previous input on backspace if current input is empty
            const prevInput = document.getElementById(`pin-${index - 1}`);
            prevInput?.focus();
        }
    };

    const handleResendCode = async () => {
        setIsLoading(true);
        setError(null);

        try {
            // Mock API call
            await new Promise(resolve => setTimeout(resolve, 1000));
            setTimeLeft(90); // Reset timer
        } catch (err) {
            console.error(err);
            setError('Failed to resend code');
        } finally {
            setIsLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        const pin = pins.join('');
        if (pin.length !== 6) {
            setError('Please enter all 6 digits');
            setIsLoading(false);
            return;
        }

        try {
            const result = await validatePIN(pin, user.id);

            if (result) {
                onSuccess();
            } else {
                setError('Invalid PIN code');
            }
        } catch (err) {
            console.error(err);
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Card className="w-full max-w-md">
            <CardHeader>
                <CardTitle className="text-2xl text-center">Verify Your Email</CardTitle>
                <CardDescription className="text-center">
                    Please enter the 6-digit code sent to {email}
                </CardDescription>
            </CardHeader>
            <form onSubmit={handleSubmit}>
                <CardContent className="space-y-4">
                    {error && (
                        <Alert variant="destructive">
                            <AlertDescription>{error}</AlertDescription>
                        </Alert>
                    )}

                    <div className="flex justify-center gap-2">
                        {pins.map((pin, index) => (
                            <Input
                                key={index + ""}
                                id={`pin-${index}`}
                                type="text"
                                inputMode="numeric"
                                value={pin}
                                onChange={(e) => handlePinChange(index, e.target.value)}
                                onKeyDown={(e) => handleKeyDown(index, e)}
                                className="w-12 h-12 text-center text-lg"
                                maxLength={1}
                                disabled={isLoading}
                            />
                        ))}
                    </div>

                    <div className="text-center text-sm text-gray-600">
                        Time remaining: {formatTime(timeLeft)}
                    </div>
                </CardContent>

                <CardFooter className="flex flex-col space-y-4">
                    <Button
                        type="submit"
                        className="w-full"
                        disabled={isLoading || timeLeft === 0}
                    >
                        {isLoading ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Verifying...
                            </>
                        ) : (
                            'Verify'
                        )}
                    </Button>

                    <div className="flex justify-between items-center w-full">
                        <Button
                            type="button"
                            // variant="ghost"
                            onClick={onCancel}
                            disabled={isLoading}
                        >
                            Cancel
                        </Button>

                        <Button
                            type="button"
                            // variant="ghost"
                            onClick={handleResendCode}
                            disabled={isLoading || timeLeft > 0}
                        >
                            Resend Code
                        </Button>
                    </div>
                </CardFooter>
            </form>
        </Card>
    );
};

export default PinValidation;