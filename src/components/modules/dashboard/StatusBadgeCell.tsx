import { Badge } from '@/components/ui/badge'
import { UserStatus } from '@/types/user.types'

interface IStatusBadgeCellProps {
  status: UserStatus
}

const StatusBadgeCell = ({ status }: IStatusBadgeCellProps) => {
  return (
    <Badge
      variant={
        status === UserStatus.ACTIVE
          ? 'default'
          : status === UserStatus.BLOCK
            ? 'destructive'
            : 'secondary'
      }>
      <span className='text-sm capitalize'>{status?.toLowerCase()}</span>
    </Badge>
  )
}

export default StatusBadgeCell
