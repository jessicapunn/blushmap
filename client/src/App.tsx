import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { AuthProvider } from "@/lib/auth";
import { BasketProvider } from "@/lib/basket";
import Home from "@/pages/Home";
import Analyse from "@/pages/Analyse";
import Results from "@/pages/Results";
import Scanner from "@/pages/Scanner";
import ScanResult from "@/pages/ScanResult";
import Search from "@/pages/Search";
import Profile from "@/pages/Profile";
import TryOn from "@/pages/TryOn";
import ProductDetail from "@/pages/ProductDetail";
import ColourAnalysis from "@/pages/ColourAnalysis";
import Advertise from "@/pages/Advertise";
import About from "@/pages/About";
import PrivacyPolicy from "@/pages/PrivacyPolicy";
import TermsConditions from "@/pages/TermsConditions";
import NotFound from "@/pages/not-found";

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <BasketProvider>
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
          <Toaster />
        </BasketProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}
