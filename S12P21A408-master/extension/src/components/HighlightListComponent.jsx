import React from 'react';
import HighlightComponent from './HighlightComponent';
import useHighlightStore from '../store/highlightStore';

function HighlightListComponent() {
  const { highlights, deleteHighlight } = useHighlightStore();

  return (
    <div className="space-y-4 pt-1">
      {highlights.length === 0 ? (
        <p className="text-sm text-gray-500">하이라이트가 없습니다.</p>
      ) : (
        highlights.map((highlight) => (
          <HighlightComponent
            key={highlight.highlightId}
            highlightId={highlight.highlightId}
            content={highlight.rawContent}
            color={highlight.color}
            onDelete={() => deleteHighlight(highlight.highlightId)}
          />
        ))
      )}
    </div>
  );
}

export default HighlightListComponent;
