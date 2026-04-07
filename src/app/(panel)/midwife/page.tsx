import Navbar from "./components/Navbar"
import TopBar from "./dashboard/TopBar"
import WelcomeHeaderCard from "./dashboard/WelcomeHeaderCard"
import DashboardFeatures from "./dashboard/DashboardFeatures"
import ManagementCards from "./dashboard/ManagementCard"

export default function MidwifeDashboardPage() {
  return (
      <div className="min-h-screen bg-[#000000] text-white">
          <Navbar />
          <WelcomeHeaderCard />
          <TopBar />
          <ManagementCards />
          <DashboardFeatures />
      </div>
  )
}