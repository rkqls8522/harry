import React from 'react';
import { Pencil, Trash2 } from 'lucide-react';
import Button from './Button';

const NoteSection = ({ savedNote, note, isEditingNote, onNoteChange, onNoteSave, onNoteDelete, onEditNote }) => (
  <div className="mt-8">
    <h3 className="text-lg font-semibold text-gray-800 mb-2">요약</h3>

    {savedNote && !isEditingNote ? (
      <div className="border border-gray-300 rounded-lg p-4 text-gray-700">
        <p className="whitespace-pre-wrap">{savedNote}</p>
        <div className="flex justify-end mt-2 gap-4">
          <button onClick={onEditNote} className="text-gray-500 hover:text-blue-600">
            <Pencil className="w-4 h-4" />
          </button>
          <button onClick={onNoteDelete} className="text-gray-500 hover:text-red-500">
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    ) : (
      <>
        <textarea
          rows={4}
          placeholder="이 페이지에 대한 요약 ..."
          value={note}
          onChange={onNoteChange}
          className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
        />
        <div className="flex justify-end mt-2">
          <Button variant="default" size="sm" onClick={onNoteSave}>
            저장
          </Button>
        </div>
      </>
    )}
  </div>
);

export default NoteSection;
