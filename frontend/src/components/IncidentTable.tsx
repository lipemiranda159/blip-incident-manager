import {
  BdsTable,
  BdsTableHeader,
  BdsTableBody,
  BdsTableRow,
  BdsTableTh,
  BdsTableCell,
  BdsChipTag,
  BdsTypo,
  BdsGrid,
  BdsButton,
  BdsIcon
} from 'blip-ds/dist/blip-ds-react/components';
import type { Incident } from '../types';

interface IncidentTableProps {
  incidents: Incident[];
  loading: boolean;
  hasMore: boolean;
  onLoadMore: () => void;
  onIncidentClick: (incident: Incident) => void;
}

export const IncidentTable = ({
  incidents,
  loading,
  hasMore,
  onLoadMore,
  onIncidentClick
}: IncidentTableProps) => {
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

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('pt-BR', {
      timeZone: 'America/Sao_Paulo',
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const truncateText = (text: string, maxLength: number = 50) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  if (incidents.length === 0 && !loading) {
    return (
      <BdsGrid
        direction="column"
        align-items="center"
        justify-content="center"
        padding="8"
        gap="2"
      >
        <BdsTypo variant="fs-20" color="content-secondary">
          Nenhum incidente encontrado
        </BdsTypo>
        <BdsTypo variant="fs-14" color="content-tertiary">
          Tente ajustar os filtros para ver mais resultados
        </BdsTypo>
      </BdsGrid>
    );
  }

  return (
    <BdsGrid direction="column" gap="4">
      <BdsTable>
        <BdsTableHeader>
          <BdsTableRow>
            <BdsTableTh>ID</BdsTableTh>
            <BdsTableTh>Título</BdsTableTh>
            <BdsTableTh>Descrição</BdsTableTh>
            <BdsTableTh>Status</BdsTableTh>
            <BdsTableTh>Prioridade</BdsTableTh>
            <BdsTableTh>Criado por</BdsTableTh>
            <BdsTableTh>Atribuído a</BdsTableTh>
            <BdsTableTh>Data</BdsTableTh>
            <BdsTableTh>Ações</BdsTableTh>
          </BdsTableRow>
        </BdsTableHeader>
        <BdsTableBody>
          {incidents.map((incident) => (
            <BdsTableRow key={incident.id}>
              <BdsTableCell>
                <BdsTypo variant="fs-12">
                  {incident.id}
                </BdsTypo>
              </BdsTableCell>
              <BdsTableCell>
                <BdsTypo variant="fs-14" title={incident.title}>
                  {truncateText(incident.title, 30)}
                </BdsTypo>
              </BdsTableCell>
              <BdsTableCell>
                <BdsTypo variant="fs-12" color="content-secondary" title={incident.description}>
                  {truncateText(incident.description, 40)}
                </BdsTypo>
              </BdsTableCell>
              <BdsTableCell>
                <BdsChipTag color={getStatusColor(incident.status)}>
                  {incident.status}
                </BdsChipTag>
              </BdsTableCell>
              <BdsTableCell>
                <BdsChipTag color={getPriorityColor(incident.priority)}>
                  {incident.priority}
                </BdsChipTag>
              </BdsTableCell>
              <BdsTableCell>
                <BdsTypo variant="fs-12">
                  {incident.createdBy.name}
                </BdsTypo>
              </BdsTableCell>
              <BdsTableCell>
                <BdsTypo variant="fs-12" color={incident.assignedTo ? 'primary' : 'content-tertiary'}>
                  {incident.assignedTo ? incident.assignedTo.name : 'Não atribuído'}
                </BdsTypo>
              </BdsTableCell>
              <BdsTableCell>
                <BdsTypo variant="fs-12">
                  {formatDate(incident.createdAt)}
                </BdsTypo>
              </BdsTableCell>
              <BdsTableCell>
                <BdsButton
                  variant="ghost"
                  size="short"
                  onClick={() => onIncidentClick(incident)}
                >
                  <BdsIcon name="edit" size="small" />
                </BdsButton>
              </BdsTableCell>
            </BdsTableRow>
          ))}
        </BdsTableBody>
      </BdsTable>

      {hasMore && (
        <BdsGrid direction="row" justify-content="center" padding="4">
          <BdsButton
            variant="secondary"
            onClick={onLoadMore}
            disabled={loading}
          >
            {loading ? 'Carregando...' : 'Carregar mais incidentes'}
          </BdsButton>
        </BdsGrid>
      )}
    </BdsGrid>
  );
};
