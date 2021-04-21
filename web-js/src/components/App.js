import { WelcomePage } from "./WelcomePage";
import { RealmAppProvider, useRealmApp } from "./RealmApp";
import "./App.css";

export default function AppWithRealm() {
  return (
    <RealmAppProvider appId="template-ihgiv">
      <App />
    </RealmAppProvider>
  );
}

function App() {
  const { currentUser, logOut } = useRealmApp();
  return (
    <div className="App">
      {currentUser ? (
        <>
          {"Logged In"}{" "}
          <button
            onClick={async () => {
              await logOut();
            }}
          >
            Logout
          </button>
        </>
      ) : (
        <WelcomePage />
      )}
    </div>
  );
}
