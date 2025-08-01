import {
  BdsCard,
  BdsCardBody,
  BdsCardHeader,
  BdsCardSubtitle,
  BdsCardTitle,
  BdsChipTag
} from 'blip-ds/dist/blip-ds-react/components';
import { forwardRef } from 'react';
import type { Incident } from '../types';

interface IncidentCardProps {
  incident: Incident;
  onClick: (incident: Incident) => void;
}

export const IncidentCard = forwardRef<HTMLDivElement, IncidentCardProps>(
  ({ incident, onClick }, ref) => {
    const getStatusColor = (status: Incident['status']) => {
      switch (status) {
        case 'Aberto':
          return 'danger';
        case 'Em andamento':
          return 'warning';
        case 'Resolvido':
          return 'success';
        case 'Cancelado':
          return 'disabled';
        default:
          return 'default';
      }
    };

    const getPriorityColor = (priority: Incident['priority']) => {
      switch (priority) {
        case 'Crítica':
          return 'danger';
        case 'Alta':
          return 'warning';
        case 'Média':
          return 'info';
        case 'Baixa':
          return 'success';
        default:
          return 'default';
      }
    };

    return (
      <div ref={ref}>
        <BdsCard
          clickable
          className="shadow-sm hover:shadow-md transition-shadow cursor-pointer"
          onClick={() => onClick(incident)}
        >
          <BdsCardHeader>
            <div className="flex justify-between items-start">
              <div>
                <BdsCardTitle text={incident.id} />
                <BdsCardSubtitle text={incident.title} />
              </div>
              <div className="flex flex-col gap-1">
                <BdsChipTag color={getStatusColor(incident.status)}>
                  {incident.status}
                </BdsChipTag>
                <BdsChipTag color={getPriorityColor(incident.priority)} size="sm">
                  {incident.priority}
                </BdsChipTag>
              </div>
            </div>
          </BdsCardHeader>
          <BdsCardBody>
            <p className="text-sm text-gray-600 line-clamp-2">
              {incident.description}
            </p>
            <div className="mt-2 flex justify-between items-center text-xs text-gray-500">
              <span>Por: {incident.createdBy.name}</span>
              <span>{new Date(incident.createdAt).toLocaleDateString('pt-BR')}</span>
            </div>
            {incident.assignedTo && (
              <div className="mt-1 text-xs text-blue-600">
                Atribuído a: {incident.assignedTo.name}
              </div>
            )}
          </BdsCardBody>
        </BdsCard>
      </div>
    );
  }
);

IncidentCard.displayName = 'IncidentCard';
