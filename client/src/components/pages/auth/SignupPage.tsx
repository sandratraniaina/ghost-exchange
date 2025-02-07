// src/pages/auth/SignupPage.tsx
import { useContext, useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2 } from 'lucide-react';
import EmailValidationDialog from './EmailValidationDialogue';

import { AuthContext } from '../../../contexts/AuthContext';

export interface SignupFormData {
    firstName: string;
    lastName: string;
    dateOfBirth: string;
    genderId: string;
    username: string;
    email: string;
    password: string;
    passwordConf: string;
}

export const SignupPage = () => {
    const auth = useContext(AuthContext);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [showValidationDialog, setShowValidationDialog] = useState(false);
    const [formData, setFormData] = useState<SignupFormData>({
        firstName: 'Niaina',
        lastName: 'Sandratra',
        dateOfBirth: '2024-02-02',
        genderId: '1',
        username: 'sandratra',
        email: 'sandratra2468@gmail.com',
        password: 'Here is a 8 letters pwd',
        passwordConf: 'Here is a 8 letters pwd'
    });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        if (error) setError(null);
    };

    const handleGenderChange = (value: string) => {
        setFormData(prev => ({
            ...prev,
            genderId: value
        }));
        if (error) setError(null);
    };

    const validateForm = () => {
        if (formData.password !== formData.confirmPassword) {
            setError('Passwords do not match');
            return false;
        }
        if (formData.password.length < 8) {
            setError('Password must be at least 8 characters long');
            return false;
        }
        return true;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validateForm()) return;

        setIsLoading(true);
        setError(null);

        try {
            // Mock sending verification email
            await new Promise(resolve => setTimeout(resolve, 1000));
            setShowValidationDialog(true);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to create account');
        } finally {
            setIsLoading(false);
        }
    };

    const handleResendEmail = async () => {
        setError(null);
        try {
            // Mock resending verification email
            await new Promise(resolve => setTimeout(resolve, 1000));
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to resend verification email');
        }
    };

    return (
        <>
            <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-8">
                <Card className="w-full max-w-md">
                    <CardHeader>
                        <CardTitle className="text-2xl text-center">Create Account</CardTitle>
                        <CardDescription className="text-center">
                            Enter your details to register
                        </CardDescription>
                    </CardHeader>
                    <form onSubmit={handleSubmit}>
                        <CardContent className="space-y-4">
                            {error && (
                                <Alert variant="destructive">
                                    <AlertDescription>{error}</AlertDescription>
                                </Alert>
                            )}
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label htmlFor="firstName" className="text-sm font-medium">
                                        First Name
                                    </label>
                                    <Input
                                        id="firstName"
                                        name="firstName"
                                        placeholder="Enter your first name"
                                        value={formData.firstName}
                                        onChange={handleInputChange}
                                        required
                                        disabled={isLoading}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label htmlFor="lastName" className="text-sm font-medium">
                                        Last Name
                                    </label>
                                    <Input
                                        id="lastName"
                                        name="lastName"
                                        placeholder="Enter your last name"
                                        value={formData.lastName}
                                        onChange={handleInputChange}
                                        required
                                        disabled={isLoading}
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label htmlFor="dateOfBirth" className="text-sm font-medium">
                                        Date of Birth
                                    </label>
                                    <Input
                                        id="dateOfBirth"
                                        name="dateOfBirth"
                                        type="date"
                                        value={formData.dateOfBirth}
                                        onChange={handleInputChange}
                                        required
                                        disabled={isLoading}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label htmlFor="genderId" className="text-sm font-medium">
                                        Gender
                                    </label>
                                    <Select
                                        value={formData.genderId}
                                        onValueChange={handleGenderChange}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select gender" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="1">Male</SelectItem>
                                            <SelectItem value="2">Female</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label htmlFor="username" className="text-sm font-medium">
                                    Username
                                </label>
                                <Input
                                    id="username"
                                    name="username"
                                    placeholder="Enter your username"
                                    value={formData.username}
                                    onChange={handleInputChange}
                                    required
                                    disabled={isLoading}
                                />
                            </div>

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

                            <div className="space-y-2">
                                <label htmlFor="confirmPassword" className="text-sm font-medium">
                                    Confirm Password
                                </label>
                                <Input
                                    id="confirmPassword"
                                    name="confirmPassword"
                                    type="password"
                                    placeholder="Confirm your password"
                                    value={formData.confirmPassword}
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
                                        Creating account...
                                    </>
                                ) : (
                                    'Create Account'
                                )}
                            </Button>
                            <div className="text-center">
                                <Link
                                    to="/login"
                                    className="text-sm text-black hover:underline hover:text-gray-700"
                                >
                                    Already have an account? Sign in
                                </Link>
                            </div>
                        </CardFooter>
                    </form>
                </Card>
            </div>

            <EmailValidationDialog
                isOpen={showValidationDialog}
                email={formData.email}
                onClose={() => setShowValidationDialog(false)}
                onResendEmail={handleResendEmail}
            />
        </>
    );
};