// The pass track is symmetric about its peak, so the exit azimuth is the
// entry azimuth mirrored across the azimuth at max elevation.
export function estimateExitAzimuth(
  startAzimuth: number,
  peakAzimuth: number,
) {
  return (((2 * peakAzimuth - startAzimuth) % 360) + 360) % 360;
}
