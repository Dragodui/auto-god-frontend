import { FC } from 'react';
import Wrapper from './Wrapper';
import Button from './UI/Button';

const Header: FC = (): JSX.Element => {
    return (
        <header>
            <Wrapper>
                <div>
                <div>AutoGOD</div>
                <nav>
                    <Button>sign in</Button>
                    <Button>sign out</Button>
                </nav>
                </div>
            </Wrapper>
        </header>
    );
};

export default Header;