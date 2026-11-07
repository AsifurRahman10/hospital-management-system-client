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
import { UserRole } from '@/types/user.types'
import { UserCog } from 'lucide-react'

interface ChangeUserRoleDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  userName?: string
  role: UserRole
  onRoleChange: (role: UserRole) => void
  onSubmit: () => void
  isPending?: boolean
}

const ChangeUserRoleDialog = ({
  open,
  onOpenChange,
  userName,
  role,
  onRoleChange,
  onSubmit,
  isPending = false
}: ChangeUserRoleDialogProps) => {
  return (
    <AppModal
      open={open}
      onOpenChange={onOpenChange}
      size='md'
      title='Change user role'
      description={`Choose the new role for ${userName ?? 'this user'}.`}
      icon={<UserCog className='size-5' />}
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
            {isPending ? 'Updating...' : 'Update role'}
          </Button>
        </div>
      }>
      <div className='space-y-2 py-2'>
        <Label htmlFor='user-role'>Account role</Label>
        <Select
          value={role}
          onValueChange={(value) => onRoleChange(value as UserRole)}>
          <SelectTrigger
            id='user-role'
            className='w-full'>
            <SelectValue placeholder='Select account role' />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={UserRole.ADMIN}>Admin</SelectItem>
            <SelectItem value={UserRole.DOCTOR}>Doctor</SelectItem>
            <SelectItem value={UserRole.PATIENT}>Patient</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </AppModal>
  )
}

export default ChangeUserRoleDialog
