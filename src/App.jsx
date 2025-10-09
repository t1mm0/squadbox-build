import React from "react";

/**
 * Replace these image URLs with your final bot renders.
 * You can use local files in /public and reference with "/bots/pm.png" etc.
 */
const BOT = {
  pm: "/images/bots/project-manager.png",
  dev: "/images/bots/buiilder-bot.png", // Assuming buiilder-bot.png is the developer bot image from previous context
  privacy: "/images/bots/data-police-bot.png", // Assuming data-police-bot.png is the privacy bot image from previous context
  builder: "/images/bots/deisgnger-bot.png", // Assuming deisgnger-bot.png is the builder bot image from previous context
  designer: "/images/bots/deisgnger-bot.png", // Re-using designer bot image as the brief also mentions builder bot
  rocket: "/images/bots/deployment-bot.png" // Re-using deployment-bot for rocket image since there is no rocket-card.png
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
        <AgentCard img={BOT.builder} label="Builder Bot" labelColor="bg-amber-400/20 text-amber-200" />
        <AgentCard img={BOT.pm} label="Project Manager" labelColor="bg-fuchsia-400/20 text-fuchsia-200" />
        <AgentCard img={BOT.designer} label="UI/UX Designer Bot" labelColor="bg-purple-400/20 text-purple-200" />
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
