import { ThemeProvider } from './context/ThemeContext';
import ContextApiExample from './app/contextApiExample/page.tsx';

function App() {
  return (
    <ThemeProvider>
      <ContextApiExample />
    </ThemeProvider>
  );
}

export default App;
