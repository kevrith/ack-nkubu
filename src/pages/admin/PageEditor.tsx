import { useState, useEffect } from 'react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { supabase } from '@/lib/supabase';
import { Plus, Trash2, Eye, GripVertical } from 'lucide-react';

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
  content: Record<string, string>;
  order_index: number;
}

// --- Sortable block row ---
function SortableBlock({
  block,
  onUpdate,
  onDelete,
}: {
  block: Block;
  onUpdate: (id: string, content: Record<string, string>) => void;
  onDelete: (id: string) => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: block.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="bg-white rounded-lg shadow p-4 border border-gray-100"
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <button
            {...attributes}
            {...listeners}
            className="cursor-grab text-gray-400 hover:text-gray-600 p-1 rounded"
            title="Drag to reorder"
          >
            <GripVertical className="h-4 w-4" />
          </button>
          <span className="text-xs font-semibold uppercase tracking-wide text-gray-500 bg-gray-100 px-2 py-0.5 rounded">
            {block.type}
          </span>
        </div>
        <button
          onClick={() => onDelete(block.id)}
          className="text-red-500 hover:text-red-700 p-1 rounded hover:bg-red-50"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      </div>

      {block.type === 'text' && (
        <textarea
          defaultValue={block.content.text}
          onBlur={(e) => onUpdate(block.id, { text: e.target.value })}
          rows={4}
          className="w-full border rounded-lg p-2 text-sm focus:outline-none focus:ring-2 focus:ring-navy/30"
          placeholder="Enter text content..."
        />
      )}

      {block.type === 'image' && (
        <div className="space-y-2">
          <input
            type="url"
            defaultValue={block.content.url}
            onBlur={(e) => onUpdate(block.id, { ...block.content, url: e.target.value })}
            placeholder="Image URL"
            className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-navy/30"
          />
          <input
            type="text"
            defaultValue={block.content.alt}
            onBlur={(e) => onUpdate(block.id, { ...block.content, alt: e.target.value })}
            placeholder="Alt text (accessibility)"
            className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-navy/30"
          />
          {block.content.url && (
            <img
              src={block.content.url}
              alt={block.content.alt || ''}
              className="mt-2 rounded-lg max-h-40 object-cover w-full"
              onError={(e) => ((e.target as HTMLImageElement).style.display = 'none')}
            />
          )}
        </div>
      )}

      {block.type === 'video' && (
        <input
          type="url"
          defaultValue={block.content.url}
          onBlur={(e) => onUpdate(block.id, { url: e.target.value })}
          placeholder="Video URL (YouTube / Cloudinary)"
          className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-navy/30"
        />
      )}

      {block.type === 'scripture' && (
        <div className="space-y-2">
          <input
            type="text"
            defaultValue={block.content.reference}
            onBlur={(e) => onUpdate(block.id, { ...block.content, reference: e.target.value })}
            placeholder="e.g. John 3:16-17"
            className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-navy/30"
          />
          <textarea
            defaultValue={block.content.text}
            onBlur={(e) => onUpdate(block.id, { ...block.content, text: e.target.value })}
            rows={3}
            placeholder="Scripture text (optional — leave blank to fetch from API)"
            className="w-full border rounded-lg p-2 text-sm font-lora italic text-gray-700 focus:outline-none focus:ring-2 focus:ring-navy/30"
          />
        </div>
      )}
    </div>
  );
}

