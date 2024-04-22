export const passQuery = `id, created_at, pass_start, daylight_pass, is_noaa, 
    gain, has_pristine, has_polar_az_el, has_polar_direction, 
    has_histogram, is_meteor, has_spectrogram, max_elevation, 
    direction, azimuth_at_max, pass_end, pass_start_azimuth,
    images:passes_images(id, created_at, path)`;
