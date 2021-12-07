import { Link } from 'react-router-dom';
import UserInfoForm from './UserInfoForm';
import { Authentication } from '../realm';

const SignUp = () => {
  const signUpUser = async (username, password) => {
    await Authentication.signUp(username, password);
  };
  return (
    <div>
      <UserInfoForm title="Sign Up" submitUserInfo={signUpUser} />
      <p>
        <Link to="/log-in">Log In</Link>
      </p>
    </div>
  );
};

export default SignUp;
