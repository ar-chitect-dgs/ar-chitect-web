import './firebaseConfig';
import Editor from './feature/editor/Editor';

function App(): JSX.Element {
  return (
    <Editor />
    // <AuthProvider>
    //   <AppRouter />
    // </AuthProvider>
  );
}

export default App;
