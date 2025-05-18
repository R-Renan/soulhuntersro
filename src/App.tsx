import { BrowserRouter, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import PodiumRank from "./components/Dashboard/PodiumRank";
import StaffDiscord from "./components/Dashboard/StaffDiscord";
import VideoPlayer from "./components/Dashboard/VideoPlayer";
import Dashboard from "./components/Dashboard/Dashboard";
import DailyItens from "./components/Dashboard/DailyItem";
import GuidePage from "./components/GuidePage";
import ParticlesBackground from "./components/Particles";
import "./App.css";
import { useAuth } from "./contexts/AuthContext";
import Body from "./components/Body";
import AuthModal from "./components/modals/AuthModal";
import { useState } from "react";

function MainPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 flex flex-col md:flex-row gap-6">
      <div className="flex-1 space-y-8">
        <Body />
        <PodiumRank
          redTeamRoleId="1125850152075276379"
          blueTeamRoleId="1372398594119827486"
          serverId="1125412537308024904"
        />
        <VideoPlayer
          videoUrl="/images/hvsh/hvsh17052025.mp4"
          posterUrl="/images/hvsh/bg.png"
          title="Destaque da Semana"
        />
        <DailyItens />
        <Dashboard />
        <StaffDiscord />
      </div>
    </div>
  );
}

function GuidePageLayout() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 flex flex-col md:flex-row gap-6">
      <div className="flex-1">
        <GuidePage /> {/* Apenas GuidePage, sem Body */}
      </div>
    </div>
  );
}

function App() {
  const { isLoggedIn, isAuthLoading } = useAuth();
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  return (
    <BrowserRouter>
      <div className="font-poppins bg-gray-900 text-white bg-cover bg-fixed bg-center min-h-screen relative">
        <div className="fixed inset-0 z-0">
          <img
            src="/images/background.png"
            alt="Background"
            className="w-full h-full object-cover blur-sm opacity-30"
          />
          <ParticlesBackground />
        </div>
        <div className="relative z-10">
          <Header />
          {!isAuthLoading && !isLoggedIn && <Body />}
          {!isAuthLoading && !isLoggedIn && (
            <div className="max-w-7xl mx-auto px-3 sm:px-4 py-4 flex justify-center">
              <div className="bg-cyan-950/20 border border-cyan-400/50 rounded-lg p-3 sm:p-4 flex flex-col items-center text-center shadow hover:shadow-cyan-500/20 transition-transform hover:scale-105 mx-auto">
                <h2 className="text-lg sm:text-xl font-bold text-cyan-100 mb-2">
                  Faça login para ter acesso
                </h2>
                <button
                  onClick={() => setIsAuthModalOpen(true)}
                  className="px-3 sm:px-4 py-1 sm:py-2 bg-gradient-to-r from-cyan-600/50 to-cyan-500/50 border border-cyan-400/30 text-cyan-100 rounded-lg text-xs sm:text-sm hover:from-cyan-500/60 hover:to-cyan-400/60 transition-all duration-300 shadow-md hover:shadow-cyan-500/40 hover:scale-105"
                >
                  Entrar
                </button>
              </div>
            </div>
          )}
          <div
            className={
              isAuthLoading || !isLoggedIn
                ? "filter blur-lg transition-all duration-300"
                : ""
            }
          >
            <Routes>
              <Route path="/" element={<MainPage />} />
              <Route path="/guides/:channelID" element={<GuidePageLayout />} />
            </Routes>
          </div>
          <Footer />
          <AuthModal
            isOpen={isAuthModalOpen}
            onClose={() => setIsAuthModalOpen(false)}
            initialMode="login"
          />
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;
