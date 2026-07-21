import { Link } from 'react-router-dom'
import { Calendar, Clock, ArrowRight } from 'lucide-react'
import { motion } from 'framer-motion'

interface BlogCardProps {
  post: {
    id: string
    title: string
    slug: string
    excerpt?: string
    content?: string
    tags?: string[]
    reading_time?: number
    readingTime?: number
    date?: string
    created_at?: string
  }
  index?: number
}

export function BlogCard({ post, index = 0 }: BlogCardProps) {
  const readingTime = post.reading_time || post.readingTime || 5
  const date = post.created_at || post.date || ''
  const tags = post.tags || []

  return (
    <motion.article
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ delay: index * 0.08, duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      whileHover={{ y: -3 }}
      className="group relative rounded-xl border border-border/50 bg-surface p-6 shadow-card hover:shadow-elevated transition-all duration-300"
    >
      <div className="flex items-center gap-4 text-xs text-text-tertiary mb-4">
        <span className="flex items-center gap-1.5">
          <Calendar className="h-3.5 w-3.5" />
          {date ? new Date(date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) : ''}
        </span>
        <span className="flex items-center gap-1.5">
          <Clock className="h-3.5 w-3.5" />
          {readingTime} min read
        </span>
      </div>

      <h3 className="text-base font-semibold text-text mb-2.5 group-hover:text-primary transition-colors duration-200">
        <Link to={`/blog/${post.slug}`}>{post.title}</Link>
      </h3>

      <p className="text-sm text-text-secondary leading-relaxed mb-4 line-clamp-2">
        {post.excerpt}
      </p>

      <div className="flex flex-wrap gap-1.5 mb-4">
        {tags.map((tag) => (
          <span key={tag} className="inline-flex items-center rounded-md bg-surface-hover px-2 py-1 text-xs font-medium text-text-secondary">
            {tag}
          </span>
        ))}
      </div>

      <Link to={`/blog/${post.slug}`} className="inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:text-primary-dark transition-colors">
        Read more
        <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
      </Link>
    </motion.article>
  )
}
