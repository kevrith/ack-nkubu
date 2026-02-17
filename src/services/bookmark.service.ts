import { supabase } from '@/lib/supabase';

export interface BibleBookmark {
  id: string;
  user_id: string;
  version: string;
  book_id: string;
  chapter: number;
  verse?: number;
  note?: string;
  created_at: string;
}

export const bookmarkService = {
  async getBookmarks(userId: string): Promise<BibleBookmark[]> {
    const { data, error } = await supabase
      .from('bible_bookmarks')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  },

  async addBookmark(bookmark: Omit<BibleBookmark, 'id' | 'created_at'>): Promise<void> {
    const { error } = await supabase.from('bible_bookmarks').insert(bookmark);
    if (error) throw error;
  },

  async deleteBookmark(id: string): Promise<void> {
    const { error } = await supabase.from('bible_bookmarks').delete().eq('id', id);
    if (error) throw error;
  },

  async updateNote(id: string, note: string): Promise<void> {
    const { error } = await supabase
      .from('bible_bookmarks')
      .update({ note })
      .eq('id', id);
    if (error) throw error;
  },
};
