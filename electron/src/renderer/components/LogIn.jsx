import { Link, useHistory } from 'react-router-dom';
import UserInfoForm from './UserInfoForm';
import useRealmApp from '../hooks/useRealmApp';

const LogIn = () => {
  const { logIn } = useRealmApp();
  const history = useHistory();

  const onLogIn = async (username, password) => {
    const res = await logIn(username, password);
    //checks if the response is an Error
    console.log(res);
    if (res !== true) {
      return res;
    } else {
      history.push('/todo');
    }
  };

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
