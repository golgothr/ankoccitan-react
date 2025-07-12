import React from 'react';

interface CardPreviewProps {
  front?: string;
  back?: string;
  imageUrl?: string;
}

export const CardPreview: React.FC<CardPreviewProps> = ({
  front,
  back,
  imageUrl,
}) => {
  return (
    <div className="space-y-4">
      <div className="p-4 bg-occitan-light rounded-xl shadow-inner">
        {imageUrl && (
          <img src={imageUrl} alt="" className="mb-3 w-full rounded" />
        )}
        {front && (
          <p className="font-semibold text-gray-700 whitespace-pre-wrap">
            {front}
          </p>
        )}
        {(front || back) && <hr className="my-2" />}
        {back && (
          <p className="text-gray-700 whitespace-pre-wrap">{back}</p>
        )}
        {!front && !back && (
          <p className="text-gray-400 italic text-sm">Aperçu de la carte</p>
        )}
      </div>
    </div>
  );
};
