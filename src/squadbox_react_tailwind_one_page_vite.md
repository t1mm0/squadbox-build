# Squadbox – React + Tailwind One‑Page (Vite)

Copy/paste-ready, all files in one place. Follow the **Quick Start**, then create/replace files exactly as shown.

---

## 1) Quick Start

```bash
# create project
npm create vite@latest squadbox -- --template react
cd squadbox

# install deps
npm install
npm install -D tailwindcss postcss autoprefixer

# init tailwind
npx tailwindcss init -p

# after creating the project, replace the files with those below
npm run dev
```

> **Images:** Put your bot images in `public/bots/` and update the `BOT` object in `src/App.jsx` accordingly.

---

## 2) Files (Full Code)

### `package.json`
```json
{
  "name": "squadbox",
  "private": true,
  "version": "0.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview"
  },
  "dependencies": {
    "react": "^18.3.1",
    "react-dom": "^18.3.1"
  },
  "devDependencies": {
    "@types/react": "^18.2.66",
    "@types/react-dom": "^18.2.22",
    "autoprefixer": "^10.4.19",
    "postcss": "^8.4.38",
    "tailwindcss": "^3.4.10",
    "vite": "^5.3.4"
  }
}
```

### `tailwind.config.js`
```js
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        slatebg: "#111315",
        slatecard: "#1a1d21",
        brand: {
          50: "#e9f7ff",
          100: "#cfeeff",
          200: "#9ddcff",
          300: "#68c6ff",
          400: "#3dafff",
          500: "#0b98ff",
          600: "#0077d1",
          700: "#005aa0",
          800: "#074274",
          900: "#0b2f54"
        }
      },
      boxShadow: {
        soft: "0 8px 32px rgba(0,0,0,.45), inset 0 1px 0 rgba(255,255,255,.04)"
      },
      borderRadius: {
        "2xl": "1rem"
      }
    }
  },
  plugins: []
}
```

### `postcss.config.js`
```js
export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}
```

### `index.html`
```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
    <title>Squadbox</title>
  </head>
  <body class="bg-slatebg text-white">
    <div id="root"></div>
    <script type="module" src="/src/main.jsx"></script>
  </body>
</html>
```

### `src/main.jsx`
```jsx
import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import "./index.css";

createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
```

### `src/index.css`
```css
@tailwind base;
@tailwind components;
@tailwind utilities;

/* smooth fonts & subtle radial glow */
html, body {
  @apply bg-slatebg;
}
.gradient-ring {
  background: radial-gradient(1200px 600px at 50% -10%, rgba(59,130,246,.18), transparent 60%),
              radial-gradient(800px 400px at 10% 0%, rgba(139,92,246,.12), transparent 60%),
              radial-gradient(800px 400px at 90% 0%, rgba(16,185,129,.10), transparent 60%);
}
.badge {
  @apply text-xs font-medium px-2.5 py-1 rounded-full;
  background: linear-gradient(180deg, rgba(255,255,255,.12), rgba(255,255,255,.04));
  border: 1px solid rgba(255,255,255,.12);
  box-shadow: inset 0 0 0 1px rgba(255,255,255,.04);
}
.card {
  @apply bg-slatecard rounded-2xl shadow-soft border border-white/5;
}
.tab {
  @apply px-5 py-2 rounded-full border border-white/10 text-sm transition;
  background: linear-gradient(180deg, rgba(255,255,255,.08), rgba(0,0,0,.2));
}
.tab-active {
  @apply border-brand-400 text-white;
  box-shadow: inset 0 0 0 1px rgba(59,130,246,.5), 0 4px 18px rgba(59,130,246,.25);
}
.btn-primary {
  @apply rounded-full px-6 py-3 font-semibold transition;
  background: linear-gradient(180deg, #3dafff, #0b98ff);
  box-shadow: 0 10px 28px rgba(11,152,255,.35);
}
.btn-primary:hover { transform: translateY(-1px); }
```

