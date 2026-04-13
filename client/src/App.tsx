import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { AuthProvider } from "@/lib/auth";
import Home from "@/pages/Home";
import Analyse from "@/pages/Analyse";
import Results from "@/pages/Results";
import Scanner from "@/pages/Scanner";
import ScanResult from "@/pages/ScanResult";
import Search from "@/pages/Search";
import Profile from "@/pages/Profile";
import NotFound from "@/pages/not-found";

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Switch>
          <Route path="/" component={Home} />
          <Route path="/analyse" component={Analyse} />
          <Route path="/results/:id" component={Results} />
          <Route path="/scanner" component={Scanner} />
          <Route path="/scan-result" component={ScanResult} />
          <Route path="/search" component={Search} />
          <Route path="/profile" component={Profile} />
          <Route component={NotFound} />
        </Switch>
        <Toaster />
      </AuthProvider>
    </QueryClientProvider>
  );
}
