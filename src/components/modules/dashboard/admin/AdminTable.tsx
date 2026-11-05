'use client'

import DateCell from '@/components/modules/dashboard/DateCell'
import StatusBadgeCell from '@/components/modules/dashboard/StatusBadgeCell'
import UserInfoCell from '@/components/modules/dashboard/UserInfoCell'
import ChangeUserStatusDialog from '@/components/shared/ChangeUserStatusDialog'
import ChangeUserRoleDialog from '@/components/shared/ChangeUserRoleDialog'
import CreateAdminFormModal from '@/components/shared/CreateAdminFormModal'
import DataTable from '@/components/shared/DataTable'
import { Button } from '@/components/ui/button'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle
} from '@/components/ui/alert-dialog'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useRowActionModalState } from '@/hooks/useRowActionModalState'
import { deleteAdmin, getAdmins, updateAdmin } from '@/service/admin.service'
import { changeUserRole, changeUserStatus } from '@/service/user.service'
import { IAdmin } from '@/types/admin.types'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { createColumnHelper, tableFeatures } from '@tanstack/react-table'
import { RotateCcw } from 'lucide-react'
import { useMemo, useState } from 'react'
import { toast } from 'sonner'
import { UserRole, UserStatus } from '@/types/user.types'

const AdminTable = () => {
  type TableFeatures = ReturnType<typeof tableFeatures>
  const columnHelper = createColumnHelper<TableFeatures, IAdmin>()
  const queryClient = useQueryClient()
  const [formValues, setFormValues] = useState({
    name: '',
    contactNumber: ''
  })
  const [statusTarget, setStatusTarget] = useState<IAdmin | null>(null)
  const [statusValue, setStatusValue] = useState<UserStatus>(UserStatus.ACTIVE)
  const [roleTarget, setRoleTarget] = useState<IAdmin | null>(null)
  const [roleValue, setRoleValue] = useState<UserRole>(UserRole.ADMIN)
  const columns = columnHelper.columns([
    columnHelper.accessor('name', {
      header: 'Name',
      enableSorting: false,
      cell: ({ row }) => (
        <UserInfoCell
          name={row.original.name}
          email={row.original.email}
          profilePhoto={row.original.profilePhoto}
        />
      )
    }),
    columnHelper.display({
      id: 'role',
      header: 'Role',
      enableSorting: false,
      cell: ({ row }) => (
        <span className='text-sm'>{row.original.user?.role ?? 'N/A'}</span>
      )
    }),
    columnHelper.accessor('contactNumber', {
      header: 'Contact Number',
      enableSorting: false,
      cell: ({ getValue }) => (
        <span className='text-sm'>{getValue() || 'N/A'}</span>
      )
    }),
    columnHelper.display({
      id: 'status',
      header: 'Status',
      enableSorting: false,
      cell: ({ row }) => (
        <StatusBadgeCell
          status={row.original.user?.status as unknown as UserStatus}
        />
      )
    }),
    columnHelper.accessor('createdAt', {
      header: 'Joined On',
      enableSorting: false,
      cell: ({ getValue }) => (
        <DateCell
          date={getValue()}
          formatString='MMM dd, yyyy'
        />
      )
    })
  ])

  const {
    editingItem,
    deletingItem,
    isEditModalOpen,
    isDeleteDialogOpen,
    onEditOpenChange,
    onDeleteOpenChange,
    tableActions
  } = useRowActionModalState<IAdmin>({ enableView: false })

  const { data, isLoading, isFetching, isError, error, refetch } = useQuery({
    queryKey: ['admins'],
    queryFn: getAdmins
  })
  const admins = data?.data ?? []
  const refreshAdmins = async () => {
    await queryClient.invalidateQueries({ queryKey: ['admins'] })
    await queryClient.refetchQueries({ queryKey: ['admins'], type: 'active' })
  }

  const editMutation = useMutation({
    mutationFn: ({ id, values }: { id: string; values: typeof formValues }) =>
      updateAdmin(id, values),
    onSuccess: async (result) => {
      if (!result.success) {
        toast.error(result.message || 'Failed to update admin')
        return
      }
      toast.success(result.message || 'Admin updated successfully')
      onEditOpenChange(false)
      await refreshAdmins()
    },
    onError: (mutationError) =>
      toast.error(
        mutationError instanceof Error
          ? mutationError.message
          : 'Failed to update admin'
      )
  })

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteAdmin(id),
    onSuccess: async (result) => {
      if (!result.success) {
        toast.error(result.message || 'Failed to delete admin')
        return
      }
      toast.success(result.message || 'Admin deleted successfully')
      onDeleteOpenChange(false)
      await refreshAdmins()
    },
    onError: (mutationError) =>
      toast.error(
        mutationError instanceof Error
          ? mutationError.message
          : 'Failed to delete admin'
      )
  })

  const statusMutation = useMutation({
    mutationFn: ({ admin, status }: { admin: IAdmin; status: UserStatus }) =>
      changeUserStatus({
        userId: admin.user.id,
        userStatus: status
      }),
    onSuccess: async (result) => {
      if (!result.success) {
        toast.error(result.message || 'Failed to change admin status')
        return
      }
      toast.success(result.message || 'Admin status updated')
      setStatusTarget(null)
      await refreshAdmins()
    },
    onError: (mutationError) =>
      toast.error(
        mutationError instanceof Error
          ? mutationError.message
          : 'Failed to change admin status'
      )
  })

  const roleMutation = useMutation({
    mutationFn: ({ admin, role }: { admin: IAdmin; role: UserRole }) =>
      changeUserRole({
        userId: admin.user.id,
        role
      }),
    onSuccess: async (result) => {
      if (!result.success) {
        toast.error(result.message || 'Failed to change admin role')
        return
      }
      toast.success(result.message || 'Admin role updated')
      setRoleTarget(null)
      await refreshAdmins()
    },
    onError: (mutationError) =>
      toast.error(
        mutationError instanceof Error
          ? mutationError.message
          : 'Failed to change admin role'
      )
  })

  const actions = useMemo(
    () => ({
      ...tableActions,
      onEdit: (admin: IAdmin) => {
        setFormValues({
          name: admin.name,
          contactNumber: admin.contactNumber ?? ''
        })
        tableActions.onEdit?.(admin)
      },
      onStatusChange: (admin: IAdmin) => {
        setStatusTarget(admin)
        setStatusValue(admin.user.status)
      },
      onRoleChange: (admin: IAdmin) => {
        setRoleTarget(admin)
        setRoleValue(admin.user.role)
      }
    }),
    [
      setFormValues,
      setRoleTarget,
      setRoleValue,
      setStatusTarget,
      setStatusValue,
      tableActions
    ]
  )

  const fetchError = isError
    ? error instanceof Error
      ? error.message
      : 'Unable to load admins.'
    : data?.success === false
      ? data.message
      : undefined

  return (
    <>
      <section className='mx-auto w-full max-w-[1600px] space-y-5 px-4 py-5 md:px-8 md:py-7'>
        <header className='flex flex-wrap items-end justify-between gap-4'>
          <div>
            <p className='mb-1 text-xs font-bold uppercase text-primary'>
              Administration
            </p>
            <h1 className='text-2xl font-extrabold text-foreground'>Admins</h1>
            <p className='mt-1 text-sm text-muted-foreground'>
              Browse and manage administrator accounts.
            </p>
          </div>
          <div className='rounded-md border border-border bg-card px-3 py-2 text-sm text-muted-foreground'>
            <span className='font-semibold tabular-nums text-foreground'>
              {admins.length}
            </span>{' '}
            {admins.length === 1 ? 'admin' : 'admins'}
          </div>
        </header>

        {fetchError && (
          <div
            className='flex flex-wrap items-center justify-between gap-3 rounded-md border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm'
            role='alert'>
            <p className='text-muted-foreground'>{fetchError}</p>
            <Button
              type='button'
              size='sm'
              variant='outline'
              onClick={() => void refetch()}
              disabled={isFetching}>
              <RotateCcw className='h-3.5 w-3.5' /> Retry
            </Button>
          </div>
        )}

        <DataTable
          data={admins}
          columns={columns}
          isLoading={isLoading}
          isFetching={isFetching}
          error={fetchError}
          onRetry={() => void refetch()}
          emptyMessage='No administrator accounts are available yet.'
          toolbarAction={<CreateAdminFormModal />}
          actions={actions}
        />
      </section>

      <Dialog
        open={isEditModalOpen}
        onOpenChange={onEditOpenChange}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Admin</DialogTitle>
            <DialogDescription>
              Update the administrator profile information.
            </DialogDescription>
          </DialogHeader>
          <div className='space-y-4 py-2'>
            <div className='space-y-1.5'>
              <Label htmlFor='admin-name'>Full Name</Label>
              <Input
                id='admin-name'
                value={formValues.name}
                onChange={(event) =>
                  setFormValues({ ...formValues, name: event.target.value })
                }
              />
            </div>
            <div className='space-y-1.5'>
              <Label htmlFor='admin-contact'>Contact Number</Label>
              <Input
                id='admin-contact'
                value={formValues.contactNumber}
                onChange={(event) =>
                  setFormValues({
                    ...formValues,
                    contactNumber: event.target.value
                  })
                }
              />
            </div>
          </div>
          <DialogFooter>
            <DialogClose
              render={
                <Button
                  type='button'
                  variant='outline'>
                  Cancel
                </Button>
              }
            />
            <Button
              type='button'
              disabled={!editingItem || editMutation.isPending}
              onClick={() =>
                editingItem &&
                editMutation.mutate({
                  id: String(editingItem.id),
                  values: formValues
                })
              }>
              {editMutation.isPending ? 'Saving...' : 'Save changes'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog
        open={isDeleteDialogOpen}
        onOpenChange={onDeleteOpenChange}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Admin</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete{' '}
              {deletingItem?.name ?? 'this admin'}?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleteMutation.isPending}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              variant='destructive'
              disabled={!deletingItem || deleteMutation.isPending}
              onClick={(event) => {
                event.preventDefault()
                if (deletingItem) deleteMutation.mutate(String(deletingItem.id))
              }}>
              {deleteMutation.isPending ? 'Deleting...' : 'Delete'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <ChangeUserStatusDialog
        open={statusTarget !== null}
        onOpenChange={(open) => {
          if (!open) setStatusTarget(null)
        }}
        userName={statusTarget?.name}
        status={statusValue}
        onStatusChange={setStatusValue}
        onSubmit={() => {
          if (statusTarget) {
            statusMutation.mutate({ admin: statusTarget, status: statusValue })
          }
        }}
        isPending={statusMutation.isPending}
      />

      <ChangeUserRoleDialog
        open={roleTarget !== null}
        onOpenChange={(open) => {
          if (!open) setRoleTarget(null)
        }}
        userName={roleTarget?.name}
        role={roleValue}
        onRoleChange={setRoleValue}
        onSubmit={() => {
          if (roleTarget) {
            roleMutation.mutate({ admin: roleTarget, role: roleValue })
          }
        }}
        isPending={roleMutation.isPending}
      />
    </>
  )
}

export default AdminTable