// --- Main PageEditor ---
export function PageEditor() {
  const [pages, setPages] = useState<Page[]>([]);
  const [selectedPage, setSelectedPage] = useState<Page | null>(null);
  const [blocks, setBlocks] = useState<Block[]>([]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  useEffect(() => {
    loadPages();
  }, []);

  const loadPages = async () => {
    const { data, error } = await supabase
      .from('cms_pages')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) {
      setError('CMS tables not found. Please run migration 007_cms_tables.sql in Supabase SQL Editor.');
      return;
    }
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
      setBlocks([]);
    }
  };

  const addBlock = async (type: Block['type']) => {
    if (!selectedPage) return;
    const content =
      type === 'text' ? { text: 'Enter text here...' } :
      type === 'image' ? { url: '', alt: '' } :
      type === 'video' ? { url: '' } :
      { reference: '', text: '' };

    const { data } = await supabase
      .from('cms_blocks')
      .insert({ page_id: selectedPage.id, type, content, order_index: blocks.length })
      .select()
      .single();
    if (data) setBlocks([...blocks, data]);
  };

  const updateBlock = async (blockId: string, content: Record<string, string>) => {
    await supabase.from('cms_blocks').update({ content }).eq('id', blockId);
    setBlocks(blocks.map((b) => (b.id === blockId ? { ...b, content } : b)));
  };

  const deleteBlock = async (blockId: string) => {
    await supabase.from('cms_blocks').delete().eq('id', blockId);
    setBlocks(blocks.filter((b) => b.id !== blockId));
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = blocks.findIndex((b) => b.id === active.id);
    const newIndex = blocks.findIndex((b) => b.id === over.id);
    const reordered = arrayMove(blocks, oldIndex, newIndex).map((b, i) => ({
      ...b,
      order_index: i,
    }));
    setBlocks(reordered);

    // Persist new order to DB
    setSaving(true);
    await Promise.all(
      reordered.map((b) =>
        supabase.from('cms_blocks').update({ order_index: b.order_index }).eq('id', b.id)
      )
    );
    setSaving(false);
  };

  const togglePublish = async () => {
    if (!selectedPage) return;
    const updated = { ...selectedPage, is_published: !selectedPage.is_published };
    await supabase
      .from('cms_pages')
      .update({ is_published: updated.is_published })
      .eq('id', selectedPage.id);
    setSelectedPage(updated);
    setPages(pages.map((p) => (p.id === updated.id ? updated : p)));
  };

  if (error) {
    return (
      <div className="max-w-2xl mx-auto mt-12">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <h2 className="text-lg font-semibold text-red-900 mb-2">Database Setup Required</h2>
          <p className="text-red-700 mb-4">{error}</p>
          <div className="bg-white rounded p-4 text-sm">
            <p className="font-medium mb-2">To fix this:</p>
            <ol className="list-decimal list-inside space-y-1 text-gray-700">
              <li>Go to your Supabase project dashboard</li>
              <li>Open the SQL Editor</li>
              <li>Run the migration file: <code className="bg-gray-100 px-1">supabase/migrations/007_cms_tables.sql</code></li>
              <li>Refresh this page</li>
            </ol>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="grid md:grid-cols-[280px_1fr] gap-6">
      {/* Page List */}
      <div className="space-y-3">
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
            <p>Click "New Page" to create your first custom page.</p>
          </div>
        ) : (
          <div className="space-y-2">
            {pages.map((page) => (
              <button
                key={page.id}
                onClick={() => { setSelectedPage(page); loadBlocks(page.id); }}
                className={`w-full text-left px-4 py-3 rounded-lg transition-colors ${
                  selectedPage?.id === page.id ? 'bg-navy text-white' : 'bg-white hover:bg-gray-50'
                }`}
              >
                <div className="font-medium">{page.title}</div>
                <div className={`text-xs mt-0.5 ${selectedPage?.id === page.id ? 'text-navy-200' : 'text-gray-400'}`}>
                  /{page.slug} · {page.is_published ? '✅ Published' : '📝 Draft'}
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Editor */}
      <div className="space-y-5">
        {selectedPage ? (
          <>
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-playfair text-navy">{selectedPage.title}</h1>
              <div className="flex items-center gap-3">
                {saving && <span className="text-xs text-gray-500 animate-pulse">Saving order…</span>}
                <button
                  onClick={togglePublish}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium ${
                    selectedPage.is_published
                      ? 'bg-green-100 text-green-800 hover:bg-green-200'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <Eye className="h-4 w-4" />
                  {selectedPage.is_published ? 'Published' : 'Draft'}
                </button>
              </div>
            </div>

            {/* Add block buttons */}
            <div className="flex flex-wrap gap-2">
              {(['text', 'image', 'video', 'scripture'] as Block['type'][]).map((type) => (
                <button
                  key={type}
                  onClick={() => addBlock(type)}
                  className="px-3 py-1.5 bg-white border border-gray-300 rounded-lg text-sm hover:bg-gray-50 capitalize"
                >
                  + {type}
                </button>
              ))}
            </div>

            {/* Drag-and-drop block list */}
            {blocks.length === 0 ? (
              <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-200 text-gray-500">
                Add your first block using the buttons above
              </div>
            ) : (
              <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}
              >
                <SortableContext
                  items={blocks.map((b) => b.id)}
                  strategy={verticalListSortingStrategy}
                >
                  <div className="space-y-3">
                    {blocks.map((block) => (
                      <SortableBlock
                        key={block.id}
                        block={block}
                        onUpdate={updateBlock}
                        onDelete={deleteBlock}
                      />
                    ))}
                  </div>
                </SortableContext>
              </DndContext>
            )}
          </>
        ) : (
          <div className="text-center py-16 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200">
            <Plus className="h-12 w-12 text-gray-400 mx-auto mb-3" />
            <h2 className="text-lg font-semibold text-navy mb-1">No Page Selected</h2>
            <p className="text-gray-500 text-sm">Select a page from the sidebar or create a new one.</p>
          </div>
        )}
      </div>
    </div>
  );
}
