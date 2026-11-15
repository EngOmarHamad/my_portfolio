import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { ArrowUpRight, Search } from 'lucide-react'
import { useLanguage } from '@/shared/i18n'
import { cn } from '@/shared/utils/cn'
import { SpotlightCard, Tag } from '@/portfolio/components/ds'
import { useBlogPosts } from '@/portfolio/hooks/use-portfolio-data'
import { DURATION, EASE, transition } from '@/portfolio/lib/motion'
import { PageShell, StatusMessage } from '../PageShell'

const ALL = '__all__'

interface Post {
  id: string
  title: string
  slug: string
  excerpt?: string
  tags?: string[]
  reading_time?: number
  created_at?: string
}

export function BlogPage() {
  const { t, lang } = useLanguage()
  const copy = t.site.pages.blog
  const { data = [], isLoading, isError } = useBlogPosts()
  const posts = data as Post[]
  const [tag, setTag] = useState(ALL)
  const [query, setQuery] = useState('')

  const tags = useMemo(() => [...new Set(posts.flatMap((post) => post.tags ?? []))], [posts])
  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase()
    return posts.filter(
      (post) =>
        (tag === ALL || (post.tags ?? []).includes(tag)) &&
        (!needle || post.title.toLowerCase().includes(needle) || (post.excerpt ?? '').toLowerCase().includes(needle)),
    )
  }, [posts, tag, query])

  const formatDate = (value?: string) =>
    value ? new Intl.DateTimeFormat(lang === 'ar' ? 'ar' : 'en-GB', { day: 'numeric', month: 'short', year: 'numeric' }).format(new Date(value)) : ''

  return (
    <PageShell id="blog" index="B" label={copy.label} title={copy.title} intro={copy.intro}>
      <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div className="flex flex-wrap gap-1 border-b border-line">
          {[ALL, ...tags].map((item) => (
            <button
              key={item}
              type="button"
              aria-pressed={tag === item}
              onClick={() => setTag(item)}
              className={cn('relative min-h-11 px-4 text-sm transition-colors', tag === item ? 'text-ink' : 'text-ink-muted hover:text-ink')}
            >
              {item === ALL ? copy.all : item}
              {tag === item && <motion.span layoutId="blog-filter" className="absolute inset-x-0 -bottom-px h-px bg-signal" transition={transition()} />}
            </button>
          ))}
        </div>
        <label className="relative block md:w-80">
          <span className="sr-only">{copy.search}</span>
          <Search className="pointer-events-none absolute start-4 top-1/2 size-4 -translate-y-1/2 text-ink-faint" aria-hidden />
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder={copy.search}
            className="h-12 w-full rounded-chip border border-line bg-panel ps-11 pe-4 text-sm text-ink outline-none placeholder:text-ink-faint focus:border-signal"
          />
        </label>
      </div>

      {isLoading && <StatusMessage role="status">{t.site.pages.loading}</StatusMessage>}
      {isError && <StatusMessage role="alert">{t.site.pages.error}</StatusMessage>}
      {!isLoading && !isError && filtered.length === 0 && <StatusMessage>{copy.empty}</StatusMessage>}

      <motion.ul layout className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <AnimatePresence mode="popLayout" initial={false}>
          {filtered.map((post) => (
            <motion.li
              key={post.id}
              layout
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: DURATION.base, ease: EASE }}
            >
              <SpotlightCard as="article" className="flex h-full flex-col p-6">
                <p className="flex gap-4 font-mono text-label text-ink-faint">
                  <span>{formatDate(post.created_at)}</span>
                  <span>
                    {post.reading_time || 5} {copy.minutes}
                  </span>
                </p>
                <h2 className="mt-4 font-display text-h3 font-semibold text-ink">
                  <Link to={`/blog/${post.slug}`} className="after:absolute after:inset-0">
                    {post.title}
                  </Link>
                </h2>
                {post.excerpt && <p className="mt-3 line-clamp-3 flex-1 text-sm text-ink-muted">{post.excerpt}</p>}
                {(post.tags ?? []).length > 0 && (
                  <div className="mt-4 flex flex-wrap gap-2">
                    {(post.tags ?? []).map((item) => (
                      <Tag key={item}>{item}</Tag>
                    ))}
                  </div>
                )}
                <span className="mt-6 inline-flex items-center gap-2 text-sm text-signal-ink">
                  {copy.read}
                  <ArrowUpRight className="size-4 rtl:-scale-x-100" aria-hidden />
                </span>
              </SpotlightCard>
            </motion.li>
          ))}
        </AnimatePresence>
      </motion.ul>
    </PageShell>
  )
}
