'use client'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { cn } from '@/app/lib/utils'
import {
  ChevronLeft,
  ChevronRight,
  RotateCcw,
  Stethoscope,
  X
} from 'lucide-react'
import { DoctorCard, DoctorCardSkeleton } from './DoctorCard'
import {
  DesktopFilterSidebar,
  FilterToolbar,
  SORT_OPTIONS
} from './DoctorFilterSidebar'
import { useDoctorFilters } from './useDoctorFilters'

// Grid column classes based on sidebar state
const gridCols = (sidebarOpen: boolean) =>
  cn(
    'grid grid-cols-1 gap-5 sm:grid-cols-2',
    sidebarOpen
      ? 'lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-4'
      : 'lg:grid-cols-3 xl:grid-cols-4'
  )

// Loader grid reused in skeleton and during refetch
export const DoctorsLoaderGrid = ({
  isSidebarOpen = true
}: {
  isSidebarOpen?: boolean
}) => (
  <div className={gridCols(isSidebarOpen)}>
    {Array.from({ length: 8 }).map((_, i) => (
      <DoctorCardSkeleton
        key={i}
        variant='detailed'
      />
    ))}
  </div>
)

// Suspense fallback skeleton matching the two-column layout
export const DoctorDirectorySkeleton = () => (
  <section
    aria-labelledby='doctors-directory-title'
    className='w-full py-8 md:py-12'>
    <div className='space-y-8'>
      <div>
        <p className='text-xs font-bold uppercase tracking-wider text-primary'>
          Browse through the doctors specialist.
        </p>
        <h1
          id='doctors-directory-title'
          className='mt-1 text-2xl font-extrabold tracking-tight text-foreground sm:text-3xl md:text-4xl'>
          Specialist Physicians & Surgeons
        </h1>
      </div>

      <div className='flex items-start gap-8'>
        <div className='flex-1 space-y-6'>
          <div className='flex items-center justify-between'>
            <Skeleton className='h-5 w-40 rounded' />
            <Skeleton className='h-9 w-32 rounded-xl' />
          </div>
          <DoctorsLoaderGrid isSidebarOpen={true} />
        </div>
      </div>
    </div>
  </section>
)

// Active filter chip with remove button
const FilterChip = ({
  label,
  onRemove
}: {
  label: string
  onRemove: () => void
}) => (
  <Badge
    variant='secondary'
    className='gap-1.5 rounded-lg py-1 px-2.5 text-xs font-semibold'>
    <span>{label}</span>
    <button
      type='button'
      onClick={onRemove}
      className='text-muted-foreground hover:text-destructive'>
      <X className='size-3' />
    </button>
  </Badge>
)

