import { createTRPCReact } from "@trpc/react-query";
import { httpBatchLink } from "@trpc/client";
import type { AppRouter } from "../../../server/routers";
import { supabase } from "./supabase";

export const trpc = createTRPCReact<AppRouter>({
  config() {
    return {
      links: [
        httpBatchLink({
          url: "/api/trpc",
          async headers() {
            const { data: { session } } = await supabase.auth.getSession();
            return {
              authorization: session?.access_token 
                ? `Bearer ${session.access_token}` 
                : "",
            };
          },
        }),
      ],
    };
  },
});
