import { Download, Grid, List, Map, Plus, RefreshCw } from 'lucide-react';
import { ModalCreateDevice } from '@sections_admin/devicesList/_modals/ModalCreateDevice/ModalCreateDevice.component';
import { SimpleButton } from '@shared/simple-btn/SimpleButton.component.tsx';

export const createHeaderBtnConfig = ({
  onRefreshClick,
  getLoadingState,
  refetch,
  refetchMap,
  reloadGrid,
  toggleCardsTable,
  toggleMap,
  isCards,
  isMap,
  onExportClick,
  createNewDevice,
}): any => [
  {
    onClick: onRefreshClick,
    variant: 'outline',
    color: 'secondary',
    size: 'sm',
    icon: RefreshCw,
    label: 'Aggiorna',
    disabled: getLoadingState(),
    createNewDevice,
  },
  {
    component: (
      <ModalCreateDevice
        onSave={async (deviceData) => { 

          if (!deviceData) {
            console.error('HEADER_CONFIG - deviceData is null or undefined!');
            throw new Error('Device data is required');
          }
          await createNewDevice(deviceData);
         
        }}
        triggerButton={
          <SimpleButton variant="outline" color="primary" size="sm" icon={Plus}>
            Nuovo
          </SimpleButton>
        }
      />
    ),
  },
  {
    onClick: onExportClick,
    variant: 'outline',
    color: 'success',
    size: 'sm',
    icon: Download,
    label: 'Esporta',
  },
  {
    onClick: toggleCardsTable,
    variant: 'outline',
    color: 'primary',
    size: 'sm',
    icon: isCards ? List : Grid,
    label: isCards ? 'Tabella' : 'Griglia',
  },
  {
    onClick: toggleMap,
    variant: 'outline',
    color: 'primary',
    size: 'sm',
    icon: Map,
    label: isMap ? 'Lista' : 'Mappa',
  },
];
