import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { motion, AnimatePresence } from 'framer-motion'
import { Send, CheckCircle, User, Mail, MessageSquare, Sparkles, CornerDownLeft, AlertCircle } from 'lucide-react'
import { cn } from '@/shared/utils/cn'
import { portfolioService } from '@/portfolio/services/portfolio-service'
import { useLanguage } from '@/shared/i18n'

interface ContactFormData {
  name: string
  email: string
  subject: string
  message: string
}

export function ContactForm() {
  const [isSubmitSuccessful, setIsSubmitSuccessful] = useState(false)
  const [focusedField, setFocusedField] = useState<string | null>(null)
  const { t } = useLanguage()

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

  return (
    <div className="relative rounded-3xl border border-border/70 bg-surface/80 p-6 sm:p-8 md:p-10 backdrop-blur-2xl shadow-elevated overflow-hidden">

      <AnimatePresence mode="wait">
        {isSubmitSuccessful ? (
          <motion.div
            key="success"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-12 space-y-5"
          >
            <div className="w-16 h-16 mx-auto rounded-2xl bg-accent/10 text-accent flex items-center justify-center border border-accent/30">
              <CheckCircle className="h-8 w-8" />
            </div>
            <h3 className="text-xl font-bold text-text">{t.contactForm.successTitle}</h3>
            <p className="text-xs text-text-secondary max-w-sm mx-auto">
              {t.contactForm.successDescription}
            </p>
            <button
              onClick={() => setIsSubmitSuccessful(false)}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-border text-xs font-mono font-bold text-text hover:border-accent hover:text-accent transition-all"
            >
              <span>{t.contactForm.sendAnother}</span>
              <CornerDownLeft className="h-3.5 w-3.5" />
            </button>
          </motion.div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 relative z-10" noValidate>

            <div className="grid sm:grid-cols-2 gap-5">

              {/* Name Field */}
              <div className="space-y-2">
                <label htmlFor="name" className="block text-xs font-mono font-semibold text-text uppercase tracking-wider">
                  {t.contactForm.name} <span className="text-accent">*</span>
                </label>
                <div className="relative rounded-xl">
                  {/* بوردر الانتقال الذكي بـ layoutId */}
                  {focusedField === 'name' && (
                    <motion.div
                      layoutId="active-input-border"
                      className="absolute -inset-[2px] rounded-[14px] border-2 border-accent pointer-events-none z-20"
                      transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                    />
                  )}
                  <div className={cn(
                    "relative flex items-center rounded-xl bg-surface border transition-colors",
                    errors.name ? 'border-red-400' : 'border-border/60'
                  )}>
                    <User className={cn('w-4 h-4 absolute left-3.5 transition-colors z-10', focusedField === 'name' ? 'text-accent' : 'text-text-secondary')} />
                    <input
                      id="name"
                      {...register('name', { required: t.contactForm.nameRequired })}
                      onFocus={() => setFocusedField('name')}
                      onBlur={() => setFocusedField(null)}
                      className="w-full rounded-xl bg-transparent pl-10 pr-4 py-3 text-xs sm:text-sm font-mono text-text placeholder:text-text-secondary/50 focus:outline-none relative z-10"
                      placeholder={t.contactForm.namePlaceholder}
                    />
                  </div>
                </div>
                {errors.name && <p className="text-[11px] font-mono text-red-400 flex items-center gap-1"><AlertCircle className="w-3 h-3" />{errors.name.message}</p>}
              </div>

              {/* Email Field */}
              <div className="space-y-2">
                <label htmlFor="email" className="block text-xs font-mono font-semibold text-text uppercase tracking-wider">
                  {t.contactForm.email} <span className="text-accent">*</span>
                </label>
                <div className="relative rounded-xl">
                  {focusedField === 'email' && (
                    <motion.div
                      layoutId="active-input-border"
                      className="absolute -inset-[2px] rounded-[14px] border-2 border-accent pointer-events-none z-20"
                      transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                    />
                  )}
                  <div className={cn(
                    "relative flex items-center rounded-xl bg-surface border transition-colors",
                    errors.email ? 'border-red-400' : 'border-border/60'
                  )}>
                    <Mail className={cn('w-4 h-4 absolute left-3.5 transition-colors z-10', focusedField === 'email' ? 'text-accent' : 'text-text-secondary')} />
                    <input
                      id="email"
                      type="email"
                      {...register('email', { required: t.contactForm.emailRequired, pattern: { value: /^\S+@\S+$/i, message: t.contactForm.invalidEmail } })}
                      onFocus={() => setFocusedField('email')}
                      onBlur={() => setFocusedField(null)}
                      className="w-full rounded-xl bg-transparent pl-10 pr-4 py-3 text-xs sm:text-sm font-mono text-text placeholder:text-text-secondary/50 focus:outline-none relative z-10"
                      placeholder={t.contactForm.emailPlaceholder}
                    />
                  </div>
                </div>
                {errors.email && <p className="text-[11px] font-mono text-red-400 flex items-center gap-1"><AlertCircle className="w-3 h-3" />{errors.email.message}</p>}
              </div>

            </div>

            {/* Subject Field */}
            <div className="space-y-2">
                <label htmlFor="subject" className="block text-xs font-mono font-semibold text-text uppercase tracking-wider">
                  {t.contactForm.subject} <span className="text-accent">*</span>
                </label>
              <div className="relative rounded-xl">
                {focusedField === 'subject' && (
                  <motion.div
                    layoutId="active-input-border"
                    className="absolute -inset-[2px] rounded-[14px] border-2 border-accent pointer-events-none z-20"
                    transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                  />
                )}
                <div className={cn(
                  "relative flex items-center rounded-xl bg-surface border transition-colors",
                  errors.subject ? 'border-red-400' : 'border-border/60'
                )}>
                  <Sparkles className={cn('w-4 h-4 absolute left-3.5 transition-colors z-10', focusedField === 'subject' ? 'text-accent' : 'text-text-secondary')} />
                  <input
                    id="subject"
                    {...register('subject', { required: t.contactForm.subjectRequired })}
                    onFocus={() => setFocusedField('subject')}
                    onBlur={() => setFocusedField(null)}
                    className="w-full rounded-xl bg-transparent pl-10 pr-4 py-3 text-xs sm:text-sm font-mono text-text placeholder:text-text-secondary/50 focus:outline-none relative z-10"
                    placeholder={t.contactForm.subjectPlaceholder}
                  />
                </div>
              </div>
              {errors.subject && <p className="text-[11px] font-mono text-red-400 flex items-center gap-1"><AlertCircle className="w-3 h-3" />{errors.subject.message}</p>}
            </div>

            {/* Message Field */}
            <div className="space-y-2">
                <label htmlFor="message" className="block text-xs font-mono font-semibold text-text uppercase tracking-wider">
                  {t.contactForm.message} <span className="text-accent">*</span>
                </label>
              <div className="relative rounded-xl">
                {focusedField === 'message' && (
                  <motion.div
                    layoutId="active-input-border"
                    className="absolute -inset-[2px] rounded-[14px] border-2 border-accent pointer-events-none z-20"
                    transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                  />
                )}
                <div className={cn(
                  "relative flex items-start rounded-xl bg-surface border transition-colors",
                  errors.message ? 'border-red-400' : 'border-border/60'
                )}>
                  <MessageSquare className={cn('w-4 h-4 absolute left-3.5 top-4 transition-colors z-10', focusedField === 'message' ? 'text-accent' : 'text-text-secondary')} />
                  <textarea
                    id="message"
                    rows={4}
                    {...register('message', { required: t.contactForm.messageRequired })}
                    onFocus={() => setFocusedField('message')}
                    onBlur={() => setFocusedField(null)}
                    className="w-full rounded-xl bg-transparent pl-10 pr-4 py-3 text-xs sm:text-sm font-mono text-text placeholder:text-text-secondary/50 focus:outline-none resize-none relative z-10"
                    placeholder={t.contactForm.messagePlaceholder}
                  />
                </div>
              </div>
              {errors.message && <p className="text-[11px] font-mono text-red-400 flex items-center gap-1"><AlertCircle className="w-3 h-3" />{errors.message.message}</p>}
            </div>

            {/* Submit Button */}
            <motion.button
              type="submit"
              disabled={isSubmitting}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.98 }}
              className="w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-accent text-[#1a1405] font-mono text-xs font-bold uppercase tracking-wider shadow-md hover:shadow-elevated transition-all disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <div className="h-4 w-4 rounded-full border-2 border-[#1a1405]/30 border-t-[#1a1405] animate-spin" />
                  <span>{t.contactForm.sending}</span>
                </>
              ) : (
                <>
                  <Send className="h-4 w-4" />
                  <span>{t.contactForm.send}</span>
                </>
              )}
            </motion.button>

          </form>
        )}
      </AnimatePresence>
    </div>
  )
}