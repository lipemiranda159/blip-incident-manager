import {
  BdsCard,
  BdsCardBody,
  BdsCardHeader,
  BdsCardSubtitle,
  BdsCardTitle,
  BdsChipTag,
  BdsGrid,
  BdsTypo
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
        case 'Pendente':
          return 'info';
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
          onClick={() => onClick(incident)}
        >
          <BdsCardHeader>
            <BdsGrid direction="row" justify-content="space-between" align-items="flex-start">
              <BdsGrid direction="column" gap="1">
                <BdsCardTitle text={incident.id} />
                <BdsCardSubtitle text={incident.title} />
              </BdsGrid>
              <BdsGrid direction="row" gap="1" justifyContent='flex-end'>
                <BdsChipTag color={getStatusColor(incident.status)}>
                  {incident.status}
                </BdsChipTag>
                <BdsChipTag color={getPriorityColor(incident.priority)}>
                  {incident.priority}
                </BdsChipTag>
              </BdsGrid>
            </BdsGrid>
          </BdsCardHeader>
          <BdsCardBody>
            <BdsGrid direction="column" gap="2">
              <BdsTypo variant="fs-14" line-height="plus">
                {incident.description}
              </BdsTypo>
              <BdsGrid direction="row" justify-content="space-between" align-items="center">
                <BdsTypo variant="fs-12" color="content-secondary">
                  Por: {incident.createdBy.name}
                </BdsTypo>
                <BdsTypo variant="fs-12" color="content-secondary">
                  {new Date(incident.createdAt).toLocaleDateString('pt-BR')}
                </BdsTypo>
                {incident.assignedTo && (
                  <BdsTypo variant="fs-12" color="primary">
                    Atribuído a: {incident.assignedTo.name}
                  </BdsTypo>
                )}
              </BdsGrid>

            </BdsGrid>
          </BdsCardBody>
        </BdsCard>
      </div>
    );
  }
);

IncidentCard.displayName = 'IncidentCard';
