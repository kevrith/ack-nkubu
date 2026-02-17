import { MapPin, ExternalLink } from 'lucide-react';

interface EventMapProps {
  location: string;
  mapsUrl?: string;
}

export function EventMap({ location, mapsUrl }: EventMapProps) {
  const encodedLocation = encodeURIComponent(location);
  const googleMapsUrl = mapsUrl || `https://www.google.com/maps/search/?api=1&query=${encodedLocation}`;
  const embedUrl = `https://www.google.com/maps/embed/v1/place?key=YOUR_API_KEY&q=${encodedLocation}`;

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-gray-700">
          <MapPin className="h-5 w-5 text-navy" />
          <span className="font-medium">{location}</span>
        </div>
        <a
          href={googleMapsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1 text-sm text-navy hover:text-navy-600"
        >
          <span>Open in Maps</span>
          <ExternalLink className="h-4 w-4" />
        </a>
      </div>
      
      <div className="w-full h-64 bg-gray-200 rounded-lg overflow-hidden">
        <iframe
          width="100%"
          height="100%"
          frameBorder="0"
          style={{ border: 0 }}
          src={embedUrl}
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        />
      </div>
    </div>
  );
}
