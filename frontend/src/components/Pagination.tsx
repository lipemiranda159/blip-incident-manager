import {
  BdsGrid,
  BdsButton,
  BdsIcon,
  BdsTypo,
  BdsSelect,
  BdsSelectOption
} from 'blip-ds/dist/blip-ds-react/components';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
  onItemsPerPageChange: (itemsPerPage: number) => void;
  loading?: boolean;
}

export const Pagination = ({
  currentPage,
  totalPages,
  totalItems,
  itemsPerPage,
  onPageChange,
  onItemsPerPageChange,
  loading = false
}: PaginationProps) => {
  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  const getVisiblePages = () => {
    const delta = 2; // Number of pages to show on each side of current page
    const range = [];
    const rangeWithDots = [];

    // Calculate range
    for (
      let i = Math.max(2, currentPage - delta);
      i <= Math.min(totalPages - 1, currentPage + delta);
      i++
    ) {
      range.push(i);
    }

    if (currentPage - delta > 2) {
      rangeWithDots.push(1, '...');
    } else {
      rangeWithDots.push(1);
    }

    rangeWithDots.push(...range);

    if (currentPage + delta < totalPages - 1) {
      rangeWithDots.push('...', totalPages);
    } else {
      rangeWithDots.push(totalPages);
    }

    return rangeWithDots;
  };

  const visiblePages = totalPages > 1 ? getVisiblePages() : [1];

  if (totalPages <= 1) {
    return (
      <BdsGrid direction="row" justify-content="space-between" align-items="center" padding="2">
        <BdsTypo variant="fs-14" color="content-secondary">
          {totalItems} {totalItems === 1 ? 'incidente' : 'incidentes'}
        </BdsTypo>
        <BdsGrid direction="row" gap="2" align-items="center">
          <BdsTypo variant="fs-12" color="content-secondary">
            Itens por página:
          </BdsTypo>
          <BdsSelect
            value={itemsPerPage.toString()}
            onBdsChange={(e: CustomEvent) => onItemsPerPageChange(Number(e.detail.value))}
            disabled={loading}
          >
            <BdsSelectOption value="10">10</BdsSelectOption>
            <BdsSelectOption value="25">25</BdsSelectOption>
            <BdsSelectOption value="50">50</BdsSelectOption>
            <BdsSelectOption value="100">100</BdsSelectOption>
          </BdsSelect>
        </BdsGrid>
      </BdsGrid>
    );
  }

  return (
    <BdsGrid direction="column" gap="3">
      {/* Pagination Info */}
      <BdsGrid direction="row" justify-content="space-between" align-items="center">
        <BdsTypo variant="fs-14" color="content-secondary">
          Mostrando {startItem} a {endItem} de {totalItems} incidentes
        </BdsTypo>
        <BdsGrid direction="row" gap="2" align-items="center">
          <BdsTypo variant="fs-12" color="content-secondary">
            Itens por página:
          </BdsTypo>
          <BdsSelect
            value={itemsPerPage.toString()}
            onBdsChange={(e: CustomEvent) => onItemsPerPageChange(Number(e.detail.value))}
            disabled={loading}
          >
            <BdsSelectOption value="10">10</BdsSelectOption>
            <BdsSelectOption value="25">25</BdsSelectOption>
            <BdsSelectOption value="50">50</BdsSelectOption>
            <BdsSelectOption value="100">100</BdsSelectOption>
          </BdsSelect>
        </BdsGrid>
      </BdsGrid>

      {/* Pagination Controls */}
      <BdsGrid direction="row" justify-content="center" align-items="center" gap="1">
        {/* Previous Button */}
        <BdsButton
          variant="ghost"
          size="short"
          disabled={currentPage === 1 || loading}
          onClick={() => onPageChange(currentPage - 1)}
        >
          <BdsIcon name="arrow-left" size="small" />
          Anterior
        </BdsButton>

        {/* Page Numbers */}
        <BdsGrid direction="row" gap="1" align-items="center">
          {visiblePages.map((page, index) => {
            if (page === '...') {
              return (
                <BdsTypo key={`dots-${index}`} variant="fs-14" color="content-secondary">
                  ...
                </BdsTypo>
              );
            }

            const pageNumber = page as number;
            const isCurrentPage = pageNumber === currentPage;

            return (
              <BdsButton
                key={pageNumber}
                variant={isCurrentPage ? 'primary' : 'ghost'}
                size="short"
                disabled={loading}
                onClick={() => onPageChange(pageNumber)}
                style={{
                  minWidth: '40px',
                  fontWeight: isCurrentPage ? 'bold' : 'normal'
                }}
              >
                {pageNumber}
              </BdsButton>
            );
          })}
        </BdsGrid>

        {/* Next Button */}
        <BdsButton
          variant="ghost"
          size="short"
          disabled={currentPage === totalPages || loading}
          onClick={() => onPageChange(currentPage + 1)}
        >
          Próxima
          <BdsIcon name="arrow-right" size="small" />
        </BdsButton>
      </BdsGrid>
    </BdsGrid>
  );
};
