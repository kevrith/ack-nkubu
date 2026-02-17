import { useState, useEffect } from 'react'
import { Calendar, User, ArrowLeft } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { PastorsCornerPost } from '@/types/pastorsCorner'
import { formatDate } from '@/lib/utils'

export function PastorsCornerPage() {
  const [posts, setPosts] = useState<PastorsCornerPost[]>([])
  const [selectedPost, setSelectedPost] = useState<PastorsCornerPost | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchPosts()
  }, [])

  async function fetchPosts() {
    const { data } = await supabase
      .from('pastors_corner')
      .select('*, author:profiles(full_name, avatar_url)')
      .eq('is_published', true)
      .order('publish_date', { ascending: false })
    
    setPosts(data || [])
    setLoading(false)
  }

  if (selectedPost) {
    return (
      <div className="space-y-6">
        <button
          onClick={() => setSelectedPost(null)}
          className="flex items-center gap-2 text-navy hover:text-gold"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to articles
        </button>

        <article className="bg-white rounded-lg shadow-lg overflow-hidden">
          {selectedPost.cover_image_url && (
            <img
              src={selectedPost.cover_image_url}
              alt={selectedPost.title}
              className="w-full h-64 object-cover"
            />
          )}
          
          <div className="p-8">
            <div className="mb-4">
              <span className="inline-block px-3 py-1 bg-gold text-navy text-sm rounded-full mb-4">
                {selectedPost.category}
              </span>
              <h1 className="text-4xl font-playfair text-navy mb-4">{selectedPost.title}</h1>
              
              <div className="flex items-center gap-4 text-sm text-gray-600">
                {selectedPost.author && (
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4" />
                    <span>{selectedPost.author.full_name}</span>
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  <span>{formatDate(selectedPost.publish_date || selectedPost.created_at)}</span>
                </div>
              </div>
            </div>

            <div className="prose max-w-none font-lora text-lg leading-relaxed">
              {selectedPost.content.split('\n').map((paragraph, idx) => (
                <p key={idx} className="mb-4">{paragraph}</p>
              ))}
            </div>
          </div>
        </article>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-playfair text-navy">Pastor's Corner</h1>

      {loading ? (
        <div className="text-center py-12">Loading articles...</div>
      ) : posts.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          <p>No articles published yet.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {posts[0] && (
            <div
              onClick={() => setSelectedPost(posts[0])}
              className="bg-white rounded-lg shadow-lg overflow-hidden cursor-pointer hover:shadow-xl transition-shadow"
            >
              {posts[0].cover_image_url && (
                <img
                  src={posts[0].cover_image_url}
                  alt={posts[0].title}
                  className="w-full h-96 object-cover"
                />
              )}
              <div className="p-6">
                <span className="inline-block px-3 py-1 bg-gold text-navy text-sm rounded-full mb-3">
                  Featured • {posts[0].category}
                </span>
                <h2 className="text-3xl font-playfair text-navy mb-3">{posts[0].title}</h2>
                {posts[0].excerpt && (
                  <p className="text-gray-600 mb-4">{posts[0].excerpt}</p>
                )}
                <div className="flex items-center gap-4 text-sm text-gray-600">
                  {posts[0].author && (
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4" />
                      <span>{posts[0].author.full_name}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    <span>{formatDate(posts[0].publish_date || posts[0].created_at)}</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.slice(1).map((post) => (
              <div
                key={post.id}
                onClick={() => setSelectedPost(post)}
                className="bg-white rounded-lg shadow overflow-hidden cursor-pointer hover:shadow-lg transition-shadow"
              >
                {post.cover_image_url && (
                  <img
                    src={post.cover_image_url}
                    alt={post.title}
                    className="w-full h-48 object-cover"
                  />
                )}
                <div className="p-4">
                  <span className="inline-block px-2 py-1 bg-navy-50 text-navy text-xs rounded mb-2">
                    {post.category}
                  </span>
                  <h3 className="font-semibold text-navy mb-2 line-clamp-2">{post.title}</h3>
                  {post.excerpt && (
                    <p className="text-sm text-gray-600 line-clamp-3 mb-3">{post.excerpt}</p>
                  )}
                  <div className="text-xs text-gray-500">
                    {formatDate(post.publish_date || post.created_at)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
