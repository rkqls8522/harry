import React, { useEffect, useState } from 'react';
import { Globe, Link, Tag as TagIcon } from 'lucide-react';
import HighlightCard from '../components/ArchiveDetail/HighlightCard';
import NoteSection from '../components/ArchiveDetail/NoteSection';
import { useParams } from 'react-router-dom';
import useArchiveDetailStore from '../store/archiveDetailStore';
import TagDropdownComponent from '../components/ArchiveDetail/TagDropdownComponent';

const ArchiveDetailPage = () => {
  const { archiveId } = useParams();
  const {
    archive,
    selectedTags,
    highlights,
    note,
    fetchArchiveDetail,
    removeHighlight,
    removeMemo,
    setIsPublic,
    addMemo,
    updateMemo,
    addNote,
    updateNote,
    removeNote,
  } = useArchiveDetailStore();

  const [memoInputs, setMemoInputs] = useState({});
  const [editingMemoIndex, setEditingMemoIndex] = useState(null);
  const [editingHighlightId, setEditingHighlightId] = useState(null);

  const [isEditingNote, setIsEditingNote] = useState(false);
  const [noteInput, setNoteInput] = useState('');

  const [isDropdownOpen, setDropdownOpen] = useState(false);

  useEffect(() => {
    fetchArchiveDetail(archiveId);
  }, [archiveId, fetchArchiveDetail]);

  const handleIsPrivate = (prev) => {
    setIsPublic(!prev);
  };

  const handleDeleteHighlight = (id) => {
    removeHighlight(id);
  };

  const handleNoteSave = () => {
    addNote(archiveId, noteInput);
    setNoteInput('');
    setIsEditingNote(false);
  };

  const handleNoteDelete = () => {
    removeNote(archiveId);
    setNoteInput('');
    setIsEditingNote(false);
  };

  const handleMemoInputChange = (id, value) => {
    setMemoInputs((prev) => ({ ...prev, [id]: value }));
  };

  const handleAddMemo = (id) => {
    const input = memoInputs[id]?.trim();
    if (!input) return;
    addMemo(id, input);
    setMemoInputs((prev) => ({ ...prev, [id]: '' }));
  };

  const handleEditMemo = (highlightId, memoId) => {
    const target = highlights.find((h) => h.highlightId === highlightId);
    setMemoInputs((prev) => ({ ...prev, [highlightId]: target.memos.find((m) => m.id === memoId).content }));
    setEditingHighlightId(highlightId);
    setEditingMemoIndex(memoId);
  };

  const handleSaveEditedMemo = () => {
    const input = memoInputs[editingHighlightId]?.trim();
    if (!input) return;
    updateMemo(editingHighlightId, editingMemoIndex, input);
    setEditingMemoIndex(null);
    setEditingHighlightId(null);
    setMemoInputs((prev) => ({ ...prev, [editingHighlightId]: '' }));
  };

  const handleDeleteMemo = (highlightId, memoId) => {
    removeMemo(highlightId, memoId);
  };

  const handleCancelEdit = (id) => {
    setEditingHighlightId(null);
    setEditingMemoIndex(null);
    setMemoInputs((prev) => ({ ...prev, [id]: '' }));
  };

  return (
    <div className="max-w-3xl mx-auto px-6 py-4 space-y-6">
      <div className="flex flex-col items-start gap-5 mb-5">
        <div
          onClick={() => handleIsPrivate(archive.isPublic)}
          className={`inline-flex items-center gap-2 text-lg rounded-full px-2 py-2 w-fit cursor-pointer border transition-colors ${
            archive.isPublic ? 'text-blue-600 bg-blue-50 border-blue-200' : 'text-gray-500 bg-gray-100 border-gray-200'
          }`}
        >
          <Globe className="w-4 h-4" />
          <span className="text-xs font-medium">{archive.isPublic ? 'public' : 'private'}</span>
        </div>

        <h2 className="text-2xl font-bold text-gray-900 leading-snug">{archive.title}</h2>

        <div className="flex items-center w-full max-w-xl gap-2 text-sm text-gray-500">
          <Link className="min-w-[16px] min-h-[16px]" />
          <a
            href={archive.url}
            target="_blank"
            rel="noopener noreferrer"
            className="underline truncate max-w-full inline-block overflow-hidden whitespace-nowrap hover:text-blue-600 transition-colors"
            title={archive.url}
          >
            {archive.url}
          </a>
        </div>

        <div className="relative w-full">
          <div
            onClick={() => setDropdownOpen((prev) => !prev)}
            className="flex items-center gap-2 cursor-pointer transition"
          >
            <TagIcon className="w-4 h-4 text-gray-500" />
            <div className="flex flex-wrap gap-2">
              {selectedTags.length === 0 ? (
                <span className="text-xs text-gray-400 italic pl-2">Empty</span>
              ) : (
                selectedTags.map((tag) => (
                  <span
                    key={tag.id}
                    className="text-xs px-3 py-1 bg-blue-50 text-blue-700 rounded-full border border-blue-200"
                  >
                    {tag.name}
                  </span>
                ))
              )}
            </div>
          </div>

          {/* 드롭다운 */}
          {isDropdownOpen && (
            <div className="absolute top-full left-0 w-full mt-2 z-50">
              <TagDropdownComponent archiveId={archiveId} onClose={() => setDropdownOpen(false)} />
            </div>
          )}
        </div>
      </div>

      <hr className="my-4" />
      <div className="space-y-4">
        {highlights.map((highlight) => (
          <HighlightCard
            key={highlight.highlightId}
            highlight={highlight}
            memoInputs={memoInputs}
            editingHighlightId={editingHighlightId}
            editingMemoIndex={editingMemoIndex}
            onDeleteHighlight={handleDeleteHighlight}
            onMemoInputChange={handleMemoInputChange}
            onAddMemo={handleAddMemo}
            onEditMemo={handleEditMemo}
            onSaveEditedMemo={handleSaveEditedMemo}
            onDeleteMemo={handleDeleteMemo}
            onCancelEdit={() => handleCancelEdit(highlight.highlightId)}
          />
        ))}
      </div>
      <NoteSection
        savedNote={note}
        note={noteInput}
        isEditingNote={isEditingNote}
        onNoteChange={(e) => setNoteInput(e.target.value)}
        onNoteSave={handleNoteSave}
        onNoteDelete={handleNoteDelete}
        onEditNote={() => {
          setNoteInput(note);
          updateNote(archiveId, noteInput);
          setIsEditingNote(true);
        }}
      />
    </div>
  );
};

export default ArchiveDetailPage;
