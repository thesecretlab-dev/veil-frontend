import { NextRequest, NextResponse } from "next/server";

export function middleware(_req: NextRequest) {
  // Closed alpha gate is disabled for public launch visibility.
  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all paths except:
     * - _next (static/image optimization)
     * - favicon, robots, sitemap, manifest
     * - api routes
     */
    "/((?!_next|favicon|icon\\.svg|robots|sitemap|site\\.webmanifest|og-image|apple-touch-icon|android-chrome|google.*\\.html|api).*)",
  ],
};
