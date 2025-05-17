import Header from "./components/Header";
import Body from "./components/Body";
import Footer from "./components/Footer";
// import StaffDiscord from "./components/Dashboard/StaffDiscord";
// import Dashboard from "./components/Dashboard/Dashboard";
// import DailyItens from "./components/Dashboard/DailyItem";
import ParticlesBackground from "./components/Particles";
import "./App.css";
import { AuthProvider } from "./contexts/AuthContext";

function App() {
  return (
    <AuthProvider>
      <div className="font-poppins bg-gray-900 text-white bg-cover bg-fixed bg-center min-h-screen relative">
        {/* Background */}
        <div className="fixed inset-0 z-0">
          <img
            src="/images/background.png"
            alt="Background"
            className="w-full h-full object-cover blur-sm opacity-30"
          />
          <ParticlesBackground />
        </div>

        {/* Conteúdo principal */}
        <div className="relative z-10">
          <Header />
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
            <Body />

            {/* <DailyItens /> */}
            {/* <Dashboard /> */}
            {/* <StaffDiscord /> */}
          </div>
          <Footer />
        </div>
      </div>
    </AuthProvider>
  );
}

export default App;
