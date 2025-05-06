import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import AccountPage from "../app/account/page";
import { useRouter } from "next/navigation";
import { signInWithPopup } from "firebase/auth";

jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
}));

jest.mock("firebase/auth", () => {
  const original = jest.requireActual("firebase/auth");
  return {
    ...original,
    signInWithPopup: jest.fn(),
  };
});

global.fetch = jest.fn();

describe("AccountPage (Login)", () => {
  const push = jest.fn();

  beforeEach(() => {
    useRouter.mockReturnValue({ push });
    fetch.mockClear();
    signInWithPopup.mockClear();
  });

  it("logs in with email and password", async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ message: "Login successful" }),
    });

    render(<AccountPage />);
    fireEvent.change(screen.getByPlaceholderText("Email"), {
      target: { value: "test@example.com" },
    });
    fireEvent.change(screen.getByPlaceholderText("Password"), {
      target: { value: "password123" },
    });

    fireEvent.click(screen.getByRole("button", { name: /login/i }));

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith("/api/login", expect.any(Object));
      expect(push).toHaveBeenCalledWith("/");
    });
  });

  it("shows error if fetch resolves with ok=false", async () => {
    fetch.mockResolvedValueOnce({
      ok: false,
      json: async () => ({ error: "Invalid credentials" }),
    });

    render(<AccountPage />);
    fireEvent.change(screen.getByPlaceholderText("Email"), {
      target: { value: "wrong@example.com" },
    });
    fireEvent.change(screen.getByPlaceholderText("Password"), {
      target: { value: "wrongpassword" },
    });

    fireEvent.click(screen.getByRole("button", { name: /login/i }));

    await waitFor(() => {
      expect(screen.getByText(/invalid credentials/i)).toBeTruthy();
    });
  });

  it("logs in with Google", async () => {
    signInWithPopup.mockResolvedValueOnce({
      user: { email: "googleuser@example.com" },
    });

    render(<AccountPage />);
    fireEvent.click(screen.getByRole("button", { name: /sign in with google/i }));

    await waitFor(() => {
      expect(signInWithPopup).toHaveBeenCalled();
      expect(push).toHaveBeenCalledWith("/");
    });
  });

  it("shows fallback error if Google login fails with no message", async () => {
    signInWithPopup.mockRejectedValueOnce({});

    render(<AccountPage />);
    fireEvent.click(screen.getByRole("button", { name: /sign in with google/i }));

    await waitFor(() => {
      expect(screen.getByText(/google login failed/i)).toBeTruthy();
    });
  });
});
