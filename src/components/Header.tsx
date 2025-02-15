import { FC } from 'react';
import Wrapper from './Wrapper';
import Button from './UI/Button';
import { useAuth } from '@/providers/AuthProvider';
import { logout } from '@/api/auth';
import { Link } from 'react-router-dom';
import { CircleUserRound } from 'lucide-react';

const Header: FC = (): JSX.Element => {
  const { isAuthenticated } = useAuth();

  return (
    <header className="font-sansation py-[20px]">
      <Wrapper>
        <div className="w-full flex justify-between items-center">
          <Link
            to="/"
            className="text-4xl font-bold text-white hover:text-white"
          >
            AutoGOD
          </Link>
          <nav className="flex gap-5 items-center">
            {isAuthenticated ? (
              <>
                <Link to="/me" className="text-white hover:text-white">
                  <CircleUserRound size={42} />
                </Link>
                <Button addStyles="text-sm" onClick={() => logout()}>
                  Log Out
                </Button>
              </>
            ) : (
              <>
                <Button addStyles="text-sm">
                  <Link to="/login" className="text-white hover:text-white">
                    Sign In
                  </Link>
                </Button>
                <Button addStyles="text-sm">
                  <Link to="/register" className="text-white hover:text-white">
                    Sign Out
                  </Link>
                </Button>
              </>
            )}
          </nav>
        </div>
      </Wrapper>
    </header>
  );
};

export default Header;
