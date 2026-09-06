import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/auth";

import { getHackerApplicationByUserId } from "@/lib/db/queries/application";
import { Input } from "@/components/ui/input";
import PageWrapper from "@/components/PageWrapper";

export const metadata: Metadata = {
  title: "Team Application - Apply to Hack Canada",
  description: "Submit your Hack Canada team application.",
};

const TeamApplicationPage = async () => {
  const currentUser = await getCurrentUser();

  if (!currentUser || !currentUser.id) {
    redirect("/sign-in");
  }

  const application = await getHackerApplicationByUserId(currentUser.id);

  // Only accessible when applying as a team
  if (!application?.isTeam) {
    redirect("/applications");
  }

  return (
    <PageWrapper>
      <div className="mx-auto w-full max-w-4xl space-y-4">
        <h1 className="text-2xl font-semibold text-white">Team Application</h1>
        <p className="text-white/50">
          Team questions are coming soon. This section is a placeholder for now.
        </p>
        {/* Placeholder field — not yet wired to the database */}
        <Input placeholder="Team name (coming soon)" disabled />
      </div>
    </PageWrapper>
  );
};

export default TeamApplicationPage;
