import { ShieldAlert, Phone, Siren, Flame, Truck, HeartPulse, AlertTriangle } from "lucide-react";

export function EmergencyInfoPage() {
  const safety = {
    before: [
      "Avoid building near unstable slopes, drainage ways, or natural erosion valleys.",
      "Monitor official weather warnings and landslide advisories.",
      "Keep emergency supplies ready: water, food, first-aid kit, flashlight, radio.",
      "Learn to recognize landslide warning signs: cracks in ground, doors sticking, tilting trees.",
    ],
    during: [
      "Move away from the landslide path quickly. Move to the nearest stable ground.",
      "Follow official evacuation instructions immediately.",
      "Do not cross active landslide areas or flowing water.",
      "If escape is impossible, curl into a tight ball and protect your head.",
    ],
    after: [
      "Stay away from affected slopes — secondary landslides can occur.",
      "Avoid damaged roads, bridges, and structures.",
      "Report broken utility lines to authorities immediately.",
      "Follow official emergency instructions. Do not return until cleared.",
    ],
  };

  const contacts = [
    { icon: Phone, label: "Local Emergency Number", value: "Add your local emergency number" },
    { icon: Siren, label: "Police", value: "Add local police number" },
    { icon: Flame, label: "Fire & Rescue", value: "Add local fire rescue number" },
    { icon: Truck, label: "District Disaster Management", value: "Add DDM number" },
    { icon: HeartPulse, label: "Ambulance", value: "Add local ambulance number" },
  ];

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-2xl font-bold text-slate-100 flex items-center gap-2">
          <ShieldAlert className="text-cyan-400" /> Landslide Safety Information
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          This information is available offline. Bookmark or install the app for emergency access.
        </p>
      </div>

      {/* Safety steps */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <SafetyCard
          title="Before"
          color="text-cyan-400"
          borderColor="border-cyan-500/30"
          items={safety.before}
        />
        <SafetyCard
          title="During"
          color="text-orange-400"
          borderColor="border-orange-500/30"
          items={safety.during}
        />
        <SafetyCard
          title="After"
          color="text-emerald-400"
          borderColor="border-emerald-500/30"
          items={safety.after}
        />
      </div>

      {/* Emergency contacts */}
      <section className="rounded-xl border border-slate-800 bg-slate-900/60 p-5">
        <h2 className="text-sm font-semibold text-slate-300 mb-4 flex items-center gap-2">
          <Phone size={16} className="text-cyan-400" /> Emergency Contacts
        </h2>
        <div className="space-y-3">
          {contacts.map((c) => {
            const Icon = c.icon;
            return (
              <div key={c.label} className="flex items-center gap-3 p-3 rounded-lg bg-slate-800/40">
                <Icon size={18} className="text-slate-500 shrink-0" />
                <div className="min-w-0">
                  <div className="text-sm font-medium text-slate-200">{c.label}</div>
                  <div className="text-xs text-slate-500">{c.value}</div>
                </div>
              </div>
            );
          })}
        </div>
        <div className="mt-4 p-3 rounded-lg bg-yellow-500/10 border border-yellow-500/20">
          <p className="text-xs text-yellow-400 flex items-start gap-2">
            <AlertTriangle size={14} className="shrink-0 mt-0.5" />
            These are placeholders. Add your local emergency numbers before relying on this information.
            National emergency helpline in India: 112.
          </p>
        </div>
      </section>

      {/* Real-world limitation */}
      <section className="rounded-xl border border-yellow-500/20 bg-yellow-500/5 p-5">
        <h2 className="text-sm font-semibold text-yellow-400 mb-2 flex items-center gap-2">
          <AlertTriangle size={16} /> Important Limitation
        </h2>
        <p className="text-sm text-slate-400 leading-relaxed">
          LANDGUARD requires a network or cellular communication channel to deliver a new remote alert.
          Offline mode allows users to access previously cached warnings and safety information.
          SMS/cellular emergency delivery requires a connected telecom/SMS service.
          A website cannot send a completely new notification to a phone that has absolutely no communication connectivity.
        </p>
      </section>
    </div>
  );
}

function SafetyCard({
  title,
  color,
  borderColor,
  items,
}: {
  title: string;
  color: string;
  borderColor: string;
  items: string[];
}) {
  return (
    <div className={`rounded-xl border ${borderColor} bg-slate-900/60 p-4`}>
      <h3 className={`text-sm font-bold ${color} mb-3`}>{title}</h3>
      <ul className="space-y-2">
        {items.map((item, i) => (
          <li key={i} className="text-xs text-slate-400 leading-relaxed flex items-start gap-2">
            <span className={`shrink-0 ${color} font-bold`}>•</span>
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
