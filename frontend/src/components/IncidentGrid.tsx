import { BdsGrid, BdsTypo } from 'blip-ds/dist/blip-ds-react/components';
import { IncidentCard } from './IncidentCard';
import { LoadingSpinner } from './LoadingSpinner';
import { useInfiniteScroll } from '../hooks/useInfiniteScroll';
import type { Incident } from '../types';

interface IncidentGridProps {
  incidents: Incident[];
  loading: boolean;
  hasMore: boolean;
  onLoadMore: () => void;
  onIncidentClick: (incident: Incident) => void;
}

export const IncidentGrid = ({
  incidents,
  loading,
  hasMore,
  onLoadMore,
  onIncidentClick
}: IncidentGridProps) => {
  const { lastElementRef } = useInfiniteScroll({
    loading,
    hasMore,
    onLoadMore
  });

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
      <BdsGrid 
        direction="row" 
        gap="2" 
        flex-wrap="wrap"
      >
        {incidents.map((incident, index) => {
          const isLast = index === incidents.length - 1;

          return (
            <BdsGrid 
              key={incident.id} 
              xxs="12" 
              sm="6" 
              md="3" 
              lg="2"
            >
              <IncidentCard
                ref={isLast ? lastElementRef : null}
                incident={incident}
                onClick={onIncidentClick}
              />
            </BdsGrid>
          );
        })}
      </BdsGrid>

      {loading && (
        <BdsGrid direction="row" justify-content="center" padding="4">
          <LoadingSpinner text="Carregando mais incidentes..." />
        </BdsGrid>
      )}
    </BdsGrid>

  );
};
