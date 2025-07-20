"use client";

import { ourFileRouter } from "@/app/api/uploadthing/core";
import { toast } from "sonner";
import { UploadDropzone } from "./uploadthing";
import { ClientUploadedFileData } from "uploadthing/types";

interface Props {
  onChange: (url?: string | string[] | undefined) => void;
  endPoint: keyof typeof ourFileRouter;
}
export const ImageUpload = ({ endPoint, onChange }: Props) => {
  const handleUploadComplete = (res: ClientUploadedFileData<null>[]) => {
    if (!res || res.length === 0) return;

    if (endPoint === "featurImage") {
      const singleUrl = res[0].ufsUrl;
      onChange(singleUrl);
    } else {
      const urls = res.map((item) => item.ufsUrl);
      onChange(urls);
    }
  };
  return (
    <UploadDropzone
      endpoint={endPoint}
      onClientUploadComplete={handleUploadComplete}
      onUploadError={(error: Error) => {
        toast.error(`ERROR! ${error.message}`);
      }}
    />
  );
};
