import { useEffect } from 'react';
import { MemoryRouter as Router, Switch, Route } from 'react-router-dom';
import ObjectId from 'bson-objectid';
import icon from '../../assets/icon.svg';
import './App.css';
import { openRealm, realmApp } from './realm';

const Hello = () => {
  useEffect(() => {
    (async () => {
      const realm = await openRealm();
      realm?.write(() => {
        realm.create('Car', {
          make: 'Toyota',
          model: 'Prius',
          miles: 42,
          _partition: realmApp.currentUser?.id,
          _id: new ObjectId(),
        });
      });
    })();
  }, []);
  return (
    <div>
      <div className="Hello">
        <img width="200px" alt="icon" src={icon} />
      </div>
      <h1>electron-react-boilerplate</h1>
      <div className="Hello">
        <a
          href="https://electron-react-boilerplate.js.org/"
          target="_blank"
          rel="noreferrer"
        >
          <button type="button">
            <span role="img" aria-label="books">
              📚
            </span>
            Read our docs!!!
          </button>
        </a>
        <a
          href="https://github.com/sponsors/electron-react-boilerplate"
          target="_blank"
          rel="noreferrer"
        >
          <button type="button">
            <span role="img" aria-label="books">
              🙏
            </span>
            Donate
          </button>
        </a>
      </div>
    </div>
  );
};

export default function App() {
  return (
    <Router>
      <Switch>
        <Route path="/" component={Hello} />
      </Switch>
    </Router>
  );
}