export const DoctorDirectory = () => {
  const filters = useDoctorFilters()

  const filterSidebarProps = {
    searchInput: filters.searchInput,
    setSearchInput: filters.setSearchInput,
    handleClearSearch: filters.handleClearSearch,
    specialties: filters.specialties,
    selectedSpecialty: filters.selectedSpecialty,
    handleSpecialtyChange: filters.handleSpecialtyChange,
    selectedGender: filters.selectedGender,
    handleGenderChange: filters.handleGenderChange,
    currentSortValue: filters.currentSortValue,
    handleSortChange: filters.handleSortChange,
    hasActiveFilters: filters.hasActiveFilters,
    handleResetAll: filters.handleResetAll
  }

  return (
    <section
      aria-labelledby='doctors-directory-title'
      className='w-full py-8 md:py-12'>
      <div className='space-y-8'>
        {/* Header */}
        <div className='flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between'>
          <div>
            <p className='text-xs font-bold uppercase tracking-wider text-primary'>
              Browse through the doctors specialist.
            </p>
            <h1
              id='doctors-directory-title'
              className='mt-1 text-2xl font-extrabold tracking-tight text-foreground sm:text-3xl md:text-4xl'>
              Specialist Physicians & Surgeons
            </h1>
          </div>

          <FilterToolbar
            {...filterSidebarProps}
            isDesktopSidebarOpen={filters.isDesktopSidebarOpen}
            setIsDesktopSidebarOpen={filters.setIsDesktopSidebarOpen}
            isMobileSheetOpen={filters.isMobileSheetOpen}
            setIsMobileSheetOpen={filters.setIsMobileSheetOpen}
            activeFilterCount={filters.activeFilterCount}
          />
        </div>

        {/* Two-Column Layout */}
        <div className='flex items-start gap-8'>
          {/* Desktop Sidebar */}
          {filters.isDesktopSidebarOpen && (
            <DesktopFilterSidebar {...filterSidebarProps} />
          )}

          {/* Main Content */}
          <div className='min-w-0 flex-1 space-y-6'>
            {/* Status bar with sort and active filter chips */}
            <div className='flex flex-col gap-3 rounded-2xl border border-border/70 bg-card p-4 shadow-xs'>
              <div className='flex flex-wrap items-center justify-between gap-3 text-xs'>
                <p className='font-semibold text-muted-foreground'>
                  {filters.showLoader ? (
                    'Searching verified physicians...'
                  ) : (
                    <>
                      Showing{' '}
                      <span className='font-extrabold text-foreground'>
                        {filters.meta?.total ?? filters.doctors.length}
                      </span>{' '}
                      specialist{filters.doctors.length === 1 ? '' : 's'}
                    </>
                  )}
                </p>

                <div className='flex items-center gap-2'>
                  <span className='text-muted-foreground font-medium'>
                    Sort:
                  </span>
                  <select
                    value={filters.currentSortValue}
                    onChange={(e) => filters.handleSortChange(e.target.value)}
                    aria-label='Sort doctors list'
                    className='rounded-lg border border-border/70 bg-background px-2.5 py-1 text-xs font-bold text-foreground outline-none focus:border-primary'>
                    {SORT_OPTIONS.map((opt) => (
                      <option
                        key={opt.value}
                        value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Active filter chips */}
              {filters.hasActiveFilters && (
                <div className='flex flex-wrap items-center gap-2 border-t border-border/60 pt-3'>
                  <span className='text-[11px] font-bold uppercase tracking-wider text-muted-foreground'>
                    Active:
                  </span>

                  {filters.appliedSearch && (
                    <FilterChip
                      label={`Search: "${filters.appliedSearch}"`}
                      onRemove={filters.handleClearSearch}
                    />
                  )}
                  {filters.selectedSpecialty !== 'all' && (
                    <FilterChip
                      label={filters.selectedSpecialty}
                      onRemove={() => filters.handleSpecialtyChange('all')}
                    />
                  )}
                  {filters.selectedGender !== 'all' && (
                    <FilterChip
                      label={`Gender: ${filters.selectedGender === 'MALE' ? 'Male' : 'Female'}`}
                      onRemove={() => filters.handleGenderChange('all')}
                    />
                  )}
                  {filters.sortBy && (
                    <FilterChip
                      label={`Sort: ${filters.sortLabel}`}
                      onRemove={() => filters.handleSortChange('recommended')}
                    />
                  )}

                  <button
                    type='button'
                    onClick={filters.handleResetAll}
                    className='inline-flex items-center gap-1 text-xs font-bold text-primary hover:underline ml-1'>
                    <RotateCcw className='size-3' />
                    Clear all
                  </button>
                </div>
              )}
            </div>

            {/* Doctor Grid / Loader / Empty State */}
            {filters.showLoader ? (
              <DoctorsLoaderGrid isSidebarOpen={filters.isDesktopSidebarOpen} />
            ) : filters.doctors.length > 0 ? (
              <div className={gridCols(filters.isDesktopSidebarOpen)}>
                {filters.doctors.map((doctor) => (
                  <DoctorCard
                    key={doctor.id}
                    doctor={doctor}
                    variant='detailed'
                  />
                ))}
              </div>
            ) : (
              <div className='flex flex-col items-center justify-center rounded-2xl border border-border/80 bg-card p-12 text-center shadow-xs'>
                <div className='flex size-14 items-center justify-center rounded-2xl bg-secondary text-primary'>
                  <Stethoscope className='size-7' />
                </div>
                <h3 className='mt-4 text-lg font-bold text-foreground'>
                  No doctors found
                </h3>
                <p className='mt-1 max-w-sm text-xs text-muted-foreground'>
                  We couldn&apos;t find any verified medical doctor matching
                  your active filters.
                </p>
                {filters.hasActiveFilters && (
                  <Button
                    type='button'
                    variant='outline'
                    onClick={filters.handleResetAll}
                    className='mt-4 h-9 rounded-xl border-primary text-xs font-bold text-primary hover:bg-primary/10'>
                    <RotateCcw className='mr-1.5 size-3.5' />
                    Reset all filters
                  </Button>
                )}
              </div>
            )}

            {/* Pagination */}
            {filters.totalPages > 1 && (
              <div className='flex items-center justify-between border-t border-border/70 pt-6'>
                <p className='text-xs font-semibold text-muted-foreground'>
                  Page{' '}
                  <span className='font-bold text-foreground'>
                    {filters.page}
                  </span>{' '}
                  of{' '}
                  <span className='font-bold text-foreground'>
                    {filters.totalPages}
                  </span>
                </p>

                <div className='flex items-center gap-2'>
                  <Button
                    type='button'
                    variant='outline'
                    size='sm'
                    disabled={filters.page <= 1 || filters.showLoader}
                    onClick={() => filters.setPage((p) => Math.max(p - 1, 1))}
                    className='h-8 rounded-lg text-xs font-semibold'>
                    <ChevronLeft className='mr-1 size-3.5' />
                    Previous
                  </Button>

                  <Button
                    type='button'
                    variant='outline'
                    size='sm'
                    disabled={
                      filters.page >= filters.totalPages || filters.showLoader
                    }
                    onClick={() =>
                      filters.setPage((p) =>
                        Math.min(p + 1, filters.totalPages)
                      )
                    }
                    className='h-8 rounded-lg text-xs font-semibold'>
                    Next
                    <ChevronRight className='ml-1 size-3.5' />
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}

export default DoctorDirectory
