import './App.css';

import Basic from './components/form/form';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>A11y audit tool</h1>
        <nav></nav>
      </header>
      <main className="main">
      <Basic />
      </main>
      <footer>
        footer
      </footer>
    </div>
  );
}

export default App;
