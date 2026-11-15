import type { ReactNode } from 'react'
import { Form, Input as AntdInput, Select as AntdSelect, Switch, Typography } from 'antd'
import type { InputProps as AntdInputProps, SelectProps as AntdSelectProps } from 'antd'
import { cn } from '@/utils/cn'

/* ------------------------------------------------------------------ */
/* FormField — label/help/error wrapper built on Ant Design Form.Item  */
/* ------------------------------------------------------------------ */

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
    <Form.Item
      label={label}
      required={required}
      help={error || description}
      validateStatus={error ? 'error' : undefined}
      className={cn('mb-5', className)}
    >
      {children}
    </Form.Item>
  )
}

/* ------------------------------------------------------------------ */
/* Input                                                               */
/* ------------------------------------------------------------------ */

interface InputProps extends Omit<AntdInputProps, 'size'> {
  label: string
  error?: string
  description?: string
  required?: boolean
}

export function Input({ label, error, description, required, className, ...props }: InputProps) {
  return (
    <FormField label={label} error={error} required={required} description={description}>
      <AntdInput className={className} {...props} />
    </FormField>
  )
}

interface TextareaProps extends Omit<React.ComponentProps<typeof AntdInput.TextArea>, 'size'> {
  label: string
  error?: string
  description?: string
  required?: boolean
}

export function Textarea({ label, error, description, required, className, ...props }: TextareaProps) {
  return (
    <FormField label={label} error={error} required={required} description={description}>
      <AntdInput.TextArea className={className} autoSize={{ minRows: 4, maxRows: 12 }} {...props} />
    </FormField>
  )
}

/* ------------------------------------------------------------------ */
/* Select                                                              */
/* ------------------------------------------------------------------ */

interface SelectProps extends Omit<AntdSelectProps, 'options'> {
  label: string
  error?: string
  description?: string
  required?: boolean
  /** Legacy pages pass `name` for native form submission — accepted for compatibility. */
  name?: string
  options: { value: string; label: string }[]
  placeholder?: string
}

export function Select({ label, error, description, required, options, placeholder, className, ...props }: SelectProps) {
  return (
    <FormField label={label} error={error} required={required} description={description}>
      <AntdSelect className={className} options={options} placeholder={placeholder} {...props} />
    </FormField>
  )
}

/* ------------------------------------------------------------------ */
/* Toggle — Ant Design Switch                                           */
/* ------------------------------------------------------------------ */

interface ToggleProps {
  label: string
  checked: boolean
  onChange: (checked: boolean) => void
  description?: string
}

export function Toggle({ label, checked, onChange, description }: ToggleProps) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '4px 0' }}>
      <div>
        <Typography.Text style={{ fontSize: 14 }}>{label}</Typography.Text>
        {description && (
          <Typography.Paragraph type="secondary" style={{ fontSize: 12, marginBottom: 0, marginTop: 2 }}>
            {description}
          </Typography.Paragraph>
        )}
      </div>
      <Switch checked={checked} onChange={onChange} />
    </div>
  )
}
