/**
 * E2Eテスト用のモックデータ
 */

import type { Artist, PrskMusic } from '../../src/types'

/**
 * テスト用アーティストデータ
 */
export const mockArtists: Artist[] = [
  {
    id: 1,
    artistName: '初音ミク',
    unitName: 'バーチャル・シンガー',
    content: 'プロセカ',
  },
  {
    id: 2,
    artistName: '星乃一歌',
    unitName: 'Leo/need',
    content: 'プロセカ',
  },
  {
    id: 3,
    artistName: '天馬咲希',
    unitName: 'Leo/need',
    content: 'プロセカ',
  },
]

/**
 * テスト用楽曲データ
 */
export const mockMusics: PrskMusic[] = [
  {
    id: 1,
    title: 'テルミナ',
    artistName: '初音ミク',
    unitName: 'バーチャル・シンガー',
    content: 'プロセカ',
    musicType: 0,
    specially: false,
    lyricsName: 'すりぃ',
    musicName: 'すりぃ',
    featuring: null,
    youtubeLink: 'https://www.youtube.com/watch?v=example1',
  },
  {
    id: 2,
    title: '愛して愛して愛して',
    artistName: '初音ミク',
    unitName: 'バーチャル・シンガー',
    content: 'プロセカ',
    musicType: 1,
    specially: true,
    lyricsName: 'きくお',
    musicName: 'きくお',
    featuring: null,
    youtubeLink: 'https://www.youtube.com/watch?v=example2',
  },
]

/**
 * 新規アーティスト作成用のフォームデータ
 */
export const newArtistFormData = {
  artistName: 'テスト用アーティスト',
  unitName: 'テスト用ユニット',
  content: 'テスト',
}

/**
 * 新規楽曲作成用のフォームデータ
 */
export const newMusicFormData = {
  title: 'テスト用楽曲',
  artistId: 1,
  musicType: 0,
  specially: false,
  lyricsName: 'テスト作詞者',
  musicName: 'テスト作曲者',
  featuring: null,
  youtubeLink: 'https://www.youtube.com/watch?v=test',
}

/**
 * 編集用のアーティストデータ
 */
export const editedArtistData = {
  artistName: '編集後アーティスト名',
  unitName: '編集後ユニット名',
  content: '編集後',
}

/**
 * 編集用の楽曲データ
 */
export const editedMusicData = {
  title: '編集後楽曲タイトル',
  artistId: 2,
  musicType: 1,
  specially: true,
  lyricsName: '編集後作詞者',
  musicName: '編集後作曲者',
  featuring: '編集後フィーチャリング',
  youtubeLink: 'https://www.youtube.com/watch?v=edited',
}
