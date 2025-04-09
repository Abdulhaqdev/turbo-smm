"use client";

import { useSession } from '@/hooks/useSession';
import { ISession } from '@/types/session';
import { FC, ReactNode, useEffect } from 'react';

type Props = {
  session?: ISession | undefined;
  children?: ReactNode;
};

const SessionProvider: FC<Props> = ({ session, children }) => {
  const { setSession } = useSession();

  useEffect(() => {
    if (session) {
      setSession(session); // Prop o‘zgarganda store ni yangilash
    }
  }, [session, setSession]);

  return <>{children}</>;
};

export default SessionProvider;