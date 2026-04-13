import { Switch, Route, Router } from "wouter";
import { useHashLocation } from "wouter/use-hash-location";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";
import { Toaster } from "@/components/ui/toaster";
import Home from "@/pages/Home";
import Analyse from "@/pages/Analyse";
import Results from "@/pages/Results";
import Scanner from "@/pages/Scanner";
import ScanResult from "@/pages/ScanResult";
import Search from "@/pages/Search";
import NotFound from "@/pages/not-found";

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router hook={useHashLocation}>
        <Switch>
          <Route path="/" component={Home} />
          <Route path="/analyse" component={Analyse} />
          <Route path="/results/:id" component={Results} />
          <Route path="/scanner" component={Scanner} />
          <Route path="/scan-result" component={ScanResult} />
          <Route path="/search" component={Search} />
          <Route component={NotFound} />
        </Switch>
      </Router>
      <Toaster />
    </QueryClientProvider>
  );
}
