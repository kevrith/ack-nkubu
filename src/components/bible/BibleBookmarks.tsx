import { useState, useEffect } from 'react';
import { Bookmark, Trash2, Edit2, Save, X } from 'lucide-react';
import { bookmarkService, BibleBookmark } from '@/services/bookmark.service';
import { useAuthStore } from '@/store/authStore';

export function BibleBookmarks() {
  const { user } = useAuthStore();
  const [bookmarks, setBookmarks] = useState<BibleBookmark[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editNote, setEditNote] = useState('');

  useEffect(() => {
    if (user) loadBookmarks();
  }, [user]);

  const loadBookmarks = async () => {
    if (!user) return;
    try {
      const data = await bookmarkService.getBookmarks(user.id);
      setBookmarks(data);
    } catch (error) {
      console.error('Failed to load bookmarks:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await bookmarkService.deleteBookmark(id);
      setBookmarks(bookmarks.filter((b) => b.id !== id));
    } catch (error) {
      console.error('Failed to delete bookmark:', error);
    }
  };

  const startEdit = (bookmark: BibleBookmark) => {
    setEditingId(bookmark.id);
    setEditNote(bookmark.note || '');
  };

  const saveNote = async (id: string) => {
    try {
      await bookmarkService.updateNote(id, editNote);
      setBookmarks(
        bookmarks.map((b) => (b.id === id ? { ...b, note: editNote } : b))
      );
      setEditingId(null);
    } catch (error) {
      console.error('Failed to save note:', error);
    }
  };

  if (loading) {
    return <div className="text-center py-8">Loading bookmarks...</div>;
  }

  if (bookmarks.length === 0) {
    return (
      <div className="text-center py-12">
        <Bookmark className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <p className="text-gray-600">No bookmarks yet</p>
        <p className="text-sm text-gray-500 mt-2">
          Bookmark verses while reading to save them here
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {bookmarks.map((bookmark) => (
        <div
          key={bookmark.id}
          className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm"
        >
          <div className="flex items-start justify-between mb-2">
            <div>
              <h3 className="font-semibold text-navy">
                {bookmark.book_id} {bookmark.chapter}
                {bookmark.verse && `:${bookmark.verse}`}
              </h3>
              <p className="text-sm text-gray-500">{bookmark.version}</p>
            </div>
            <div className="flex gap-2">
              {editingId === bookmark.id ? (
                <>
                  <button
                    onClick={() => saveNote(bookmark.id)}
                    className="text-green-600 hover:text-green-700"
                  >
                    <Save className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => setEditingId(null)}
                    className="text-gray-600 hover:text-gray-700"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => startEdit(bookmark)}
                    className="text-blue-600 hover:text-blue-700"
                  >
                    <Edit2 className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(bookmark.id)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </>
              )}
            </div>
          </div>

          {editingId === bookmark.id ? (
            <textarea
              value={editNote}
              onChange={(e) => setEditNote(e.target.value)}
              className="w-full border border-gray-300 rounded p-2 text-sm"
              rows={3}
              placeholder="Add a note..."
            />
          ) : (
            bookmark.note && (
              <p className="text-sm text-gray-700 mt-2">{bookmark.note}</p>
            )
          )}
        </div>
      ))}
    </div>
  );
}
