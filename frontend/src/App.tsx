import './App.css'
import Header from './components/Headers';

function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header onCreateIncident={function (): void {
        throw new Error('Function not implemented.');
      }}></Header>
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

      </main>
    </div>
  )
}

export default App
