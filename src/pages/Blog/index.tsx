import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, FileText } from 'lucide-react'
import { PageTransition } from '@/components/layout/PageTransition'
import { Section, SectionHeader } from '@/components/ui/Section'
import { BlogCard } from '@/components/cards/BlogCard'
import { Reveal } from '@/components/animations/Reveal'
import { useBlogPosts } from '@/hooks/use-portfolio-data'
import { cn } from '@/utils/cn'

export function BlogPage() {
  const [activeTag, setActiveTag] = useState('All')
  const [searchQuery, setSearchQuery] = useState('')
  const { data: posts = [] } = useBlogPosts()

  const allTags = useMemo(() => {
    const tags = new Set<string>()
    posts.forEach((post) => (post.tags ?? []).forEach((t: string) => tags.add(t)))
    return ['All', ...Array.from(tags)]
  }, [posts])

  const filtered = useMemo(() => {
    return posts.filter((post) => {
      const matchesTag = activeTag === 'All' || (post.tags ?? []).includes(activeTag)
      const matchesSearch =
        !searchQuery ||
        post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (post.excerpt ?? '').toLowerCase().includes(searchQuery.toLowerCase())
      return matchesTag && matchesSearch
    })
  }, [activeTag, searchQuery, posts])

  return (
    <PageTransition>
      <main>
        <Section variant="teal">
          <SectionHeader
            title="Blog"
            subtitle="Thoughts on engineering, architecture, and building great software."
            accent="primary"
          />

          <Reveal>
            <div className="flex flex-col sm:flex-row gap-4 mb-8">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-text-tertiary" />
                <input
                  type="text"
                  placeholder="Search articles..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full rounded-md border border-border/50 bg-bg pl-10 pr-4 py-2.5 text-sm text-text placeholder:text-text-tertiary focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
                />
              </div>
            </div>

            <div className="flex flex-wrap gap-2 mb-8">
              {allTags.map((tag, i) => {
                const activeColors = ['bg-primary text-white', 'bg-accent text-white', 'bg-highlight text-white', 'bg-primary text-white']
                const inactiveColors = ['bg-surface text-text-secondary hover:bg-primary/5 hover:text-primary border-primary/20', 'bg-surface text-text-secondary hover:bg-accent/5 hover:text-accent border-accent/20', 'bg-surface text-text-secondary hover:bg-highlight/5 hover:text-highlight border-highlight/20', 'bg-surface text-text-secondary hover:bg-primary/5 hover:text-primary border-primary/20']
                return (
                  <button
                    key={tag}
                    onClick={() => setActiveTag(tag)}
                    className={cn(
                      'rounded-md px-4 py-2 text-sm font-medium transition-all duration-200 border',
                      activeTag === tag
                        ? activeColors[i % activeColors.length]
                        : inactiveColors[i % inactiveColors.length],
                    )}
                  >
                    {tag}
                  </button>
                )
              })}
            </div>
          </Reveal>

          <AnimatePresence mode="wait">
            <motion.div
              key={activeTag + searchQuery}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
              className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5"
            >
              {filtered.map((post, i) => (
                <BlogCard key={post.id} post={post} index={i} />
              ))}
            </motion.div>
          </AnimatePresence>

          {filtered.length === 0 && (
            <div className="text-center py-24">
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-xl bg-surface border border-border/40 mb-5">
                <FileText className="h-6 w-6 text-text-tertiary" />
              </div>
              <p className="text-base text-text-secondary">No articles found matching your criteria.</p>
              <p className="text-sm text-text-tertiary mt-1.5">Try adjusting your search or filter.</p>
            </div>
          )}
        </Section>
      </main>
    </PageTransition>
  )
}
