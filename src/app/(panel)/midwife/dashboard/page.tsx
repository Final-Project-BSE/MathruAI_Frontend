import Navbar from "../components/Navbar"
import TopBar from "./components/TopBar"
import WelcomeHeaderCard from "./components/WelcomeHeaderCard"
import DashboardFeatures from "./components/DashboardFeatures"
import ManagementCards from "./components/ManagementCard"

export default function MidwifeDashboardPage() {
  return (
      <div className="bg-[#000000] text-white">
          <WelcomeHeaderCard />
          <TopBar />
          <ManagementCards />
          <DashboardFeatures />
      </div>
  )
}