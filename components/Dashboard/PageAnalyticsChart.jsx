import { useEffect, useState } from "react";
import {
  collection,
  getDocs,
  query,
  where,
  Timestamp,
} from "firebase/firestore";
import { db } from "@/services/firebase";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import * as UAParserLib from "ua-parser-js";
const { UAParser } = UAParserLib.default || UAParserLib;

const getDeviceType = (userAgent) => {
  const parser = new UAParser(userAgent);
  const type = parser.getDevice().type;
  if (type === "mobile") return "Mobile";
  if (type === "tablet") return "Tablet";
  if (!type) return "Desktop";
  return "Other";
};

const getOSType = (userAgent) => {
  const parser = new UAParser(userAgent);
  const os = parser.getOS().name || "Other";

  if (os.includes("iOS")) return "iOS";
  if (os.includes("iPadOS")) return "iPadOS";
  if (os.includes("Mac OS") || os.includes("Macintosh")) return "macOS";
  if (os.includes("Android")) return "Android";
  if (os.includes("Windows")) return "Windows";
  return "Other";
};

const ranges = {
  7: 7,
  15: 15,
  30: 30,
  all: 365,
};

export default function PageAnalyticsChart() {
  const [dataDevice, setDataDevice] = useState([]);
  const [dataOS, setDataOS] = useState([]);
  const [range, setRange] = useState("30");

  useEffect(() => {
    const fetchData = async () => {
      const snapshot = await getDocs(collection(db, "user_page_view"));
      const now = new Date();
      const cutoff = new Date();
      cutoff.setDate(now.getDate() - ranges[range]);

      const rawDevice = {};
      const rawOS = {};

      snapshot.forEach((doc) => {
        const { userAgent, timestamp } = doc.data();
        const dateObj = timestamp?.toDate();
        if (!dateObj || dateObj < cutoff) return;

        const date = dateObj.toISOString().split("T")[0];
        const device = getDeviceType(userAgent);
        const os = getOSType(userAgent);

        if (!rawDevice[date]) rawDevice[date] = {};
        if (!rawDevice[date][device]) rawDevice[date][device] = 0;
        rawDevice[date][device]++;

        if (!rawOS[date]) rawOS[date] = {};
        if (!rawOS[date][os]) rawOS[date][os] = 0;
        rawOS[date][os]++;
      });

      const formatChart = (obj) =>
        Object.entries(obj)
          .map(([date, counts]) => ({ date, ...counts }))
          .sort((a, b) => new Date(a.date) - new Date(b.date));

      setDataDevice(formatChart(rawDevice));
      setDataOS(formatChart(rawOS));
    };

    fetchData();
  }, [range]);

  console.log("dataOS", dataOS);

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-2">
        <label className="font-semibold text-sm">Select Time Range:</label>
        <select
          className="border rounded px-2 py-1 text-sm"
          value={range}
          onChange={(e) => setRange(e.target.value)}
        >
          <option value="7">7 days</option>
          <option value="15">15 days</option>
          <option value="30">30 days</option>
          <option value="all">All</option>
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 ml-[-10%] md:ml-0 w-full">
        <div className="w-[70vw] md:w-[30vw] h-[350px] mb-8 md:mb-0">
          <h2 className="text-md lg:text-lg font-bold mb-2">
            Page Views by Device
          </h2>
          <div className="w-full h-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={dataDevice}>
                <XAxis dataKey="date" />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="Desktop" stroke="#8884d8" />
                <Line type="monotone" dataKey="Mobile" stroke="#82ca9d" />
                <Line type="monotone" dataKey="Tablet" stroke="#ffc658" />
                <Line type="monotone" dataKey="Other" stroke="#ff7300" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="w-[70vw] md:w-[30vw] h-[350px]">
          <h2 className="text-md lg:text-lg font-bold mb-2">
            Page Views by OS
          </h2>
          <div className="w-full h-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={dataOS}>
                <XAxis dataKey="date" />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="Windows" stroke="#3366CC" />
                <Line type="monotone" dataKey="Apple" stroke="#FF3366" />
                <Line type="monotone" dataKey="Android" stroke="#00C49F" />
                <Line type="monotone" dataKey="Other" stroke="#AAAAAA" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
