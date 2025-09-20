import React from "react";
import type { TableColumn } from "@components/shared/table/types/GenericTable.types";
import type { GpsDevice } from "@store_admin/gps/gps.types";
import { ModalDetailsGps } from "@root/pages/admin/sections/gpsList/_modals/ModalDetailsGps/ModalDetailsGps.component";
import ModalCreateUpdateGps from "../_modals/ModalCreateUpdateGps/ModalCreateUpdateGps.component";
import { ModalDeleteGps } from "../_modals/ModalDeleteGps/ModalDeleteGps.component";

type GpsColumnKey = keyof GpsDevice | "coords" | "actions";

export const getGpsColumns = ({
  onEdit,
  onDelete,
}: {
  onEdit: (
    d: Partial<GpsDevice> & { id: number | string }
  ) => void | Promise<void>;
  onDelete: (d: GpsDevice) => void | Promise<void>;
}): Array<TableColumn<GpsDevice, GpsColumnKey>> => {
  const tPrimary = "var(--text-primary)";
  const tSecondary = "var(--text-secondary)";

  return [
    {
      key: "codice",
      header: "Codice Gps",
      type: "text",
      width: "110px",
      sortable: true,
    },
    {
      key: "address",
      header: "Indirizzo",
      type: "custom",
      width: "320px",
      sortable: true,
      render: (_v, row) => (
        <div>
          <div style={{ fontWeight: 600, fontSize: 14, color: tPrimary }}>
            {row.address || "—"}
          </div>
          <div style={{ fontSize: 12, color: tSecondary }}>
            {row.municipility || "—"}
          </div>
        </div>
      ),
    },
    {
      key: "customer_Name",
      header: "Cliente",
      type: "text",
      width: "140px",
      sortable: true,
    },
    {
      key: "waste",
      header: "Rifiuto",
      type: "text",
      width: "120px",
      sortable: true,
    },
    {
      key: "coords",
      header: "Coordinate",
      type: "custom",
      width: "160px",
      render: (_v, row) => (
        <div style={{ fontSize: 12, color: tPrimary }}>
          X: {row.gps_x ?? "—"}
          <br />
          Y: {row.gps_y ?? "—"}
        </div>
      ),
    },
    {
      key: "actions",
      header: "Azioni",
      type: "custom",
      width: "140px",
      render: (_v, row) => (
        <div style={{ display: "flex", gap: 12, justifyContent: "center" }}>
          <ModalDetailsGps device={row} />
          <ModalCreateUpdateGps
            mode="edit"
            initialDevice={row}
            onSave={onEdit}
          />
          <ModalDeleteGps device={row} onConfirm={onDelete} />
        </div>
      ),
    },
  ];
};

export default getGpsColumns;
