'use client'

import { CircleUser } from 'lucide-react'
import { useRouter } from 'next/navigation'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Icons } from '@/components/ui/icons'
import { Label } from '@/components/ui/label'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { CreateRoomService } from '@/modules/chat/services/create-room'
import { ListUsersService } from '@/modules/user/services/list-users'

import { Nav } from '../components/nav'

export function HomeView() {
  const router = useRouter()

  const { data } = ListUsersService({
    allRecords: true,
  })
  const users = data?.users || []

  const { mutateAsync, isPending } = CreateRoomService()

  async function handleCreateRoom(participantTwoId: string) {
    await mutateAsync(
      {
        participantTwoId,
      },
      {
        onSuccess: () => {
          router.push('/chat')
        },
      },
    )
  }

  return (
    <main className="flex min-h-screen w-full flex-col">
      <Nav />
      <main className="grid px-12 pt-10 gap-10 mobile:px-6 mobile:gap-4">
        <Label className="text-xl mobile:text-lg">
          Listagem de usuários 👀
        </Label>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Foto</TableHead>
              <TableHead>Nome</TableHead>
              <TableHead>Sobrenome</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Opções</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((user) => {
              return (
                <TableRow key={user.id}>
                  <TableCell>
                    <Avatar>
                      <AvatarImage src={user.photo} />
                      <AvatarFallback>
                        <CircleUser className="h-5 w-5" />
                      </AvatarFallback>
                    </Avatar>
                  </TableCell>
                  <TableCell>{user.name}</TableCell>
                  <TableCell>{user.lastName}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    <Button
                      onClick={() => handleCreateRoom(user.id)}
                      disabled={isPending}
                    >
                      {isPending && (
                        <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                      )}
                      Iniciar chat
                    </Button>
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </main>
      <footer className="mt-10"></footer>
    </main>
  )
}
