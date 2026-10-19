import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  // Get hostname from the request
  const hostname = request.headers.get("host") || "";
  const userAgent = request.headers.get("user-agent") || "";

  // Skip middleware for static files and assets
  if (
    request.nextUrl.pathname.startsWith("/_next/") ||
    request.nextUrl.pathname.startsWith("/static/") ||
    request.nextUrl.pathname.includes(".")
  ) {
    return NextResponse.next();
  }

  // If request is coming from API subdomain, redirect to main domain
  if (hostname.includes("api.halokaki.com")) {
    const url = new URL(request.nextUrl);
    url.hostname = "halokaki.com";
    url.protocol = "https:";

    return NextResponse.redirect(url, 301);
  }

  // Ensure all requests use HTTPS and www-less domain
  if (hostname === "www.halokaki.com") {
    const url = new URL(request.nextUrl);
    url.hostname = "halokaki.com";

    return NextResponse.redirect(url, 301);
  }

  // Create response with proper headers
  const response = NextResponse.next();

  // Add security headers for all requests
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("X-Frame-Options", "DENY");
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");

  // Prevent Facebook from caching API responses
  if (request.nextUrl.pathname.startsWith("/api/")) {
    response.headers.set("X-Robots-Tag", "noindex, nofollow");
    response.headers.set(
      "Cache-Control",
      "no-cache, no-store, must-revalidate",
    );
    return response;
  }

  // Add Open Graph specific headers for social media crawlers
  if (
    userAgent.includes("facebookexternalhit") ||
    userAgent.includes("Twitterbot") ||
    userAgent.includes("LinkedInBot") ||
    userAgent.includes("WhatsApp")
  ) {
    response.headers.set("Cache-Control", "public, max-age=86400");
    response.headers.set("X-Frame-Options", "SAMEORIGIN");
    response.headers.set("Content-Type", "text/html; charset=utf-8");
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
     * - public files with extensions
     * - API routes that should be handled separately
     */
    "/((?!_next/static|_next/image|_next/webpack-hmr|favicon.ico|robots.txt|sitemap.xml|manifest.json|.*\\.[a-zA-Z0-9]+$).*)",
  ],
};
