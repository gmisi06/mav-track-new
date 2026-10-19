export const VEHICLE_POSITIONS_QUERY = `
    query {
        vehiclePositions (
            swLat: 45.5,
            swLon: 16.1,
            neLat: 48.7,
            neLon: 22.8,
            modes: [RAIL, RAIL_REPLACEMENT_BUS]
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
            modes: [RAIL, RAIL_REPLACEMENT_BUS]
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
