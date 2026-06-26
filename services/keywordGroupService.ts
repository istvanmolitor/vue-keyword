import { createApiClient } from '@user/services/apiClient'

const api = createApiClient()

export interface KeywordGroupKeyword {
  id: number
  name: string
}

export interface KeywordGroup {
  id: number
  name: string
  slug: string
  keywords?: KeywordGroupKeyword[]
  created_at: string
  updated_at: string
}

export interface KeywordGroupFormData {
  name: string
  slug: string
}

export interface PaginatedResponse<T> {
  data: T[]
  meta: {
    current_page: number
    last_page: number
    per_page: number
    total: number
  }
  filters?: {
    search?: string
    sort?: string
    direction?: string
  }
}

export interface SingleResponse<T> {
  data: T
}

export const keywordGroupService = {
  getAll(params?: { search?: string; sort?: string; direction?: string; page?: number; per_page?: number }) {
    return api.get<PaginatedResponse<KeywordGroup>>('/api/admin/keyword/keyword-groups', { params })
  },

  getById(id: number | string) {
    return api.get<SingleResponse<KeywordGroup>>(`/api/admin/keyword/keyword-groups/${id}`)
  },

  create(data: KeywordGroupFormData) {
    return api.post<SingleResponse<KeywordGroup>>('/api/admin/keyword/keyword-groups', data)
  },

  update(id: number | string, data: KeywordGroupFormData) {
    return api.put<SingleResponse<KeywordGroup>>(`/api/admin/keyword/keyword-groups/${id}`, data)
  },

  delete(id: number | string) {
    return api.delete(`/api/admin/keyword/keyword-groups/${id}`)
  },

  attachKeyword(groupId: number | string, keywordId: number) {
    return api.post(`/api/admin/keyword/keyword-groups/${groupId}/keywords`, { keyword_id: keywordId })
  },

  detachKeyword(groupId: number | string, keywordId: number) {
    return api.delete(`/api/admin/keyword/keyword-groups/${groupId}/keywords/${keywordId}`)
  },
}
