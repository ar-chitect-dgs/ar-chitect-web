import AppRouter from './feature/navigation/AppRouter';
import './firebaseConfig';
import AuthProvider from './auth/AuthProvider';

function App(): JSX.Element {
  return (
    <AuthProvider>
      <AppRouter />
    </AuthProvider>
  );
}

export default App;