### `src/App.jsx`
```jsx
import React from "react";

/**
 * Replace these image URLs with your final bot renders.
 * You can use local files in /public and reference with "/bots/pm.png" etc.
 */
const BOT = {
  pm: "https://placehold.co/480x320/14181f/ffffff?text=Project+Manager+Bot",
  dev: "https://placehold.co/480x320/151b23/ffffff?text=Developer+Bot",
  privacy: "https://placehold.co/480x320/14181f/ffffff?text=Privacy+Bot",
  builder: "https://placehold.co/480x320/151b23/ffffff?text=Builder+Bot",
  designer: "https://placehold.co/480x320/14181f/ffffff?text=UI%2FUX+Designer+Bot",
  rocket: "https://placehold.co/480x320/0b98ff/ffffff?text=Launch+in+Minutes"
};

function Logo() {
  return (
    <div className="flex items-center gap-3">
      <div className="border border-white/20 rounded-lg px-3 py-2 tracking-widest font-black text-xl">
        SQUADBOX
      </div>
    </div>
  );
}

function LoginButton() {
  return (
    <button className="flex items-center gap-2 px-4 py-2 rounded-full border border-white/10 hover:border-white/20 transition">
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
        <path d="M12 12a5 5 0 1 0-5-5 5 5 0 0 0 5 5Zm0 2c-4.418 0-8 2.239-8 5v1h16v-1c0-2.761-3.582-5-8-5Z" fill="currentColor" opacity=".9"/>
      </svg>
      <span className="text-sm">Login</span>
      <svg width="18" height="18" viewBox="0 0 24 24" className="opacity-70">
        <path d="M7 10l5 5 5-5" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round"/>
      </svg>
    </button>
  );
}

function Tabs() {
  return (
    <div className="flex gap-3">
      <button className="tab tab-active">AI Dev Squad</button>
      <button className="tab">Our Tech</button>
      <button className="tab">Pricing</button>
    </div>
  );
}

function AgentCard({ img, label, labelColor = "bg-brand-500/20 text-brand-200", children }) {
  return (
    <div className="card p-4 flex flex-col justify-end relative overflow-hidden">
      <img src={img} alt="" className="absolute inset-0 w-full h-full object-cover opacity-90 pointer-events-none" />
      <div className="absolute inset-0 bg-black/40 pointer-events-none" />
      <div className="relative">
        <span className={`badge ${labelColor}`}>{label}</span>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <div className="min-h-screen gradient-ring">
      {/* Header */}
      <header className="sticky top-0 z-10 backdrop-blur supports-[backdrop-filter]:bg-black/40">
        <div className="max-w-6xl mx-auto px-4 py-5 flex items-center justify-between">
          <Logo />
          <div className="hidden md:block">
            <Tabs />
          </div>
          <LoginButton />
        </div>
        <div className="md:hidden border-t border-white/10">
          <div className="max-w-6xl mx-auto px-4 py-3">
            <Tabs />
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="max-w-6xl mx-auto px-4 pt-8 md:pt-12">
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">
          Your Agentic Dev Squad
        </h1>
        <p className="mt-3 text-white/70 max-w-2xl">
          Meet the AI Agents that will build your app in minutes
        </p>
      </section>

      {/* Grid */}
      <section className="max-w-6xl mx-auto px-4 py-8 md:py-10 grid gap-5 md:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        <AgentCard img={BOT.pm} label="Project Manager" labelColor="bg-green-400/20 text-green-200" />
        <AgentCard img={BOT.dev} label="Developer Bot" labelColor="bg-sky-400/20 text-sky-200" />
        <AgentCard img={BOT.privacy} label="Privacy Bot" labelColor="bg-blue-400/20 text-blue-100" />
        <AgentCard img={BOT.pm} label="Project Manager" labelColor="bg-fuchsia-400/20 text-fuchsia-200" />
        <AgentCard img={BOT.designer} label="UI/UX Designer Bot" labelColor="bg-purple-400/20 text-purple-200" />
        <AgentCard img={BOT.builder} label="Builder Bot" labelColor="bg-amber-400/20 text-amber-200" />
        {/* Big CTA card */}
        <div className="card p-6 sm:col-span-2 lg:col-span-1 flex items-center justify-center relative overflow-hidden">
          <img src={BOT.rocket} alt="" className="absolute inset-0 w-full h-full object-cover opacity-20" />
          <div className="relative text-left">
            <h3 className="text-xl md:text-2xl font-bold">Launch your site in minutes!</h3>
            <p className="text-white/70 text-sm">(not months)</p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-6xl mx-auto px-4 pb-16 md:pb-24">
        <div className="text-center space-y-6">
          <div className="text-2xl md:text-3xl font-extrabold">FREE for limited time*</div>
          <div>
            <a href="#" className="btn-primary inline-flex items-center gap-2">
              Register for Beta Access
            </a>
          </div>
          <div className="text-xs text-white/60">
            *charges begin 14 days after free trial ends
          </div>
        </div>
      </section>
    </div>
  );
}
```

---

## 3) Image Replacement (Optional)
In `src/App.jsx`, swap the placeholders with local files:
```js
const BOT = {
  pm: "/bots/project-manager.png",
  dev: "/bots/developer.png",
  privacy: "/bots/privacy.png",
  builder: "/bots/builder.png",
  designer: "/bots/designer.png",
  rocket: "/bots/rocket-card.png"
};
```

---

## 4) Notes
- Tabs are visual; connect to a router if you want navigation.
- Cards, badges, and dark glass aesthetic match the provided design.
- Feel free to split components later (e.g., `components/AgentCard.jsx`).

