'use client'

import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import { UserRole } from '@/types/user.types'

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
    <Dialog
      open={open}
      onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Change user role</DialogTitle>
          <DialogDescription>
            Choose the new role for {userName ?? 'this user'}.
          </DialogDescription>
        </DialogHeader>

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
              <SelectItem value={UserRole.SUPER_ADMIN}>Super Admin</SelectItem>
            </SelectContent>
          </Select>
          <p className='text-xs text-muted-foreground'>
            You cannot change your own role.
          </p>
        </div>

        <DialogFooter>
          <DialogClose
            render={
              <Button
                type='button'
                variant='outline'
                disabled={isPending}>
                Cancel
              </Button>
            }
          />
          <Button
            type='button'
            onClick={onSubmit}
            disabled={isPending}>
            {isPending ? 'Updating...' : 'Update role'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default ChangeUserRoleDialog
