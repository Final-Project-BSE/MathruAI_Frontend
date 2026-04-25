import BirthControlPagination from "./components/BirthControlPagination";
import TopBarFeatures from "@/components/common/TopBarFeatures";
import { ShieldCheck } from "lucide-react";


export default function Page() {
  return (
      <div className="bg-[#fed2cc] min-h-screen p-4 md:p-6">
          <TopBarFeatures/>

          <div className="relative mb-6 overflow-hidden rounded-2xl bg-gradient-to-r from-[#fab0a7] to-[#d04f51] p-5 text-white shadow-lg">
        <div className="relative z-10 flex items-center gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/20 backdrop-blur">
            <ShieldCheck className="h-7 w-7 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold md:text-2xl">Birth Control Methods</h1>
            <p className="text-sm opacity-90 mt-0.5">
             Learn about different methods to plan your family with confidence        </p>
          </div>
          
        </div>
      </div>

        {/* Birth Control Section */}
        <div className="bg-gray-100 min-h-screen rounded-lg p-5">
          
          <BirthControlPagination />
        </div>

      </div>

  );
}