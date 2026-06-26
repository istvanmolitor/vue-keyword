export { keywordService } from './services/keywordService'
export type {
  Keyword,
  KeywordFormData,
  KeywordOption,
  PaginatedResponse as KeywordPaginatedResponse,
  SingleResponse as KeywordSingleResponse,
} from './services/keywordService'

export { keywordGroupService } from './services/keywordGroupService'
export type { KeywordGroup, KeywordGroupFormData } from './services/keywordGroupService'

export { default as router } from './router/index'
export { KeywordMenuBuilder, keywordMenuBuilder } from './config/menuBuilder'
