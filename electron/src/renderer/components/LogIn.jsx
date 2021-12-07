import { useContext } from 'react';
import { Link } from 'react-router-dom';
import UserInfoForm from './UserInfoForm';
import Context from './Context';
import { Authentication } from '../realm';

const LogIn = () => {
  const { onLogIn } = useContext(Context);
  return (
    <div>
      <UserInfoForm title="Log In" submitUserInfo={onLogIn} />
      <p>
        <Link to="/sign-up">Sign up</Link>
      </p>
    </div>
  );
};

export default LogIn;
