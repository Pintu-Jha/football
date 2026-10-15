import { useEffect, useId } from 'react'

export type JsonLdProps = {
  data: Record<string, unknown> | Record<string, unknown>[]
}

/** Injects a JSON-LD script into document.head; removes it on unmount. */
export function JsonLd({ data }: JsonLdProps) {
  const reactId = useId()
  const scriptId = `json-ld-${reactId.replace(/:/g, '')}`

  useEffect(() => {
    let script = document.getElementById(scriptId) as HTMLScriptElement | null
    if (!script) {
      script = document.createElement('script')
      script.id = scriptId
      script.type = 'application/ld+json'
      document.head.appendChild(script)
    }
    script.textContent = JSON.stringify(data)

    return () => {
      script?.remove()
    }
  }, [data, scriptId])

  return null
}
