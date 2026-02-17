import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Plus, Save, Trash2, Eye } from 'lucide-react';

interface Page {
  id: string;
  slug: string;
  title: string;
  meta_description: string;
  is_published: boolean;
}

interface Block {
  id: string;
  type: 'text' | 'image' | 'video' | 'scripture';
  content: any;
  order_index: number;
}

export function PageEditor() {
  const [pages, setPages] = useState<Page[]>([]);
  const [selectedPage, setSelectedPage] = useState<Page | null>(null);
  const [blocks, setBlocks] = useState<Block[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadPages();
  }, []);

  const loadPages = async () => {
    const { data } = await supabase
      .from('cms_pages')
      .select('*')
      .order('created_at', { ascending: false });
    setPages(data || []);
  };

  const loadBlocks = async (pageId: string) => {
    const { data } = await supabase
      .from('cms_blocks')
      .select('*')
      .eq('page_id', pageId)
      .order('order_index');
    setBlocks(data || []);
  };

  const createPage = async () => {
    const title = prompt('Page title:');
    if (!title) return;

    const slug = title.toLowerCase().replace(/\s+/g, '-');
    const { data } = await supabase
      .from('cms_pages')
      .insert({ slug, title, is_published: false })
      .select()
      .single();

    if (data) {
      setPages([data, ...pages]);
      setSelectedPage(data);
    }
  };

  const addBlock = async (type: Block['type']) => {
    if (!selectedPage) return;

    const content = type === 'text' ? { text: 'Enter text here...' } :
                    type === 'image' ? { url: '', alt: '' } :
                    type === 'video' ? { url: '' } :
                    { reference: '', version: 'NIV' };

    const { data } = await supabase
      .from('cms_blocks')
      .insert({
        page_id: selectedPage.id,
        type,
        content,
        order_index: blocks.length,
      })
      .select()
      .single();

    if (data) setBlocks([...blocks, data]);
  };

  const updateBlock = async (blockId: string, content: any) => {
    await supabase
      .from('cms_blocks')
      .update({ content })
      .eq('id', blockId);
  };

  const deleteBlock = async (blockId: string) => {
    await supabase.from('cms_blocks').delete().eq('id', blockId);
    setBlocks(blocks.filter(b => b.id !== blockId));
  };

  const togglePublish = async () => {
    if (!selectedPage) return;

    await supabase
      .from('cms_pages')
      .update({ is_published: !selectedPage.is_published })
      .eq('id', selectedPage.id);

    setSelectedPage({ ...selectedPage, is_published: !selectedPage.is_published });
    loadPages();
  };

  return (
    <div className="grid md:grid-cols-[300px_1fr] gap-6">
      <div className="space-y-4">
        <button
          onClick={createPage}
          className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-navy text-white rounded-lg hover:bg-navy-600"
        >
          <Plus className="h-4 w-4" />
          New Page
        </button>

        {pages.length === 0 ? (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-sm text-blue-800">
            <p className="font-medium mb-1">No pages yet</p>
            <p>Click "New Page" above to create your first custom page.</p>
          </div>
        ) : (
          <div className="space-y-2">
            {pages.map((page) => (
              <button
                key={page.id}
                onClick={() => {
                  setSelectedPage(page);
                  loadBlocks(page.id);
                }}
                className={`w-full text-left px-4 py-3 rounded-lg ${
                  selectedPage?.id === page.id
                    ? 'bg-navy text-white'
                    : 'bg-white hover:bg-gray-50'
                }`}
              >
                <div className="font-medium">{page.title}</div>
                <div className="text-xs opacity-75">/{page.slug}</div>
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="space-y-6">
        {selectedPage ? (
          <>
            <div className="flex items-center justify-between">
              <h1 className="text-3xl font-playfair text-navy">{selectedPage.title}</h1>
              <button
                onClick={togglePublish}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
                  selectedPage.is_published
                    ? 'bg-green-100 text-green-800'
                    : 'bg-gray-100 text-gray-800'
                }`}
              >
                <Eye className="h-4 w-4" />
                {selectedPage.is_published ? 'Published' : 'Draft'}
              </button>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => addBlock('text')}
                className="px-4 py-2 bg-white border rounded-lg hover:bg-gray-50"
              >
                + Text
              </button>
              <button
                onClick={() => addBlock('image')}
                className="px-4 py-2 bg-white border rounded-lg hover:bg-gray-50"
              >
                + Image
              </button>
              <button
                onClick={() => addBlock('video')}
                className="px-4 py-2 bg-white border rounded-lg hover:bg-gray-50"
              >
                + Video
              </button>
              <button
                onClick={() => addBlock('scripture')}
                className="px-4 py-2 bg-white border rounded-lg hover:bg-gray-50"
              >
                + Scripture
              </button>
            </div>

            <div className="space-y-4">
              {blocks.map((block) => (
                <div key={block.id} className="bg-white rounded-lg shadow p-4">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm font-medium text-gray-600">{block.type}</span>
                    <button
                      onClick={() => deleteBlock(block.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>

                  {block.type === 'text' && (
                    <textarea
                      defaultValue={block.content.text}
                      onBlur={(e) => updateBlock(block.id, { text: e.target.value })}
                      rows={4}
                      className="w-full border rounded p-2"
                    />
                  )}

                  {block.type === 'image' && (
                    <div className="space-y-2">
                      <input
                        type="url"
                        defaultValue={block.content.url}
                        onBlur={(e) => updateBlock(block.id, { ...block.content, url: e.target.value })}
                        placeholder="Image URL"
                        className="w-full border rounded px-3 py-2"
                      />
                      <input
                        type="text"
                        defaultValue={block.content.alt}
                        onBlur={(e) => updateBlock(block.id, { ...block.content, alt: e.target.value })}
                        placeholder="Alt text"
                        className="w-full border rounded px-3 py-2"
                      />
                    </div>
                  )}

                  {block.type === 'video' && (
                    <input
                      type="url"
                      defaultValue={block.content.url}
                      onBlur={(e) => updateBlock(block.id, { url: e.target.value })}
                      placeholder="Video URL"
                      className="w-full border rounded px-3 py-2"
                    />
                  )}

                  {block.type === 'scripture' && (
                    <div className="space-y-2">
                      <input
                        type="text"
                        defaultValue={block.content.reference}
                        onBlur={(e) => updateBlock(block.id, { ...block.content, reference: e.target.value })}
                        placeholder="e.g., John 3:16"
                        className="w-full border rounded px-3 py-2"
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </>
        ) : (
          <div className="text-center py-12">
            <div className="bg-white rounded-lg shadow p-8 max-w-md mx-auto">
              <Plus className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h2 className="text-xl font-semibold text-navy mb-2">No Page Selected</h2>
              <p className="text-gray-600 mb-4">
                Click "New Page" in the sidebar to create your first custom page, or select an existing page to edit.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
