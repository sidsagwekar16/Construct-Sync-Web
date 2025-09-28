import { useState, useCallback, useMemo, useEffect } from 'react';
import { GoogleMap, useJsApiLoader, Marker, InfoWindow, TrafficLayer } from '@react-google-maps/api';
import { Job } from '@/shared/schema';
import { Link } from 'wouter';
import { Button } from '@/components/ui/button';

// Use centralized Google Maps libraries configuration
import { googleMapsLibraries } from '@/lib/googleMapsLibraries';

interface JobMapViewProps {
  jobs: Job[];
  className?: string;
  onSelectLocation?: (address: string) => void;
  showTraffic?: boolean;
}

const containerStyle = {
  width: '100%',
  height: '100%',
  minHeight: '350px',
  borderRadius: '0.5rem'
};

// Default center to Auckland, New Zealand if no jobs are available
const DEFAULT_CENTER = {
  lat: -36.8509, // Auckland
  lng: 174.7645
};

export function JobMapView({ jobs, className, onSelectLocation, showTraffic = false }: JobMapViewProps) {
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [showLegend, setShowLegend] = useState<boolean>(false);
  const [mapType, setMapType] = useState<'roadmap' | 'satellite'>('roadmap');
  const [mapRef, setMapRef] = useState<google.maps.Map | null>(null);
  
  const { isLoaded } = useJsApiLoader({
    id: 'google-maps-script',
    googleMapsApiKey: 'AIzaSyArKmiJ4LZ8F46FLbpDTj8GSAhYU8KM0Pc',
    libraries: googleMapsLibraries,
    preventGoogleFontsLoading: true,
  });

  // Function to fit bounds to all jobs
  const fitBoundsToJobs = useCallback((map: google.maps.Map) => {
    if (jobs.length > 0 && jobs.some(job => job.latitude && job.longitude)) {
      const bounds = new google.maps.LatLngBounds();
      
      jobs.forEach(job => {
        if (job.latitude && job.longitude) {
          bounds.extend({
            lat: job.latitude,
            lng: job.longitude
          });
        }
      });
      
      map.fitBounds(bounds);
      
      // Don't zoom in too far
      const listener = google.maps.event.addListener(map, 'idle', () => {
        const zoom = map.getZoom();
        if (zoom !== undefined && zoom > 15) {
          map.setZoom(15);
        }
        google.maps.event.removeListener(listener);
      });
    }
  }, [jobs]);

  const onLoad = useCallback((map: google.maps.Map) => {
    setMapRef(map);
    fitBoundsToJobs(map);
  }, [fitBoundsToJobs]);

  // Re-fit bounds when jobs data changes (e.g., when switching between status filters)
  useEffect(() => {
    if (mapRef) {
      fitBoundsToJobs(mapRef);
    }
  }, [jobs, mapRef, fitBoundsToJobs]);

  const onUnmount = useCallback(() => {
    setMapRef(null);
  }, []);

  // Function to toggle between roadmap and satellite view
  const toggleMapType = useCallback(() => {
    const newMapType = mapType === 'roadmap' ? 'satellite' : 'roadmap';
    setMapType(newMapType);
    
    if (mapRef) {
      mapRef.setMapTypeId(
        newMapType === 'satellite' 
          ? google.maps.MapTypeId.SATELLITE 
          : google.maps.MapTypeId.ROADMAP
      );
    }
  }, [mapType, mapRef]);

  // Calculate center based on available job locations
  const center = useMemo(() => {
    if (jobs.length === 0 || !jobs.some(job => job.latitude && job.longitude)) {
      return DEFAULT_CENTER;
    }

    // Find the average of all job locations
    let totalLat = 0;
    let totalLng = 0;
    let count = 0;

    jobs.forEach(job => {
      if (job.latitude && job.longitude) {
        totalLat += job.latitude;
        totalLng += job.longitude;
        count++;
      }
    });

    if (count === 0) return DEFAULT_CENTER;

    return {
      lat: totalLat / count,
      lng: totalLng / count
    };
  }, [jobs]);

  // Generate different marker colors based on job status
  const getMarkerIcon = (status: string) => {
    switch(status) {
      case 'in_progress':
        return 'http://maps.google.com/mapfiles/ms/icons/blue-dot.png';
      case 'completed':
        return 'http://maps.google.com/mapfiles/ms/icons/green-dot.png';
      case 'scheduled':
        return 'http://maps.google.com/mapfiles/ms/icons/yellow-dot.png';
      case 'issue':
        return 'http://maps.google.com/mapfiles/ms/icons/red-dot.png';
      default:
        return 'http://maps.google.com/mapfiles/ms/icons/orange-dot.png';
    }
  };

  if (!isLoaded) {
    return (
      <div className={`flex items-center justify-center bg-gray-100 rounded-lg ${className || 'h-[350px]'}`}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Loading map...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`relative ${className || 'h-[350px]'}`}>
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={center}
        zoom={10}
        onLoad={onLoad}
        onUnmount={onUnmount}
        options={{
          fullscreenControl: false,
          mapTypeControl: false,
          streetViewControl: false,
          mapTypeId: mapType === 'satellite' ? google.maps.MapTypeId.SATELLITE : google.maps.MapTypeId.ROADMAP,
          gestureHandling: 'cooperative',
          clickableIcons: false,
          styles: [
            {
              featureType: 'poi',
              elementType: 'labels',
              stylers: [{ visibility: 'off' }]
            }
          ]
        }}
      >
        {jobs.map(job => {
          if (!job.latitude || !job.longitude) return null;
          
          return (
            <Marker
              key={job.id}
              position={{
                lat: job.latitude,
                lng: job.longitude
              }}
              onClick={() => {
                setSelectedJob(job);
                // Call the onSelectLocation prop when a job is selected
                if (onSelectLocation && job.address) {
                  onSelectLocation(job.address);
                }
              }}
              icon={{
                url: getMarkerIcon(job.status),
                scaledSize: new google.maps.Size(32, 32)
              }}
              animation={google.maps.Animation.DROP}
            />
          );
        })}

        {selectedJob && selectedJob.latitude && selectedJob.longitude && (
          <InfoWindow
            position={{
              lat: selectedJob.latitude,
              lng: selectedJob.longitude
            }}
            onCloseClick={() => setSelectedJob(null)}
            options={{
              pixelOffset: new google.maps.Size(0, -10),
            }}
          >
            <div className="p-4 max-w-[300px] bg-white rounded-lg shadow-xl border-2 border-gray-300">
              <h3 className="font-bold text-gray-900 mb-2 text-base">{selectedJob.jobType} - {selectedJob.clientName}</h3>
              <p className="text-sm text-gray-800 mb-3 leading-relaxed">{selectedJob.address}</p>
              <div className="flex items-center justify-between">
                <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                  selectedJob.status === 'completed' ? 'bg-emerald-100 text-emerald-800' :
                  selectedJob.status === 'in_progress' ? 'bg-blue-100 text-blue-800' :
                  selectedJob.status === 'scheduled' ? 'bg-amber-100 text-amber-800' :
                  selectedJob.status === 'issue' ? 'bg-rose-100 text-rose-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {selectedJob.status.replace('_', ' ')}
                </span>
                <Link href={`/jobs/${selectedJob.id}`}>
                  <span className="text-xs text-blue-600 hover:text-blue-800 font-medium cursor-pointer">
                    View Details →
                  </span>
                </Link>
              </div>
            </div>
          </InfoWindow>
        )}
        
        {/* Show traffic layer when requested */}
        {showTraffic && <TrafficLayer />}
      </GoogleMap>

      {/* Map type toggle button */}
      {mapRef && (
        <div className="absolute top-3 right-3">
          <Button 
            variant="outline" 
            size="sm" 
            className="bg-white/90 backdrop-blur-sm text-xs px-3 py-1 h-8 shadow-sm hover:bg-white"
            onClick={toggleMapType}
          >
            {mapType === 'roadmap' ? 'Satellite' : 'Map'}
          </Button>
        </div>
      )}

      {/* Legend Button */}
      <button 
        onClick={() => setShowLegend(!showLegend)}
        className="absolute bottom-3 left-3 bg-white rounded-md shadow-md p-2 h-8 flex items-center text-xs hover:bg-gray-50"
      >
        {showLegend ? "Hide Legend" : "Job Status"}
      </button>
      
      {/* Expandable Legend */}
      {showLegend && (
        <div className="absolute bottom-12 left-3 bg-white rounded-md shadow-md p-2 flex flex-col gap-1 max-w-[140px]">
          <div className="flex justify-between">
            <p className="text-xs font-medium">Job Status</p>
            <button 
              onClick={() => setShowLegend(false)}
              className="text-xs text-gray-500 hover:text-gray-700"
            >
              ✕
            </button>
          </div>
          
          <div className="grid grid-cols-1 gap-1">
            <div className="flex items-center">
              <div className="w-2 h-2 rounded-full bg-blue-500 mr-1"></div>
              <span className="text-xs">In Progress</span>
            </div>
            <div className="flex items-center">
              <div className="w-2 h-2 rounded-full bg-green-500 mr-1"></div>
              <span className="text-xs">Completed</span>
            </div>
            <div className="flex items-center">
              <div className="w-2 h-2 rounded-full bg-yellow-500 mr-1"></div>
              <span className="text-xs">Scheduled</span>
            </div>
            <div className="flex items-center">
              <div className="w-2 h-2 rounded-full bg-red-500 mr-1"></div>
              <span className="text-xs">Issue</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}