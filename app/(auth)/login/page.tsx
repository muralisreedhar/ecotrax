import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { loginWithEmail, loginWithGoogle } from './actions'
import Link from 'next/link'

interface PageProps {
  searchParams: Promise<{ error?: string }>
}

export default async function LoginPage({ searchParams }: PageProps) {
  const { error } = await searchParams
  return (
    <main className="mx-auto flex min-h-dvh max-w-sm items-center px-4">
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Log in to Ecotrax</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {error && <p className="text-sm text-destructive">{error}</p>}
          <form action={loginWithEmail} className="space-y-3">
            <div className="space-y-1">
              <Label htmlFor="email">Email</Label>
              <Input id="email" name="email" type="email" required autoComplete="email" />
            </div>
            <div className="space-y-1">
              <Label htmlFor="password">Password</Label>
              <Input id="password" name="password" type="password" required autoComplete="current-password" />
            </div>
            <Button type="submit" className="w-full">Log in</Button>
          </form>
          <form action={loginWithGoogle}>
            <Button type="submit" variant="outline" className="w-full">Continue with Google</Button>
          </form>
          <p className="text-center text-sm text-muted-foreground">
            New here? <Link href="/signup" className="underline">Create an account</Link>
          </p>
        </CardContent>
      </Card>
    </main>
  )
}
