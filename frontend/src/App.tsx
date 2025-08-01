import { useState } from 'react';
import { BdsGrid } from 'blip-ds/dist/blip-ds-react/components';
import Header from './components/Headers';
import Dashboard from './components/Dashboard';
import { IncidentFilters } from './components/IncidentFilters';
import { IncidentGrid } from './components/IncidentGrid';
import { CreateIncidentModal } from './components/CreateIncidentModal';
import { useIncidents } from './hooks/useIncidents';
import { useAuth } from './hooks/useAuth';
import { useIncidentModal } from './hooks/useIncidentModal';
import './styles/modal-scroll-lock.css';
import { useIncidentOperations } from './hooks/useIncidentOperations';
import { LoginForm } from './components/LoginForm';
import type { Incident } from './types';
import { IncidentModal } from './components/IncidentModal';

function App() {
  const { user, isAuthenticated, login, logout } = useAuth();
  const {
    incidents,
    loading,
    filters,
    setFilters,
    hasMore,
    loadMoreIncidents,
    createIncident,
    updateIncident,
    addComment,
    getIncidentById
  } = useIncidents();

  // Modal management
  const incidentModal = useIncidentModal();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [loginLoading, setLoginLoading] = useState(false);

  // Incident operations with error handling
  const incidentOperations = useIncidentOperations({
    createIncident,
    updateIncident,
    addComment,
    getIncidentById
  });

  const handleLogin = async (email: string, password: string) => {
    setLoginLoading(true);
    const success = await login(email, password);
    setLoginLoading(false);
    return success;
  };

  const handleIncidentClick = (incident: Incident) => {
    const currentIncident = getIncidentById(incident.id);
    if (currentIncident) {
      incidentModal.openModal(currentIncident);
    }
  };

  const handleCreateIncident = () => {
    setShowCreateModal(true);
  };

  const handleStatusUpdate = async (incidentId: string, status: Incident['status']) => {
    return await incidentOperations.handleUpdateIncident(incidentId, { status });
  };

  if (!isAuthenticated || !user) {
    return <LoginForm onLogin={handleLogin} loading={loginLoading} />;
  }

  return (
    <BdsGrid direction="column" height="100vh" className="bg-surface-1">
      <Header 
        onCreateIncident={handleCreateIncident} 
        user={user} 
        onLogout={logout} 
      />
      
      <BdsGrid 
        direction="column" 
        gap="4" 
        padding="4" 
        xxs="12" 
        lg="10" 
      >
        <Dashboard />
        
        <IncidentFilters
          filters={filters}
          onFiltersChange={setFilters}
          totalItems={incidents.length}
        />

        <IncidentGrid
          incidents={incidents}
          loading={loading}
          hasMore={hasMore}
          onLoadMore={loadMoreIncidents}
          onIncidentClick={handleIncidentClick}
        />
      </BdsGrid>

      {/* Incident Details Modal */}
      {incidentModal.selectedIncident && (
        <IncidentModal
          incident={incidentModal.selectedIncident}
          currentUser={user}
          onClose={incidentModal.closeModal}
          onStatusUpdate={handleStatusUpdate}
          onAddComment={incidentOperations.handleAddComment}
        />
      )}

      {/* Create Incident Modal */}
      <CreateIncidentModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSubmit={incidentOperations.handleCreateIncident}
        currentUser={user}
      />
    </BdsGrid>
  );
}

export default App;
