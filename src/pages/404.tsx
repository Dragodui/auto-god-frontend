import type React from 'react';
import Wrapper from '../components/Wrapper';
import Button from '@/components/ui/Button';
import { Link } from 'react-router-dom';
import { AlertCircle } from 'lucide-react';

const NotFound: React.FC = () => {
  return (
    <Wrapper>
      <div className="flex flex-col items-center justify-center text-center">
        <AlertCircle className="w-20 h-20 text-red-500 mb-4" />
        <h2 className="text-5xl font-bold mb-[30px]">404</h2>
        <p className="text-xl mb-6">
          Oops! The page you're looking for doesn't exist.
        </p>
        <p className="mb-8">
          The page might have been moved or deleted, or you might have mistyped
          the URL.
        </p>
        <Link to="/">
          <Button>Back to Home</Button>
        </Link>
      </div>
    </Wrapper>
  );
};

export default NotFound;
