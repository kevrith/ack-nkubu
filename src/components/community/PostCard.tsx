import { useState, useEffect } from 'react'
import { Heart, MessageCircle, User, Send } from 'lucide-react'
import { CommunityPost } from '@/types/community'
import { formatDate } from '@/lib/utils'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/hooks/useAuth'

interface PostCardProps {
  post: CommunityPost
  onLike: (postId: string) => void
  onComment: (postId: string) => void
}

export function PostCard({ post, onLike, onComment }: PostCardProps) {
  const { user } = useAuth()
  const [showComments, setShowComments] = useState(false)
  const [comments, setComments] = useState<any[]>([])
  const [newComment, setNewComment] = useState('')
  const [reaction, setReaction] = useState<string | null>(null)

  useEffect(() => {
    if (showComments) loadComments()
    loadReaction()
  }, [showComments, post.id])

  async function loadComments() {
    const { data } = await supabase
      .from('community_comments')
      .select('*, author:profiles(full_name, avatar_url)')
      .eq('post_id', post.id)
      .order('created_at', { ascending: true })
    setComments(data || [])
  }

  async function loadReaction() {
    if (!user) return
    const { data } = await supabase
      .from('community_reactions')
      .select('reaction_type')
      .eq('post_id', post.id)
      .eq('user_id', user.id)
      .single()
    setReaction(data?.reaction_type || null)
  }

  async function handleReaction(type: string) {
    if (!user) return
    if (reaction === type) {
      await supabase.from('community_reactions').delete().eq('post_id', post.id).eq('user_id', user.id)
      setReaction(null)
    } else {
      await supabase.from('community_reactions').upsert({ post_id: post.id, user_id: user.id, reaction_type: type })
      setReaction(type)
    }
  }

  async function handleAddComment() {
    if (!user || !newComment.trim()) return
    await supabase.from('community_comments').insert({ post_id: post.id, author_id: user.id, content: newComment.trim() })
    setNewComment('')
    loadComments()
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-start gap-3 mb-4">
        {post.author?.avatar_url ? (
          <img src={post.author.avatar_url} alt={post.author.full_name} className="w-10 h-10 rounded-full" />
        ) : (
          <div className="w-10 h-10 bg-navy rounded-full flex items-center justify-center">
            <User className="w-6 h-6 text-white" />
          </div>
        )}
        <div className="flex-1">
          <div className="font-semibold text-navy">{post.author?.full_name}</div>
          <div className="text-sm text-gray-500">
            {post.author?.cell_group && <span>{post.author.cell_group} • </span>}
            {formatDate(post.created_at)}
          </div>
        </div>
      </div>

      <p className="text-gray-700 mb-4 whitespace-pre-line">{post.content}</p>

      {post.image_url && (
        <img src={post.image_url} alt="Post" className="w-full rounded-lg mb-4" />
      )}

      <div className="flex items-center gap-4 pt-4 border-t border-gray-200">
        <button onClick={() => handleReaction('like')} className={`flex items-center gap-2 ${reaction === 'like' ? 'text-red-600' : 'text-gray-600 hover:text-red-600'}`}>
          <Heart className="w-5 h-5" fill={reaction === 'like' ? 'currentColor' : 'none'} />
          <span>Like</span>
        </button>
        <button onClick={() => handleReaction('love')} className={`flex items-center gap-2 ${reaction === 'love' ? 'text-red-600' : 'text-gray-600 hover:text-red-600'}`}>
          ❤️ Love
        </button>
        <button onClick={() => handleReaction('pray')} className={`flex items-center gap-2 ${reaction === 'pray' ? 'text-navy' : 'text-gray-600 hover:text-navy'}`}>
          🙏 Pray
        </button>
        <button onClick={() => handleReaction('amen')} className={`flex items-center gap-2 ${reaction === 'amen' ? 'text-gold' : 'text-gray-600 hover:text-gold'}`}>
          ✝️ Amen
        </button>
        <button onClick={() => setShowComments(!showComments)} className="flex items-center gap-2 text-gray-600 hover:text-navy ml-auto">
          <MessageCircle className="w-5 h-5" />
          <span>{post.comments_count}</span>
        </button>
      </div>

      {showComments && (
        <div className="mt-4 pt-4 border-t space-y-3">
          {comments.map((comment) => (
            <div key={comment.id} className="flex gap-3">
              {comment.author?.avatar_url ? (
                <img src={comment.author.avatar_url} alt="" className="w-8 h-8 rounded-full" />
              ) : (
                <div className="w-8 h-8 bg-navy rounded-full flex items-center justify-center">
                  <User className="w-4 h-4 text-white" />
                </div>
              )}
              <div className="flex-1 bg-gray-50 rounded-lg p-3">
                <div className="font-medium text-sm text-navy">{comment.author?.full_name}</div>
                <p className="text-sm text-gray-700">{comment.content}</p>
              </div>
            </div>
          ))}
          {user && (
            <div className="flex gap-2">
              <input
                type="text"
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAddComment()}
                placeholder="Write a comment..."
                className="flex-1 px-3 py-2 border rounded-lg text-sm"
              />
              <button onClick={handleAddComment} className="px-4 py-2 bg-navy text-white rounded-lg hover:bg-navy-600">
                <Send className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
