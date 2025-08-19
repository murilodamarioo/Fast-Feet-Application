import * as NodeGeocoder from "node-geocoder"

const options: NodeGeocoder.Options = {
  provider: "openstreetmap",
  language: "pt",
}

const geocoder = (NodeGeocoder as any).default
  ? (NodeGeocoder as any).default(options)
  : (NodeGeocoder as any)(options)

export default geocoder
