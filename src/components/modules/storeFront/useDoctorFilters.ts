'use client'

import { getAllSpecialties, getDoctors } from '@/service/doctor.service'
import { PaginationMeta } from '@/types/api.types'
import { IDoctor } from '@/types/doctor.types'
import { ISpecialty } from '@/types/specialty.types'
import { useQuery } from '@tanstack/react-query'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { useEffect, useMemo, useState } from 'react'

const SPECIALTIES_PARAM_KEY = 'doctorSpecialties.specialty.title'

const SORT_MAP: Record<string, { sortBy: string; sortOrder: string }> = {
  rating: { sortBy: 'averageRating', sortOrder: 'desc' },
  experience: { sortBy: 'experience', sortOrder: 'desc' },
  'fee-asc': { sortBy: 'appointmentFee', sortOrder: 'asc' },
  'fee-desc': { sortBy: 'appointmentFee', sortOrder: 'desc' }
}

const SORT_LABELS: Record<string, string> = {
  rating: 'Highest Rated',
  experience: 'Most Experienced',
  'fee-asc': 'Fee: Low to High',
  'fee-desc': 'Fee: High to Low'
}

export function useDoctorFilters() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  // Sidebar toggle state
  const [isDesktopSidebarOpen, setIsDesktopSidebarOpen] = useState(true)
  const [isMobileSheetOpen, setIsMobileSheetOpen] = useState(false)

  // Filter state from URL
  const [searchInput, setSearchInput] = useState(
    () => searchParams.get('searchTerm') || ''
  )
  const [appliedSearch, setAppliedSearch] = useState(
    () => searchParams.get('searchTerm') || ''
  )
  const [selectedSpecialty, setSelectedSpecialty] = useState(
    () => searchParams.get(SPECIALTIES_PARAM_KEY) || 'all'
  )
  const [selectedGender, setSelectedGender] = useState(
    () => searchParams.get('gender') || 'all'
  )
  const [sortBy, setSortBy] = useState(() => searchParams.get('sortBy') || '')
  const [sortOrder, setSortOrder] = useState(
    () => searchParams.get('sortOrder') || ''
  )
  const [page, setPage] = useState(() => Number(searchParams.get('page')) || 1)

  // Debounced search
  useEffect(() => {
    const trimmed = searchInput.trim()
    const timer = setTimeout(() => {
      setAppliedSearch(trimmed)
      setPage(1)
    }, 300)
    return () => clearTimeout(timer)
  }, [searchInput])

  // Build query string
  const queryString = useMemo(() => {
    const params = new URLSearchParams()
    if (appliedSearch) params.set('searchTerm', appliedSearch)
    if (selectedSpecialty && selectedSpecialty !== 'all')
      params.set(SPECIALTIES_PARAM_KEY, selectedSpecialty)
    if (selectedGender && selectedGender !== 'all')
      params.set('gender', selectedGender)
    if (sortBy) {
      params.set('sortBy', sortBy)
      params.set('sortOrder', sortOrder)
    }
    if (page > 1) params.set('page', String(page))
    return params.toString()
  }, [appliedSearch, selectedSpecialty, selectedGender, sortBy, sortOrder, page])

  // Sync URL
  useEffect(() => {
    const nextUrl = queryString ? `${pathname}?${queryString}` : pathname
    router.replace(nextUrl, { scroll: false })
  }, [queryString, pathname, router])

  // Queries
  const {
    data: doctorDataResponse,
    isLoading: isDoctorsLoading,
    isFetching: isDoctorsFetching
  } = useQuery({
    queryKey: ['doctors', queryString],
    queryFn: () => getDoctors(queryString)
  })

  const { data: specialtiesResponse } = useQuery({
    queryKey: ['specialties'],
    queryFn: getAllSpecialties,
    staleTime: 1000 * 60 * 60
  })

  // Extract data safely from API response shape
  interface DoctorNestedData {
    data?: IDoctor[]
    meta?: PaginationMeta
  }
  const doctorResponseData = doctorDataResponse?.data as
    | DoctorNestedData
    | IDoctor[]
    | undefined

  const doctors: IDoctor[] =
    (Array.isArray(doctorResponseData)
      ? doctorResponseData
      : ((doctorResponseData as DoctorNestedData)?.data ??
        ((doctorDataResponse as { data?: { data?: IDoctor[] } })?.data?.data ||
          []))) || []

  const meta: PaginationMeta | undefined =
    (doctorResponseData as DoctorNestedData)?.meta ??
    (doctorDataResponse as { meta?: PaginationMeta })?.meta

  const specialties: ISpecialty[] =
    (Array.isArray((specialtiesResponse as { data?: ISpecialty[] })?.data)
      ? (specialtiesResponse as { data?: ISpecialty[] })?.data
      : Array.isArray(specialtiesResponse)
        ? (specialtiesResponse as ISpecialty[])
        : []) || []

  // Handlers
  const handleClearSearch = () => {
    setSearchInput('')
    setAppliedSearch('')
    setPage(1)
  }

  const handleSpecialtyChange = (value: string) => {
    setSelectedSpecialty(value)
    setPage(1)
  }

  const handleGenderChange = (value: string) => {
    setSelectedGender(value)
    setPage(1)
  }

  const handleSortChange = (value: string) => {
    const mapped = SORT_MAP[value]
    setSortBy(mapped?.sortBy ?? '')
    setSortOrder(mapped?.sortOrder ?? '')
    setPage(1)
  }

  const handleResetAll = () => {
    setSearchInput('')
    setAppliedSearch('')
    setSelectedSpecialty('all')
    setSelectedGender('all')
    setSortBy('')
    setSortOrder('')
    setPage(1)
  }

  // Derived values
  const currentSortValue =
    sortBy === 'averageRating'
      ? 'rating'
      : sortBy === 'experience'
        ? 'experience'
        : sortBy === 'appointmentFee' && sortOrder === 'asc'
          ? 'fee-asc'
          : sortBy === 'appointmentFee' && sortOrder === 'desc'
            ? 'fee-desc'
            : 'recommended'

  const hasActiveFilters =
    Boolean(appliedSearch) ||
    selectedSpecialty !== 'all' ||
    selectedGender !== 'all' ||
    Boolean(sortBy)

  const activeFilterCount =
    (appliedSearch ? 1 : 0) +
    (selectedSpecialty !== 'all' ? 1 : 0) +
    (selectedGender !== 'all' ? 1 : 0) +
    (sortBy ? 1 : 0)

  const sortLabel = SORT_LABELS[currentSortValue] ?? ''
  const totalPages = meta?.totalPages ?? 1
  const showLoader = isDoctorsLoading || isDoctorsFetching

  return {
    // UI toggle state
    isDesktopSidebarOpen,
    setIsDesktopSidebarOpen,
    isMobileSheetOpen,
    setIsMobileSheetOpen,

    // Filter state
    searchInput,
    setSearchInput,
    appliedSearch,
    selectedSpecialty,
    selectedGender,
    currentSortValue,
    sortBy,

    // Data
    doctors,
    meta,
    specialties,
    showLoader,
    page,
    setPage,
    totalPages,

    // Derived
    hasActiveFilters,
    activeFilterCount,
    sortLabel,

    // Handlers
    handleClearSearch,
    handleSpecialtyChange,
    handleGenderChange,
    handleSortChange,
    handleResetAll
  }
}
