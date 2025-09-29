'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, PanInfo, useAnimation, useIsPresent } from 'framer-motion';
import { z } from 'zod';
import { cn } from '@/lib/utils';
import { FingerprintPiece1, FingerprintPiece2, FingerprintPiece3, FingerprintPiece4, FingerprintPiece5, FingerprintPiece6 } from './fingerprint-pieces';

type Piece = {
  id: number;
  Component: React.FC<React.SVGProps<SVGSVGElement>>;
  solvedX: number;
  solvedY: number;
  isSolved: boolean;
};

const MotionEventValidator = z.object({
  x: z.number(),
  y: z.number(),
});

const piecesData: Omit<Piece, 'isSolved'>[] = [
  { id: 1, Component: FingerprintPiece1, solvedX: 0, solvedY: 0 },
  { id: 2, Component: FingerprintPiece2, solvedX: 100, solvedY: 0 },
  { id: 3, Component: FingerprintPiece3, solvedX: 0, solvedY: 100 },
  { id: 4, Component: FingerprintPiece4, solvedX: 100, solvedY: 100 },
  { id: 5, Component: FingerprintPiece5, solvedX: 0, solvedY: 200 },
  { id: 6, Component: FingerprintPiece6, solvedX: 100, solvedY: 200 },
];

function getRandomPosition(containerWidth: number, containerHeight: number) {
    const pieceSize = 100;
    // Get random positions within the container, leaving some padding
    const x = Math.random() * (containerWidth - pieceSize * 2) + pieceSize;
    const y = Math.random() * (containerHeight - pieceSize);
    return { x, y };
}


export default function FingerprintPuzzle({ onSolve }: { onSolve: () => void }) {
  const [pieces, setPieces] = useState<Piece[]>(
    piecesData.map(p => ({ ...p, isSolved: p.id === 1 }))
  );
  const [initialPositions, setInitialPositions] = useState<{ x: number; y: number }[]>([]);
  const constraintsRef = useRef<HTMLDivElement>(null);
  const controls = pieces.map(() => useAnimation());

  useEffect(() => {
    if (constraintsRef.current && initialPositions.length === 0) {
      const { width, height } = constraintsRef.current.getBoundingClientRect();
      const newPositions = piecesData.map((piece) => {
        if (piece.id === 1) {
           // The first piece is already solved
           return { x: piece.solvedX, y: piece.solvedY };
        }
        return getRandomPosition(width, height);
      });
      setInitialPositions(newPositions);
    }
  }, []);

  useEffect(() => {
    if(initialPositions.length > 0) {
        initialPositions.forEach((pos, i) => {
            controls[i].set({ x: pos.x, y: pos.y });
        });
    }
  }, [initialPositions, controls]);


  const handleDragEnd = (
    event: MouseEvent | TouchEvent | PointerEvent,
    info: PanInfo,
    pieceId: number
  ) => {
    const piece = pieces.find(p => p.id === pieceId);
    if (!piece || piece.isSolved) return;

    MotionEventValidator.parse(info.point);
    
    const dropZone = document.getElementById(`drop-zone-${pieceId}`);
    if(!dropZone || !constraintsRef.current) return;
    
    const dropZoneRect = dropZone.getBoundingClientRect();
    const containerRect = constraintsRef.current.getBoundingClientRect();

    // Check if the center of the piece is within the drop zone
    if (
        info.point.x >= dropZoneRect.left &&
        info.point.x <= dropZoneRect.right &&
        info.point.y >= dropZoneRect.top &&
        info.point.y <= dropZoneRect.bottom
    ) {
      const updatedPieces = pieces.map(p =>
        p.id === pieceId ? { ...p, isSolved: true } : p
      );
      setPieces(updatedPieces);
      
      const targetX = dropZoneRect.left - containerRect.left;
      const targetY = dropZoneRect.top - containerRect.top;

      controls[pieceId - 1].start({
        x: targetX,
        y: targetY,
        transition: { type: 'spring', stiffness: 300, damping: 30 },
      });

      if (updatedPieces.every(p => p.isSolved)) {
        onSolve();
      }
    } else {
        const initialPosition = initialPositions[pieceId - 1];
        if (initialPosition) {
            controls[pieceId - 1].start({
                x: initialPosition.x,
                y: initialPosition.y,
                transition: { type: 'spring', stiffness: 200, damping: 20 },
            });
        }
    }
  };

  const allSolved = pieces.every(p => p.isSolved);

  return (
    <div className="w-full h-full flex flex-col items-center justify-center">
      <div ref={constraintsRef} className="relative w-[300px] h-[400px] sm:w-[500px] sm:h-[500px]">
        {/* Drop Zones */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[200px] h-[300px] grid grid-cols-2 grid-rows-3">
          {piecesData.map(piece => (
            <div
              key={`dropzone-${piece.id}`}
              id={`drop-zone-${piece.id}`}
              className={cn(
                "w-[100px] h-[100px] border-dashed border-2 rounded-lg",
                pieces.find(p => p.id === piece.id)?.isSolved ? "border-accent/50" : "border-foreground/20",
                allSolved && "border-transparent"
              )}
            />
          ))}
        </div>

        {/* Puzzle Pieces */}
        {initialPositions.length > 0 && pieces.map((piece, index) => (
          <motion.div
            key={piece.id}
            drag={!piece.isSolved && !allSolved}
            dragConstraints={constraintsRef}
            dragElastic={0.5}
            onDragEnd={(event, info) => handleDragEnd(event, info, piece.id)}
            animate={controls[index]}
            className={cn(
                "absolute cursor-grab",
                piece.isSolved ? "cursor-default" : "active:cursor-grabbing",
                allSolved && 'pointer-events-none'
            )}
            style={{
              zIndex: piece.isSolved ? 1 : 10,
            }}
          >
            <piece.Component className={cn("w-[100px] h-[100px] text-foreground", allSolved && "text-primary transition-colors duration-1000")} />
          </motion.div>
        ))}
      </div>
    </div>
  );
}
