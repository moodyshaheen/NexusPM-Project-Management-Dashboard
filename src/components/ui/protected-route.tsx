import { Navigate } from 'react-router-dom';
import { useMember } from '@/integrations';
import { LoadingSpinner } from './loading-spinner';

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
    const { isAuthenticated, isLoading } = useMember();

    if (isLoading) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <LoadingSpinner />
            </div>
        );
    }

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    return <>{children}</>;
}
