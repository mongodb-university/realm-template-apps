import { useContext } from 'react';
import { Link } from 'react-router-dom';
import Context from './Context';

const Welcome = () => {
  const { isLoggedIn } = useContext(Context);
  console.log(isLoggedIn);
  return (
    <div>
      <div className="Hello"></div>
      <h2>Welcome to Realm Todo</h2>
      <p>A todo list app built with MongoDB Realm, Electron, and React</p>
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
