import { logout } from "@/lib/actions/auth/users"
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

// ✅ Mock Supabase client and redirect
jest.mock("@/lib/supabase/server", () => ({
  createClient: jest.fn(),
}));

jest.mock("next/navigation", () => ({
  redirect: jest.fn(),
}));

const mockSignOut = jest.fn();

beforeEach(() => {
  jest.clearAllMocks();

  const mockCreateClient = createClient as unknown as jest.Mock;
  mockCreateClient.mockResolvedValue({
    auth: {
      signOut: mockSignOut,
    },
  });
});

describe("logout", () => {
  it("signs out the user and redirects to /auth/login", async () => {
    await logout();

    expect(mockSignOut).toHaveBeenCalled();
    expect(redirect).toHaveBeenCalledWith("/auth/login");
  });
});