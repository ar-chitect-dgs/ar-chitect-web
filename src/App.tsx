import Editor from './feature/editor/Editor';
import './firebaseConfig';

function App(): JSX.Element {
  return (
    <Editor />
    // <AuthProvider>
    //   <AppRouter />
    // </AuthProvider>
  );
}

export default App;
