export const accessControl = {
  slug: "access-control",
  title: "Access Control",
  tagline: "Who can see what, today and where it's headed.",
  sections: [
    {
      heading: "Accounts today",
      body: [
        "Every user signs in through a standard identity provider and gets an authenticated account. From there, an account is one of two kinds: a regular user, who manages their own gateways, drones, and missions, or an admin, who gets fleet-wide visibility and management across every account on the system.",
        "Admin access can only be granted through an internal setup step — there is no self-service way for an account to make itself an admin, from the dashboard or otherwise.",
      ],
    },
    {
      heading: "Where this is headed",
      body: [
        "A more granular role model — for example, distinguishing an operator who flies missions day-to-day from a planner who only designs them, or a read-only observer — is a direction being explored, but isn't implemented today. The current model is intentionally simple: regular user, or admin.",
      ],
    },
  ],
};
