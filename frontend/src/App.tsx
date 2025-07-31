import { BdsButton, BdsCard, BdsCardBody, BdsCardFooter, BdsCardHeader, BdsCardSubtitle, BdsCardTitle, BdsChipTag, BdsGrid, BdsIcon } from 'blip-ds/dist/blip-ds-react/components';
import Header from './components/Headers';
import Dashboard from './components/Dashboard';
import { IncidentFilters } from './components/IncidentFilters';
import { useIncidents } from './hooks/useIncidents';
import { LoadingSpinner } from './components/LoadingSpinner';
import { useAuth } from './hooks/useAuth';
import { LoginForm } from './components/LoginForm';
import { useState } from 'react';
import type { Incident } from './types';
import { IncidentModal } from './components/IncidentModal';

function App() {
  const { user, isAuthenticated, login, logout } = useAuth();
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

  const [selectedIncident, setSelectedIncident] = useState<Incident | null>(null);
  const [loginLoading, setLoginLoading] = useState(false);

  const handleLogin = async (email: string, password: string) => {
    setLoginLoading(true);
    const success = await login(email, password);
    setLoginLoading(false);
    return success;
  };

  const handleIncidentClick = (incident: Incident) => {
    const currentIncident = getIncidentById(incident.id);
    if (currentIncident) {
      setSelectedIncident(currentIncident);
    }
  };

  const notImplementedFunction = function (): void {
    throw new Error('Function not implemented.');
  };

  if (!isAuthenticated || !user) {
    return <LoginForm onLogin={handleLogin} loading={loginLoading} />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header
        onCreateIncident={notImplementedFunction}
        user={user}
        onLogout={logout}>
      </Header>
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
              <BdsCard
                key={incident.id}
                clickable
                className="shadow-sm hover:shadow-md transition-shadow"
                onClick={() => { handleIncidentClick(incident) }}>
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
      {selectedIncident && (
        <IncidentModal
          incident={selectedIncident}
          currentUser={user}
          onClose={() => setSelectedIncident(null)}
          onStatusUpdate={notImplementedFunction}
          onAddComment={addComment}
        />
      )}
    </div>
  )
}

export default App
