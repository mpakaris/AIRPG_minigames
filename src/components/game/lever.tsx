'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

type LeverProps = {
  id: number;
  onPull: (id: number) => void;
  isPulled: boolean;
  isDisabled: boolean;
};

export default function Lever({ id, onPull, isPulled, isDisabled }: LeverProps) {
  const handlePull = () => {
    if (!isDisabled && !isPulled) {
      onPull(id);
    }
  };

  return (
    <div className="flex flex-col items-center">
      <div className="w-4 h-24 bg-muted rounded-t-md relative flex justify-center shadow-inner">
        <motion.div
          animate={{ y: isPulled ? '6rem' : '0rem' }}
          transition={{ type: 'spring', stiffness: 200, damping: 15 }}
          className={cn(
            'absolute top-0 w-10 h-10 rounded-full bg-primary shadow-lg -translate-y-1/2 cursor-pointer',
            (isDisabled || isPulled) && 'cursor-not-allowed bg-muted-foreground'
          )}
          onTap={handlePull}
        >
            <div className='w-full h-full rounded-full border-4 border-background shadow-inner' />
        </motion.div>
        <div className="w-1 h-full bg-foreground/20 absolute" />
      </div>
       <div className="w-12 h-4 bg-accent/30 rounded-b-md border-x-2 border-b-2 border-accent/50" />
       <span className="mt-2 text-sm font-bold text-muted-foreground">{id}</span>
    </div>
  );
}
