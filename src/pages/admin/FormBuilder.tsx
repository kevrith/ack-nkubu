import { useState } from 'react';
import { Plus, Trash2, Save } from 'lucide-react';

interface FormField {
  id: string;
  type: 'text' | 'email' | 'tel' | 'textarea' | 'select' | 'checkbox';
  label: string;
  required: boolean;
  options?: string[];
}

export function FormBuilder() {
  const [formName, setFormName] = useState('');
  const [fields, setFields] = useState<FormField[]>([]);
  const [success, setSuccess] = useState(false);

  const addField = (type: FormField['type']) => {
    setFields([
      ...fields,
      {
        id: Date.now().toString(),
        type,
        label: `New ${type} field`,
        required: false,
        options: type === 'select' ? ['Option 1', 'Option 2'] : undefined,
      },
    ]);
  };

  const updateField = (id: string, updates: Partial<FormField>) => {
    setFields(fields.map(f => f.id === id ? { ...f, ...updates } : f));
  };

  const deleteField = (id: string) => {
    setFields(fields.filter(f => f.id !== id));
  };

  const saveForm = () => {
    setSuccess(true);
    setTimeout(() => setSuccess(false), 3000);
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-playfair text-navy">Form Builder</h1>

      {success && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded">
          ✓ Form saved successfully!
        </div>
      )}

      <div className="bg-white rounded-lg shadow p-6 space-y-6">
        <div>
          <label className="block text-sm font-medium mb-2">Form Name</label>
          <input
            type="text"
            value={formName}
            onChange={(e) => setFormName(e.target.value)}
            placeholder="e.g., Event Registration"
            className="w-full px-4 py-2 border rounded-lg"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-3">Add Fields</label>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => addField('text')}
              className="px-3 py-2 bg-gray-100 rounded hover:bg-gray-200 text-sm"
            >
              + Text
            </button>
            <button
              onClick={() => addField('email')}
              className="px-3 py-2 bg-gray-100 rounded hover:bg-gray-200 text-sm"
            >
              + Email
            </button>
            <button
              onClick={() => addField('tel')}
              className="px-3 py-2 bg-gray-100 rounded hover:bg-gray-200 text-sm"
            >
              + Phone
            </button>
            <button
              onClick={() => addField('textarea')}
              className="px-3 py-2 bg-gray-100 rounded hover:bg-gray-200 text-sm"
            >
              + Textarea
            </button>
            <button
              onClick={() => addField('select')}
              className="px-3 py-2 bg-gray-100 rounded hover:bg-gray-200 text-sm"
            >
              + Dropdown
            </button>
            <button
              onClick={() => addField('checkbox')}
              className="px-3 py-2 bg-gray-100 rounded hover:bg-gray-200 text-sm"
            >
              + Checkbox
            </button>
          </div>
        </div>

        <div className="space-y-4">
          {fields.map((field, index) => (
            <div key={field.id} className="border rounded-lg p-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-600">
                  Field {index + 1}: {field.type}
                </span>
                <button
                  onClick={() => deleteField(field.id)}
                  className="text-red-600 hover:text-red-700"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>

              <div>
                <label className="block text-sm mb-1">Label</label>
                <input
                  type="text"
                  value={field.label}
                  onChange={(e) => updateField(field.id, { label: e.target.value })}
                  className="w-full px-3 py-2 border rounded"
                />
              </div>

              {field.type === 'select' && (
                <div>
                  <label className="block text-sm mb-1">Options (comma-separated)</label>
                  <input
                    type="text"
                    value={field.options?.join(', ')}
                    onChange={(e) => updateField(field.id, { options: e.target.value.split(',').map(s => s.trim()) })}
                    className="w-full px-3 py-2 border rounded"
                  />
                </div>
              )}

              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={field.required}
                  onChange={(e) => updateField(field.id, { required: e.target.checked })}
                  className="rounded"
                />
                <span className="text-sm">Required field</span>
              </label>
            </div>
          ))}
        </div>

        {fields.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            <p>No fields added yet. Click the buttons above to add fields.</p>
          </div>
        )}

        <button
          onClick={saveForm}
          disabled={!formName || fields.length === 0}
          className="flex items-center gap-2 px-6 py-3 bg-navy text-white rounded-lg hover:bg-navy-600 disabled:opacity-50"
        >
          <Save className="h-5 w-5" />
          Save Form
        </button>
      </div>

      {fields.length > 0 && (
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold text-navy mb-4">Preview</h2>
          <div className="space-y-4">
            {fields.map((field) => (
              <div key={field.id}>
                <label className="block text-sm font-medium mb-2">
                  {field.label}
                  {field.required && <span className="text-red-600 ml-1">*</span>}
                </label>
                {field.type === 'textarea' ? (
                  <textarea className="w-full px-3 py-2 border rounded" rows={3} disabled />
                ) : field.type === 'select' ? (
                  <select className="w-full px-3 py-2 border rounded" disabled>
                    {field.options?.map((opt, i) => (
                      <option key={i}>{opt}</option>
                    ))}
                  </select>
                ) : field.type === 'checkbox' ? (
                  <input type="checkbox" className="rounded" disabled />
                ) : (
                  <input type={field.type} className="w-full px-3 py-2 border rounded" disabled />
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
