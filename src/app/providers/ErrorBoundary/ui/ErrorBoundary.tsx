import React, { ErrorInfo, ReactNode, Suspense } from 'react';
import { LoadingOutlined } from '@ant-design/icons';
import { Navigate } from 'react-router-dom';
import { PageRoutes } from '@/app/routes/Routes';
import { HTTPError } from 'ky';
import { NotAuthError } from '@/entities/User/api/errors';

interface ErrorBoundaryProps {
  children: ReactNode;

}

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

class ErrorBoundary extends React.Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error) {
    console.log(error)
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.log(error, errorInfo);
    this.setState({hasError: true, error: error})
  }

  render() {
    const { hasError, error } = this.state;
    const { children } = this.props;

    if (hasError) {
      if( error instanceof NotAuthError){
        return <Navigate to={PageRoutes.User}/>
      }
      return (
        <Suspense fallback={<LoadingOutlined />}>
          <div>error has occured: {error?.message}</div>
          {children}
        </Suspense>
      );
    }

    return children;
  }
}

export default ErrorBoundary;
