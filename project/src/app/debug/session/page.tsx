"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

export default function DebugSession() {
  const { data: session, status } = useSession();
  const [clientInfo, setClientInfo] = useState("");

  useEffect(() => {
    setClientInfo(`
      URL: ${window.location.href}
      Pathname: ${window.location.pathname}
      Status: ${status}
      Time: ${new Date().toISOString()}
    `);
  }, [status]);

  const handleGoToDashboard = () => {
    window.location.href = "/dashboard";
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Session Debug</h1>
      <div className="mb-4">
        <h2 className="text-xl font-semibold">Session Status</h2>
        <pre className="bg-gray-100 p-4 rounded">{status}</pre>
      </div>

      <div className="mb-4">
        <h2 className="text-xl font-semibold">Client Info</h2>
        <pre className="bg-gray-100 p-4 rounded">{clientInfo}</pre>
      </div>

      <div className="mb-4">
        <h2 className="text-xl font-semibold">Session Data</h2>
        <pre className="bg-gray-100 p-4 rounded overflow-auto max-h-96">
          {session ? JSON.stringify(session, null, 2) : "No session data"}
        </pre>
      </div>
      
      {status === "authenticated" && (
        <button
          onClick={handleGoToDashboard}
          className="mt-4 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
        >
          Continue to Dashboard
        </button>
      )}
    </div>
  );
}