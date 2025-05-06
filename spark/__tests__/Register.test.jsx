import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import RegisterPage from "../app/register/page";
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

describe("RegisterPage", () => {
  const push = jest.fn();

  beforeEach(() => {
    useRouter.mockReturnValue({ push });
    fetch.mockClear();
    signInWithPopup.mockClear();
  });

  it("registers with email and password", async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ message: "User created" }),
    });

    render(<RegisterPage />);
    fireEvent.change(screen.getByPlaceholderText(/email/i), {
      target: { value: "newuser@example.com" },
    });
    fireEvent.change(screen.getByPlaceholderText(/password/i), {
      target: { value: "password123" },
    });

    fireEvent.click(screen.getByRole("button", { name: /register/i }));

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith("/api/register", expect.any(Object));
      expect(push).toHaveBeenCalledWith("/");
    });
  });

  it("shows error if fetch resolves with ok=false", async () => {
    fetch.mockResolvedValueOnce({
      ok: false,
      json: async () => ({ error: "Registration failed" }),
    });

    render(<RegisterPage />);
    fireEvent.change(screen.getByPlaceholderText(/email/i), {
      target: { value: "baduser@example.com" },
    });
    fireEvent.change(screen.getByPlaceholderText(/password/i), {
      target: { value: "badpassword" },
    });

    fireEvent.click(screen.getByRole("button", { name: /register/i }));

    await waitFor(() => {
      expect(screen.getByText(/registration failed/i)).toBeTruthy();
    });
  });

  it("registers with Google", async () => {
    signInWithPopup.mockResolvedValueOnce({
      user: { email: "googleuser@example.com" },
    });

    render(<RegisterPage />);
    fireEvent.click(screen.getByRole("button", { name: /sign up with google/i }));

    await waitFor(() => {
      expect(signInWithPopup).toHaveBeenCalled();
      expect(push).toHaveBeenCalledWith("/");
    });
  });

  it("shows fallback error if Google register fails with no message", async () => {
    signInWithPopup.mockRejectedValueOnce({});

    render(<RegisterPage />);
    fireEvent.click(screen.getByRole("button", { name: /sign up with google/i }));

    await waitFor(() => {
      expect(screen.getByText(/google sign-in failed/i)).toBeTruthy();
    });
  });
});
