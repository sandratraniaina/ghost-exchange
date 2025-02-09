import React from "react";
import { useNavigate } from "react-router-dom";
import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface ErrorPageProps {
    title?: string;
    message?: string;
    error?: Error;
    showHome?: boolean;
    showRetry?: boolean;
}

const ErrorPage: React.FC<ErrorPageProps> = ({
    title = "Something went wrong",
    message = "We encountered an unexpected error. Please try again later.",
    error,
    showHome = true,
    showRetry = true,
}) => {
    const navigate = useNavigate();

    const handleRetry = () => {
        window.location.reload();
    };

    const handleGoHome = () => {
        navigate("/");
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-gray-50">
            <Card className="max-w-lg w-full">
                <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                        <AlertTriangle className="h-6 w-6 text-red-500" />
                        <span>{title}</span>
                    </CardTitle>
                </CardHeader>

                <CardContent className="space-y-4">
                    <Alert variant="destructive">
                        <AlertTitle>Error</AlertTitle>
                        <AlertDescription>{message}</AlertDescription>
                    </Alert>

                    {error && (
                        <div className="bg-gray-100 p-4 rounded-lg text-sm font-mono overflow-auto">
                            {error.message}
                        </div>
                    )}

                    {error?.stack && (
                        <details className="text-sm text-gray-500">
                            <summary className="cursor-pointer hover:text-gray-700">
                                Technical Details
                            </summary>
                            <pre className="mt-2 bg-gray-100 p-4 rounded-lg overflow-auto">
                                {error.stack}
                            </pre>
                        </details>
                    )}
                </CardContent>

                <CardFooter className="flex justify-end space-x-2">
                    {showRetry && (
                        <Button variant="outline" onClick={handleRetry}>
                            Try Again
                        </Button>
                    )}
                    {showHome && (
                        <Button variant="default" onClick={handleGoHome}>
                            Go Home
                        </Button>
                    )}
                </CardFooter>
            </Card>
        </div>
    );
};

export default ErrorPage;
