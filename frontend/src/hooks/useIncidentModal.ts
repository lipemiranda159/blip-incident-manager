import { useState } from 'react';
import type { IncidentDto } from '../services';

export const useIncidentModal = () => {
  const [selectedIncident, setSelectedIncident] = useState<IncidentDto | null>(null);

  const openModal = (incident: IncidentDto) => {
    setSelectedIncident(incident);
  };

  const closeModal = () => {
    setSelectedIncident(null);
  };

  return {
    selectedIncident,
    openModal,
    closeModal,
    isOpen: selectedIncident !== null
  };
};
