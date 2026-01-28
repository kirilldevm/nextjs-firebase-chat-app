import { signOut } from 'firebase/auth';
import { auth } from './lib/fitebase';

function App() {
  function handleLogout() {
    signOut(auth);
  }

  return <button onClick={handleLogout}>Logout</button>;
}

export default App;
