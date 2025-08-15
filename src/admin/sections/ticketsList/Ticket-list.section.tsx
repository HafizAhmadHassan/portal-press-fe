import React, { useCallback, useMemo } from 'react';
import { useListQueryParams } from '@hooks/useListQueryParams';
import { createTicketsTableConfig } from './_config/ticketsTableConfig';
import { createTicketsFilterConfig, TicketFields } from './_config/ticketsFilterConfig';
import styles from './_styles/TicketsListSection.module.scss';
import { SectionHeaderComponent } from '@sections_admin/_commons/components/SectionHeader/Section-header.component';
import { SectionFilterComponent } from '@sections_admin/_commons/components/SectionFilters/Section-filters.component';
import { GenericTableWithLogic } from '@shared/table/components/GenericTableWhitLogic.component';
import { usePagination } from '@hooks/usePagination.ts';
import { useTicketsWithDevices } from '@store_admin/tickets/hooks/useTicketWithDevices';
import ModalCloseTicket from '@sections_admin/ticketsList/_modals/ModalCloseTIcket/ModalCloseTicket.component';
import { Download, Plus, RefreshCw } from 'lucide-react';
import { Divider } from '@shared/divider/Divider.component.tsx';
import { SimpleButton } from '@shared/simple-btn/SimpleButton.component.tsx';

export const TicketsListSections: React.FC = () => {
  // ✅ Query params management
  const {
    filters,
    sortBy,
    sortOrder, 
    page,
    pageSize,
    setFilter,
    setSort,
    setPage,
    setPageSize,
    resetAll,
  } = useListQueryParams({
    initialFilters: {
      [TicketFields.TITLE]: '',
      [TicketFields.STATUS]: '',
      [TicketFields.PRIORITY]: '',
      [TicketFields.CATEGORY]: '',
      [TicketFields.ASSIGNED_TO]: '',
    },
  });

  // ✅ Build query params for API call
  const queryParams = useMemo(
    () => ({
      ...filters,
      sortBy,
      sortOrder,
      page,
      page_size: pageSize,
    }),
    [filters, sortBy, sortOrder, page, pageSize]
  );

  // ✅ API calls con device join
  const {
    tickets,
    meta,
    isLoading,
    error,
    refetch,
    createNewTicket,
    updateExistingTicket,
    deleteExistingTicket,
  } = useTicketsWithDevices(queryParams);

 

  // ✅ Pagination management (unica istanza)
  const pagination = usePagination({
    initialPage: page,
    initialPageSize: pageSize,
    totalItems: meta?.total,
    totalPages: meta?.total_pages,
    onChange: (newPage, newSize) => {
      setPage(newPage);
      setPageSize(newSize);
    },
  });

  // ✅ Reset handler unificato
  const handleResetAll = () => {
    resetAll();
    pagination.resetPagination();
    refetch();
  };

  // ✅ CRUD operations
  const handleCreate = useCallback(
    async (data) => {
      const created = await createNewTicket(data).unwrap();
      refetch();
      return created;
    },
    [createNewTicket, refetch]
  );

  const handleEdit = useCallback(
    async ({ id, ...rest }) => {
      const updated = await updateExistingTicket({ id, data: rest }).unwrap();
      refetch();
      return updated;
    },
    [updateExistingTicket, refetch]
  );

  const handleDelete = useCallback(
    async (ticket) => {
      if (window.confirm(`Confermi eliminazione ticket #${ticket.id}?`)) {
        await deleteExistingTicket(ticket.id).unwrap();
        refetch();
      }
    },
    [deleteExistingTicket, refetch]
  );

  // ✅ Table configuration
  const tableConfig = useMemo(
    () =>
      createTicketsTableConfig({
        tickets,
        onEdit: handleEdit,
        onDelete: handleDelete,
        isLoading,
        sortBy,
        sortOrder,
        onSort: setSort,
        pagination: {
          enabled: true,
          currentPage: meta?.page ?? page,
          pageSize,
          totalPages: meta?.total_pages ?? 1,
          totalItems: meta?.total ?? 0,
          onPageChange: setPage,
          onPageSizeChange: setPageSize,
          hasNext: meta?.has_next,
          hasPrev: meta?.has_prev,
        },
      }),
    [tickets, handleEdit, handleDelete, isLoading, sortBy, sortOrder, setSort, meta, page, pageSize, setPage, setPageSize]
  );

  // ✅ Filters configuration
  const filtersConfig = useMemo(
    () => createTicketsFilterConfig({ filters, setFilter }),
    [filters, setFilter]
  );

  console.log('TICKETS', tickets);

  return (
    <div className={styles['tickets-list-page']}>
      <SectionHeaderComponent
        title="Tickets"
        subTitle={`Gestisci i tickets (${meta?.total ?? 0} totali)`}
      />

      <div className={styles['tickets-list-page__filters']}>
        <SectionFilterComponent 
          filters={filtersConfig} 
          onResetFilters={handleResetAll} 
          isLoading={isLoading} 
        />
      </div>
      
      <Divider />

      <div className={styles['tickets-list-page__table-wrapper']}>
        <GenericTableWithLogic 
          config={tableConfig} 
          loading={isLoading}
          pagination={{
            page: meta?.page ?? page,
            pageSize,
            total: meta?.total ?? 0,
            totalPages: meta?.total_pages ?? 1,
          }}
          onPageChange={setPage}
        />
      </div>
    </div>
  );
};