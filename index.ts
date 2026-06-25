export { keywordService } from './services/keywordService'
export type {
  Keyword,
  KeywordFormData,
  KeywordOption,
  PaginatedResponse as KeywordPaginatedResponse,
  SingleResponse as KeywordSingleResponse,
} from './services/keywordService'

export { default as router } from './router/index'
export { KeywordMenuBuilder, keywordMenuBuilder } from './config/menuBuilder'
