import { zodResolver } from '@hookform/resolvers/zod'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'

import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form'
import { Icons } from '@/components/ui/icons'
import { Input } from '@/components/ui/input'
import {
  CreateUserFormData,
  createUserSchema,
} from '@/modules/user/schemas/create-validation-schema'
import { CreateUserService } from '@/modules/user/services/create-user'

export function SignUpView() {
  const router = useRouter()

  const form = useForm<CreateUserFormData>({
    resolver: zodResolver(createUserSchema),
  })

  const { mutateAsync, isPending } = CreateUserService()

  async function onSubmit(data: CreateUserFormData) {
    await mutateAsync(data, {
      onSuccess: () => {
        router.push('/')
      },
    })
  }

  return (
    <Form {...form}>
      <div className="grid min-h-screen grid-cols-2 antialiased mobile:grid-cols-1">
        <div className="flex h-full flex-col justify-between border-r border-foreground/5 bg-muted/30 p-10 text-muted-foreground mobile:hidden">
          <div className="flex items-center mobile:justify-center"></div>

          <footer className="text-sm">
            <blockquote className="space-y-2">
              <footer className="text-sm grid grid-cols-1">
                <strong>Sistema de Eventos</strong>
              </footer>
            </blockquote>
          </footer>
        </div>

        <div className="relative flex flex-col items-center justify-center mobile:p-6">
          <form className="grid gap-6" onSubmit={form.handleSubmit(onSubmit)}>
            <div className="flex flex-col space-y-2 text-center">
              <h1 className="text-2xl font-semibold tracking-tight">
                Cadastro
              </h1>
              <p className="text-sm text-muted-foreground">
                Preencha suas informações para acessar a plataforma
              </p>
            </div>
            <div className="grid gap-2">
              <div className="grid gap-1">
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
                <FormField
                  control={form.control}
                  name="lastName"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input
                          placeholder="Seu sobrenome"
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
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input
                          placeholder="email@gmail.com"
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
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input
                          placeholder="senha"
                          type="password"
                          autoCapitalize="none"
                          autoComplete="off"
                          autoCorrect="off"
                          disabled={isPending}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="photo"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input
                          placeholder="Digite uma URL de sua foto"
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
              </div>
              <Button disabled={isPending} type="submit">
                {isPending && (
                  <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                )}
                Cadastrar
              </Button>
            </div>
            <p className="px-8 text-center text-sm text-muted-foreground">
              Possui uma conta?{' '}
              <Link
                href="/login"
                className="underline underline-offset-4 hover:text-primary"
              >
                Logue-se
              </Link>{' '}
            </p>
          </form>
        </div>
      </div>
    </Form>
  )
}
