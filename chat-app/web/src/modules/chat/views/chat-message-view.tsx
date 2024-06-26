import { zodResolver } from '@hookform/resolvers/zod'
import { getCookie } from 'cookies-next'
import { ArrowLeft, CircleUser, SendIcon } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'
import { useForm } from 'react-hook-form'
import io from 'socket.io-client'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { useAuth } from '@/contexts/auth-context'
import { env } from '@/env'

import { ChatList } from '../components/chat-list'
import {
  ChatMessageFormData,
  chatMessageSchema,
} from '../schemas/chat-message-schema'
import { ChatInfoProps } from '../types/chat-info-props'
import { ChatInfoResponseProps } from '../types/chat-info-response-props'
import { ChatMessageResponse } from '../types/chat-message-response'

const socket = io(env.NEXT_PUBLIC_SOCKET_IO_URL, {
  withCredentials: true,
  reconnectionAttempts: 3,
  retries: 3,
  timeout: 2000,
})
export function ChatMessageView() {
  const { user } = useAuth()
  const router = useRouter()
  const [participant, setParticipant] = useState<ChatInfoProps>()
  const [messages, setMessages] = useState<ChatMessageResponse[]>([])
  const chatContainerRef = useRef<HTMLDivElement | null>(null)

  const roomId = getCookie('chatapp.room')

  const form = useForm<ChatMessageFormData>({
    resolver: zodResolver(chatMessageSchema),
  })

  useEffect(() => {
    console.log(socket)

    const onConnect = () => {
      socket.emit('joinRoom', { roomId })
    }

    const onLoadMessages = (loadedMessages: ChatMessageResponse[]) => {
      setMessages(loadedMessages)
    }

    const onNewMessage = (newMessage: ChatMessageResponse) => {
      setMessages((prevMessages) => [...prevMessages, newMessage])
    }

    const onRoomDetails = (room: ChatInfoResponseProps) => {
      room.participantOneName === user?.name
        ? setParticipant({
            participantId: room.participantTwoId,
            participantName: room.participantTwoName,
            participantPhoto: room.participantTwoPhoto,
          })
        : setParticipant({
            participantId: room.participantOneId,
            participantName: room.participantOneName,
            participantPhoto: room.participantOnePhoto,
          })
    }

    socket.on('connect', onConnect)
    socket.on('loadMessages', onLoadMessages)
    socket.on('newMessage', onNewMessage)
    socket.on('room-details', onRoomDetails)

    return () => {
      socket.off('connect', onConnect)
      socket.off('loadMessages', onLoadMessages)
      socket.off('newMessage', onNewMessage)
      socket.off('room-details', onRoomDetails)
    }
  }, [roomId, user, participant])

  function handleNavigateBack() {
    router.push('/chats')
  }

  async function handleSubmitNewMessage(data: ChatMessageFormData) {
    if (data.mensagem === '') return

    socket.emit('sendMessage', {
      message: data.mensagem,
      roomId,
      userRecipientId: participant?.participantId,
    })

    form.setValue('mensagem', '')
  }

  return (
    <Form {...form}>
      <div ref={chatContainerRef} className="flex min-h-screen w-full flex-col">
        <div className="sticky top-0 flex h-20 flex-row items-center justify-start bg-white p-5">
          <button type="button" onClick={handleNavigateBack}>
            <ArrowLeft size={30} />
          </button>
          <Avatar>
            <AvatarImage src={participant?.participantPhoto} />
            <AvatarFallback>
              <CircleUser className="h-5 w-5" />
            </AvatarFallback>
          </Avatar>
          <label className="ml-3 text-lg font-medium">
            {participant?.participantName}
          </label>
        </div>
        <div className="flex flex-grow flex-col overflow-auto bg-zinc-50 px-10 py-5">
          <ChatList chat={messages ?? []} />
        </div>
        <form
          onSubmit={form.handleSubmit(handleSubmitNewMessage)}
          className="flex w-full items-center justify-between gap-3 bg-card p-5 shadow"
        >
          <FormField
            control={form.control}
            name="mensagem"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormControl>
                  <Input
                    placeholder="Enviar mensagem"
                    maxLength={255}
                    autoComplete="off"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" variant="ghost">
            <SendIcon size={25} />
          </Button>
        </form>
      </div>
    </Form>
  )
}
