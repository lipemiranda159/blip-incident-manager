import { useState } from 'react';
import type { Incident } from '../types';

export const useIncidentModal = () => {
  const [selectedIncident, setSelectedIncident] = useState<Incident | null>(null);

  const openModal = (incident: Incident) => {
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
