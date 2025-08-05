import { useState } from 'react';
import { BdsGrid, BdsButton, BdsIcon } from 'blip-ds/dist/blip-ds-react/components';
import Header from './components/Headers';
import { IncidentFilters } from './components/IncidentFilters';
import { IncidentTable } from './components/IncidentTable';
import { Pagination } from './components/Pagination';
import { CreateIncidentModal } from './components/CreateIncidentModal';
import { useIncidents } from './hooks/useIncidents';
import { useIncidentModal } from './hooks/useIncidentModal';
import './styles/modal-scroll-lock.css';
import { useIncidentOperations } from './hooks/useIncidentOperations';
import { LoginForm } from './components/LoginForm';
import { RegisterForm } from './components/RegisterForm';
import type { Incident } from './types';
import { IncidentModal } from './components/IncidentModal';
import { AuthProvider, useAuthContext } from './contexts/AuthContext';

// Component that uses the auth context
function AppContent() {
  const { user, isAuthenticated, logout } = useAuthContext();
  const [showRegister, setShowRegister] = useState(false);
  const {
    incidents,
    loading,
    filters,
    setFilters,
    currentPage,
    totalPages,
    totalItems,
    itemsPerPage,
    onPageChange,
    onItemsPerPageChange,
    createIncident,
    updateIncident,
    addComment,
    getIncidentById,
    refreshIncidents
  } = useIncidents();

  // Modal management
  const incidentModal = useIncidentModal();
  const [showCreateModal, setShowCreateModal] = useState(false);
  // Incident operations with error handling
  const incidentOperations = useIncidentOperations({
    createIncident,
    updateIncident,
    addComment,
    getIncidentById
  });

  const handleLoginSuccess = () => {
    setShowRegister(false); // Reset to login view after successful login
  };

  const handleRegisterSuccess = () => {
    setShowRegister(false); // Reset to login view after successful registration
  };

  const handleGoToRegister = () => {
    setShowRegister(true);
  };

  const handleBackToLogin = () => {
    setShowRegister(false);
  };

  const handleIncidentClick = async (incident: Incident) => {
    try {
      const currentIncident = await getIncidentById(incident.id);
      if (currentIncident) {
        incidentModal.openModal(currentIncident);
      } else {
        console.error('Incidente não encontrado:', incident.id);
      }
    } catch (error) {
      console.error('Erro ao carregar detalhes do incidente:', error);
    }
  };

  const handleCreateIncident = () => {
    setShowCreateModal(true);
  };

  const handleStatusUpdate = async (incidentId: string, status: string | null) => {
    if (!status) return { success: false, error: 'Status inválido' };
    try {
      const result = await incidentOperations.handleUpdateIncident(incidentId, { status: status as Incident['status'] });
      return result;
    } catch (error) {
      console.error('Erro ao atualizar status:', error);
      return { success: false, error: 'Erro ao atualizar status' };
    }
  };

  const handleAssignedToUpdate = async (incidentId: string, assignedToId: string | null) => {
    try {
      const updateData: Partial<Incident> = assignedToId ? { assignedTo: user! } : { assignedTo: undefined };
      const result = await incidentOperations.handleUpdateIncident(incidentId, updateData);
      return result;
    } catch (error) {
      console.error('Erro ao atualizar atribuição:', error);
      return { success: false, error: 'Erro ao atualizar atribuição' };
    }
  };

  const handleAddComment = async (incidentId: string, content: string, author: any) => {
    try {
      const result = await incidentOperations.handleAddComment(incidentId, content, author);
      return result;
    } catch (error) {
      console.error('Erro ao adicionar comentário:', error);
      return { success: false, error: 'Erro ao adicionar comentário' };
    }
  };

  if (!isAuthenticated || !user) {
    if (showRegister) {
      return (
        <RegisterForm 
          onRegisterSuccess={handleRegisterSuccess}
          onBackToLogin={handleBackToLogin}
        />
      );
    }
    return (
      <LoginForm 
        onLoginSuccess={handleLoginSuccess}
        onGoToRegister={handleGoToRegister}
      />
    );
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
        gap="2"
        padding="2"
        xxs="12"
        lg="12"
      >
        {/* <Dashboard /> */}

        <IncidentFilters
          filters={filters}
          onFiltersChange={setFilters}
          totalItems={totalItems}
        />

        {/* Manual Refresh Button */}
        <BdsGrid direction="row" justify-content="flex-end" gap="2">
          <BdsButton
            variant="secondary"
            size="short"
            onClick={refreshIncidents}
            disabled={loading}
          >
            <BdsIcon name="refresh" size="small" />
            Atualizar Lista
          </BdsButton>
        </BdsGrid>

        <IncidentTable
          incidents={incidents}
          loading={loading}
          onIncidentClick={handleIncidentClick}
        />

        {/* Pagination Component */}
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={totalItems}
          itemsPerPage={itemsPerPage}
          onPageChange={onPageChange}
          onItemsPerPageChange={onItemsPerPageChange}
          loading={loading}
        />
      </BdsGrid>

      {/* Incident Details Modal */}
      {incidentModal.selectedIncident && (
        <IncidentModal
          incident={incidentModal.selectedIncident}
          currentUser={user}
          onClose={incidentModal.closeModal}
          onStatusUpdate={handleStatusUpdate}
          onAddComment={handleAddComment}
          onAssignedToUpdate={handleAssignedToUpdate}
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

// Main App component with AuthProvider
function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
