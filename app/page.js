import path from "path";
import { processData } from "../lib/parseData";
import Dashboard from "./Dashboard";

export default function Page() {
  const csvPath = path.join(process.cwd(), "data", "quotes.csv");
  const data = processData(csvPath, null); // null = all 3PLs (main dashboard)
  return <Dashboard data={data} />;
}
