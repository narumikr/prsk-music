import { TEXT } from '@/constants/text'

// ============================================================================
// Domain Models
// ============================================================================

/**
 * 楽曲タイプ
 * - 0: オリジナル
 * - 1: 3DMV
 * - 2: 2DMV
 */
export type MusicType = 0 | 1 | 2

/**
 * 楽曲タイプのラベルマップ
 */
export const MUSIC_TYPE_LABELS: Record<MusicType, string> = {
  0: TEXT.musicType.original,
  1: TEXT.musicType.mv3d,
  2: TEXT.musicType.mv2d,
}

/**
 * 監査情報
 */
export interface AuditInfo {
  createdAt: string
  createdBy: string
  updatedAt: string
  updatedBy: string
}

/**
 * プロセカ楽曲
 */
export interface PrskMusic {
  id: number
  title: string
  artistName: string
  unitName: string | null
  content: string | null
  musicType: MusicType
  specially: boolean | null
  lyricsName: string | null
  musicName: string | null
  featuring: string | null
  youtubeLink: string
  auditInfo: AuditInfo
}

/**
 * アーティスト
 */
export interface Artist {
  id: number
  artistName: string
  unitName: string | null
  content: string | null
  auditInfo: AuditInfo
}

// ============================================================================
// Form Data Models
// ============================================================================

/**
 * 楽曲フォームデータ
 */
export interface MusicFormData {
  title: string
  artistId: number
  musicType: MusicType
  specially: boolean | null
  lyricsName: string | null
  musicName: string | null
  featuring: string | null
  youtubeLink: string
}

/**
 * アーティストフォームデータ
 */
export interface ArtistFormData {
  artistName: string
  unitName: string | null
  content: string | null
}

// ============================================================================
// API Response Models
// ============================================================================

/**
 * ページネーションメタデータ
 */
export interface PaginationMeta {
  totalItems: number
  totalPages: number
  pageIndex: number
  limit: number
}

/**
 * ページネーション付きレスポンス
 */
export interface PaginatedResponse<T> {
  items: T[]
  meta: PaginationMeta
}

/**
 * エラー詳細
 */
export interface ErrorDetail {
  field: string
  message: string
}

/**
 * APIエラーレスポンス
 */
export interface ApiErrorResponse {
  statusCode: number
  error: string
  message: string
  details?: ErrorDetail[]
}
