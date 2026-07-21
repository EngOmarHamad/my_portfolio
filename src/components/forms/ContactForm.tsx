import { useForm } from 'react-hook-form'
import { motion } from 'framer-motion'
import { Send, CheckCircle } from 'lucide-react'
import { cn } from '@/utils/cn'
import { portfolioService } from '@/services/portfolio-service'
import { useState } from 'react'

interface ContactFormData {
  name: string
  email: string
  subject: string
  message: string
}

export function ContactForm() {
  const [isSubmitSuccessful, setIsSubmitSuccessful] = useState(false)
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<ContactFormData>()

  const onSubmit = async (data: ContactFormData) => {
    try {
      await portfolioService.submitContact(data)
      setIsSubmitSuccessful(true)
      reset()
    } catch (err) {
      console.error('Failed to send message:', err)
    }
  }

  if (isSubmitSuccessful) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center py-12"
      >
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-xl bg-primary/10 text-primary mb-5">
          <CheckCircle className="h-7 w-7" />
        </div>
        <h3 className="text-lg font-semibold text-text mb-2">Message Sent</h3>
        <p className="text-sm text-text-secondary mb-6">
          Thank you for reaching out. I'll get back to you within 24 hours.
        </p>
        <button
          onClick={() => setIsSubmitSuccessful(false)}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-md border border-border text-sm font-medium text-text hover:bg-surface-hover transition-all duration-200"
        >
          Send another message
        </button>
      </motion.div>
    )
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
      <div className="grid sm:grid-cols-2 gap-5">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-text mb-1.5">Name</label>
          <input id="name" {...register('name', { required: 'Name is required' })} className={cn("w-full rounded-md border bg-bg px-4 py-2.5 text-sm text-text placeholder:text-text-tertiary transition-colors", "focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary", errors.name ? 'border-accent/60' : 'border-border/60')} placeholder="Your name" />
          {errors.name && <p className="mt-1.5 text-xs text-accent flex items-center gap-1"><span className="inline-block h-1 w-1 rounded-full bg-accent" />{errors.name.message}</p>}
        </div>
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-text mb-1.5">Email</label>
          <input id="email" type="email" {...register('email', { required: 'Email is required', pattern: { value: /^\S+@\S+$/i, message: 'Invalid email' } })} className={cn("w-full rounded-md border bg-bg px-4 py-2.5 text-sm text-text placeholder:text-text-tertiary transition-colors", "focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary", errors.email ? 'border-accent/60' : 'border-border/60')} placeholder="your@email.com" />
          {errors.email && <p className="mt-1.5 text-xs text-accent flex items-center gap-1"><span className="inline-block h-1 w-1 rounded-full bg-accent" />{errors.email.message}</p>}
        </div>
      </div>

      <div>
        <label htmlFor="subject" className="block text-sm font-medium text-text mb-1.5">Subject</label>
        <input id="subject" {...register('subject', { required: 'Subject is required' })} className={cn("w-full rounded-md border bg-bg px-4 py-2.5 text-sm text-text placeholder:text-text-tertiary transition-colors", "focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary", errors.subject ? 'border-accent/60' : 'border-border/60')} placeholder="What is this about?" />
        {errors.subject && <p className="mt-1.5 text-xs text-accent flex items-center gap-1"><span className="inline-block h-1 w-1 rounded-full bg-accent" />{errors.subject.message}</p>}
      </div>

      <div>
        <label htmlFor="message" className="block text-sm font-medium text-text mb-1.5">Message</label>
        <textarea id="message" rows={5} {...register('message', { required: 'Message is required' })} className={cn("w-full rounded-md border bg-bg px-4 py-2.5 text-sm text-text placeholder:text-text-tertiary transition-colors resize-none", "focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary", errors.message ? 'border-accent/60' : 'border-border/60')} placeholder="Tell me about your project..." />
        {errors.message && <p className="mt-1.5 text-xs text-accent flex items-center gap-1"><span className="inline-block h-1 w-1 rounded-full bg-accent" />{errors.message.message}</p>}
      </div>

      <motion.button type="submit" disabled={isSubmitting} whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.98 }}
        className="w-full inline-flex items-center justify-center gap-2 px-6 py-3 rounded-md bg-primary text-white text-sm font-medium hover:bg-primary-light transition-all duration-200 shadow-soft disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isSubmitting ? (
          <><div className="h-4 w-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />Sending...</>
        ) : (
          <><Send className="h-4 w-4" />Send Message</>
        )}
      </motion.button>
    </form>
  )
}
