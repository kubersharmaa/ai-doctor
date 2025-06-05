// pages/index.js
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
      <h1 className="text-4xl font-bold text-blue-600 mb-8 text-center">
        Select an AI Doctor
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full max-w-3xl">
        {/* Dr. Manish Jain Card */}
        <Link href="/doctor/manish">
          <div className="cursor-pointer bg-white rounded-xl shadow-lg hover:shadow-2xl transition p-6 flex flex-col items-center">
            <video
              src="/manish-avatar.mp4"
              autoPlay
              muted
              loop
              className="w-32 h-32 object-cover rounded-full mb-4 shadow-sm"
            />
            <h2 className="text-2xl font-semibold mb-2">Dr. Manish Jain</h2>
            <p className="text-gray-600 text-center">
              Gastroenterologist
              <br />
              MBBS, MD, DNB, DM Gastroenterology
            </p>
          </div>
        </Link>

        {/* Dr. Bharti Card */}
        <Link href="/doctor/bharti">
          <div className="cursor-pointer bg-white rounded-xl shadow-lg hover:shadow-2xl transition p-6 flex flex-col items-center">
            <video
              src="/doctor-avatar.mp4"
              autoPlay
              muted
              loop
              className="w-32 h-32 object-cover rounded-full mb-4 shadow-sm"
            />
            <h2 className="text-2xl font-semibold mb-2">Dr. Bharti</h2>
            <p className="text-gray-600 text-center">
              General Healthcare Practitioner
            </p>
          </div>
        </Link>
      </div>
    </div>
  );
}
