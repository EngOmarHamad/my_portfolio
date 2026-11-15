import { forwardRef, useMemo, useState, type InputHTMLAttributes, type TextareaHTMLAttributes } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { AnimatePresence, m } from 'framer-motion'
import { AlertTriangle, ArrowRight, Check, Loader2 } from 'lucide-react'
import { useLanguage } from '@/shared/i18n'
import { cn } from '@/shared/utils/cn'
import { portfolioService } from '@/portfolio/services/portfolio-service'
import { transition } from '@/portfolio/lib/motion'

type Status = 'idle' | 'sending' | 'success' | 'error'

const fieldBase =
  'peer w-full rounded-chip border bg-panel px-4 pt-6 pb-2 text-ink outline-none transition-colors duration-200 placeholder:text-transparent focus:border-signal'
const labelBase =
  'pointer-events-none absolute start-4 top-4 origin-[0_0] text-ink-muted transition-transform duration-200 ease-precise rtl:origin-[100%_0] peer-focus:-translate-y-2.5 peer-focus:scale-75 peer-[:not(:placeholder-shown)]:-translate-y-2.5 peer-[:not(:placeholder-shown)]:scale-75'

interface FieldProps {
  id: string
  label: string
  error?: string
}

const Input = forwardRef<HTMLInputElement, FieldProps & InputHTMLAttributes<HTMLInputElement>>(({ id, label, error, ...props }, ref) => (
  <div>
    <div className="relative">
      <input
        ref={ref}
        id={id}
        placeholder=" "
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `${id}-error` : undefined}
        className={cn(fieldBase, 'h-14', error ? 'border-danger' : 'border-line')}
        {...props}
      />
      <label htmlFor={id} className={labelBase}>
        {label}
      </label>
    </div>
    {error && (
      <p id={`${id}-error`} className="mt-2 text-sm text-danger">
        {error}
      </p>
    )}
  </div>
))
Input.displayName = 'Input'

const TextArea = forwardRef<HTMLTextAreaElement, FieldProps & TextareaHTMLAttributes<HTMLTextAreaElement>>(({ id, label, error, ...props }, ref) => (
  <div>
    <div className="relative">
      <textarea
        ref={ref}
        id={id}
        placeholder=" "
        rows={5}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `${id}-error` : undefined}
        className={cn(fieldBase, 'resize-y', error ? 'border-danger' : 'border-line')}
        {...props}
      />
      <label htmlFor={id} className={labelBase}>
        {label}
      </label>
    </div>
    {error && (
      <p id={`${id}-error`} className="mt-2 text-sm text-danger">
        {error}
      </p>
    )}
  </div>
))
TextArea.displayName = 'TextArea'

export function ContactForm({ email }: { email: string }) {
  const { t } = useLanguage()
  const copy = t.site.contact.form
  const [status, setStatus] = useState<Status>('idle')

  const schema = useMemo(
    () =>
      z.object({
        name: z.string().trim().min(2, copy.nameError).max(120),
        email: z.email(copy.emailError).max(200),
        subject: z.string().trim().min(3, copy.subjectError).max(200),
        message: z.string().trim().min(20, copy.messageError).max(5000),
      }),
    [copy],
  )
  type Values = z.infer<typeof schema>

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<Values>({ resolver: zodResolver(schema), mode: 'onTouched' })

  const onSubmit = async (values: Values) => {
    setStatus('sending')
    try {
      await portfolioService.submitContact(values)
      setStatus('success')
      reset()
    } catch {
      setStatus('error')
    }
  }

  return (
    <div className="relative">
      <AnimatePresence mode="wait" initial={false}>
        {status === 'success' ? (
          <m.div
            key="success"
            role="status"
            className="rounded-card border border-line bg-panel p-8"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={transition()}
          >
            <span className="grid size-12 place-items-center rounded-full bg-signal text-on-signal">
              <Check className="size-5" aria-hidden />
            </span>
            <p className="mt-6 font-display text-h3 font-semibold text-ink">{copy.successTitle}</p>
            <p className="mt-2 text-ink-muted">{copy.successBody}</p>
            <button type="button" onClick={() => setStatus('idle')} className="link-wipe mt-6 min-h-11 text-sm text-ink">
              {copy.again}
            </button>
          </m.div>
        ) : (
          <m.form
            key="form"
            id="contact-form"
            noValidate
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={transition(0.2)}
          >
            <div className="grid gap-4 sm:grid-cols-2">
              <Input id="contact-name" label={copy.name} autoComplete="name" error={errors.name?.message} {...register('name')} />
              <Input id="contact-email" label={copy.email} type="email" autoComplete="email" dir="ltr" error={errors.email?.message} {...register('email')} />
            </div>
            <Input id="contact-subject" label={copy.subject} error={errors.subject?.message} {...register('subject')} />
            <TextArea id="contact-message" label={copy.message} error={errors.message?.message} {...register('message')} />

            {status === 'error' && (
              <div role="alert" className="flex gap-3 rounded-chip border border-danger p-4 text-sm">
                <AlertTriangle className="mt-0.5 size-4 shrink-0 text-danger" aria-hidden />
                <div>
                  <p className="font-medium text-ink">{copy.errorTitle}</p>
                  <p className="mt-1 text-ink-muted">
                    {copy.errorBody}{' '}
                    <a href={`mailto:${email}`} className="link-wipe text-ink" dir="ltr">
                      {email}
                    </a>
                  </p>
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={status === 'sending'}
              className="group/btn inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-chip bg-signal px-6 text-sm font-medium text-on-signal disabled:opacity-70 sm:w-auto"
            >
              {status === 'sending' ? (
                <>
                  <Loader2 className="size-4 animate-spin" aria-hidden />
                  {copy.sending}
                </>
              ) : (
                <>
                  {status === 'error' ? copy.retry : copy.send}
                  <ArrowRight className="size-4 transition-transform duration-500 ease-precise group-hover/btn:translate-x-0.5 rtl:-scale-x-100" aria-hidden />
                </>
              )}
            </button>
          </m.form>
        )}
      </AnimatePresence>
    </div>
  )
}
