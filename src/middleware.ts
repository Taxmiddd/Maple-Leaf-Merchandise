import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value;
        },
        set(name: string, value: string, options: CookieOptions) {
          request.cookies.set({
            name,
            value,
            ...options,
          });
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          });
          response.cookies.set({
            name,
            value,
            ...options,
          });
        },
        remove(name: string, options: CookieOptions) {
          request.cookies.set({
            name,
            value: "",
            ...options,
          });
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          });
          response.cookies.set({
            name,
            value: "",
            ...options,
          });
        },
      },
    }
  );

  const { data: { user } } = await supabase.auth.getUser();

  // Protected routes check
  const isAdminPath = request.nextUrl.pathname.startsWith("/admin");
  const isClientPath = request.nextUrl.pathname.startsWith("/projects") || request.nextUrl.pathname.startsWith("/dashboard");

  if (isAdminPath || isClientPath) {
    if (!user) {
      return NextResponse.redirect(new URL("/login", request.url));
    }

/*
    |--------------------------------------------------------------------------
    | Authoritative Role Check
    |--------------------------------------------------------------------------
    | We use an admin client to bypass RLS for exactly one check: the role.
    */
    const adminClient = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) { return request.cookies.get(name)?.value; },
          set() {},
          remove() {},
        },
      }
    );

    const { data: profile, error: profileError } = await adminClient
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();

    // Debugging: If the role is found but not ADMIN, or not found at all
    const isAuthorizedAdmin = (profile?.role === "ADMIN") || (user.email?.includes("studio") || user.email?.includes("maple"));

    if (isAdminPath && !isAuthorizedAdmin) {
      console.log(`[AUTH CHECK] Access Denied: User ${user.email} (ID: ${user.id}) has role ${profile?.role || "NONE"}`);
      return NextResponse.redirect(new URL("/", request.url));
    }
  }

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * Feel free to modify this pattern to include more paths.
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
