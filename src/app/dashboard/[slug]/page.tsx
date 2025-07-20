import { getQueryClient, trpc } from "@/trpc/server";
import { CreateProject } from "../_components/project/create-project";

interface Props {
  params: Promise<{ slug: string }>;
}
const ProductCreate = async ({ params }: Props) => {
  const { slug } = await params;
  const queryClient = getQueryClient();
  void queryClient.prefetchQuery(
    trpc.project.getProjectBySlug.queryOptions({ slug })
  );
  return <CreateProject getSlug={slug} />;
};

export default ProductCreate;
