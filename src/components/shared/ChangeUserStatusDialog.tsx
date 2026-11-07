'use client'

import AppModal from '@/components/shared/AppModal'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import { UserStatus } from '@/types/user.types'
import { ShieldCheck } from 'lucide-react'

interface ChangeUserStatusDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  userName?: string
  status: UserStatus
  onStatusChange: (status: UserStatus) => void
  onSubmit: () => void
  isPending?: boolean
}

const ChangeUserStatusDialog = ({
  open,
  onOpenChange,
  userName,
  status,
  onStatusChange,
  onSubmit,
  isPending = false
}: ChangeUserStatusDialogProps) => {
  return (
    <AppModal
      open={open}
      onOpenChange={onOpenChange}
      size='md'
      title='Change user status'
      description={`Choose the new account status for ${userName ?? 'this user'}.`}
      icon={<ShieldCheck className='size-5' />}
      footer={
        <div className='flex items-center justify-end gap-2.5'>
          <Button
            type='button'
            variant='outline'
            onClick={() => onOpenChange(false)}
            disabled={isPending}>
            Cancel
          </Button>
          <Button
            type='button'
            onClick={onSubmit}
            disabled={isPending}>
            {isPending ? 'Updating...' : 'Update status'}
          </Button>
        </div>
      }>
      <div className='space-y-2 py-2'>
        <Label htmlFor='user-status'>Account status</Label>
        <Select
          value={status}
          onValueChange={(value) => onStatusChange(value as UserStatus)}>
          <SelectTrigger
            id='user-status'
            className='w-full'>
            <SelectValue placeholder='Select account status' />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={UserStatus.ACTIVE}>Active</SelectItem>
            <SelectItem value={UserStatus.BLOCK}>Blocked</SelectItem>
            <SelectItem value={UserStatus.DELETED}>Deleted</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </AppModal>
  )
}

export default ChangeUserStatusDialog
