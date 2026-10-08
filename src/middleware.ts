import { withAuth } from "next-auth/middleware";

// Protect /admin/* but allow the login page itself.
export default withAuth({
  pages: { signIn: "/admin/login" },
});

export const config = {
  matcher: [
    // All admin routes except the login page and NextAuth endpoints
    "/admin/((?!login).*)",
  ],
};
