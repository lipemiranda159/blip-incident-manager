import { BdsButton, BdsCard, BdsCardBody, BdsCardFooter, BdsCardHeader, BdsCardSubtitle, BdsCardTitle, BdsChipTag, BdsGrid, BdsIcon } from 'blip-ds/dist/blip-ds-react/components';
import Header from './components/Headers';
import Dashboard from './components/Dashboard';
import { IncidentFilters } from './components/IncidentFilters';
import { useIncidents } from './hooks/useIncidents';
import { LoadingSpinner } from './components/LoadingSpinner';

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
        <Dashboard />
        <IncidentFilters
          filters={filters}
          onFiltersChange={setFilters}
          totalItems={totalItems}
        />

        {loading ? (
          <LoadingSpinner text="Carregando incidentes..." />
        ) : (
          <BdsGrid className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {incidents.map(incident => (
              <BdsCard key={incident.id} clickable className="shadow-sm hover:shadow-md transition-shadow">
                <BdsCardHeader>
                  <BdsCardTitle text={incident.id} />
                  <BdsChipTag color="default" icon="">
                    <BdsCardSubtitle text={incident.status} />
                  </BdsChipTag>
                </BdsCardHeader>
                <BdsCardBody>
                  <p>{incident.description}</p>
                </BdsCardBody>
              </BdsCard>
            ))}
          </BdsGrid>
        )}
      </main>
    </div>
  )
}

export default App
