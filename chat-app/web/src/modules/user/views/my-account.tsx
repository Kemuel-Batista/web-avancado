import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'

import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useAuth } from '@/contexts/auth-context'
import { Nav } from '@/modules/public/components/nav'

import {
  ChangeNameFormData,
  changeNameSchema,
} from '../schemas/change-name-schema'
import { ChangeNameUserService } from '../services/change-name-user'

export function MyAccountView() {
  const { user, getMe } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (user.id === '') {
      router.push('/')
    }
  }, [])

  const form = useForm<ChangeNameFormData>({
    resolver: zodResolver(changeNameSchema),
    defaultValues: {
      name: user.name,
    },
  })

  const { mutateAsync, isPending } = ChangeNameUserService()

  async function onSubmit(data: ChangeNameFormData) {
    await mutateAsync(data, {
      onSuccess: () => {
        getMe()

        window.location.reload()
      },
    })
  }

  return (
    <Form {...form}>
      <main className="flex min-h-screen w-full flex-col">
        <Nav />
        <main className="grid px-12 pt-10 gap-10 mobile:px-6 mobile:gap-4">
          <Label className="text-xl mobile:text-lg">Minha conta</Label>

          <form className="grid gap-6" onSubmit={form.handleSubmit(onSubmit)}>
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      placeholder="Seu nome"
                      type="text"
                      autoCapitalize="none"
                      autoCorrect="off"
                      disabled={isPending}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Input
              type="text"
              autoCapitalize="none"
              autoCorrect="off"
              disabled={true}
              placeholder={user.lastName}
              value={user.lastName}
            />

            <Input
              type="text"
              autoCapitalize="none"
              autoCorrect="off"
              disabled={true}
              placeholder={user.email}
              value={user.email}
            />

            <Input
              type="text"
              autoCapitalize="none"
              autoCorrect="off"
              disabled={true}
              placeholder={user.photo}
              value={user.photo}
            />

            <Button type="submit" size="sm">
              Atualizar nome
            </Button>
          </form>
        </main>
      </main>
    </Form>
  )
}
