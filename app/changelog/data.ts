// 02_Website/Marketing Website/tuneview-web/app/changelog/data.ts
//
// Public changelog. Written for tuners, not developers.
// User-visible changes land in `userFacing`; infrastructure / security
// work lives under `behindTheScenes` so it's visible but not front-page.
//
// NOTE: This file is duplicated from 06_App/Frontend/app/changelog/data.ts.
// Planned consolidation into a shared package; keep them in sync manually
// until that lands.

export type ChangelogTag = "Security" | "Infrastructure" | "Product" | "AI";

export type ChangelogItem = {
  title: string;
  tags: ChangelogTag[];
  description: string;
};

export type ChangelogEntry = {
  version: string;
  date: string;          // ISO "YYYY-MM-DD"
  summary?: string;      // one-line release lede
  userFacing: ChangelogItem[];
  behindTheScenes: ChangelogItem[];
};

export const CHANGELOG: ChangelogEntry[] = [
  {
    version: "0.3.0",
    date: "2026-04-19",
    summary:
      "Log upload accepts real HPT files. Fuel-pressure analysis finally works on Gen 5 DI. Adding a vehicle actually flows into the upload. Three silent failures, three fixes.",
    userFacing: [
      {
        title: "Log upload accepts real HPTuners logs",
        tags: ["Product"],
        description:
          "The validator was rejecting every real VCM Scanner CSV because the check read the first line of the file expecting column headers — but HPT logs have a 9-line preamble ('HP Tuners CSV Log File', version, [Log Information], [Channel Information], channel IDs) before the real header row at line 10. We were failing your file in ~5 milliseconds without looking at what was in it. Now the validator uses the same header-detection logic the pipeline uses (parser.detect_structure), which has always known about the preamble. A file that produces a real report in the pipeline will now always pass the upload gate — there's only one answer to 'is this an HPT log' across the whole codebase.",
      },
      {
        title: "Fuel pressure analysis — now working on Gen 5 DI",
        tags: ["Product"],
        description:
          "Gen 5 DI engines report fuel rail pressure in MPa (values 2-17). The unit detector in the fuel-pressure module only knew kPa vs psi, so every MPa log fell into the psi branch, applied a 500-psi pairing threshold, and produced zero paired samples. Net effect: the fuel-pressure module was silently returning 'not enough data' on every single Gen 5 DI log — even WOT pulls that clearly showed HPFP capacity limits. MPa is now a first-class branch. On a quick local check, one previously-empty log went from 0 paired samples to 237 pairs plus 39 sustained HPFP capacity events totaling 55.9 seconds of >250 psi tracking error. If your pump is at its limit, you'll see it now.",
      },
      {
        title: "Vehicle picker actually sees your builds",
        tags: ["Product"],
        description:
          "Two bugs coupled together. First: the 'Add Vehicle' form was writing to the vehicles table, but the upload page's vehicle dropdown reads from vehicle_profiles — two different tables, no cross-reference. Adding a vehicle did nothing for the upload flow. Second: the /upload endpoint wasn't even declaring vehicle_profile_id in its form signature, so FastAPI silently dropped the field when the frontend sent it. Even if you picked a pre-existing profile, the case row wouldn't bind to it. Both fixed — adding a vehicle now puts it in the dropdown, selecting it on upload binds cases.vehicle_profile_id to the build, and the case history page can finally group logs by vehicle correctly.",
      },
      {
        title: "Changelog page live",
        tags: ["Product"],
        description:
          "What you're reading now. Same entries on both app.tuneview.io/changelog and tuneview.io/changelog — no signup required, no gating, just what shipped and why.",
      },
    ],
    behindTheScenes: [
      {
        title: "HPT log format owned by parser.py",
        tags: ["Infrastructure"],
        description:
          "The HPT log validator and the pipeline parser had diverged. The validator hand-rolled string matching against bare column names like 'Engine RPM', which real VCM Scanner files don't carry (they have 'Engine Speed (SAE) (RPM)' with unit suffixes). So even after we fixed the preamble skip, there was a second bug class: two implementations of 'what's an HPT log' getting out of sync. Solution: all format decisions — header detection, alias matching, distinctive-canonical recognition — now live in app/parsers/parser.py. The validator is a 7-line wrapper that calls parser.validate_hpt_log and turns a failed gate into an HTTP 422. A new 'Architecture Laws — Non-Negotiable' section in CLAUDE.md codifies the rule: no duplicate format logic permitted anywhere in the codebase. Duplication caused this bug. Making it non-negotiable prevents the next one.",
      },
      {
        title: "Region-aware fuel-pressure analytics",
        tags: ["Infrastructure"],
        description:
          "Lifted from a March 2026 prototype into the live fuel_pressure_tracking module. New metrics: operating-region bucketing (idle / light_cruise / moderate_load, classified by injector pulsewidth), steady-vs-transient sample stratification (so a commanded pressure ramp doesn't inflate error stats), spike counts at two thresholds (>150 psi, >250 psi abs error), sustained-high-error event detection with a 0.50-second minimum duration window (one-off noise doesn't count, sustained capacity drops do), p95 stats, and an injector pulsewidth descriptor. The module now also emits a P2 'Investigate HPFP capacity limit' recommendation when sustained events fire.",
      },
      {
        title: "Dead legacy FastAPI removed",
        tags: ["Infrastructure"],
        description:
          "scripts/api.py — an 87-line FastAPI service from March that invoked prototype modules via subprocess with a hard-coded Windows path. Had zero callers in the live app, referenced a module (torque_model/) that no longer existed, and used the same subprocess anti-pattern the current pipeline explicitly repudiated. Deleted outright.",
      },
      {
        title: "09_MODULES archived",
        tags: ["Infrastructure"],
        description:
          "The old prototype directory (fuel_delivery Python package + lambdaworx-ui Vite/React frontend) moved to 99_Archive/09_MODULES_2026-03/ after its useful parts were extracted. 106 MB of node_modules stripped before archiving; the actual code surface is now 409 KB. Historical reference preserved, workbench cleared.",
      },
      {
        title: "CLAUDE.md tracked in both repos",
        tags: ["Infrastructure"],
        description:
          "The standing brief and Architecture Laws (HPT format ownership, etc.) lived as a single local file at the root of the developer machine — not tracked in any git repo. Machine loss would have wiped it. Now mirrored as CLAUDE.md in both tuneview-backend and tuneview-frontend, each carrying a sync-warning header noting the canonical source and the other mirror. Drift prevention via script/hook tracked as technical debt.",
      },
    ],
  },
  {
    version: "0.2.0",
    date: "2026-04-19",
    summary:
      "Research companion goes live. Your log now gets matched against known field patterns — not just analyzed in isolation.",
    userFacing: [
      {
        title: "Research companion",
        tags: ["AI", "Product"],
        description:
          "Every analysis now runs through a research layer that matches your log against known Gen 5 patterns — light-load torque-model mismatches, post-change airflow instability, DI rail pressure tracking limits, cold-start flare signatures, TCC strategy conflicts, and a handful more. The layer is region-aware: it only fires a pattern if your log actually contains the operating window it applies to (low-pedal, part-throttle, idle, WOT). Cross-module correlations are surfaced as families — when spark_control + torque_model + throttle_driver_demand all move together, you get a single 'torque/airflow delivery' finding with a recommended focus region instead of three separate flags. The system also remembers confirmed fixes over time; a family that's been resolved before gets a small confidence boost on future matching logs.",
      },
      {
        title: "Password reset flow",
        tags: ["Product"],
        description:
          "The sign-in screen now has a 'Forgot password?' link that sends a reset email. If you get locked out, you recover yourself.",
      },
      {
        title: "api.tuneview.io",
        tags: ["Infrastructure"],
        description:
          "The backend now responds at api.tuneview.io instead of a generic Railway URL. No change in how the app works — but if you ever poke at network requests, everything's on one clean domain now.",
      },
    ],
    behindTheScenes: [
      {
        title: "Backend architecture consolidation",
        tags: ["Infrastructure"],
        description:
          "All Python code now lives under a single app/ package. The prior dual-layout (duplicate modules at repo root and under app/) is gone. 20 root-level dev artifacts cleared out, 5 superseded duplicates deleted, 6 services migrated into app/services/ and app/parsers/. Net effect: next time something needs changing in the pipeline, there's one place to look.",
      },
      {
        title: "Frontend structure cleanup",
        tags: ["Infrastructure"],
        description:
          "The upload page went from 1990 lines to 345 by extracting types, helpers, styles, and eight subcomponents into lib/upload/ and components/upload/. Dashboard got the same treatment: 635 → 480. Nothing changed visually. Everything got easier to change without breaking.",
      },
      {
        title: "Silent analysis bug caught and fixed",
        tags: ["AI"],
        description:
          "The kb_entry_performance view — which powers the trust-weighted ordering on KB suggestions — was silently producing zero success rates because its internal outcome-string comparisons (`'worked'` / `'did_not_work'`) never matched the real values the system actually stores (`'improved'` / `'worse'`). Been broken since it shipped. Fixed in the same migration that added the KB-entry foreign key to recommendation_feedback.",
      },
      {
        title: "Feedback flagging function fixed",
        tags: ["AI", "Security"],
        description:
          "The flag_low_trust_user routine — called after every feedback submission to catch bad-faith users — was silently no-opping in production because it was querying an admin-gated view as a service role. Rewrote it to call a dedicated SECURITY DEFINER RPC instead. It actually runs now.",
      },
      {
        title: "Security hardening",
        tags: ["Security"],
        description:
          "Seven of nine SECURITY DEFINER view advisor warnings cleared. Two more remain by design — they back admin-aggregation views that legitimately need elevated privileges. Listed as a separate item to tackle when there's an admin-bypass design.",
      },
      {
        title: "Recommendation feedback table finalized",
        tags: ["AI", "Infrastructure"],
        description:
          "Added a kb_entry_id foreign key so feedback can finally be attributed to the specific knowledge-base entry that drove a recommendation. Row-level security aligned to the Path 1 identity model. Once feedback data starts flowing, the trust-weighted KB sort will have a real signal to operate on.",
      },
    ],
  },
  {
    version: "0.1.0",
    date: "2026-04-18",
    summary:
      "Foundational beta. Upload a log, get a report, save it, come back to it.",
    userFacing: [
      {
        title: "Anonymous upload claim flow",
        tags: ["Product"],
        description:
          "Drop a log without signing up. The report is yours for 30 days via a claim token stored in your browser. Create an account anytime to save it permanently across devices.",
      },
      {
        title: "Unified app navigation",
        tags: ["Product"],
        description:
          "Dashboard, upload, verify, add-vehicle, and case detail pages now share a single top navigation. Signed-in state shows Dashboard / Upload / Add Vehicle links plus your email and a Sign Out button. Signed-out state shows a single Sign In CTA.",
      },
      {
        title: "Email confirmation lands on your dashboard",
        tags: ["Product"],
        description:
          "New account flow used to drop confirmed users on the anonymous upload page. Now you confirm your email and land directly on your authed dashboard — the 'you're in' moment the flow was missing.",
      },
      {
        title: "Case links route correctly",
        tags: ["Product"],
        description:
          "Clicking a row in the dashboard case history used to try to open a URL on the marketing site that didn't exist, so it 404'd. Now it routes to the full SSR case detail page: grade, safety, confidence, primary issue, metrics grid, module results sorted by severity, and priority-ranked revision steps.",
      },
    ],
    behindTheScenes: [
      {
        title: "User identity standardized across the platform (RLS Path 1)",
        tags: ["Security", "Infrastructure"],
        description:
          "Row-level security across 23 tables now resolves the current user's ID through a single current_app_user_id() helper. Legacy users whose auth.users.id and public.users.id diverged (from older auth flows) were reconciled, so they can see and write their own data again without any workarounds.",
      },
      {
        title: "Add-vehicle write path repaired",
        tags: ["Security"],
        description:
          "The vehicles table insert was broken by the Path 1 migration — it was writing auth.uid() into a column foreign-keyed to public.users.id. Repaired via the current_app_user_id() RPC plus a null-guard for legacy linkage edge cases.",
      },
      {
        title: "Dead API routes removed",
        tags: ["Infrastructure"],
        description:
          "Five Next.js API routes that tried to read from hardcoded Windows absolute paths (left over from an earlier dev pattern) were returning empty stubs in production, had zero frontend callers, and were adding 578 lines of noise. Deleted. Route count 14 → 9.",
      },
    ],
  },
];
