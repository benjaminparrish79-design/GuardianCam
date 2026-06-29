import { protectedProcedure, router } from "../_core/trpc";
import { supabaseAdmin } from "../supabase";
import { z } from "zod";
import { TRPCError } from "@trpc/server";

export const eventsRouter = router({
  // List events for user's cameras
  list: protectedProcedure
    .input(
      z.object({
        cameraId: z.string().uuid().optional(),
        severity: z.enum(["low", "medium", "high"]).optional(),
        limit: z.number().min(1).max(100).default(50),
        offset: z.number().min(0).default(0),
      })
    )
    .query(async ({ ctx, input }) => {
      let query = supabaseAdmin
        .from("events")
        .select("*")
        .eq("user_id", ctx.user.id);

      if (input.cameraId) {
        query = query.eq("camera_id", input.cameraId);
      }

      if (input.severity) {
        query = query.eq("severity", input.severity);
      }

      const { data, error, count } = await query
        .order("time", { ascending: false })
        .range(input.offset, input.offset + input.limit - 1);

      if (error) {
        console.error("Error fetching events:", error);
        throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: error.message });
      }

      return {
        events: data || [],
        total: count || 0,
      };
    }),

  // Create event
  create: protectedProcedure
    .input(
      z.object({
        cameraId: z.string().uuid(),
        cameraName: z.string(),
        type: z.string(),
        description: z.string().optional(),
        severity: z.enum(["low", "medium", "high"]).default("medium"),
      })
    )
    .mutation(async ({ ctx, input }) => {
      // Verify camera ownership
      const { data: camera, error: fetchError } = await supabaseAdmin
        .from("cameras")
        .select("user_id")
        .eq("id", input.cameraId)
        .single();

      if (fetchError || camera?.user_id !== ctx.user.id) {
        throw new TRPCError({ code: "FORBIDDEN", message: "Not authorized" });
      }

      const { data, error } = await supabaseAdmin
        .from("events")
        .insert({
          user_id: ctx.user.id,
          camera_id: input.cameraId,
          camera_name: input.cameraName,
          type: input.type,
          description: input.description,
          severity: input.severity,
          time: new Date().toISOString(),
        })
        .select()
        .single();

      if (error) {
        console.error("Error creating event:", error);
        throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: error.message });
      }

      return data;
    }),

  // Delete event
  delete: protectedProcedure
    .input(z.object({ id: z.string().uuid() }))
    .mutation(async ({ ctx, input }) => {
      // Verify ownership
      const { data: event, error: fetchError } = await supabaseAdmin
        .from("events")
        .select("user_id")
        .eq("id", input.id)
        .single();

      if (fetchError || event?.user_id !== ctx.user.id) {
        throw new TRPCError({ code: "FORBIDDEN", message: "Not authorized" });
      }

      const { error } = await supabaseAdmin
        .from("events")
        .delete()
        .eq("id", input.id);

      if (error) {
        throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: error.message });
      }

      return { success: true };
    }),

  // Clear old events (older than 30 days)
  clearOld: protectedProcedure.mutation(async ({ ctx }) => {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const { error } = await supabaseAdmin
      .from("events")
      .delete()
      .eq("user_id", ctx.user.id)
      .lt("time", thirtyDaysAgo.toISOString());

    if (error) {
      throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: error.message });
    }

    return { success: true };
  }),
});
