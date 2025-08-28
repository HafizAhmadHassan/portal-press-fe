import { ArrowLeft, RotateCw } from "lucide-react";
import style from "./PageHeader.module.scss";
import Switch from "@root/components/shared/switch/Switch.component";
import { SimpleButton } from "@root/components/shared/simple-btn/SimpleButton.component";

export interface PageHeaderProps {
  editMode: boolean;
  showEditSwitch: boolean;
  onToggleEdit: (on: boolean) => void;
  refetch: () => void;
  navigateTo: () => void;
}

export const PageHeader = ({
  editMode,
  showEditSwitch,
  onToggleEdit,
  refetch,
  navigateTo,
}: PageHeaderProps) => {
  return (
    <div className={style.pageHeader}>
      <SimpleButton
        className={style.backBtn}
        onClick={navigateTo}
        icon={ArrowLeft}
      >
        <span>Torna alla Dashboard</span>
      </SimpleButton>

      <div className={style.pageActions}>
        <SimpleButton
          size="sm"
          color="secondary"
          variant="ghost"
          icon={RotateCw}
          onClick={refetch}
        >
          Aggiorna
        </SimpleButton>

        {showEditSwitch && (
          <Switch
            size="md"
            color="primary"
            checked={editMode}
            onChange={onToggleEdit}
            label={
              <span
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 6,
                }}
              >
                Modifica {editMode ? "attiva" : "disattiva"}
              </span>
            }
            labelPosition="right"
            title="Attiva/disattiva la modalità modifica"
          />
        )}
      </div>
    </div>
  );
};
