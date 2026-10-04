import { parseCoordinates } from './coordinateParser.js'

function runTests() {
  const tests = [
    {
      name: 'Sample DMS format from requirements (9°34\'03.0"N 77°40\'44.8"E)',
      input: '9°34\'03.0"N 77°40\'44.8"E',
      expectedOk: true,
      expectedLat: 9.5675,
      expectedLng: 77.679111,
      tolerance: 0.0001,
    },
    {
      name: 'Typographic quotes & primes (9°34′03.0″N 77°40′44.8″E)',
      input: '9°34′03.0″N 77°40′44.8″E',
      expectedOk: true,
      expectedLat: 9.5675,
      expectedLng: 77.679111,
      tolerance: 0.0001,
    },
    {
      name: 'Decimal format with comma (9.5675, 77.679111)',
      input: '9.5675, 77.679111',
      expectedOk: true,
      expectedLat: 9.5675,
      expectedLng: 77.679111,
      tolerance: 0.000001,
    },
    {
      name: 'Decimal format with space separation (9.5675 77.679111)',
      input: '9.5675 77.679111',
      expectedOk: true,
      expectedLat: 9.5675,
      expectedLng: 77.679111,
      tolerance: 0.000001,
    },
    {
      name: 'South and West coordinates in DMS (33°51\'30"S 151°12\'30"W)',
      input: '33°51\'30"S 151°12\'30"W',
      expectedOk: true,
      expectedLat: -33.858333,
      expectedLng: -151.208333,
      tolerance: 0.0001,
    },
    {
      name: 'Latitude out of range (95.1234, 77.5678)',
      input: '95.1234, 77.5678',
      expectedOk: false,
    },
    {
      name: 'Longitude out of range (12.3456, 185.1234)',
      input: '12.3456, 185.1234',
      expectedOk: false,
    },
    {
      name: 'Invalid garbage input ("random text")',
      input: 'random text',
      expectedOk: false,
    },
    {
      name: 'Empty string input ("")',
      input: '',
      expectedOk: false,
    },
  ]

  let passed = 0
  let failed = 0

  for (const t of tests) {
    const res = parseCoordinates(t.input)
    if (res.ok !== t.expectedOk) {
      console.error(`FAIL: ${t.name}. Expected ok=${t.expectedOk}, got ok=${res.ok} (${res.error})`)
      failed++
      continue
    }

    if (t.expectedOk) {
      const latDiff = Math.abs(res.lat - t.expectedLat)
      const lngDiff = Math.abs(res.lng - t.expectedLng)
      if (latDiff > t.tolerance || lngDiff > t.tolerance) {
        console.error(`FAIL: ${t.name}. Expected lat=${t.expectedLat}, lng=${t.expectedLng}, got lat=${res.lat}, lng=${res.lng}`)
        failed++
        continue
      }
    }
    console.log(`PASS: ${t.name}`)
    passed++
  }

  console.log(`\nResults: ${passed} passed, ${failed} failed.`)
  if (failed > 0) process.exit(1)
}

runTests()
