import type { ReactNode } from 'react'
import { cn } from '@/utils/cn'

interface FormFieldProps {
  label: string
  error?: string
  children: ReactNode
  required?: boolean
  className?: string
  description?: string
}

export function FormField({ label, error, children, required, className, description }: FormFieldProps) {
  return (
    <div className={cn('space-y-1.5', className)}>
      <label className="block text-sm font-medium text-[var(--color-text)]">
        {label}
        {required && <span className="text-red-500 ml-0.5">*</span>}
      </label>
      {description && (
        <p className="text-xs text-[var(--color-text-tertiary)]">{description}</p>
      )}
      {children}
      {error && (
        <p className="text-xs text-red-500">{error}</p>
      )}
    </div>
  )
}

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string
  error?: string
}

export function Input({ label, error, className, id, ...props }: InputProps) {
  return (
    <FormField label={label} error={error} required={props.required}>
      <input
        id={id}
        className={cn(
          'w-full px-3 py-2 text-sm rounded-lg border bg-[var(--color-surface)] text-[var(--color-text)] placeholder:text-[var(--color-text-tertiary)] transition-all',
          'focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/20 focus:border-[var(--color-primary)]',
          error ? 'border-red-500' : 'border-[var(--color-border)]',
          className
        )}
        {...props}
      />
    </FormField>
  )
}

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string
  error?: string
}

export function Textarea({ label, error, className, id, ...props }: TextareaProps) {
  return (
    <FormField label={label} error={error} required={props.required}>
      <textarea
        id={id}
        className={cn(
          'w-full px-3 py-2 text-sm rounded-lg border bg-[var(--color-surface)] text-[var(--color-text)] placeholder:text-[var(--color-text-tertiary)] transition-all resize-y min-h-[100px]',
          'focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/20 focus:border-[var(--color-primary)]',
          error ? 'border-red-500' : 'border-[var(--color-border)]',
          className
        )}
        {...props}
      />
    </FormField>
  )
}

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label: string
  error?: string
  options: { value: string; label: string }[]
  placeholder?: string
}

export function Select({ label, error, options, placeholder, className, id, ...props }: SelectProps) {
  return (
    <FormField label={label} error={error} required={props.required}>
      <select
        id={id}
        className={cn(
          'w-full px-3 py-2 text-sm rounded-lg border bg-[var(--color-surface)] text-[var(--color-text)] transition-all',
          'focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/20 focus:border-[var(--color-primary)]',
          error ? 'border-red-500' : 'border-[var(--color-border)]',
          className
        )}
        {...props}
      >
        {placeholder && <option value="">{placeholder}</option>}
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>{opt.label}</option>
        ))}
      </select>
    </FormField>
  )
}

interface ToggleProps {
  label: string
  checked: boolean
  onChange: (checked: boolean) => void
  description?: string
}

export function Toggle({ label, checked, onChange, description }: ToggleProps) {
  return (
    <div className="flex items-center justify-between py-2">
      <div>
        <span className="text-sm font-medium text-[var(--color-text)]">{label}</span>
        {description && (
          <p className="text-xs text-[var(--color-text-tertiary)]">{description}</p>
        )}
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={cn(
          'relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors',
          checked ? 'bg-[var(--color-primary)]' : 'bg-[var(--color-muted)]'
        )}
      >
        <span
          className={cn(
            'pointer-events-none inline-block h-4 w-4 rounded-full bg-white shadow transform ring-0 transition-transform',
            checked ? 'translate-x-4' : 'translate-x-0'
          )}
        />
      </button>
    </div>
  )
}
