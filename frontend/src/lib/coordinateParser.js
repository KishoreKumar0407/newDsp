/**
 * parseCoordinates(input: string)
 * Pure, robust coordinate parser accepting both:
 * 1) DMS format: 9°34'03.0"N 77°40'44.8"E (handles typographic quotes/degrees: °, ', ", ′, ″, ’, ”, extra spaces)
 * 2) Decimal format: 9.5675, 77.679111 or 9.5675 77.679111
 *
 * Validates ranges: lat -90..90, lng -180..180.
 * Returns { ok: true, lat: number, lng: number, formatted: string }
 * or { ok: false, error: string }
 */
export function parseCoordinates(input) {
  if (typeof input !== 'string') {
    return { ok: false, error: 'Coordinate input must be a valid text string.' }
  }

  const raw = input.trim()
  if (!raw) {
    return { ok: false, error: 'Please enter coordinates in Decimal or DMS format.' }
  }

  // Normalize typographic variants of degree, minutes, seconds, and apostrophes
  const normalized = raw
    .replace(/[\u2032\u2019\u0060]/g, "'")    // prime, right single quote, backtick -> '
    .replace(/[\u2033\u201D\u201C]/g, '"')    // double prime, smart quotes -> "
    .replace(/[\u00BA\u02DA]/g, '°')          // masculine ordinal / ring above -> °
    .replace(/(\d)\s*deg(rees)?/gi, '$1°')
    .replace(/(\d)\s*min(utes)?/gi, "$1'")
    .replace(/(\d)\s*sec(onds)?/gi, '$1"')
    .replace(/\s+/g, ' ')
    .trim()

  // ── Strategy A: DMS Pattern ──────────────────────────────────────────
  // Matches e.g. 9° 34' 03.0" N, 77° 40' 44.8" E or 9°34'03.0"N 77°40'44.8"E
  const dmsPartRegex = /([+-]?\d+(?:\.\d+)?)\s*°(?:\s*(\d+(?:\.\d+)?)\s*')?(?:\s*(\d+(?:\.\d+)?)\s*")?\s*([NSEW])?/gi
  const dmsMatches = [...normalized.matchAll(dmsPartRegex)]

  if (dmsMatches.length >= 2) {
    const parseDmsPart = (m) => {
      const deg = parseFloat(m[1]) || 0
      const min = parseFloat(m[2]) || 0
      const sec = parseFloat(m[3]) || 0
      const hemi = (m[4] || '').toUpperCase()

      let dec = Math.abs(deg) + min / 60 + sec / 3600
      if (deg < 0 || hemi === 'S' || hemi === 'W') {
        dec = -dec
      }
      return { dec, hemi }
    }

    const p1 = parseDmsPart(dmsMatches[0])
    const p2 = parseDmsPart(dmsMatches[1])

    let lat = null
    let lng = null

    if (p1.hemi === 'N' || p1.hemi === 'S') {
      lat = p1.dec
    } else if (p1.hemi === 'E' || p1.hemi === 'W') {
      lng = p1.dec
    }

    if (p2.hemi === 'N' || p2.hemi === 'S') {
      lat = p2.dec
    } else if (p2.hemi === 'E' || p2.hemi === 'W') {
      lng = p2.dec
    }

    // Default to lat, lng order if hemisphere not specified
    if (lat === null && lng === null) {
      lat = p1.dec
      lng = p2.dec
    } else if (lat === null) {
      lat = p1.dec
    } else if (lng === null) {
      lng = p2.dec
    }

    return validateAndFormat(lat, lng)
  }

  // ── Strategy B: Decimal with Cardinal Letters (e.g. 9.5675 N, 77.679111 E) ──
  const cardinalDecRegex = /^([+-]?\d+(?:\.\d+)?)\s*°?\s*([NS])?[,\s]+([+-]?\d+(?:\.\d+)?)\s*°?\s*([EW])?$/i
  const cardMatch = normalized.match(cardinalDecRegex)
  if (cardMatch) {
    let lat = parseFloat(cardMatch[1])
    const latHemi = (cardMatch[2] || '').toUpperCase()
    let lng = parseFloat(cardMatch[3])
    const lngHemi = (cardMatch[4] || '').toUpperCase()

    if (latHemi === 'S' && lat > 0) lat = -lat
    if (lngHemi === 'W' && lng > 0) lng = -lng

    return validateAndFormat(lat, lng)
  }

  // ── Strategy C: Pure Decimal (e.g. "9.5675, 77.679111" or "9.5675 77.679111") ──
  const plainDecRegex = /^([+-]?\d+(?:\.\d+)?)[,\s]+([+-]?\d+(?:\.\d+)?)$/
  const plainMatch = normalized.match(plainDecRegex)
  if (plainMatch) {
    const lat = parseFloat(plainMatch[1])
    const lng = parseFloat(plainMatch[2])
    return validateAndFormat(lat, lng)
  }

  return {
    ok: false,
    error: 'Unrecognized format. Enter DMS (e.g., 9°34\'03.0"N 77°40\'44.8"E) or Decimal (e.g., 9.5675, 77.679111).',
  }
}

function validateAndFormat(lat, lng) {
  if (Number.isNaN(lat) || Number.isNaN(lng)) {
    return { ok: false, error: 'Coordinates could not be parsed to numeric values.' }
  }

  if (lat < -90 || lat > 90) {
    return {
      ok: false,
      error: `Latitude ${lat.toFixed(4)}° is out of range. Latitude must be between -90 and +90.`,
    }
  }

  if (lng < -180 || lng > 180) {
    return {
      ok: false,
      error: `Longitude ${lng.toFixed(4)}° is out of range. Longitude must be between -180 and +180.`,
    }
  }

  const latHemi = lat >= 0 ? 'N' : 'S'
  const lngHemi = lng >= 0 ? 'E' : 'W'
  const formattedDms = `${toDms(lat, latHemi)} ${toDms(lng, lngHemi)}`

  return {
    ok: true,
    lat: Number(lat.toFixed(6)),
    lng: Number(lng.toFixed(6)),
    formatted: `${lat.toFixed(6)}, ${lng.toFixed(6)} (${formattedDms})`,
    dms: formattedDms,
  }
}

function toDms(val, hemi) {
  const abs = Math.abs(val)
  const deg = Math.floor(abs)
  const minFloat = (abs - deg) * 60
  const min = Math.floor(minFloat)
  const sec = ((minFloat - min) * 60).toFixed(1)
  return `${deg}°${min.toString().padStart(2, '0')}'${sec.padStart(4, '0')}"${hemi}`
}
