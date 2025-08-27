import { useSelector } from "react-redux";
import type { RootState } from "@root/store";
import { UserRoles } from "@utils/constants/userRoles";

export const useSession = () => {
  const user = useSelector((state: RootState) => state.auth.user);
  const isAuthenticated = useSelector(
    (state: RootState) => state.auth.isAuthenticated
  );
  const token = useSelector((state: RootState) => state.auth.token);
  const refresh = useSelector((state: RootState) => state.auth.refresh);

  // Puoi aggiungere helper basati su ruolo
  const isAdmin =
    user?.role?.includes(UserRoles.ADMIN) ||
    user?.role?.includes(UserRoles.SUPER_ADMIN);
  const isSuperAdmin = user?.role?.includes(UserRoles.SUPER_ADMIN);

  return {
    user,
    isAuthenticated,
    token,
    refresh,
    isAdmin,
    isSuperAdmin,
  };
};
