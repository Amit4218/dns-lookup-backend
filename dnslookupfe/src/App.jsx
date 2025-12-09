import axios from "axios";
import { useState } from "react";

const RECORD_TYPES = [
  "A", // IPv4 Address
  "AAAA", // IPv6 Address
  "CNAME", // Canonical Name (Alias)
  "MX", // Mail Exchange
  "NS", // Name Server
  "TXT", // Text records (e.g., SPF, DKIM)
  "SRV", // Service locator
  "PTR", // Pointer (Reverse DNS)
  "SOA", // Start of Authority
  "CAA", // Certificate Authority Authorization
];

function App() {
  const [domain, setDomain] = useState("");
  const [record, setRecord] = useState("A");
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  // Use the environment variable or fall back to a default
  const API_BASE = import.meta.env.VITE_API_URL;

  /**
   * Fetches the DNS record for the specified domain and record type.
   */
  const fetchDNS = async (e) => {
    e.preventDefault(); // Prevent default form submission

    if (!domain.trim()) {
      alert("Please enter a domain");
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const url = `${API_BASE}/api/${record}/?domain=${domain.trim()}`;
      const res = await axios.get(url);

      setResult(res.data);
    } catch (err) {
      const errorMessage = "Cannot find the requested DNS Data";

      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white shadow-2xl rounded-xl p-8 max-w-lg w-full transform transition duration-500 hover:shadow-3xl">
        <h1 className="text-3xl font-extrabold mb-8 text-center text-indigo-700 tracking-tight">
          🌐 DNS Lookup Tool
        </h1>

        <form onSubmit={fetchDNS} className="space-y-5">
          <input
            type="text"
            placeholder="Enter domain (e.g., google.com)"
            className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-150 text-gray-700 placeholder-gray-400"
            value={domain}
            onChange={(e) => setDomain(e.target.value)}
          />

          <select
            className="w-full p-4 border border-gray-300 rounded-lg appearance-none bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-150 text-gray-700 cursor-pointer"
            value={record}
            onChange={(e) => setRecord(e.target.value)}
          >
            {RECORD_TYPES.map((r) => (
              <option key={r} value={r}>
                {r}
              </option>
            ))}
          </select>

          <button
            type="submit"
            className="w-full flex items-center justify-center bg-indigo-600 text-white p-4 rounded-lg font-semibold shadow-md hover:bg-indigo-700 transition duration-300 ease-in-out disabled:opacity-60 disabled:cursor-not-allowed"
            disabled={loading}
          >
            {loading ? (
              <>
                <svg
                  className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Processing...
              </>
            ) : (
              "Lookup DNS Record"
            )}
          </button>
        </form>

        {/* Error Display (More prominent) */}
        {error && (
          <div className="mt-6 p-4 bg-red-50 border border-red-300 text-red-700 rounded-lg flex items-center">
            <svg
              className="h-6 w-6 mr-3 shrink-0"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                clipRule="evenodd"
              ></path>
            </svg>
            <p className="font-medium">Error: {error}</p>
          </div>
        )}

        {/* Results Display */}
        {result && (
          <div className="mt-6">
            <h2 className="text-xl font-bold mb-3 text-gray-800 border-b pb-1">
              Lookup Result ({record} Record):
            </h2>
            <div className="bg-gray-800 shadow-inner rounded-lg p-5">
              <pre className="text-green-400 overflow-auto text-sm font-mono whitespace-pre-wrap warp-break-words">
                {JSON.stringify(result, null, 2)}
              </pre>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
