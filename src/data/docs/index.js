import { overview } from "./overview";
import { architecture } from "./architecture";
import { fleetTierModel } from "./fleetTierModel";
import { missions } from "./missions";
import { telemetryFailsafe } from "./telemetryFailsafe";
import { simulation } from "./simulation";
import { gateways } from "./gateways";
import { accessControl } from "./accessControl";
import { deploymentScale } from "./deploymentScale";

/** Ordered list of every docs page — drives routing and the sidebar nav. */
export const docs = [
  overview,
  architecture,
  fleetTierModel,
  missions,
  telemetryFailsafe,
  simulation,
  gateways,
  accessControl,
  deploymentScale,
];

export const docsBySlug = Object.fromEntries(docs.map((d) => [d.slug, d]));
