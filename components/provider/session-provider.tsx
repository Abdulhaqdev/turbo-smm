"use client";

import { useSession } from '@/hooks/useSession';
import { UserSession } from '@/types/session';
import { FC, useEffect } from 'react';

type Props = {
  children: React.ReactNode;
  session: UserSession;
};

const SessionProvider: FC<Props> = ({ session, children }) => {
  useEffect(() => useSession.getState().setSession(session), [session]);
  return <>{children}</>;
};

export default SessionProvider;