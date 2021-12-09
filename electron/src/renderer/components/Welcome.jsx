import { useContext } from 'react';
import { Link } from 'react-router-dom';
import Context from './Context';

const Welcome = () => {
  const { isLoggedIn } = useContext(Context);
  return (
    <div>
      <div>
        {isLoggedIn ? (
          <Link to="/todo">
            <button>Todo</button>
          </Link>
        ) : (
          <>
            <Link to="/log-in">
              <button>Log In</button>
            </Link>
            <Link to="/sign-up">
              <button>Sign Up</button>
            </Link>
          </>
        )}
      </div>
    </div>
  );
};

export default Welcome;
