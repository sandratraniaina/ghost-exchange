import { useLocation, useNavigate } from 'react-router-dom';
import { ErrorState } from '@/types/error';
import { AlertTriangle } from 'lucide-react';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';

const ErrorPage: React.FC = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const state = location.state as ErrorState;

    // Default error state if none provided
    const errorState: ErrorState = {
        title: state?.title || "Page not found",
        message: state?.message || "The page you are looking for does not exist.",
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