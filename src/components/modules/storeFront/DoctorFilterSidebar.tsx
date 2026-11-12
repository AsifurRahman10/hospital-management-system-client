import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle
} from '@/components/ui/sheet'
import { ISpecialty } from '@/types/specialty.types'
import { cn } from '@/app/lib/utils'
import {
  Check,
  PanelLeftClose,
  PanelLeftOpen,
  RotateCcw,
  Search,
  SlidersHorizontal,
  X
} from 'lucide-react'
import React from 'react'

// Shared pill button style
const pillClass = (active: boolean) =>
  cn(
    'rounded-xl border px-3.5 py-2.5 text-left text-xs font-semibold transition-all',
    active
      ? 'border-primary/40 bg-primary/10 text-primary shadow-xs'
      : 'border-border/70 bg-card text-muted-foreground hover:border-border hover:bg-muted/40 hover:text-foreground'
  )

// Sort options shared between sidebar and toolbar
export const SORT_OPTIONS = [
  { value: 'recommended', label: 'Recommended' },
  { value: 'rating', label: 'Highest Rated' },
  { value: 'experience', label: 'Most Experienced' },
  { value: 'fee-asc', label: 'Fee: Low to High' },
  { value: 'fee-desc', label: 'Fee: High to Low' }
] as const

export interface FilterSidebarProps {
  searchInput: string
  setSearchInput: (value: string) => void
  handleClearSearch: () => void
  specialties: ISpecialty[]
  selectedSpecialty: string
  handleSpecialtyChange: (value: string) => void
  selectedGender: string
  handleGenderChange: (value: string) => void
  currentSortValue: string
  handleSortChange: (value: string) => void
  hasActiveFilters: boolean
  handleResetAll: () => void
  onItemSelect?: () => void
}

const GENDER_OPTIONS = [
  { label: 'All', value: 'all' },
  { label: 'Male', value: 'MALE' },
  { label: 'Female', value: 'FEMALE' }
]

// Inner content rendered in both desktop sidebar and mobile sheet
const FilterSidebarContent = ({
  searchInput,
  setSearchInput,
  handleClearSearch,
  specialties,
  selectedSpecialty,
  handleSpecialtyChange,
  selectedGender,
  handleGenderChange,
  currentSortValue,
  handleSortChange,
  hasActiveFilters,
  handleResetAll,
  onItemSelect
}: FilterSidebarProps) => (
  <div className='flex flex-col gap-6 text-foreground'>
    {/* Header */}
    <div className='flex items-center justify-between border-b border-border/70 pb-3'>
      <div className='flex items-center gap-2'>
        <SlidersHorizontal className='size-4 text-primary' />
        <h2 className='text-sm font-bold uppercase tracking-wider text-foreground'>
          Filter Doctors
        </h2>
      </div>
      {hasActiveFilters && (
        <button
          type='button'
          onClick={handleResetAll}
          className='inline-flex items-center gap-1 text-xs font-semibold text-primary transition-colors hover:text-primary/80'>
          <RotateCcw className='size-3' />
          Reset all
        </button>
      )}
    </div>

    {/* Search */}
    <div className='space-y-2'>
      <label
        htmlFor='sidebar-search'
        className='text-xs font-bold uppercase tracking-wider text-muted-foreground'>
        Search Doctor
      </label>
      <div className='relative'>
        <Search
          className='absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground'
          aria-hidden='true'
        />
        <Input
          id='sidebar-search'
          type='text'
          placeholder='Name, qualification, hospital...'
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          className='h-10 rounded-xl bg-background pl-9 pr-8 text-xs focus-visible:border-primary'
        />
        {searchInput && (
          <button
            type='button'
            onClick={handleClearSearch}
            aria-label='Clear search'
            className='absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground'>
            <X className='size-3.5' />
          </button>
        )}
      </div>
    </div>

    {/* Specialist Categories */}
    <div className='space-y-2'>
      <div className='flex items-center justify-between'>
        <label className='text-xs font-bold uppercase tracking-wider text-muted-foreground'>
          Specialist Categories
        </label>
        <span className='text-[11px] font-semibold text-muted-foreground/80'>
          {specialties.length + 1}
        </span>
      </div>

      <div className='flex flex-col gap-1.5'>
        <button
          type='button'
          onClick={() => {
            handleSpecialtyChange('all')
            onItemSelect?.()
          }}
          className={cn(
            'group flex w-full items-center justify-between',
            pillClass(selectedSpecialty === 'all')
          )}>
          <span>All Specialists</span>
          {selectedSpecialty === 'all' && (
            <Check className='size-3.5 shrink-0 text-primary' />
          )}
        </button>

        {specialties.map((spec) => {
          const active = selectedSpecialty === spec.title
          return (
            <button
              type='button'
              key={spec.id}
              onClick={() => {
                handleSpecialtyChange(spec.title)
                onItemSelect?.()
              }}
              className={cn(
                'group flex w-full items-center justify-between',
                pillClass(active)
              )}>
              <span className='truncate'>{spec.title}</span>
              {active && <Check className='size-3.5 shrink-0 text-primary' />}
            </button>
          )
        })}
      </div>
    </div>

    {/* Gender */}
    <div className='space-y-2'>
      <label className='text-xs font-bold uppercase tracking-wider text-muted-foreground'>
        Doctor Gender
      </label>
      <div className='grid grid-cols-3 gap-1.5'>
        {GENDER_OPTIONS.map((item) => (
          <button
            type='button'
            key={item.value}
            onClick={() => {
              handleGenderChange(item.value)
              onItemSelect?.()
            }}
            className={cn(
              'text-center',
              pillClass(selectedGender === item.value)
            )}>
            {item.label}
          </button>
        ))}
      </div>
    </div>
  </div>
)

