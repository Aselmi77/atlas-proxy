# Atlas web proxy

A self-hosted Scramjet browser with a Wisp networking backend, URL/search bar, browsing controls, and a Google Sites launch card. Based on Mercury Workshop's Scramjet-App: https://github.com/MercuryWorkshop/Scramjet-App . This distribution preserves its AGPL license; see LICENSE and public/credits.html.

## Run locally

Install Node.js 24 (including npm), then open a terminal in this folder:

```
corepack enable
corepack pnpm install --prod --frozen-lockfile
corepack pnpm start
```

Visit http://localhost:8080 . Localhost works without HTTPS. Alternatively run `docker compose up --build -d` and open the same address. Dependency installation requires internet access. If Corepack is unavailable, install pnpm 10.18.3 with `npm install -g pnpm@10.18.3`, then use `pnpm` in place of `corepack pnpm`.

## Host it online

Use a Node.js or Docker host supporting persistent WebSocket connections and outbound TCP. Static hosts and Google Sites cannot run this backend. Upload the entire source folder or push it to your own repository. With Docker, build the supplied Dockerfile and expose container port 8080. With Node, use the install/start commands above; PORT is configurable.

Your host must supply an HTTPS URL and forward WebSocket upgrades on `/wisp/`. Preserve `Host` and set `X-Forwarded-Proto: https` at your trusted reverse proxy. Preserve these response headers (the app already sets them):

```
Cross-Origin-Opener-Policy: same-origin
Cross-Origin-Embedder-Policy: require-corp
```

`GET /health` returns a JSON status for host health checks. Open the deployed URL directly, enter `https://example.com`, and check page navigation. Then test your intended interactive sites and video playback. Site compatibility, DRM, CAPTCHAs, logins, browser policies, and upstream blocking vary; this is not a universal compatibility guarantee.

For a personal deployment, put host-level authentication/access control in front of BOTH HTTP routes and WebSocket upgrades. This project does not include user accounts, quotas, or per-user isolation. Everyone using a shared deployment shares the server's outbound IP. Proxy content can access browser storage on its origin: use a dedicated domain without unrelated apps or secrets. The server rejects private/loopback destinations using Wisp's built-in checks and checks the browser WebSocket Origin; these checks do not replace authentication. No browsing history is deliberately stored by this app; browsers, hosting providers, and destination sites may retain data.

## Put the launch page on Google Sites

1. Deploy the proxy and copy its HTTPS URL.
2. Open GOOGLE-SITES.html in a text editor and replace `https://YOUR-PROXY-DOMAIN.example` with that URL.
3. In Google Sites, choose Insert > Embed > Embed code. Paste the HTML, choose Next, then Insert.
4. Publish your Google Site. Launch Atlas opens the proxy in its own tab, required for its browser isolation and service worker features.

Alternatively add a Google Sites Button named Launch Atlas pointing to the proxy URL. Google Sites does not relay or conceal the proxy's network traffic. School access depends on network and device rules.

## Source and license

Atlas UI modifications and the adapted server are supplied under the repository's AGPL-3.0 license. Keep LICENSE, credits, and provide the complete corresponding source (including your changes) to people using your hosted version, for example with a Source link to your public source repository. Dependency licenses are listed in the upstream credits and dependency packages. The proxy engine and network transport are installed from the pinned release/lockfile rather than bundled into this download.
