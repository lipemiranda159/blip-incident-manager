import { useCallback } from 'react';
import type { Incident, User } from '../types';

interface UseIncidentOperationsProps {
  createIncident: (data: Omit<Incident, 'id' | 'createdAt' | 'updatedAt' | 'comments'>) => Promise<Incident>;
  updateIncident: (id: string, updates: Partial<Incident>) => Promise<void>;
  addComment: (incidentId: string, content: string, author: User) => Promise<void>;
  getIncidentById: (id: string) => Incident | null;
}

export const useIncidentOperations = ({
  createIncident,
  updateIncident,
  addComment,
  getIncidentById
}: UseIncidentOperationsProps) => {
  const handleCreateIncident = useCallback(async (
    incidentData: Omit<Incident, 'id' | 'createdAt' | 'updatedAt' | 'comments'>
  ) => {
    try {
      const newIncident = await createIncident(incidentData);
      return { success: true, incident: newIncident };
    } catch (error) {
      console.error('Failed to create incident:', error);
      return { success: false, error: 'Falha ao criar incidente' };
    }
  }, [createIncident]);

  const handleUpdateIncident = useCallback(async (
    id: string,
    updates: Partial<Incident>
  ) => {
    try {
      await updateIncident(id, updates);
      return { success: true };
    } catch (error) {
      console.error('Failed to update incident:', error);
      return { success: false, error: 'Falha ao atualizar incidente' };
    }
  }, [updateIncident]);

  const handleAddComment = useCallback(async (
    incidentId: string,
    content: string,
    author: User
  ) => {
    try {
      await addComment(incidentId, content, author);
      return { success: true };
    } catch (error) {
      console.error('Failed to add comment:', error);
      return { success: false, error: 'Falha ao adicionar comentário' };
    }
  }, [addComment]);

  const handleGetIncident = useCallback((id: string) => {
    try {
      return getIncidentById(id);
    } catch (error) {
      console.error('Failed to get incident:', error);
      return null;
    }
  }, [getIncidentById]);

  return {
    handleCreateIncident,
    handleUpdateIncident,
    handleAddComment,
    handleGetIncident
  };
};
