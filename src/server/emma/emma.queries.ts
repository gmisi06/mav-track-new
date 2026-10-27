// Környezeti változókból (vesszővel elválasztva, pl. "COACH,BUS"), GraphQL enum értékek.
function parseModes(value: string | undefined, fallback: string[]): string {
  const modes = (value ?? "")
    .split(",")
    .map((mode) => mode.trim().toUpperCase())
    .filter((mode) => /^[A-Z_]+$/.test(mode));
  return (modes.length ? modes : fallback).join(", ");
}

const VEHICLE_POSITIONS_MODES = parseModes(process.env.VEHICLE_POSITIONS_MODES, ["COACH"]);
const GTFS_VEHICLE_POSITIONS_MODES = parseModes(process.env.GTFS_VEHICLE_POSITIONS_MODES, ["BUS"]);

export const VEHICLE_POSITIONS_QUERY = `
    query {
        vehiclePositions (
            swLat: 45.5,
            swLon: 16.1,
            neLat: 48.7,
            neLon: 22.8,
            modes: [${VEHICLE_POSITIONS_MODES}]
        )
        {
            vehicleId
            lat
            lon
            heading
            lastUpdated
            speed
            stopRelationship {
                status
                stop {
                    id
                    gtfsId
                    name
                    lat,
                    lon
                }
                arrivalTime
            }
            trip {
                id
                gtfsId
                routeShortName
                tripHeadsign
                tripShortName
                route {
                    mode
                    longName
                    textColor
                    color
                }
                stoptimes {
                    realtimeArrival
                    scheduledArrival
                    arrivalDelay
                }
            }
        }
    }
`;

// A GTFS-rt VehiclePositions feedhez kellő mezők (azonosítók a statikus GTFS-hez).
export const GTFS_VEHICLE_POSITIONS_QUERY = `
    query {
        vehiclePositions (
            swLat: 45.5,
            swLon: 16.1,
            neLat: 48.7,
            neLon: 22.8,
            modes: [${GTFS_VEHICLE_POSITIONS_MODES}]
        )
        {
            vehicleId
            label
            lat
            lon
            heading
            lastUpdated
            speed
            stopRelationship {
                status
                stop {
                    gtfsId
                    name
                }
            }
            trip {
                gtfsId
                tripShortName
                tripHeadsign
                serviceDate
                route {
                    gtfsId
                }
            }
        }
    }
`;

export const TRIP_DETAILS_QUERY =(tripId: string, serviceDay: string) => `
    query {
        trip (
            id: "${tripId}",
            serviceDay: "${serviceDay}"
        ) 
        {
            wheelchairAccessible
            bikesAllowed
            occupancy {
                occupancyStatus
            }
            availableComfortLevels {
                placeReservation
                fromStopIndex
                tillStopIndex
                comfortLevel {
                    name
                    mandatoryPlaceReservation
                    fontCode
                }
            }
            throughCoaches {
                attachedFromStop {
                    name
                }
                attachedTillStop {
                    name
                }
                trip {
                    tripShortName
                    tripHeadsign
                }
            }
            pullingTrips {
                attachedFromStop {
                    name
                }
                attachedTillStop {
                    name
                }
                trip {
                    tripShortName
                    tripHeadsign
                }
            }
            infoServices {
                name
                fontCode
                fromStop {
                    name
                }
                tillStop {
                    name
                }
            }
            alerts {
                alertDescriptionText
            }
            stoptimes { 
                stop {
                    id
                    gtfsId
                    name
                    lat
                    lon
                    platformCode
                } 
                realtimeArrival
                realtimeDeparture
                arrivalDelay
                scheduledArrival
                scheduledDeparture    
            }
        }
    }  
`;

export const TRIP_POLYLINE_QUERY = (tripId: string, serviceDay: string) => `
    query {
        trip (
            id: "${tripId}"
            serviceDay: "${serviceDay}",
        ) 
        {
            tripGeometry {
                points
            }
        }
    }
`;
