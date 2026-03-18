import React, { useState, useEffect, useCallback, ReactNode } from 'react';
import { MemberActions, MemberContext, MemberState } from '.';
import { getCurrentMember, logoutUser } from '..';

interface MemberProviderProps {
  children: ReactNode;
}

export const MemberProvider: React.FC<MemberProviderProps> = ({ children }) => {
  const [state, setState] = useState<MemberState>({
    member: null,
    isAuthenticated: false,
    isLoading: true,
    error: null,
  });

  const updateState = useCallback((updates: Partial<MemberState>) => {
    setState((prev) => ({ ...prev, ...updates }));
  }, []);

  // Check session on mount
  useEffect(() => {
    getCurrentMember()
      .then((member) => updateState({ member, isAuthenticated: !!member, isLoading: false }))
      .catch(() => updateState({ isLoading: false }));
  }, []);

  const actions: MemberActions = {
    loadCurrentMember: useCallback(async () => {
      updateState({ isLoading: true, error: null });
      try {
        const member = await getCurrentMember();
        updateState({ member, isAuthenticated: !!member, isLoading: false });
      } catch (err) {
        updateState({ error: err instanceof Error ? err.message : 'Failed', isLoading: false });
      }
    }, [updateState]),

    login: useCallback(() => {
      window.location.href = '/login';
    }, []),

    logout: useCallback(async () => {
      await logoutUser();
      updateState({ member: null, isAuthenticated: false });
    }, [updateState]),

    clearMember: useCallback(() => {
      updateState({ member: null, isAuthenticated: false, error: null });
    }, [updateState]),
  };

  return (
    <MemberContext.Provider value={{ ...state, actions }}>
      {children}
    </MemberContext.Provider>
  );
};
