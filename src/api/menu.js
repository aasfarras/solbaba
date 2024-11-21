import useSWR, { mutate } from "swr";
import { useMemo } from "react";

const initialState = {
  openedItem: "dashboard",
  openedComponent: "buttons",
  openedHorizontalItem: null,
  isDashboardDrawerOpened: false,
  isComponentDrawerOpened: true,
};

const customizationReducer = (state = initialState, action) => {
  switch (action.type) {
    case MENU_OPEN:
      return {
        ...state,
        isOpen: state.isOpen.includes(action.id)
          ? state.isOpen.filter((id) => id !== action.id)
          : [...state.isOpen, action.id],
        selectedItem: action.id, // Update selected item
      };
    // other cases...
    default:
      return state;
  }
};

export const endpoints = {
  key: "api/menu",
  master: "master",
  dashboard: "/dashboard", // server URL
};

export function useGetMenuMaster() {
  const { data, isLoading } = useSWR(
    endpoints.key + endpoints.master,
    () => initialState,
    {
      revalidateIfStale: false,
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
    }
  );

  const memoizedValue = useMemo(
    () => ({
      menuMaster: data,
      menuMasterLoading: isLoading,
    }),
    [data, isLoading]
  );

  return memoizedValue;
}

export function handlerDrawerOpen(isDashboardDrawerOpened) {
  // to update local state based on key

  mutate(
    endpoints.key + endpoints.master,
    (currentMenuMaster) => {
      return { ...currentMenuMaster, isDashboardDrawerOpened };
    },
    false
  );
}

export function handlerActiveItem(openedItem) {
  // to update local state based on key

  mutate(
    endpoints.key + endpoints.master,
    (currentMenuMaster) => {
      return { ...currentMenuMaster, openedItem };
    },
    false
  );
}
