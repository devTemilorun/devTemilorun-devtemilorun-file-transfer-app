import { AppRouter } from './router';
import { Header } from './components/layout/Header';
import { ToastProvider } from './components/ui/Toast';

function App() {
  return (
    <ToastProvider>
      <div 
        className="min-h-screen"
        style={{
          backgroundColor: 'var(--bg-primary)',
          color: 'var(--text-primary)'
        }}
      >
        <Header />
        <main className="pt-16">
          <AppRouter />
        </main>
      </div>
    </ToastProvider>
  );
}

export default App;