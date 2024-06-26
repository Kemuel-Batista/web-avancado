import { Label } from '@radix-ui/react-label'
import { setCookie } from 'cookies-next'
import { ArrowRight, Trash } from 'lucide-react'
import { useRouter } from 'next/navigation'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Icons } from '@/components/ui/icons'
import { Skeleton } from '@/components/ui/skeleton'
import { useAuth } from '@/contexts/auth-context'
import { Nav } from '@/modules/public/components/nav'
import { formatTimestamp } from '@/utils/masks'

import { DeleteRoomService } from '../services/delete-room'
import { ListRoomsService } from '../services/list-rooms'
import { ChatInfoProps } from '../types/chat-info-props'

export function RoomsView() {
  const { user } = useAuth()
  const router = useRouter()
  const { data, isLoading } = ListRoomsService({
    allRecords: true,
  })
  const rooms = data?.rooms || []

  const { mutateAsync, isPending } = DeleteRoomService()

  async function handleDeleteRoom(roomId: string) {
    await mutateAsync(roomId, {
      onSuccess: () => {
        router.push('/home')
      },
    })
  }

  async function handleNavigateToChatMessage(roomId: string) {
    setCookie('chatapp.room', roomId, {
      maxAge: 60 * 60 * 1,
      path: '/',
      sameSite: true,
    })

    router.push('/chats/messages')
  }

  return (
    <main className="flex min-h-screen w-full flex-col">
      <Nav />
      <main className="grid px-12 pt-10 gap-10 mobile:px-6 mobile:gap-4">
        <Label className="text-xl mobile:text-lg">Suas conversas</Label>

        {isLoading ? (
          <>
            <Skeleton className="mt-2 h-20 w-full" />
            <Skeleton className="mt-2 h-20 w-full" />
            <Skeleton className="mt-2 h-20 w-full" />
            <Skeleton className="mt-2 h-20 w-full" />
          </>
        ) : rooms && rooms.length > 0 ? (
          rooms.map((item) => {
            const otherParticipant: ChatInfoProps = {
              participantId: '',
              participantName: '',
              participantPhoto: '',
            }

            if (item.participantOneName === user?.name) {
              otherParticipant.participantId = item.participantTwoId
              otherParticipant.participantName = item.participantTwoName
              otherParticipant.participantPhoto = item.participantTwoPhoto
            } else {
              otherParticipant.participantId = item.participantOneId
              otherParticipant.participantName = item.participantOneName
              otherParticipant.participantPhoto = item.participantOnePhoto
            }

            return (
              <Card key={item.id}>
                <CardContent className="flex flex-row items-center gap-3 pt-6">
                  <Avatar>
                    <AvatarImage src={otherParticipant.participantPhoto} />
                    <AvatarFallback>User</AvatarFallback>
                  </Avatar>
                  <div className="flex w-full flex-col">
                    <div className="flex flex-row items-center justify-between gap-2">
                      <label className="text-base font-medium text-muted-foreground">
                        {otherParticipant.participantName}
                      </label>
                      <div className="flex flex-row items-center gap-2">
                        <label className="text-sm">
                          {formatTimestamp(item.lastMessageDate)}
                        </label>
                        <Button
                          size="icon"
                          disabled={isPending}
                          onClick={() => handleDeleteRoom(item.id)}
                        >
                          {isPending ? (
                            <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                          ) : (
                            <Trash size={20} />
                          )}
                        </Button>
                        <Button
                          size="icon"
                          disabled={isPending}
                          onClick={() => handleNavigateToChatMessage(item.id)}
                        >
                          {isPending ? (
                            <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                          ) : (
                            <ArrowRight size={20} />
                          )}
                        </Button>
                      </div>
                    </div>
                    <label className="overflow-hidden truncate text-ellipsis whitespace-nowrap text-left text-sm">
                      {item.lastMessage}
                    </label>
                  </div>
                </CardContent>
              </Card>
            )
          })
        ) : (
          <div className="mt-5 flex w-full flex-col items-center justify-center text-center">
            <span className="text-xl text-muted-foreground">
              Suas mensagens futuras aparecerão aqui.
            </span>
          </div>
        )}
      </main>
    </main>
  )
}
