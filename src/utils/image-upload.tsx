"use client";

import { ourFileRouter } from "@/app/api/uploadthing/core";
import { toast } from "sonner";
import { UploadDropzone } from "./uploadthing";
import { useState } from "react";
import Image from "next/image";
import { ClientUploadedFileData } from "uploadthing/types";

interface Props {
  onChange: (url?: string | string[] | undefined) => void;
  endPoint: keyof typeof ourFileRouter;
}
export const ImageUpload = ({ endPoint, onChange }: Props) => {
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const handleUploadComplete = (res: ClientUploadedFileData<null>[]) => {
    if (!res || res.length === 0) return;

    if (endPoint === "featurImage") {
      const singleUrl = res[0].ufsUrl;
      setImageUrls([singleUrl]);
      onChange(singleUrl);
    } else {
      const urls = res.map((item) => item.ufsUrl);
      setImageUrls(urls);
      onChange(urls);
    }
  };
  return (
    <div className="space-y-3">
      {imageUrls.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {imageUrls.map((url) => (
            <Image
              key={url}
              src={url}
              height={500}
              width={500}
              alt="Uploaded image"
              className="h-32 w-32 object-cover"
            />
          ))}
        </div>
      )}
      <UploadDropzone
        endpoint={endPoint}
        onClientUploadComplete={handleUploadComplete}
        onUploadError={(error: Error) => {
          toast.error(`ERROR! ${error.message}`);
        }}
      />
    </div>
  );
};
