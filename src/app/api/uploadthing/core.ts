import { getAuth } from "@/utils/getAuth";
import { createUploadthing, type FileRouter } from "uploadthing/next";

const f = createUploadthing();

const auth = async () => {
  const auth = await getAuth();
  const isAdmin = auth?.user.role;
  if (isAdmin !== "admin") {
    throw new Error("Unauthorize user");
  }
  return { isAdmin };
};

// FileRouter for your app, can contain multiple FileRoutes
export const ourFileRouter = {
  // Define as many FileRoutes as you like, each with a unique routeSlug
  featurImage: f({ image: { maxFileCount: 1, maxFileSize: "4MB" } })
    .middleware(() => auth())
    .onUploadComplete(() => {}),
  productImage: f({ image: { maxFileCount: 5, maxFileSize: "16MB" } })
    .middleware(() => auth())
    .onUploadComplete(() => {}),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
