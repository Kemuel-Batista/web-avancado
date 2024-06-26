import { useAuth } from '@/contexts/auth-context'
import { formatTimestamp } from '@/utils/masks'

import { ChatMessageResponse } from '../types/chat-message-response'

interface ChatListProps {
  chat: ChatMessageResponse[]
}

export function ChatList({ chat }: ChatListProps) {
  const { user } = useAuth()

  return (
    <div>
      {chat.map((chat, index) => {
        const isSender = chat.senderName === user?.name
        const isRecipient = chat.recipientName === user?.name

        const flexClasses = isSender
          ? 'flex flex-col justify-end items-end'
          : ''
        const chatBgClasses = isSender
          ? 'bg-gray-900 text-white'
          : 'bg-blue-200 text-gray-700'

        return (
          <div className={flexClasses} key={index}>
            <div
              className={`${chatBgClasses} mt-2 max-w-xs rounded-md px-3 py-3 text-sm`}
            >
              <p>{chat.message}</p>
            </div>
            <div
              className={`${isSender ? 'w-full text-right' : ''} text-blue-950`}
            >
              <small>
                {isSender
                  ? 'Você'
                  : !isRecipient
                    ? chat.recipientName
                    : chat.senderName}{' '}
                · {formatTimestamp(chat.createdAt)}
              </small>
            </div>
          </div>
        )
      })}
    </div>
  )
}
