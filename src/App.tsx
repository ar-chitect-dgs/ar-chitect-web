import AuthProvider from './auth/AuthProvider';
import AppRouter from './feature/navigation/AppRouter';
import './firebaseConfig';

function App(): JSX.Element {
  return (
    <AuthProvider>
      <AppRouter />
    </AuthProvider>
  );
}

export default App;
