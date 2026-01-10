// "use client";

// import * as Clerk from "@clerk/elements/common";
// import * as SignIn from "@clerk/elements/sign-in";
// import { useUser } from "@clerk/nextjs";
// import Image from "next/image";
// import { useRouter } from "next/navigation";
// import { useEffect } from "react";

// const LoginPage = () => {
//   const { isLoaded, isSignedIn, user } = useUser();

//   const router = useRouter();

//   useEffect(() => {
//     const role = user?.publicMetadata?.role;
//     console.log("this is user role");
//     if (role) {
//       router.push(`/${role}`);
//     }
//   }, [user, router]);

//   return (
//     <div className="h-screen flex items-center justify-center bg-lamaSkyLight">
//       <SignIn.Root>
//         <SignIn.Step
//           name="start"
//           className="bg-white p-12 rounded-md shadow-2xl flex flex-col gap-2"
//         >
//           <h1 className="text-xl font-bold flex items-center gap-2">
//             <Image src="/logo.png" alt="" width={24} height={24} />
//             SchooLama
//           </h1>
//           <h2 className="text-gray-400">Sign in to your account</h2>
//           <Clerk.GlobalError className="text-sm text-red-400" />
//           <Clerk.Field name="identifier" className="flex flex-col gap-2">
//             <Clerk.Label className="text-xs text-gray-500">
//               Username
//             </Clerk.Label>
//             <Clerk.Input
//               type="text"
//               required
//               className="p-2 rounded-md ring-1 ring-gray-300"
//             />
//             <Clerk.FieldError className="text-xs text-red-400" />
//           </Clerk.Field>
//           <Clerk.Field name="password" className="flex flex-col gap-2">
//             <Clerk.Label className="text-xs text-gray-500">
//               Password
//             </Clerk.Label>
//             <Clerk.Input
//               type="password"
//               required
//               className="p-2 rounded-md ring-1 ring-gray-300"
//             />
//             <Clerk.FieldError className="text-xs text-red-400" />
//           </Clerk.Field>
//           <SignIn.Action
//             submit
//             className="bg-blue-500 text-white my-1 rounded-md text-sm p-[10px]"
//           >
//             Sign In
//           </SignIn.Action>
//         </SignIn.Step>
//       </SignIn.Root>
//     </div>
//   );
// };

// export default LoginPage;



"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import  userProfileStore from "@/components/store/user.store";
const LoginPage = () => {
  const { setUserProfile } = userProfileStore();
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("this is request body ",JSON.stringify({ username, password }))
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include", //
      body: JSON.stringify({ username, password }),
    });
   console.log("this is login details",res);
    const data = await res.json();
 console.log("this is login data",data);
    // if (!res.ok) {
    //   setError(data.message);
    //   return;
    // }
      setUserProfile(
    data.user.name,
    data.user.email,
    data.user.role.toLowerCase(),
    data.user.id
  );
    console.log("this is new route",`/${data.user?.role.toLowerCase()}`)

    router.push(`/${data.user?.role.toLowerCase()}`);
  };




  return (
    <div className="h-screen flex items-center justify-center bg-lamaSkyLight">
      <form
        onSubmit={handleLogin}
        className="bg-white p-12 rounded-md shadow-2xl flex flex-col gap-3 w-[350px]"
      >
        <h1 className="text-xl font-bold flex items-center gap-2">
          <Image src="/logo.png" alt="" width={24} height={24} />
          SchooLama
        </h1>
        <h2 className="text-gray-400">Sign in to your account</h2>

        {error && <p className="text-red-500 text-sm">{error}</p>}

        <div className="flex flex-col gap-2">
          <label className="text-xs text-gray-500">Username</label>
          <input
            type="text"
            required
            className="p-2 rounded-md ring-1 ring-gray-300"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-xs text-gray-500">Password</label>
          <input
            type="password"
            required
            className="p-2 rounded-md ring-1 ring-gray-300"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <button
          type="submit"
          className="bg-blue-500 text-white rounded-md text-sm p-2 mt-2"
        >
          Sign In
        </button>
      </form>
    </div>
  );
};

export default LoginPage;