// Props for the outer wrapper that handles desktop sidebar + mobile sheet
interface DoctorFilterSidebarProps extends FilterSidebarProps {
  isDesktopSidebarOpen: boolean
  setIsDesktopSidebarOpen: (open: boolean) => void
  isMobileSheetOpen: boolean
  setIsMobileSheetOpen: (open: boolean) => void
  activeFilterCount: number
}

// Desktop sidebar panel (collapsible)
export const DesktopFilterSidebar = (props: FilterSidebarProps) => (
  <aside className='sticky top-24 hidden w-72 shrink-0 md:block lg:w-80'>
    <div className='rounded-2xl border border-border/70 bg-card p-5 shadow-xs'>
      <FilterSidebarContent {...props} />
    </div>
  </aside>
)

// Toolbar buttons + mobile sheet trigger
export const FilterToolbar = ({
  isDesktopSidebarOpen,
  setIsDesktopSidebarOpen,
  isMobileSheetOpen,
  setIsMobileSheetOpen,
  activeFilterCount,
  ...filterProps
}: DoctorFilterSidebarProps) => (
  <div className='flex items-center gap-3'>
    {/* Desktop toggle */}
    <Button
      type='button'
      variant='outline'
      onClick={() => setIsDesktopSidebarOpen(!isDesktopSidebarOpen)}
      className='hidden md:inline-flex h-10 items-center gap-2 rounded-xl border-border/80 bg-card px-4 text-xs font-bold text-foreground shadow-xs hover:border-primary hover:text-primary'>
      {isDesktopSidebarOpen ? (
        <PanelLeftClose className='size-4' />
      ) : (
        <PanelLeftOpen className='size-4' />
      )}
      <span>{isDesktopSidebarOpen ? 'Hide Filters' : 'Show Filters'}</span>
      {activeFilterCount > 0 && (
        <Badge
          variant='default'
          className='ml-1 size-5 rounded-full p-0 flex items-center justify-center text-[10px] font-bold'>
          {activeFilterCount}
        </Badge>
      )}
    </Button>

    {/* Mobile sheet trigger */}
    <div className='md:hidden'>
      <Button
        type='button'
        variant='outline'
        onClick={() => setIsMobileSheetOpen(true)}
        className='h-10 items-center gap-2 rounded-xl border-border/80 bg-card px-4 text-xs font-bold text-foreground shadow-xs'>
        <SlidersHorizontal className='size-4 text-primary' />
        <span>Filters</span>
        {activeFilterCount > 0 && (
          <Badge
            variant='default'
            className='ml-1 size-5 rounded-full p-0 flex items-center justify-center text-[10px] font-bold'>
            {activeFilterCount}
          </Badge>
        )}
      </Button>

      <Sheet
        open={isMobileSheetOpen}
        onOpenChange={setIsMobileSheetOpen}>
        <SheetContent
          side='left'
          className='w-[85vw] max-w-sm overflow-y-auto p-6'>
          <SheetHeader className='p-0 pb-4 text-left'>
            <SheetTitle className='text-base font-bold'>
              Doctor Filters
            </SheetTitle>
          </SheetHeader>
          <FilterSidebarContent
            {...filterProps}
            onItemSelect={() => setIsMobileSheetOpen(false)}
          />
        </SheetContent>
      </Sheet>
    </div>
  </div>
)
