/** Tracks whether the background frame sequence has already finished loading
 *  this tab session, so switching between docs/products and back never
 *  re-triggers the calibration state once the frames are cached. */
const KEY = "polaris:framesReady";

export function framesAlreadyLoaded() {
  try {
    return sessionStorage.getItem(KEY) === "1";
  } catch {
    return false;
  }
}

export function markFramesLoaded() {
  try {
    sessionStorage.setItem(KEY, "1");
  } catch {
    /* private-browsing storage access can throw — non-fatal */
  }
}
