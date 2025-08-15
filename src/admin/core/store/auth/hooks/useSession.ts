import { useSelector } from 'react-redux';
import type { RootState } from '@store_admin/store';
import { UserRoles } from '@utils/constants/userRoles';

export const useSession = () => {
  const user = useSelector((state: RootState) => state.auth.user);
  const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);
  const token = useSelector((state: RootState) => state.auth.token);
  const refreshToken = useSelector((state: RootState) => state.auth.refreshToken);

  // Puoi aggiungere helper basati su ruolo
  const isAdmin = user?.user_permissions?.includes(UserRoles.ADMIN) || user?.user_permissions?.includes(UserRoles.SUPER_ADMIN);
  const isSuperAdmin = user?.user_permissions?.includes(UserRoles.SUPER_ADMIN);

  return {
    user,
    isAuthenticated,
    token,
    refreshToken,
    isAdmin,
    isSuperAdmin,
  };
};
