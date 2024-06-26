import { CircleUser, MessageCircle } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useAuth } from '@/contexts/auth-context'

export function Nav() {
  const router = useRouter()
  const { user, signOut, isAuthenticated } = useAuth()

  function handleNavigateToLogin() {
    router.push('/')
  }

  async function handleSignOut() {
    await signOut()
    router.push('/')
  }

  function handleNavigateToMyChats() {
    router.push('/chats')
  }

  function handleNavigateToMyAccount() {
    router.push('/user/my-account')
  }

  return (
    <header className="sticky flex h-16 items-center gap-4 border-b bg-background px-4">
      <nav className="flex flex-row text-lg font-medium items-center gap-5 md:text-sm lg:gap-6">
        <Link
          href="/home"
          className="flex items-center gap-2 text-lg font-semibold md:text-base"
        >
          <MessageCircle className="h-6 w-6" />
          <span className="sr-only">Acme Inc</span>
        </Link>
        <Link
          href="/home"
          className="text-foreground transition-colors hover:text-foreground mobile:text-sm"
        >
          Chat App
        </Link>
      </nav>
      <div className="flex w-full items-center gap-4 md:ml-auto md:gap-2 lg:gap-4">
        <form className="ml-auto flex-1 sm:flex-initial"></form>
        {!isAuthenticated ? (
          <Button onClick={handleNavigateToLogin} className="mobile:text-xs">
            Entrar
          </Button>
        ) : (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="secondary" size="icon" className="rounded-full">
                <Avatar>
                  <AvatarImage src={user.photo} />
                  <AvatarFallback>
                    <CircleUser className="h-5 w-5" />
                  </AvatarFallback>
                </Avatar>
                <span className="sr-only">Toggle user menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel
                onClick={handleNavigateToMyAccount}
                className="hover:cursor-pointer"
              >
                Minha conta
              </DropdownMenuLabel>
              <DropdownMenuItem
                onClick={handleNavigateToMyChats}
                className="hover:cursor-pointer"
              >
                Meus chats
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleSignOut}>Sair</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>
    </header>
  )
}
