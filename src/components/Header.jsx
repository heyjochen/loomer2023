import { Fragment } from 'react'
import { useSession } from 'next-auth/react'
import Link from 'next/link'
import { Popover, Transition } from '@headlessui/react'
import clsx from 'clsx'

import { Button } from '@/components/Button'
import { Container } from '@/components/Container'
import { Logo } from '@/components/Logo'

export function Header() {
  const { data: session, status } = useSession()
  const user = session?.user

  return (
    <header className="py-10">
      <Container>
        <nav className="relative z-50 flex justify-between">
          <div className="flex items-center md:gap-x-12">
            <Link href="/" aria-label="Home">
              <Logo className="h-10 w-auto" />
            </Link>
          </div>
          <div className="flex items-center gap-x-5 md:gap-x-8">
            <Button href={user ? '/dashboard' : '/login'} color="blue">
              <span>{user ? 'Dashboard' : 'Get started'}</span>
            </Button>
          </div>
        </nav>
      </Container>
    </header>
  )
}
