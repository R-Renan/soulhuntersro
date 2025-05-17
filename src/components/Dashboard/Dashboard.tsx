import React, { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import DiscordFeed from "./DiscordFeed";
import Notices from "./Notice";
import Sidebar from "./Sidebar";

const Dashboard: React.FC = () => {
  useEffect(() => {
    AOS.init({ once: true, duration: 800, easing: "ease-out" });
  }, []);

  return (
    <div className="mb-6 sm:mb-8 max-w-7xl mx-auto">
      <div
        className="grid grid-cols-1 lg:grid-cols-12 gap-4"
        data-aos="fade-up"
      >
        <div className="lg:col-span-9 space-y-4">
          <div>
            <DiscordFeed />
          </div>
          <div data-aos="fade-up" data-aos-delay="200">
            <Notices />
          </div>
        </div>

        <aside
          className="lg:col-span-3 w-full"
          data-aos="fade-left"
          data-aos-delay="400"
        >
          <Sidebar />
        </aside>
      </div>
    </div>
  );
};

export default Dashboard;
