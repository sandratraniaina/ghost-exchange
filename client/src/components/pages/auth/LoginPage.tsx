// src/pages/auth/LoginPage.tsx
import { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2 } from 'lucide-react';
import PinValidation from './PinValidation';

interface LoginFormData {
    email: string;
    password: string;
}

export const LoginPage = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { login } = useAuth();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [showPinValidation, setShowPinValidation] = useState(false);
    const [formData, setFormData] = useState<LoginFormData>({
        email: 'ghostexchangetest@gmail.com',
        password: 'Here is a 8 letters pwd'
    });

    const from = location.state?.from?.pathname || '/home';

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        if (error) setError(null);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        try {
            await login(formData.email, formData.password);
            setShowPinValidation(true);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Invalid credentials');
        } finally {
            setIsLoading(false);
        }
    };

    const handlePinSuccess = async () => {
        setIsLoading(true);
        try {
            navigate(from, { replace: true });
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to login');
            setShowPinValidation(false);
        } finally {
            setIsLoading(false);
        }
    };

    const handlePinCancel = () => {
        setShowPinValidation(false);
    };

    if (showPinValidation) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
                <PinValidation
                    email={formData.email}
                    onSuccess={handlePinSuccess}
                    onCancel={handlePinCancel}
                />
            </div>
        );
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
            <Card className="w-full max-w-md">
                <CardHeader>
                    <CardTitle className="text-2xl text-center">Welcome Back</CardTitle>
                    <CardDescription className="text-center">
                        Enter your credentials to access your account
                    </CardDescription>
                </CardHeader>
                <form onSubmit={handleSubmit}>
                    <CardContent className="space-y-4">
                        {error && (
                            <Alert variant="destructive">
                                <AlertDescription>{error}</AlertDescription>
                            </Alert>
                        )}
                        <div className="space-y-2">
                            <label htmlFor="email" className="text-sm font-medium">
                                Email
                            </label>
                            <Input
                                id="email"
                                name="email"
                                type="email"
                                placeholder="Enter your email"
                                value={formData.email}
                                onChange={handleInputChange}
                                required
                                disabled={isLoading}
                            />
                        </div>
                        <div className="space-y-2">
                            <label htmlFor="password" className="text-sm font-medium">
                                Password
                            </label>
                            <Input
                                id="password"
                                name="password"
                                type="password"
                                placeholder="Enter your password"
                                value={formData.password}
                                onChange={handleInputChange}
                                required
                                disabled={isLoading}
                            />
                        </div>
                    </CardContent>
                    <CardFooter className="flex flex-col space-y-4">
                        <Button
                            type="submit"
                            className="w-full"
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Verifying...
                                </>
                            ) : (
                                'Sign In'
                            )}
                        </Button>
                        <div className="flex justify-between items-center w-full text-sm">
                            <Button
                                variant="outline"
                                onClick={() => navigate('/signup')}
                                disabled={isLoading}
                            >
                                Create account
                            </Button>

                            <Link
                                to="/forgot-password"
                                className="text-sm text-black hover:underline hover:text-gray-700"
                            >
                                Forgot password?
                            </Link>
                        </div>
                    </CardFooter>
                </form>
            </Card>
        </div>
    );
};