import { Link, useHistory } from 'react-router-dom';
import UserInfoForm from './UserInfoForm';
import { Authentication } from '../realm';
import { useContext } from 'react';
import Context from './Context';
import useRealmApp from 'renderer/hooks/useRealmApp';

const SignUp = () => {
  const { signUp } = useRealmApp();
  const history = useHistory();

  const onSignUp = async (username, password) => {
    const res = await signUp(username, password);
    //checks if the response is an Error
    if (res !== true) {
      return res;
    } else {
      history.push('/todo');
    }
  };

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
