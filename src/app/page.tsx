import { useActionState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { getArtistShopUrls } from "@/lib/utils"

interface State {
  urls: string[]
}

async function queryAction(_: State, formData: FormData): Promise<State> {
  'use server'
  const query = formData.get('query')?.toString() || ''
  if (!query) {
    return { urls: [] }
  }
  const urls = await getArtistShopUrls(query)
  return { urls }
}

export default function Home() {
  const [state, formAction] = useActionState(queryAction, { urls: [] })

  return (
    <main className="container mx-auto max-w-xl p-6 space-y-4">
      <form action={formAction} className="flex gap-2">
        <Input name="query" placeholder="Search artist" />
        <Button type="submit">Query</Button>
      </form>
      <ul className="list-disc pl-5 space-y-1">
        {state.urls.map((url) => (
          <li key={url}>
            <a href={url} className="underline" target="_blank" rel="noreferrer">
              {url}
            </a>
          </li>
        ))}
      </ul>
    </main>
  )
}
