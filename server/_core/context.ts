import type { CreateExpressContextOptions } from "@trpc/server/adapters/express";
import { supabaseAdmin } from "../supabase";

export type TrpcContext = {
  req: CreateExpressContextOptions["req"];
  res: CreateExpressContextOptions["res"];
  user: any | null; // We'll improve the type later
};

export async function createContext(
  opts: CreateExpressContextOptions
): Promise<TrpcContext> {
  let user: any | null = null;

  try {
    // Get token from Authorization header (Bearer token)
    const authHeader = opts.req.headers.authorization;
    
    if (authHeader && authHeader.startsWith("Bearer ")) {
      const token = authHeader.substring(7); // Remove "Bearer "

      // Verify the token with Supabase
      const { data: { user: supabaseUser }, error } = await supabaseAdmin.auth.getUser(token);

      if (!error && supabaseUser) {
        user = supabaseUser;
      }
    }
  } catch (error) {
    // Authentication failed or no token — user stays null (for public routes)
    user = null;
  }

  return {
    req: opts.req,
    res: opts.res,
    user,
  };
}
