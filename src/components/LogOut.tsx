// import React from 'react'

// const logout = () => {
//   return (
//     <div>
      
//     </div>
//   )
// }

// export default logout

"use client";

import { useRouter } from "next/navigation";
import Image from "next/image";

export default function LogoulogouttButton() {
  const router = useRouter();

  const logOut = async () => {
    try {
      console.log("Logout clicked");

      const response = await fetch("/api/auth/logout", {
        method: "POST",
        credentials: "include",
      });

      if (response.ok) {
        console.log("Token removed from cookies");
        router.push("/sign-in");
      }
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return (
    <button
      onClick={logOut}
      className="flex items-center justify-center lg:justify-start gap-4 text-gray-500 py-2 md:px-2 rounded-md hover:bg-lamaSkyLight w-full mt-4"
    >
      <Image src="/logout.png" alt="Logout" width={20} height={20} />
      <span className="hidden lg:block">Logout</span>
    </button>
  );
}