import { NextRequest, NextResponse } from "next/server";

const ACCESS_KEY = process.env.VEIL_ACCESS_KEY || "tsl2026";

export function middleware(req: NextRequest) {
  const host = req.nextUrl.hostname.toLowerCase();
  const isLocalHost = host === "localhost" || host === "127.0.0.1" || host === "::1";

  // Never gate local development traffic.
  if (isLocalHost) {
    return NextResponse.next();
  }

  // Check cookie
  if (req.cookies.get("veil_access")?.value === ACCESS_KEY) {
    return NextResponse.next();
  }

  // Check query param ?key=xxx (sets cookie and redirects clean)
  const key = req.nextUrl.searchParams.get("key");
  if (key === ACCESS_KEY) {
    const url = req.nextUrl.clone();
    url.searchParams.delete("key");
    const res = NextResponse.redirect(url);
    res.cookies.set("veil_access", ACCESS_KEY, {
      httpOnly: true,
      // Local dev runs on http://localhost, so secure cookies won't persist there.
      secure: req.nextUrl.protocol === "https:",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 30, // 30 days
    });
    return res;
  }

  // Show gate page
  return new NextResponse(gatePage(), {
    status: 200,
    headers: { "Content-Type": "text/html" },
  });
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

function gatePage() {
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8"/>
<meta name="viewport" content="width=device-width,initial-scale=1"/>
<title>VEIL \u2014 Closed Alpha</title>
<style>
  *{margin:0;padding:0;box-sizing:border-box}
  body{background:#050505;color:#fff;font-family:'Space Grotesk',system-ui,sans-serif;
    display:flex;align-items:center;justify-content:center;min-height:100vh;
    overflow:hidden}
  .gate{text-align:center;max-width:380px;padding:2rem}
  .triangle{width:48px;height:48px;margin:0 auto 2rem;opacity:0.25}
  .triangle svg{width:100%;height:100%}
  h1{font-size:0.7rem;letter-spacing:0.4em;text-transform:uppercase;
    opacity:0.3;margin-bottom:2rem;font-weight:400}
  p{font-size:0.65rem;letter-spacing:0.2em;text-transform:uppercase;
    opacity:0.15;margin-bottom:2rem}
  form{display:flex;gap:8px;justify-content:center}
  input{background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.06);
    border-radius:6px;padding:10px 16px;color:#fff;font-size:0.8rem;
    font-family:inherit;letter-spacing:0.1em;outline:none;width:200px;
    transition:border-color 1.5s ease}
  input:focus{border-color:rgba(16,185,129,0.3)}
  input::placeholder{color:rgba(255,255,255,0.1)}
  button{background:rgba(16,185,129,0.08);border:1px solid rgba(16,185,129,0.15);
    border-radius:6px;padding:10px 20px;color:rgba(16,185,129,0.6);
    font-size:0.65rem;letter-spacing:0.2em;text-transform:uppercase;
    font-family:inherit;cursor:pointer;transition:all 1.5s ease}
  button:hover{background:rgba(16,185,129,0.15);color:rgba(16,185,129,0.9);
    border-color:rgba(16,185,129,0.3)}
  .err{color:rgba(239,68,68,0.5);font-size:0.6rem;margin-top:1rem;
    letter-spacing:0.1em;display:none}
</style>
</head>
<body>
<div class="gate">
  <div class="triangle"><svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M50 10 L90 85 H10 Z" stroke="rgba(16,185,129,0.3)" stroke-width="1.5"/>
  </svg></div>
  <h1>Closed Alpha</h1>
  <p>Access is restricted during development</p>
  <form method="GET" onsubmit="return go(event)">
    <input type="text" name="key" placeholder="access key" autocomplete="off" spellcheck="false"/>
    <button type="submit">Enter</button>
  </form>
  <p class="err" id="err">invalid key</p>
</div>
<script>
function go(e){
  const v=e.target.key.value.trim();
  if(!v){e.preventDefault();return false}
  return true;
}
</script>
</body>
</html>`;
}
