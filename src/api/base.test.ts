import { describe, expect, it } from 'vitest'
import { TEXT } from '@/constants/text'
import { ApiErrorResponse, getApiErrorMessage } from './index'

describe('getApiErrorMessage', () => {
  it('400 Bad Requestのエラーメッセージを返す', () => {
    const response = new Response(null, { status: 400 })
    const error = new ApiErrorResponse(response)
    error.data = { message: TEXT.apiError.badRequest }

    const message = getApiErrorMessage(error)

    expect(message).toBe(TEXT.apiError.badRequest)
  })

  it('400 Bad Requestでdataがない場合はデフォルトメッセージを返す', () => {
    const response = new Response(null, { status: 400 })
    const error = new ApiErrorResponse(response)

    const message = getApiErrorMessage(error)

    expect(message).toBe(TEXT.apiError.badRequest)
  })

  it('401 Unauthorizedのエラーメッセージを返す', () => {
    const response = new Response(null, { status: 401 })
    const error = new ApiErrorResponse(response)

    const message = getApiErrorMessage(error)

    expect(message).toBe(TEXT.apiError.unauthorized)
  })

  it('403 Forbiddenのエラーメッセージを返す', () => {
    const response = new Response(null, { status: 403 })
    const error = new ApiErrorResponse(response)

    const message = getApiErrorMessage(error)

    expect(message).toBe(TEXT.apiError.forbidden)
  })

  it('404 Not Foundのエラーメッセージを返す', () => {
    const response = new Response(null, { status: 404 })
    const error = new ApiErrorResponse(response)

    const message = getApiErrorMessage(error)

    expect(message).toBe(TEXT.apiError.notFound)
  })

  it('409 Conflictのエラーメッセージを返す', () => {
    const response = new Response(null, { status: 409 })
    const error = new ApiErrorResponse(response)
    error.data = { message: TEXT.apiError.conflict }

    const message = getApiErrorMessage(error)

    expect(message).toBe(TEXT.apiError.conflict)
  })

  it('409 Conflictでdataがない場合はデフォルトメッセージを返す', () => {
    const response = new Response(null, { status: 409 })
    const error = new ApiErrorResponse(response)

    const message = getApiErrorMessage(error)

    expect(message).toBe(TEXT.apiError.conflict)
  })

  it('500 Internal Server Errorのエラーメッセージを返す', () => {
    const response = new Response(null, { status: 500 })
    const error = new ApiErrorResponse(response)

    const message = getApiErrorMessage(error)

    expect(message).toBe(TEXT.apiError.serverError)
  })

  it('503 Service Unavailableのエラーメッセージを返す', () => {
    const response = new Response(null, { status: 503 })
    const error = new ApiErrorResponse(response)

    const message = getApiErrorMessage(error)

    expect(message).toBe(TEXT.apiError.serviceUnavailable)
  })

  it('未知のステータスコードの場合はデフォルトメッセージを返す', () => {
    const response = new Response(null, { status: 418 })
    const error = new ApiErrorResponse(response)

    const message = getApiErrorMessage(error)

    expect(message).toBe(TEXT.apiError.default)
  })
})
