import { useState, useEffect, useContext } from 'react';
import {
  MemoryRouter as Router,
  Switch,
  Route,
  Link,
  Redirect,
  useHistory,
  useLocation,
} from 'react-router-dom';
import './App.css';
import { RealmAppProvider } from './components/RealmApp';
import { appId } from '../realm.json';
import Context from './components/Context';
import LogIn from './components/LogIn';
import SignUp from './components/SignUp';
import Todo from './components/Todo';
import Welcome from './components/Welcome';
import useRealmApp from './hooks/useRealmApp';

const PrivateRoute = (props) => {
  const location = useLocation();
  const { currentUser } = useRealmApp();

  return currentUser?.isLoggedIn ? (
    <Route {...props} />
  ) : (
    <Redirect
      to={{
        pathname: '/',
        state: { from: location },
      }}
    />
  );
};

const App = () => {
  const history = useHistory();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const { logOut, currentUser } = useRealmApp();

  useEffect(() => {
    currentUser?.isLoggedIn === true
      ? setIsLoggedIn(true)
      : setIsLoggedIn(false);
  }, [currentUser?.isLoggedIn]);

  useEffect(() => {
    if (currentUser?.isLoggedIn) {
      history.push('/todo');
    }
  }, [currentUser?.isLoggedIn]);

  const onLogOut = () => {
    logOut();
  };

  return (
    <>
      <div>
        <Link to="/">
          <h1>Realm Todo</h1>
        </Link>
        {currentUser?.isLoggedIn && <button onClick={onLogOut}>Log Out</button>}
      </div>
      <Switch>
        <Route path="/" component={Welcome} exact />
        <Route path="/log-in" component={LogIn} />
        <Route path="/sign-up" component={SignUp} />
        <PrivateRoute path="/todo" component={Todo} />
      </Switch>
    </>
  );
};

// defining Router in a separate component so that the App component
// has access to the `useHistory` hook.
// See https://stackoverflow.com/a/68173854/17093063
const AppWithProvider = () => (
  <RealmAppProvider appId={appId}>
    <Router>
      <App />
    </Router>
  </RealmAppProvider>
);
export default AppWithProvider;
