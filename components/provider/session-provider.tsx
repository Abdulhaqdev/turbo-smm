"use client"

import { useSession } from '@/hooks/useSession'
import { ISession } from '@/types/session'
import { FC, Fragment, ReactNode, useEffect } from 'react'

type Props = {
	session?: ISession
	children?: ReactNode
}

const SessionProvider: FC<Props> = ({ session, children }) => {
	useEffect(() => useSession.getState().setSession(session), [session])
	return <Fragment>{children}</Fragment>
}

export default SessionProvider
