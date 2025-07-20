"use client";

import { formatDate } from "@/lib/utils";
import { useTRPC } from "@/trpc/client";
import { useSuspenseQuery } from "@tanstack/react-query";

export const AllMessage = () => {
  const trpc = useTRPC();
  const { data } = useSuspenseQuery(trpc.userInfo.allMessage.queryOptions());
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
      {data.map((item) => (
        <div
          className="inset-0 bg-gradient-to-r from-blue-600/20 via-transparent to-blue-800/20 space-y-3 rounded-2xl px-4 py-6"
          key={item.id}
        >
          <h2>
            <span className="text-blue-400 text-xl font-bold">Name:</span>{" "}
            <span>{item.name}</span>
          </h2>
          <h2>
            <span className="text-blue-400 text-xl font-bold">Email:</span>{" "}
            <span>{item.email}</span>
          </h2>
          {item.subject && (
            <h2>
              <span className="text-blue-400 text-xl font-bold">Subject:</span>{" "}
              <span>{item.subject}</span>
            </h2>
          )}
          <h2>
            <span className="text-blue-400 text-xl font-bold">Message:</span>{" "}
            <span>{item.message}</span>
          </h2>
          <h2>
            <span className="text-blue-400 text-xl font-bold">Date:</span>{" "}
            <span>{formatDate(item.createdAt)}</span>
          </h2>
        </div>
      ))}
    </div>
  );
};
