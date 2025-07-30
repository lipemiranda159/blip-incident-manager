import { BdsButton, BdsCard, BdsCardBody, BdsCardFooter, BdsCardHeader, BdsCardTitle, BdsGrid, BdsIcon } from 'blip-ds/dist/blip-ds-react/components';
import Header from './components/Headers';
import Dashboard from './components/Dashboard';
import { IncidentFilters } from './components/IncidentFilters';
import { useIncidents } from './hooks/useIncidents';

function App() {

    const {
    incidents,
    loading,
    filters,
    setFilters,
    currentPage,
    setCurrentPage,
    totalPages,
    totalItems,
    createIncident,
    updateIncident,
    addComment,
    getIncidentById
  } = useIncidents();

  const notImplementedFunction = function (): void {
    throw new Error('Function not implemented.');
  };
  return (
    <div className="min-h-screen bg-gray-50">
      <Header onCreateIncident={notImplementedFunction}></Header>
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Dashboard/>
        <IncidentFilters
          filters={filters}
          onFiltersChange={setFilters}
          totalItems={totalItems}
        />
      </main>
    </div>
  )
}

export default App
