import { Badge } from "@/components/ui/badge";
import { ContactInfo } from "./_components/contact-info";
import { ContactForm } from "./_components/contact-form";
import { getQueryClient, trpc } from "@/trpc/server";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { Suspense } from "react";

const ContactPage = async () => {
  const queryClient = getQueryClient();
  void queryClient.prefetchQuery(trpc.userInfo.myInfo.queryOptions());
  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <Badge variant="outline" className="mb-4">
            Get In Touch
          </Badge>
          <h1 className="text-4xl font-bold mb-4">Contact Me</h1>
          <p className="text-xl text-muted-foreground">
            Let&apos;s discuss your next project or opportunity
          </p>
        </div>
        <div className="grid md:grid-cols-2 gap-12">
          <HydrationBoundary state={dehydrate(queryClient)}>
            <Suspense fallback={<p>Loading...</p>}>
              <ContactInfo />
            </Suspense>
          </HydrationBoundary>
          <ContactForm />
        </div>
      </div>
    </div>
  );
};

export default ContactPage;
