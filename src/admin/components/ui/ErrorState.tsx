import { Button, Result } from 'antd'

interface ErrorStateProps {
  message?: string
  onRetry?: () => void
}

export function ErrorState({ message = 'Something went wrong', onRetry }: ErrorStateProps) {
  return (
    <Result
      status="error"
      title="Something went wrong"
      subTitle={message}
      extra={
        onRetry && (
          <Button onClick={onRetry}>Try again</Button>
        )
      }
      style={{ padding: '32px 16px' }}
    />
  )
}
