import { describe, it } from 'node:test'
import assert from 'node:assert/strict'
import {
  getDefaultDashboardRoute,
  getRouteOwner,
  isAuthRoute
} from '@/utils/authUtils'
import { buildQueryString } from '@/utils/queryStringUtils'

describe('authUtils', () => {
  it('correctly identifies route owners', () => {
    assert.equal(getRouteOwner('/admin/dashboard'), 'ADMIN')
    assert.equal(getRouteOwner('/doctor/dashboard'), 'DOCTOR')
    assert.equal(getRouteOwner('/dashboard'), 'PATIENT')
    assert.equal(getRouteOwner('/my-profile'), 'COMMON')
    assert.equal(getRouteOwner('/'), null)
  })

  it('correctly maps default dashboard routes', () => {
    assert.equal(getDefaultDashboardRoute('ADMIN'), '/admin/dashboard')
    assert.equal(getDefaultDashboardRoute('SUPER_ADMIN'), '/admin/dashboard')
    assert.equal(getDefaultDashboardRoute('DOCTOR'), '/doctor/dashboard')
    assert.equal(getDefaultDashboardRoute('PATIENT'), '/dashboard')
  })

  it('identifies auth routes', () => {
    assert.equal(isAuthRoute('/login'), true)
    assert.equal(isAuthRoute('/register'), true)
    assert.equal(isAuthRoute('/dashboard'), false)
  })
})

describe('queryStringUtils', () => {
  it('serializes simple and array parameters', () => {
    const params = {
      searchTerm: 'cardio',
      status: ['ACTIVE', 'PENDING'],
      page: '1',
      empty: undefined
    }
    const result = buildQueryString(params)
    assert.equal(
      result,
      'searchTerm=cardio&status=ACTIVE&status=PENDING&page=1'
    )
  })
})
