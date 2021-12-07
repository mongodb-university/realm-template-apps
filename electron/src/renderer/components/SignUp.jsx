import { Link } from 'react-router-dom';
import UserInfoForm from './UserInfoForm';
import { Authentication } from '../realm';
import { useContext } from 'react';
import Context from './Context';

const SignUp = () => {
  const { onSignUp } = useContext(Context);
  return (
    <div>
      <UserInfoForm title="Sign Up" submitUserInfo={onSignUp} />
      <p>
        <Link to="/log-in">Log In</Link>
      </p>
    </div>
  );
};

export default SignUp;
