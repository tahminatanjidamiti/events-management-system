import { getUserSession } from "@/helpers/getUserSession";
import Image from "next/image";

export default async function Profile() {

  const session = await getUserSession();

  return (
    <div className="min-h-screen flex flex-col justify-center items-center p-1 md:p-6 w-full">
      {(session?.user?.picture) &&
        <Image className="rounded-4xl border-2 border-yellow-700" width={100}
          height={100} src={session?.user?.picture} alt="Profile Picture"></Image>}
      <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-linear-to-r from-gray-700 from-5% via-amber-500 to-gray-700 mb-4">
        Welcome, {session?.user?.fullName}!
      </h1>
      <p className="text-lg text-center">
        Email: <span className="italic">{session?.user?.email}</span>
      </p>
      {(session?.user?.phone) &&<p className="text-center">
        Phone: <span className="italic">{session?.user?.phone}</span>
      </p>}
      <p className="font-bold text-center">Role: <span className="text-yellow-700 italic">{session?.user?.role}</span></p>
      <p className="text-center">Status: <span className="text-green-700 italic">{session?.user?.status}</span></p>
      {session?.user?.isVerified === true && (
        <p className="text-center">
          Verified: ☑️
        </p>
      )}
      {(session?.user?.bio) &&<p className="text-center">Bio: <span className="text-gray-700 italic">{session?.user?.bio}</span></p>}
    </div>
  );
};
