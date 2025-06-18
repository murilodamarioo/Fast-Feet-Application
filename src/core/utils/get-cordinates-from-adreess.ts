import geocoder from "./geocoder"

export interface Coordinate {
  latitude: number
  longitude: number
}

export async function getCoordinatesFromAddress(address: string): Promise<Coordinate | null> {
  try {
    const res = await geocoder.geocode(address)

    if (res.length === 0) return null

    if (typeof res[0].latitude !== "number" || typeof res[0].longitude !== "number") {
      return null
    }
    
    return {
      latitude: res[0].latitude,
      longitude: res[0].longitude,
    }
  } catch (err) {
    console.error('Geocoding error:', err)
    return null
  }
}
