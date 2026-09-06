/**
 * Hackathon Phase Configuration System
 *
 * This file contains the centralized configuration for all phase-dependent
 * features in the application. Phases are automatically determined based on
 * the current date and configured date boundaries.
 */

// Phase types
export type HackathonPhase =
  | "pre-registration" // Before registration opens
  | "registration-open" // Registration is available
  | "pre-event" // Registration closed, before event starts
  | "during-event" // Event is happening
  | "post-event"; // Event concluded

// Phase dates - keep HEAD's functional dates
export const phaseDates = {
  registrationOpen: new Date("2026-02-05T00:00:00-05:00"),
  registrationClose: new Date("2026-12-31T23:59:59-05:00"),
  eventStart: new Date("2026-03-06T16:00:00-05:00"),
  eventEnd: new Date("2026-03-08T16:00:00-05:00"),
} as const;

// Phase features
export interface PhaseFeatures {
  // Authentication & Registration
  userRegistration: boolean;
  oauthSignIn: boolean;

  // Applications
  applicationSubmission: boolean;
  applicationSaving: boolean;
  applicationViewing: boolean;

  // RSVP
  rsvpAccess: boolean;
  rsvpCancellation: boolean;

  // Dashboard Components
  showApplicationStatus: boolean;
  showHackathonConclusion: boolean;
  showCountdown: boolean;
  showProjectsCard: boolean;
  showHackerPackage: boolean;
  showDiscordInvite: boolean;

  // Check-ins & QR
  qrCodeCheckIns: boolean;
  qrCodeDisplay: boolean;

  // Profile & Updates
  profileUpdates: boolean;

  // Schedule
  scheduleVisible: boolean;

  // Content Messages
  contactMessage: "pre-event" | "during-event" | "post-event";
}

export const phaseFeatures: Record<HackathonPhase, PhaseFeatures> = {
  "pre-registration": {
    userRegistration: false,
    oauthSignIn: false,
    applicationSubmission: false,
    applicationSaving: false,
    applicationViewing: true,
    rsvpAccess: false,
    rsvpCancellation: false,
    showApplicationStatus: true,
    showHackathonConclusion: false,
    showCountdown: true,
    showProjectsCard: false,
    showHackerPackage: false,
    showDiscordInvite: true,
    qrCodeCheckIns: false,
    qrCodeDisplay: false,
    profileUpdates: false,
    scheduleVisible: true,
    contactMessage: "pre-event",
  },

  "registration-open": {
    userRegistration: true,
    oauthSignIn: true,
    applicationSubmission: true,
    applicationSaving: true,
    applicationViewing: true,
    rsvpAccess: true,
    rsvpCancellation: true,
    showApplicationStatus: true,
    showHackathonConclusion: false,
    showCountdown: true,
    showProjectsCard: false,
    showHackerPackage: false,
    showDiscordInvite: true,
    qrCodeCheckIns: false,
    qrCodeDisplay: false,
    profileUpdates: true,
    scheduleVisible: true,
    contactMessage: "pre-event",
  },

  "pre-event": {
    userRegistration: true,
    oauthSignIn: true,
    applicationSubmission: false,
    applicationSaving: false,
    applicationViewing: true,
    rsvpAccess: true,
    rsvpCancellation: true,
    showApplicationStatus: true,
    showHackathonConclusion: false,
    showCountdown: true,
    showProjectsCard: false,
    showHackerPackage: true,
    showDiscordInvite: true,
    qrCodeCheckIns: false,
    qrCodeDisplay: true,
    profileUpdates: true,
    scheduleVisible: true,
    contactMessage: "pre-event",
  },

  "during-event": {
    userRegistration: true,
    oauthSignIn: true,
    applicationSubmission: false,
    applicationSaving: false,
    applicationViewing: true,
    rsvpAccess: true,
    rsvpCancellation: true,
    showApplicationStatus: true,
    showHackathonConclusion: false,
    showCountdown: false,
    showProjectsCard: false,
    showHackerPackage: true,
    showDiscordInvite: true,
    qrCodeCheckIns: true,
    qrCodeDisplay: true,
    profileUpdates: true,
    scheduleVisible: true,
    contactMessage: "during-event",
  },

  "post-event": {
    userRegistration: false,
    oauthSignIn: true,
    applicationSubmission: false,
    applicationSaving: false,
    applicationViewing: true,
    rsvpAccess: false,
    rsvpCancellation: false,
    showApplicationStatus: false,
    showHackathonConclusion: true,
    showCountdown: false,
    showProjectsCard: true,
    showHackerPackage: false,
    showDiscordInvite: true,
    qrCodeCheckIns: false,
    qrCodeDisplay: false,
    profileUpdates: false,
    scheduleVisible: true,
    contactMessage: "post-event",
  },
};

// ============================================================================
// Phase Detection Logic
// ============================================================================

export function getCurrentPhase(now: Date = new Date()): HackathonPhase {
  if (typeof process !== "undefined" && process.env.FORCE_HACKATHON_PHASE) {
    const forcedPhase = process.env.FORCE_HACKATHON_PHASE as HackathonPhase;
    if (isValidPhase(forcedPhase)) {
      return forcedPhase;
    }
  }

  const currentTime = now.getTime();

  if (currentTime < phaseDates.registrationOpen.getTime()) {
    return "pre-registration";
  }

  if (currentTime < phaseDates.registrationClose.getTime()) {
    return "registration-open";
  }

  if (currentTime < phaseDates.eventStart.getTime()) {
    return "pre-event";
  }

  if (currentTime < phaseDates.eventEnd.getTime()) {
    return "during-event";
  }

  return "post-event";
}

function isValidPhase(phase: string): phase is HackathonPhase {
  return [
    "pre-registration",
    "registration-open",
    "pre-event",
    "during-event",
    "post-event",
  ].includes(phase);
}

export function getPhaseFeatures(phase: HackathonPhase): PhaseFeatures {
  return phaseFeatures[phase];
}

export function getCurrentPhaseFeatures(): PhaseFeatures {
  const currentPhase = getCurrentPhase();
  return getPhaseFeatures(currentPhase);
}

export function isFeatureEnabled(featureName: keyof PhaseFeatures): boolean {
  const features = getCurrentPhaseFeatures();
  return features[featureName] as boolean;
}

export function isPhaseActive(...phases: HackathonPhase[]): boolean {
  const currentPhase = getCurrentPhase();
  return phases.includes(currentPhase);
}

// Helper functions
export function getApplicationDeadline(): Date {
  return phaseDates.registrationClose;
}

export function getEventDate(): Date {
  return phaseDates.eventStart;
}

export function areApplicationsOpen(): boolean {
  return isPhaseActive("registration-open");
}

export function isEventActive(): boolean {
  return isPhaseActive("during-event");
}

export function isEventConcluded(): boolean {
  return isPhaseActive("post-event");
}

export default {
  phaseDates,
  phaseFeatures,
  getCurrentPhase,
  getPhaseFeatures,
  getCurrentPhaseFeatures,
  isFeatureEnabled,
  isPhaseActive,
  getApplicationDeadline,
  getEventDate,
  areApplicationsOpen,
  isEventActive,
  isEventConcluded,
};
