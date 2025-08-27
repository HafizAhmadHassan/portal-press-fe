// machineTableConfig.ts
/*import { TableConfig } from '@shared/table/types/GenericTable.types';
import { ActionConfig } from '@shared/table/types/GenericTable.types';*/

const machineTableConfig: any = {
  columns: [
    {
      key: "status_Machine_Blocked",
      header: "Stato",
      type: "badge",
      badgeConfig: {
        true: { label: "Attivo", className: "bg-success text-white" },
        false: { label: "Disattivato", className: "bg-danger text-white" },
      },
      accessor: (item) => {
        console.log(String(item?.status_Machine_Blocked));
        return String(item?.status_Machine_Blocked);
      },
    },
    {
      key: "machine_Name",
      header: "Nome Macchina",
      type: "text",
    },
    {
      key: "city",
      header: "Città",
      type: "text",
    },
    {
      key: "country",
      header: "Paese",
      type: "text",
    },
    {
      key: "customer_Name",
      header: "Cliente",
      type: "text",
    },
    {
      key: "waste",
      header: "Tipo Rifiuto",
      type: "text",
    },
    {
      key: "azioni",
      header: "Azioni",
      type: "actions",
      actions: [
        {
          label: "Riattiva",
          onClick: (item) => console.log("Riattiva:", item),
          className: "btn-warning", // puoi collegarlo a uno stile giallo
          disabled: (item) => item?.status === 1,
        },
        {
          label: "Dettagli",
          onClick: (item) => console.log("Dettagli:", item),
          className: "btn-info", // puoi collegarlo a uno stile azzurro
        },
      ] as any[],
    },
  ],
  data: [],
  pagination: {
    enabled: true,
    pageSize: 10,
  },
  sorting: {
    enabled: true,
    defaultSort: {
      key: "machine_Name",
      direction: "asc",
    },
  },
  selection: {
    enabled: true,
    idField: "id",
  },
};

export default machineTableConfig;
