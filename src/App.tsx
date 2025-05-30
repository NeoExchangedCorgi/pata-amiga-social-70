
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { ThemeProvider } from "@/contexts/ThemeContext";
import Index from "./pages/Index";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import Profile from "./pages/Profile";
import PostDetail from "./pages/PostDetail";
import UserProfile from "./pages/UserProfile";
import Likes from "./pages/Likes";
import Marcacoes from "./pages/Marcacoes";
import History from "./pages/History";
import HiddenProfiles from "./pages/HiddenProfiles";
import DeleteProfile from "./pages/DeleteProfile";
import ReportedPosts from "./pages/ReportedPosts";
import Notifications from "./pages/Notifications";
import Search from "./pages/Search";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<SignUp />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/delete-profile" element={<DeleteProfile />} />
              <Route path="/post/:id" element={<PostDetail />} />
              <Route path="/user/:username" element={<UserProfile />} />
              <Route path="/likes" element={<Likes />} />
              <Route path="/marcacoes" element={<Marcacoes />} />
              <Route path="/history" element={<History />} />
              <Route path="/hidden" element={<HiddenProfiles />} />
              <Route path="/reported-posts" element={<ReportedPosts />} />
              <Route path="/notifications" element={<Notifications />} />
              <Route path="/search" element={<Search />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
