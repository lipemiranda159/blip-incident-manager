import {
  BdsGrid,
  BdsButton,
  BdsIcon,
  BdsTypo,
  BdsSelect,
  BdsSelectOption,
  BdsPagination
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

  // Handler para o evento bdsPaginationChange do BdsPagination
  const handleBdsPaginationChange = (event: CustomEvent) => {
    const newPage = event.detail;
    if (newPage && newPage !== currentPage) {
      onPageChange(newPage);
    }
  };

  return (
    <BdsGrid direction="row" justify-content="space-between" align-items="center" padding="2">
      <BdsTypo variant="fs-14" color="content-secondary">
        {totalItems} {totalItems === 1 ? 'incidente' : 'incidentes'}
      </BdsTypo>

      {totalPages > 1 && (
        <BdsPagination
          pages={totalPages}
          current-page={currentPage}
          startedPage={1}
          pageCounter={true}
          onBdsPaginationChange={handleBdsPaginationChange}
        />
      )}

    </BdsGrid>
  );
};
