import { useState } from 'react';
import { Plus, Pencil, Trash2, GripVertical, Eye, EyeOff } from 'lucide-react';
import Badge from '../components/ui/Badge';
import Modal from '../components/ui/Modal';

const MOCK_SECTIONS = [
  {
    id: '1',
    order: 1,
    title: 'Top Destinations',
    titleAr: 'أفضل الوجهات',
    type: 'destinations',
    itemCount: 8,
    isVisible: true,
  },
  {
    id: '2',
    order: 2,
    title: 'Featured Tours',
    titleAr: 'جولات مميزة',
    type: 'tours',
    itemCount: 12,
    isVisible: true,
  },
  {
    id: '3',
    order: 3,
    title: 'Top Rated Guides',
    titleAr: 'أفضل المرشدين',
    type: 'guides',
    itemCount: 6,
    isVisible: true,
  },
  {
    id: '4',
    order: 4,
    title: 'Upcoming Events',
    titleAr: 'الفعاليات القادمة',
    type: 'events',
    itemCount: 4,
    isVisible: false,
  },
  {
    id: '5',
    order: 5,
    title: 'Popular This Week',
    titleAr: 'الأكثر شهرة هذا الأسبوع',
    type: 'tours',
    itemCount: 10,
    isVisible: true,
  },
];

const SECTION_TYPES = ['destinations', 'tours', 'guides', 'events', 'restaurants'];

const typeColors = {
  destinations: 'bg-blue-100 text-blue-700',
  tours: 'bg-purple-100 text-purple-700',
  guides: 'bg-green-100 text-green-700',
  events: 'bg-yellow-100 text-yellow-700',
  restaurants: 'bg-orange-100 text-orange-700',
};

export default function ExploreScreen() {
  const [sections, setSections] = useState(MOCK_SECTIONS);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editSection, setEditSection] = useState(null);
  const [form, setForm] = useState({ title: '', titleAr: '', type: '', isVisible: true });

  const set = (field, value) => setForm((prev) => ({ ...prev, [field]: value }));

  const toggleVisibility = (id) => {
    setSections((prev) => prev.map((s) => s.id === id ? { ...s, isVisible: !s.isVisible } : s));
  };

  const deleteSection = (id) => {
    setSections((prev) => prev.filter((s) => s.id !== id));
  };

  const handleSave = () => {
    if (!form.title || !form.type) return;
    if (editSection) {
      setSections((prev) => prev.map((s) => s.id === editSection.id ? { ...s, ...form } : s));
      setEditSection(null);
    } else {
      setSections((prev) => [
        ...prev,
        { id: String(Date.now()), order: prev.length + 1, itemCount: 0, ...form },
      ]);
      setShowAddModal(false);
    }
    setForm({ title: '', titleAr: '', type: '', isVisible: true });
  };

  const openEdit = (section) => {
    setEditSection(section);
    setForm({ title: section.title, titleAr: section.titleAr, type: section.type, isVisible: section.isVisible });
  };

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Explore Screen</h2>
          <p className="text-sm text-gray-400 mt-0.5">Manage sections displayed on the explore page</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-primary text-white rounded-xl text-sm font-medium hover:bg-primary-600 transition-colors shadow-sm"
        >
          <Plus size={16} />
          Add Section
        </button>
      </div>

      {/* Sections list */}
      <div className="space-y-3">
        {sections.map((section) => (
          <div
            key={section.id}
            className={`bg-white rounded-2xl shadow-card p-4 flex items-center gap-4 transition-opacity ${
              !section.isVisible ? 'opacity-60' : ''
            }`}
          >
            {/* Drag handle */}
            <div className="text-gray-300 cursor-grab flex-shrink-0">
              <GripVertical size={18} />
            </div>

            {/* Order */}
            <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center text-sm font-bold text-gray-500 flex-shrink-0">
              {section.order}
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <p className="text-sm font-semibold text-gray-800">{section.title}</p>
                <span className={`px-2 py-0.5 rounded-full text-xs font-medium capitalize ${typeColors[section.type] || 'bg-gray-100 text-gray-500'}`}>
                  {section.type}
                </span>
                {!section.isVisible && (
                  <span className="px-2 py-0.5 rounded-full text-xs bg-gray-100 text-gray-400">Hidden</span>
                )}
              </div>
              <p className="text-xs text-gray-400 mt-0.5 dir-rtl">{section.titleAr}</p>
            </div>

            {/* Item count */}
            <div className="text-right flex-shrink-0">
              <p className="text-lg font-bold text-gray-800">{section.itemCount}</p>
              <p className="text-xs text-gray-400">items</p>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-1 flex-shrink-0">
              <button
                onClick={() => toggleVisibility(section.id)}
                className={`p-1.5 rounded-lg transition-colors ${
                  section.isVisible
                    ? 'hover:bg-gray-100 text-gray-400'
                    : 'hover:bg-primary/10 text-primary'
                }`}
                title={section.isVisible ? 'Hide' : 'Show'}
              >
                {section.isVisible ? <Eye size={15} /> : <EyeOff size={15} />}
              </button>
              <button
                onClick={() => openEdit(section)}
                className="p-1.5 rounded-lg hover:bg-primary/10 text-primary transition-colors"
                title="Edit"
              >
                <Pencil size={15} />
              </button>
              <button
                onClick={() => deleteSection(section.id)}
                className="p-1.5 rounded-lg hover:bg-red-50 text-red-500 transition-colors"
                title="Delete"
              >
                <Trash2 size={15} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add / Edit Modal */}
      <Modal
        isOpen={showAddModal || !!editSection}
        onClose={() => { setShowAddModal(false); setEditSection(null); setForm({ title: '', titleAr: '', type: '', isVisible: true }); }}
        title={editSection ? 'Edit Section' : 'Add Section'}
        size="sm"
      >
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium text-gray-700 block mb-1.5">Title (EN) <span className="text-red-500">*</span></label>
            <input
              type="text"
              value={form.title}
              onChange={(e) => set('title', e.target.value)}
              placeholder="e.g. Top Destinations"
              className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700 block mb-1.5">Title (AR)</label>
            <input
              type="text"
              value={form.titleAr}
              onChange={(e) => set('titleAr', e.target.value)}
              placeholder="مثال: أفضل الوجهات"
              dir="rtl"
              className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700 block mb-1.5">Content Type <span className="text-red-500">*</span></label>
            <select
              value={form.type}
              onChange={(e) => set('type', e.target.value)}
              className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20"
            >
              <option value="">Select type</option>
              {SECTION_TYPES.map((t) => <option key={t} value={t} className="capitalize">{t}</option>)}
            </select>
          </div>
          <div className="flex items-center justify-between py-1">
            <span className="text-sm text-gray-700">Visible on explore screen</span>
            <button
              type="button"
              onClick={() => set('isVisible', !form.isVisible)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                form.isVisible ? 'bg-primary' : 'bg-gray-200'
              }`}
            >
              <span className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${
                form.isVisible ? 'translate-x-6' : 'translate-x-1'
              }`} />
            </button>
          </div>
          <div className="flex gap-3 pt-2">
            <button
              onClick={() => { setShowAddModal(false); setEditSection(null); setForm({ title: '', titleAr: '', type: '', isVisible: true }); }}
              className="flex-1 py-2.5 border border-gray-200 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={!form.title || !form.type}
              className="flex-1 py-2.5 bg-primary text-white rounded-xl text-sm font-medium hover:bg-primary-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {editSection ? 'Save Changes' : 'Add Section'}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
