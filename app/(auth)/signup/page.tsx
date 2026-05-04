import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Select, SelectTrigger, SelectValue, SelectContent, SelectItem,
} from '@/components/ui/select'
import { signupAction } from './actions'
import Link from 'next/link'

interface PageProps {
  searchParams: Promise<{ error?: string }>
}

export default async function SignupPage({ searchParams }: PageProps) {
  const { error } = await searchParams
  return (
    <main className="mx-auto flex min-h-dvh max-w-md items-center px-4 py-8">
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Create your Ecotrax account</CardTitle>
        </CardHeader>
        <CardContent className="space-y-5">
          {error && <p className="text-sm text-destructive">{error}</p>}
          <form action={signupAction} className="space-y-3">
            <div className="space-y-1">
              <Label htmlFor="fullName">Full name</Label>
              <Input id="fullName" name="fullName" required autoComplete="name" />
            </div>
            <div className="space-y-1">
              <Label htmlFor="email">Email</Label>
              <Input id="email" name="email" type="email" required autoComplete="email" />
            </div>
            <div className="space-y-1">
              <Label htmlFor="password">Password (min 8 characters)</Label>
              <Input id="password" name="password" type="password" required minLength={8} autoComplete="new-password" />
            </div>
            <div className="space-y-1">
              <Label htmlFor="role">I am a&hellip;</Label>
              <Select name="role" required>
                <SelectTrigger id="role">
                  <SelectValue placeholder="Select your role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="funder">Funder (foundation, donor, ESG/CSR lead)</SelectItem>
                  <SelectItem value="practitioner">Practitioner (NGO, field biologist, project lead)</SelectItem>
                  <SelectItem value="other">Researcher, agency, ranger, or other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button type="submit" className="w-full">Create account</Button>
          </form>
          <p className="text-center text-sm text-muted-foreground">
            Already have an account? <Link href="/login" className="underline">Log in</Link>
          </p>
        </CardContent>
      </Card>
    </main>
  )
}
