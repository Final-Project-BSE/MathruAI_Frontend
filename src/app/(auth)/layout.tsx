import React from "react";

import AuthWrapper from "@/components/auth/AuthWrapper";
// import { getSession } from "@/lib/authentication";
import Image from "next/image";

// import "@/public/auth-icons.css";

const AuthLayout = async ({ children }: { children: React.ReactNode }) => {
  // const session = await getSession();

  return (
    <AuthWrapper >
      <div className="max-w-screen flex flex-col md:flex-row justify-between h-full">
        <div className="w-full md:w-[71.4%] h-svh max-sm:h-full sticky right-0 top-0 flex flex-col justify-between max-lg:hidden bg-white">
          <div className="h-screen w-full max-sm:hidden relative flex overflow-hidden p-4">
            <Image
              className="object-container h-full w-full rounded-lg"
              alt="login background"
              width={2000}
              height={2000}
              src="/images/auth-bg.png"
              style={{
                // padding: "0px",
              }}
            />
          </div>
        </div>
        <div className=" w-full lg:w-[28.5%] flex justify-center items-center bg-white px-4 lg:px-[40px]">
          {children}
        </div>
      </div>
    </AuthWrapper>
  );
};

export default AuthLayout;
