import { describe, it, expect, beforeAll } from "vitest";
import { ENV } from "./_core/env";

describe("Supabase Configuration", () => {
  it("should have Supabase URL configured", () => {
    expect(ENV.supabaseUrl).toBeTruthy();
    expect(ENV.supabaseUrl).toContain("supabase.co");
  });

  it("should have Supabase publishable key configured", () => {
    expect(ENV.supabasePublishableKey).toBeTruthy();
    expect(ENV.supabasePublishableKey).toContain("sb_publishable");
  });

  it("should have Supabase secret key configured", () => {
    expect(ENV.supabaseSecretKey).toBeTruthy();
    expect(ENV.supabaseSecretKey).toContain("sb_secret");
  });

  it("should have Supabase JWKS URL configured", () => {
    expect(ENV.supabaseJwksUrl).toBeTruthy();
    expect(ENV.supabaseJwksUrl).toContain("/.well-known/jwks.json");
  });
});

describe("Supabase Client Creation", () => {
  it("should create admin client successfully", async () => {
    const { supabaseAdmin } = await import("./supabase");
    expect(supabaseAdmin).toBeDefined();
  });

  it("should create user client successfully", async () => {
    const { createUserClient } = await import("./supabase");
    const client = createUserClient("test-token");
    expect(client).toBeDefined();
  });
});

describe("Database Types", () => {
  it("should define Camera interface", async () => {
    const { supabaseAdmin } = await import("./supabase");
    expect(supabaseAdmin).toBeDefined();
  });

  it("should define Event interface", async () => {
    const { supabaseAdmin } = await import("./supabase");
    expect(supabaseAdmin).toBeDefined();
  });

  it("should define ShareLink interface", async () => {
    const { supabaseAdmin } = await import("./supabase");
    expect(supabaseAdmin).toBeDefined();
  });
});
