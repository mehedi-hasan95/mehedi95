"use client";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { JSX, useState } from "react";
import { Button } from "../ui/button";
interface Props {
  trigger: JSX.Element;
  title?: string;
  children: React.ReactNode;
  className?: string;
  showCloseDialog?: boolean;
  closeText?: string;
  submitText?: string;
  closeButtonCss?: string;
  submitButtonCss?: string;
  showDialogFooter?: boolean;
}
export const ModifyDialog = ({
  children,
  title,
  trigger,
  className,
  showCloseDialog = false,
  closeText = "Cancle",
  closeButtonCss,
  submitButtonCss,
  submitText,
  showDialogFooter = false,
}: Props) => {
  const [open, setOpen] = useState(false);
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className={className}>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription asChild>{children}</DialogDescription>
        </DialogHeader>
        {showDialogFooter && (
          <DialogFooter>
            {showCloseDialog && (
              <DialogClose asChild>
                <Button variant="outline" className={closeButtonCss}>
                  {closeText}
                </Button>
              </DialogClose>
            )}
            <Button type="submit" className={submitButtonCss}>
              {submitText}
            </Button>
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  );
};
