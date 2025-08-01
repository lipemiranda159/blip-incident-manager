import { BdsGrid } from 'blip-ds/dist/blip-ds-react/components';
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
      <div className="text-center py-12">
        <div className="text-gray-500 text-lg">
          Nenhum incidente encontrado
        </div>
        <div className="text-gray-400 text-sm mt-2">
          Tente ajustar os filtros para ver mais resultados
        </div>
      </div>
    );
  }

  return (
    <>
      <BdsGrid className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {incidents.map((incident, index) => {
          const isLast = index === incidents.length - 1;

          return (
            <IncidentCard
              key={incident.id}
              ref={isLast ? lastElementRef : null}
              incident={incident}
              onClick={onIncidentClick}
            />
          );
        })}
      </BdsGrid>

      {loading && (
        <div className="flex justify-center mt-8">
          <LoadingSpinner text="Carregando mais incidentes..." />
        </div>
      )}
    </>
  );
};
