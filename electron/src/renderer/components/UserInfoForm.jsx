import { useState } from 'react';

const UserInfoForm = ({ title, submitUserInfo }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);

  const onSubmit = async (e) => {
    e.preventDefault();
    const res = await submitUserInfo(username, password);
    if (res) {
      setError(res.message);
    } else setError(null);
  };
  return (
    <div>
      <h2>{title}</h2>
      <div>
        <form>
          <div>
            <input
              type="email"
              name="email"
              placeholder="email"
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          <div>
            <input
              type="password"
              name="password"
              placeholder="password"
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div>
            <button onClick={onSubmit}>{title}</button>
          </div>
          <div>{error && <p>{error}</p>}</div>
        </form>
      </div>
    </div>
  );
};

export default UserInfoForm;
