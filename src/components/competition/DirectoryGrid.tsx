import { Link } from 'react-router-dom'

export type DirectoryItem = {
  id: string
  name: string
  meta: string
  href: string
}

export type DirectoryGridProps = {
  id: string
  title: string
  items: DirectoryItem[]
}

export function DirectoryGrid({ id, title, items }: DirectoryGridProps) {
  return (
    <section id={id} className="scroll-mt-20 bg-white pt-10">
      <div className="container-home">
        <h2 className="text-[22px] font-bold tracking-[-0.01em] text-ink">{title}</h2>

        <ul className="mt-4 grid grid-cols-2 border-l border-t border-border md:grid-cols-4">
          {items.map((item) => (
            <li key={item.id} className="border-b border-r border-border">
              <Link
                to={item.href}
                className="block px-4 py-2.5 transition-colors hover:bg-surface-muted"
              >
                <p className="truncate text-[13px] font-semibold text-ink">{item.name}</p>
                <p className="mt-0.5 text-[11px] text-muted">{item.meta}</p>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
