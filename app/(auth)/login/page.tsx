import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Image from 'next/image'
import LoginForm from './login-form'

export default async function LoginPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (user) redirect('/dashboard')

  return (
    <div className="flex min-h-screen flex-col md:flex-row items-center justify-center gap-8 px-4 bg-zinc-50 dark:bg-zinc-950">
      <div className="w-full max-w-sm">
        <h1 className="mb-4 text-center text-4xl md:text-5xl font-bold bg-gradient-to-r from-zinc-900 via-zinc-700 to-zinc-900 dark:from-zinc-100 dark:via-zinc-300 dark:to-zinc-100 bg-clip-text text-transparent tracking-tight">
          Adiyo's Bookmark
        </h1>
        <p className="mb-6 text-center text-sm text-zinc-500 dark:text-zinc-400">
          Sign in with Google to manage your bookmarks
        </p>
        <LoginForm />
      </div>
      <div className="w-full max-w-md md:max-w-xl">
        <Image
          src="/images/child.png"
          alt="Bookmark illustration"
          width={500}
          height={500}
          priority
          className="w-full h-auto"
        />
      </div>
    </div>
  )
}
