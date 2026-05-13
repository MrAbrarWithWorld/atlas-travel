import { redirect } from "next/navigation";

// Homepage — redirect to the blog for now.
// The main app (trip planner) will be wired up in Phase 2.
export default function HomePage() {
  redirect("/blog");
}
