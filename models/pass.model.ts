export interface Pass {
  id: number;
  created_at: Date;
  pass_start: Date;
  daylight_pass: boolean;
  is_noaa: boolean;
  gain: number;
  has_pristine: boolean;
  has_polar_az_el: boolean;
  has_polar_direction: boolean;
  has_histogram: boolean;
  is_meteor: boolean;
  has_spectrogram: boolean;
  images: { id: number; created_at: Date; path: string }[];
}
