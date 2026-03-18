import { forwardRef, type ImgHTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

export type ImageProps = ImgHTMLAttributes<HTMLImageElement>;

export const Image = forwardRef<HTMLImageElement, ImageProps>(
  ({ src, className, alt = '', ...props }, ref) => {
    if (!src) return <div data-empty-image />;
    return (
      <img
        ref={ref}
        src={src}
        alt={alt}
        className={cn(className)}
        {...props}
      />
    );
  }
);
Image.displayName = 'Image';
