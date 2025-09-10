import withAuth from "next-auth/middleware";

export default withAuth({
  pages: {
    signIn: "/auth/signin", // Redirect unauthenticated users to this page
  },
});

export const config = { matcher: ["/group(.*)"] };
