'use client'

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog'
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
    <Dialog
      open={open}
      onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Change user status</DialogTitle>
          <DialogDescription>
            Choose the new account status for {userName ?? 'this user'}.
          </DialogDescription>
        </DialogHeader>

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
              <SelectItem value='ACTIVE'>ACTIVE</SelectItem>
              <SelectItem value='BLOCK'>BLOCK</SelectItem>
            </SelectContent>
          </Select>
          <p className='text-xs text-muted-foreground'>
            Deleted accounts can only be handled through the delete action.
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
            {isPending ? 'Updating...' : 'Update status'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default ChangeUserStatusDialog
