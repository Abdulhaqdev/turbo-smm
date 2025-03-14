// @/components/ui/dialog.tsx
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { forwardRef } from "react";

export const Dialog = DialogPrimitive.Root;

export const DialogContent = forwardRef<
  React.ElementRef<typeof DialogPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content>
>(({ children, ...props }, ref) => (
  <DialogPrimitive.Portal>
    <DialogPrimitive.Overlay />
    <DialogPrimitive.Content ref={ref} {...props}>
      {children}
    </DialogPrimitive.Content>
  </DialogPrimitive.Portal>
));
DialogContent.displayName = "DialogContent";

export const DialogHeader = ({ children, ...props }: React.HTMLProps<HTMLDivElement>) => (
  <div className="space-y-1.5" {...props}>
    {children}
  </div>
);

export const DialogFooter = ({ children, ...props }: React.HTMLProps<HTMLDivElement>) => (
  <div className="flex justify-end space-x-2" {...props}>
    {children}
  </div>
);

export const DialogTitle = DialogPrimitive.Title;
export const DialogDescription = DialogPrimitive.Description;