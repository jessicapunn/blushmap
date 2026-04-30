import { Suspense, lazy } from "react";
import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { AuthProvider } from "@/lib/auth";
import { BasketProvider } from "@/lib/basket";

// ── Home is eager (above the fold, must be instant) ──────────────────────────
import Home from "@/pages/Home";

// ── All other pages lazy-loaded (split into separate chunks) ─────────────────
const Analyse        = lazy(() => import("@/pages/Analyse"));
const Results        = lazy(() => import("@/pages/Results"));
const Scanner        = lazy(() => import("@/pages/Scanner"));
const ScanResult     = lazy(() => import("@/pages/ScanResult"));
const Search         = lazy(() => import("@/pages/Search"));
const Profile        = lazy(() => import("@/pages/Profile"));
const TryOn          = lazy(() => import("@/pages/TryOn"));
const ProductDetail  = lazy(() => import("@/pages/ProductDetail"));
const ColourAnalysis = lazy(() => import("@/pages/ColourAnalysis"));
const Advertise      = lazy(() => import("@/pages/Advertise"));
const About          = lazy(() => import("@/pages/About"));
const PrivacyPolicy  = lazy(() => import("@/pages/PrivacyPolicy"));
const TermsConditions = lazy(() => import("@/pages/TermsConditions"));
const NotFound       = lazy(() => import("@/pages/not-found"));

// Minimal full-screen spinner shown while a lazy chunk loads
function PageLoader() {
  return (
    <div
      className="min-h-screen flex items-center justify-center"
      style={{ background: "#fff8f9" }}
    >
      <div
        className="w-10 h-10 rounded-full border-2 animate-spin"
        style={{ borderColor: "#f0ccd6", borderTopColor: "#c9506e" }}
      />
    </div>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <BasketProvider>
          <Suspense fallback={<PageLoader />}>
            <Switch>
              <Route path="/" component={Home} />
              <Route path="/analyse" component={Analyse} />
              <Route path="/results/:id" component={Results} />
              <Route path="/scanner" component={Scanner} />
              <Route path="/scan-result" component={ScanResult} />
              <Route path="/search" component={Search} />
              <Route path="/profile" component={Profile} />
              <Route path="/try-on" component={TryOn} />
              <Route path="/product/:id" component={ProductDetail} />
              <Route path="/colour-analysis" component={ColourAnalysis} />
              <Route path="/advertise" component={Advertise} />
              <Route path="/about" component={About} />
              <Route path="/privacy" component={PrivacyPolicy} />
              <Route path="/terms" component={TermsConditions} />
              <Route component={NotFound} />
            </Switch>
          </Suspense>
          <Toaster />
        </BasketProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}
