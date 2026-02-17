import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { CommunityPost } from '@/types/community'
import { PostCard } from '@/components/community/PostCard'
import { PostForm } from '@/components/community/PostForm'
import { CommunityGroups } from '@/components/community/CommunityGroups'
import { MessageSquare, Users as UsersIcon } from 'lucide-react'

export function CommunityPage() {
  const [posts, setPosts] = useState<CommunityPost[]>([])
  const [loading, setLoading] = useState(true)
  const [view, setView] = useState<'feed' | 'groups'>('feed')
  const [selectedGroupId, setSelectedGroupId] = useState<string | null>(null)

  useEffect(() => {
    fetchPosts()
  }, [selectedGroupId])

  async function fetchPosts() {
    let query = supabase
      .from('community_posts')
      .select('*, author:profiles(full_name, avatar_url, cell_group)')
      .eq('is_approved', true)
      .order('is_pinned', { ascending: false })
      .order('created_at', { ascending: false })
      .limit(50)

    if (selectedGroupId) {
      query = query.eq('group_id', selectedGroupId)
    }
    
    const { data } = await query
    setPosts(data || [])
    setLoading(false)
  }

  async function handleLike(postId: string) {
    const post = posts.find(p => p.id === postId)
    if (!post) return

    await supabase
      .from('community_posts')
      .update({ likes_count: post.likes_count + 1 })
      .eq('id', postId)

    fetchPosts()
  }

  function handleComment(postId: string) {
    // Comment functionality can be expanded
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-playfair text-navy">Community</h1>
        <div className="flex gap-2">
          <button
            onClick={() => { setView('feed'); setSelectedGroupId(null); }}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
              view === 'feed' ? 'bg-navy text-white' : 'bg-gray-100 text-gray-700'
            }`}
          >
            <MessageSquare className="h-4 w-4" />
            Feed
          </button>
          <button
            onClick={() => setView('groups')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
              view === 'groups' ? 'bg-navy text-white' : 'bg-gray-100 text-gray-700'
            }`}
          >
            <UsersIcon className="h-4 w-4" />
            Groups
          </button>
        </div>
      </div>

      {view === 'groups' ? (
        <CommunityGroups onSelectGroup={(id) => { setSelectedGroupId(id); setView('feed'); }} />
      ) : (
        <>
          {selectedGroupId && (
            <button
              onClick={() => setSelectedGroupId(null)}
              className="text-sm text-navy hover:underline"
            >
              ← Back to all posts
            </button>
          )}
          
          <PostForm onSuccess={fetchPosts} />

          {loading ? (
            <div className="text-center py-12">Loading posts...</div>
          ) : posts.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <p>No posts yet. Be the first to share!</p>
            </div>
          ) : (
            <div className="space-y-4">
              {posts.map((post) => (
                <PostCard
                  key={post.id}
                  post={post}
                  onLike={handleLike}
                  onComment={handleComment}
                />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  )
}
