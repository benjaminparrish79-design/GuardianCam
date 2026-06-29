import { protectedProcedure, router } from "../_core/trpc";
import { supabaseAdmin } from "../supabase";
import { z } from "zod";
import { TRPCError } from "@trpc/server";

export const camerasRouter = router({
  // List all cameras for current user
  list: protectedProcedure.query(async ({ ctx }) => {
    const { data, error } = await supabaseAdmin
      .from("cameras")
      .select("*")
      .eq("user_id", ctx.user.id)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching cameras:", error);
      throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: error.message });
    }

    return data || [];
  }),

  // Get single camera
  get: protectedProcedure
    .input(z.object({ id: z.string().uuid() }))
    .query(async ({ ctx, input }) => {
      const { data, error } = await supabaseAdmin
        .from("cameras")
        .select("*")
        .eq("id", input.id)
        .eq("user_id", ctx.user.id)
        .single();

      if (error) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Camera not found" });
      }

      return data;
    }),

  // Create camera
  create: protectedProcedure
    .input(
      z.object({
        name: z.string().min(1).max(255),
        location: z.string().min(1).max(255),
        type: z.string().default("Phone Camera"),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { data, error } = await supabaseAdmin
        .from("cameras")
        .insert({
          user_id: ctx.user.id,
          name: input.name,
          location: input.location,
          type: input.type,
          status: "online",
        })
        .select()
        .single();

      if (error) {
        console.error("Error creating camera:", error);
        throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: error.message });
      }

      return data;
    }),

  // Update camera
  update: protectedProcedure
    .input(
      z.object({
        id: z.string().uuid(),
        name: z.string().min(1).max(255).optional(),
        location: z.string().min(1).max(255).optional(),
        status: z.enum(["online", "offline"]).optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { id, ...updates } = input;

      // Verify ownership
      const { data: camera, error: fetchError } = await supabaseAdmin
        .from("cameras")
        .select("user_id")
        .eq("id", id)
        .single();

      if (fetchError || camera?.user_id !== ctx.user.id) {
        throw new TRPCError({ code: "FORBIDDEN", message: "Not authorized" });
      }

      const { data, error } = await supabaseAdmin
        .from("cameras")
        .update(updates)
        .eq("id", id)
        .select()
        .single();

      if (error) {
        throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: error.message });
      }

      return data;
    }),

  // Delete camera
  delete: protectedProcedure
    .input(z.object({ id: z.string().uuid() }))
    .mutation(async ({ ctx, input }) => {
      // Verify ownership
      const { data: camera, error: fetchError } = await supabaseAdmin
        .from("cameras")
        .select("user_id")
        .eq("id", input.id)
        .single();

      if (fetchError || camera?.user_id !== ctx.user.id) {
        throw new TRPCError({ code: "FORBIDDEN", message: "Not authorized" });
      }

      const { error } = await supabaseAdmin
        .from("cameras")
        .delete()
        .eq("id", input.id);

      if (error) {
        throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: error.message });
      }

      return { success: true };
    }),

  // Update last seen
  updateLastSeen: protectedProcedure
    .input(z.object({ id: z.string().uuid() }))
    .mutation(async ({ ctx, input }) => {
      const { data: camera, error: fetchError } = await supabaseAdmin
        .from("cameras")
        .select("user_id")
        .eq("id", input.id)
        .single();

      if (fetchError || camera?.user_id !== ctx.user.id) {
        throw new TRPCError({ code: "FORBIDDEN", message: "Not authorized" });
      }

      const { error } = await supabaseAdmin
        .from("cameras")
        .update({ last_seen: new Date().toISOString() })
        .eq("id", input.id);

      if (error) {
        throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: error.message });
      }

      return { success: true };
    }),
});
