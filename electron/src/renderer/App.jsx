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
import { AppBar, Toolbar, Button, Typography } from '@material-ui/core';
import './App.css';
import { RealmAppProvider } from './components/RealmApp';
import { appId } from '../realm.json';
import Context from './components/Context';
import LogIn from './components/LogIn';
import SignUp from './components/SignUp';
import Todo from './components/Todo';
import Welcome from './components/Welcome';
import useRealmApp from './hooks/useRealmApp';
import { WelcomePage } from './components/WelcomePage';

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

function AppName() {
  return (
    <Typography className="app-bar-title" component="h1" variant="h5">
      Realm Electron Template
    </Typography>
  );
}

function FooterInfo() {
  return (
    <div className="footer-info">
      <span>Built with the MongoDB Realm Electron Template</span> |{' '}
      <Link target="_blank" href="https://docs.mongodb.com/realm">
        Docs
      </Link>
    </div>
  );
}

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
      <AppBar position="sticky">
        <Toolbar>
          <AppName />
          {currentUser?.isLoggedIn ? (
            <Button
              variant="contained"
              color="secondary"
              onClick={async () => {
                await logOut();
              }}
            >
              <Typography variant="button">Log Out</Typography>
            </Button>
          ) : null}
        </Toolbar>
      </AppBar>

      <Switch>
        <Route path="/" component={WelcomePage} exact />
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
      <FooterInfo />
    </Router>
  </RealmAppProvider>
);
export default AppWithProvider;
