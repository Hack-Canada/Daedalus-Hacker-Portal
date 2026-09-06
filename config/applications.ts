import { HandHelping, Lightbulb, LucideIcon, User, Users } from "lucide-react";

import { getApplicationDeadline, getCurrentPhase } from "./phases";

export type Application = {
  title: string;
  href: string;
  status: "open" | "closed" | "coming soon";
  disabled: boolean;
  deadline?: string;
  description: string;
  icon: LucideIcon;
};

/**
 * Formats a date as a deadline string
 */
function formatDeadline(date: Date): string {
  return date.toLocaleDateString("en-US", {
    timeZone: "America/Toronto",
    month: "long",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}

/**
 * Gets the application status based on the current phase
 */
function getApplicationStatus(): "open" | "closed" | "coming soon" {
  const phase = getCurrentPhase();

  switch (phase) {
    case "pre-registration":
      return "coming soon";
    case "registration-open":
      return "open";
    default:
      return "closed";
  }
}

/**
 * Gets all applications with phase-aware status and deadlines
 */
export function getApplications(isTeam = false): Application[] {
  const status = getApplicationStatus();
  const hackerDeadline = getApplicationDeadline();

  return [
    {
      title: "Hacker Applications",
      href: "/applications/hacker",
      status: status,
      deadline:
        status === "closed" ? undefined : formatDeadline(hackerDeadline),
      description:
        "Ready to build something awesome? Join hundreds of hackers for an unforgettable weekend!",
      icon: User,
      disabled: status !== "open",
    },
    // Only shown to applicants who opted into a team application
    ...(isTeam
      ? [
          {
            title: "Team Applications",
            href: "/applications/team",
            status: status,
            deadline:
              status === "closed" ? undefined : formatDeadline(hackerDeadline),
            description:
              "Applying with a team? Complete your team's application here.",
            icon: Users,
            disabled: status !== "open",
          } as Application,
        ]
      : []),
    {
      title: "Mentor & Judge Applications",
      href: "https://forms.gle/tUCGaGi5HgHGQtKD9",
      status: "closed",
      deadline: "March 2nd (11:59:59 PM), 2026",
      description:
        // for mentors and judges,
        "Share your wisdom and help hackers bring their ideas to life! 💡",
      icon: Lightbulb,
      disabled: true,
    },
    // {
    //   title: "Judge Applications",
    //   href: "https://docs.google.com/forms/d/e/1FAIpQLScCS76RX3C1AvGGFOQ5J69XpoYb6rvdYQ-B0aYxS_GLaf4jmQ/viewform?usp=sf_link",
    //   status: "coming soon",
    //   description:
    //     "Help crown the champions and discover the next big thing! ⚖️",
    //   deadline: "February 28th (11:59:59 PM), 2026",
    //   icon: Gavel,
    //   disabled: true,
    // },
    {
      title: "Volunteer Applications",
      href: "https://forms.gle/QyHgyzaiAELfNN4Q6",
      status: "closed",
      description:
        "Help us run an amazing event and make a difference behind the scenes!",
      deadline: "March 2nd (11:59:59 PM), 2026",
      icon: HandHelping,
      disabled: true,
    },
  ];
}

// Export a static list for backwards compatibility (will be phase-aware when called)
export const applications = getApplications();
