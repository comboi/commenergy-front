'use client';

import React, { createContext, useContext, ReactNode } from 'react';
import { Community } from '../model/community';
import { useAuth } from '@/contexts/auth-context';

interface CommunityAdminContextType {
  isLoggedUserAdmin: boolean;
  isUserAdmin: (userId: string) => boolean;
  community: Community | null;
}

const CommunityAdminContext = createContext<CommunityAdminContextType | null>(
  null
);

interface CommunityAdminProviderProps {
  children: ReactNode;
  community: Community | null;
}

export function CommunityAdminProvider({
  children,
  community,
}: CommunityAdminProviderProps) {
  const { user: loggedUser } = useAuth();

  const isLoggedUserAdmin = community
    ? (community.users ?? []).some(
        (user) => user.userId === loggedUser?.id && user.role === 'admin'
      )
    : false;

  const isUserAdmin = (userId: string): boolean => {
    if (!community) return false;
    return (community.users ?? []).some(
      (user) => user.userId === userId && user.role === 'admin'
    );
  };

  const value: CommunityAdminContextType = {
    isLoggedUserAdmin,
    isUserAdmin,
    community,
  };

  return (
    <CommunityAdminContext.Provider value={value}>
      {children}
    </CommunityAdminContext.Provider>
  );
}

export function useCommunityAdmin() {
  const context = useContext(CommunityAdminContext);
  if (!context) {
    throw new Error(
      'useCommunityAdmin must be used within a CommunityAdminProvider'
    );
  }
  return context;
}

export default CommunityAdminContext;
