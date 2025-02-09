import { useLocation, useNavigate } from 'react-router-dom';
import { ErrorState } from '@/types/error';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '../ui/card';
import { AlertTriangle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '../ui/alert';
import { Button } from '../ui/button';

const ErrorPage: React.FC = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const state = location.state as ErrorState;

    // Default error state if none provided
    const errorState: ErrorState = {
        title: state?.title || "Something went wrong",
        message: state?.message || "An unexpected error occurred.",
        showHome: state?.showHome ?? true,
        showRetry: state?.showRetry ?? true
    };

    const handleRetry = () => {
        window.location.reload();
    };

    const handleGoHome = () => {
        navigate('/home');
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-gray-50">
            <Card className="max-w-lg w-full">
                <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                        <AlertTriangle className="h-6 w-6 text-red-500" />
                        <span>{errorState.title}</span>
                    </CardTitle>
                </CardHeader>

                <CardContent className="space-y-4">
                    <Alert variant="destructive">
                        <AlertTitle>Error</AlertTitle>
                        <AlertDescription>{errorState.message}</AlertDescription>
                    </Alert>
                </CardContent>

                <CardFooter className="flex justify-end space-x-2">
                    {errorState.showRetry && (
                        <Button
                            variant="outline"
                            onClick={handleRetry}
                        >
                            Try Again
                        </Button>
                    )}
                    {errorState.showHome && (
                        <Button
                            variant="default"
                            onClick={handleGoHome}
                        >
                            Go Home
                        </Button>
                    )}
                </CardFooter>
            </Card>
        </div>
    );
};

export default ErrorPage;