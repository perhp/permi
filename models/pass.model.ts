export interface Pass {
  id: number;
  pass_start: Date;
  is_noaa: boolean;
  gain: number;
  is_meteor: boolean;
  direction: string;
  azimuth_at_max: number;
  pass_start_azimuth: number;
  max_elevation: number;
  images: { id: number; path: string }[];
}
