import { Libraries } from '@react-google-maps/api';

// Define Google Maps libraries as a static variable to avoid reloading
// Include places library for address autocomplete and geometry for directions
export const googleMapsLibraries: Libraries = ['places', 'geometry'];