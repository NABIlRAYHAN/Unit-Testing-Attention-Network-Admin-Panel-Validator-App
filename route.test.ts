import { GET } from "../auth/confirm/route"; // ✅ Adjust the path as needed
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { NextRequest } from "next/server";

// ✅ Mock the Supabase client and redirect
jest.mock("@/lib/supabase/server", () => ({
  createClient: jest.fn(),
}));

jest.mock("next/navigation", () => ({
  redirect: jest.fn(),
}));

// ✅ Setup mock function for verifyOtp
const mockVerifyOtp = jest.fn();

beforeEach(() => {
  jest.clearAllMocks();

 
  const mockCreateClient = createClient as unknown as jest.Mock;
  mockCreateClient.mockResolvedValue({
    auth: {
      verifyOtp: mockVerifyOtp,
    },
  });
});

function createMockRequest(url: string): NextRequest {
  return {
    url,
  } as unknown as NextRequest;
}

describe("GET - verifyOtp", () => {
  it("should verify OTP and redirect to 'next' path on success", async () => {
    mockVerifyOtp.mockResolvedValue({ error: null });

    const request = createMockRequest(
      "https://example.com/api/verify?token_hash=abc123&type=email&next=/dashboard"
    );

    await GET(request);

    expect(mockVerifyOtp).toHaveBeenCalledWith({
      type: "email",
      token_hash: "abc123",
    });

    expect(redirect).toHaveBeenCalledWith("/dashboard");
  });

  it("should redirect to error page if OTP verification fails", async () => {
    mockVerifyOtp.mockResolvedValue({
      error: { message: "Invalid token" },
    });

    const request = createMockRequest(
      "https://example.com/api/verify?token_hash=wrong&type=email"
    );

    await GET(request);

    expect(redirect).toHaveBeenCalledWith("/auth/error?error=Invalid token");
  });

  it("should redirect to error page if token_hash or type is missing", async () => {
    const request = createMockRequest("https://example.com/api/verify");

    await GET(request);

    expect(redirect).toHaveBeenCalledWith(
      "/auth/error?error=No token hash or type"
    );
  });
});