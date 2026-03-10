const express = require('express')
const router = express.Router()
const User = require('../models/User')

// Cost per km in rupees
const COST_PER_KM = 45

// Estimated speed in km/h for agricultural transport
const ESTIMATED_SPEED = 40

// District coordinates mapping for India (approximate)
const districtCoordinates = {
  // Maharashtra
  'Mumbai': { lat: 19.0760, lng: 72.8777 },
  'Pune': { lat: 18.5204, lng: 73.8567 },
  'Nagpur': { lat: 21.1458, lng: 79.0882 },
  'Nashik': { lat: 20.0144, lng: 73.7898 },
  'Kolhapur': { lat: 16.7050, lng: 74.2432 },
  'Thane': { lat: 19.2183, lng: 72.9781 },
  'Aurangabad': { lat: 19.8762, lng: 75.3433 },
  'Solapur': { lat: 17.6599, lng: 75.9064 },
  'Satara': { lat: 17.6965, lng: 74.0467 },
  'Raigad': { lat: 18.5155, lng: 73.1822 },
  
  // Punjab
  'Ludhiana': { lat: 30.9010, lng: 75.8573 },
  'Amritsar': { lat: 31.6340, lng: 74.8723 },
  'Jalandhar': { lat: 31.3260, lng: 75.5762 },
  'Patiala': { lat: 30.3398, lng: 76.3867 },
  'Bathinda': { lat: 30.2115, lng: 74.9455 },
  'Hoshiarpur': { lat: 31.5326, lng: 75.9103 },
  'Pathankot': { lat: 32.2747, lng: 75.6528 },
  'Moga': { lat: 30.8163, lng: 75.1700 },
  
  // Haryana
  'Gurgaon': { lat: 28.4595, lng: 77.0266 },
  'Faridabad': { lat: 28.4089, lng: 77.3178 },
  'Panipat': { lat: 29.3951, lng: 76.9734 },
  'Rohtak': { lat: 28.8955, lng: 76.6066 },
  'Karnal': { lat: 29.6857, lng: 76.9885 },
  'Hisar': { lat: 29.1644, lng: 75.7204 },
  'Sonipat': { lat: 28.9945, lng: 77.0195 },
  
  // Uttar Pradesh
  'Lucknow': { lat: 26.8467, lng: 80.9462 },
  'Agra': { lat: 27.1767, lng: 78.0081 },
  'Varanasi': { lat: 25.3176, lng: 82.9739 },
  'Kanpur': { lat: 26.4499, lng: 80.3319 },
  'Ghaziabad': { lat: 28.6692, lng: 77.4538 },
  'Allahabad': { lat: 25.4358, lng: 81.8264 },
  'Meerut': { lat: 28.9845, lng: 77.7081 },
  
  // Madhya Pradesh
  'Bhopal': { lat: 23.2599, lng: 77.4126 },
  'Indore': { lat: 22.7196, lng: 75.8577 },
  'Jabalpur': { lat: 23.1815, lng: 79.9864 },
  'Gwalior': { lat: 26.2124, lng: 78.1772 },
  'Ujjain': { lat: 23.1824, lng: 75.7684 },
  'Satna': { lat: 24.6022, lng: 80.8254 },
  
  // Gujarat
  'Ahmedabad': { lat: 23.0225, lng: 72.5714 },
  'Surat': { lat: 21.1702, lng: 72.8311 },
  'Vadodara': { lat: 22.3072, lng: 73.1812 },
  'Rajkot': { lat: 22.3039, lng: 70.8022 },
  'Bhavnagar': { lat: 21.7645, lng: 72.1519 },
  'Jamnagar': { lat: 22.4707, lng: 70.0577 },
  'Gandhinagar': { lat: 23.2156, lng: 72.6369 },
  
  // Rajasthan
  'Jaipur': { lat: 26.9124, lng: 75.7873 },
  'Jodhpur': { lat: 26.2389, lng: 73.0243 },
  'Udaipur': { lat: 24.5854, lng: 73.7125 },
  'Kota': { lat: 25.2138, lng: 75.8648 },
  'Bikaner': { lat: 28.0229, lng: 73.3119 },
  'Ajmer': { lat: 26.4499, lng: 74.6399 },
  
  // Karnataka
  'Bangalore': { lat: 12.9716, lng: 77.5946 },
  'Mysore': { lat: 12.2958, lng: 76.6394 },
  'Hubli': { lat: 15.3647, lng: 75.1249 },
  'Mangalore': { lat: 12.9141, lng: 74.8560 },
  'Belgaum': { lat: 15.8497, lng: 74.4977 },
  'Dharwad': { lat: 15.4589, lng: 75.0078 },
  'Gulbarga': { lat: 17.3297, lng: 76.8374 },
  'Bellary': { lat: 15.1426, lng: 76.9210 },
  
  // Tamil Nadu
  'Chennai': { lat: 13.0827, lng: 80.2707 },
  'Coimbatore': { lat: 11.0168, lng: 76.9558 },
  'Madurai': { lat: 9.9252, lng: 78.1198 },
  'Tiruchirappalli': { lat: 10.7905, lng: 78.7047 },
  'Salem': { lat: 11.6643, lng: 78.1460 },
  'Tiruppur': { lat: 11.1085, lng: 77.3411 },
  'Vellore': { lat: 12.9165, lng: 79.1325 },
  
  // West Bengal
  'Kolkata': { lat: 22.5726, lng: 88.3639 },
  'Howrah': { lat: 22.5958, lng: 88.2636 },
  'Asansol': { lat: 23.6683, lng: 86.9694 },
  'Siliguri': { lat: 26.7114, lng: 88.4315 },
  'Durgapur': { lat: 23.5204, lng: 87.3119 },
  'Bardhaman': { lat: 23.2320, lng: 87.8614 },
  'Malda': { lat: 25.0101, lng: 88.1394 }
}

// Get coordinates for a location
const getCoordinates = async (userId) => {
  const user = await User.findById(userId).select('address district state')
  if (!user) return null

  // First check if user has lat/lng in address
  if (user.address?.latitude && user.address?.longitude) {
    return { lat: user.address.latitude, lng: user.address.longitude }
  }

  // Try to get from district coordinates
  const district = user.address?.district || user.district
  const state = user.address?.state || user.state
  
  // Try exact district match first
  if (district && districtCoordinates[district]) {
    return districtCoordinates[district]
  }

  // Try to find in same state
  for (const [key, coords] of Object.entries(districtCoordinates)) {
    // If state has a city with same name (e.g., Pune district in Maharashtra)
    if (key.toLowerCase() === district?.toLowerCase()) {
      return coords
    }
  }

  // Return default coordinates based on state
  const stateDefaults = {
    'Maharashtra': { lat: 19.7515, lng: 75.7139 },
    'Punjab': { lat: 31.1471, lng: 75.3413 },
    'Haryana': { lat: 29.0588, lng: 76.0856 },
    'Uttar Pradesh': { lat: 26.8467, lng: 80.9462 },
    'Madhya Pradesh': { lat: 22.9734, lng: 78.6569 },
    'Gujarat': { lat: 22.2587, lng: 71.1924 },
    'Rajasthan': { lat: 27.0238, lng: 74.2179 },
    'Karnataka': { lat: 15.3173, lng: 75.7139 },
    'Tamil Nadu': { lat: 11.1271, lng: 78.6569 },
    'West Bengal': { lat: 22.9868, lng: 87.855 }
  }

  return stateDefaults[state] || { lat: 20.5937, lng: 78.9629 } // Default India center
}

// Calculate distance between two points (Haversine formula)
const calculateDistance = (lat1, lng1, lat2, lng2) => {
  const R = 6371 // Earth's radius in km
  const dLat = (lat2 - lat1) * Math.PI / 180
  const dLng = (lng2 - lng1) * Math.PI / 180
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLng/2) * Math.sin(dLng/2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a))
  return R * c
}

// GET /api/routes/calculate - Calculate route between two users
router.get('/calculate', async (req, res) => {
  try {
    const { from_user_id, to_user_id } = req.query

    if (!from_user_id || !to_user_id) {
      return res.status(400).json({
        success: false,
        message: 'Both from_user_id and to_user_id are required'
      })
    }

    // Get coordinates for both users
    const fromCoords = await getCoordinates(from_user_id)
    const toCoords = await getCoordinates(to_user_id)

    if (!fromCoords || !toCoords) {
      return res.status(404).json({
        success: false,
        message: 'Could not find coordinates for one or both users'
      })
    }

    // Calculate distance
    const distance = calculateDistance(
      fromCoords.lat, fromCoords.lng,
      toCoords.lat, toCoords.lng
    )

    // Calculate estimated time
    const estimatedHours = distance / ESTIMATED_SPEED
    const hours = Math.floor(estimatedHours)
    const minutes = Math.round((estimatedHours - hours) * 60)
    const estimatedTime = hours > 0 ? `${hours}h ${minutes}m` : `${minutes} min`

    // Calculate transport cost
    const transportCost = Math.round(distance * COST_PER_KM)

    // Generate Google Maps URL
    const mapsUrl = `https://www.google.com/maps/dir/?api=1&origin=${fromCoords.lat},${fromCoords.lng}&destination=${toCoords.lat},${toCoords.lng}`

    res.json({
      success: true,
      route: {
        origin: {
          coordinates: fromCoords,
          type: 'origin'
        },
        destination: {
          coordinates: toCoords,
          type: 'destination'
        },
        distance_km: Math.round(distance * 10) / 10,
        estimated_time: estimatedTime,
        estimated_hours: Math.round(estimatedHours * 10) / 10,
        transport_cost: transportCost,
        cost_per_km: COST_PER_KM,
        maps_url: mapsUrl
      }
    })
  } catch (error) {
    console.error('Calculate route error:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to calculate route',
      error: error.message
    })
  }
})

// GET /api/routes/farmer-to-trader - Get route from farmer to trader
router.get('/farmer-to-trader', async (req, res) => {
  try {
    const { farmer_id, trader_id } = req.query

    if (!farmer_id || !trader_id) {
      return res.status(400).json({
        success: false,
        message: 'farmer_id and trader_id are required'
      })
    }

    const fromCoords = await getCoordinates(farmer_id)
    const toCoords = await getCoordinates(trader_id)

    if (!fromCoords || !toCoords) {
      return res.status(404).json({
        success: false,
        message: 'Could not find coordinates'
      })
    }

    const distance = calculateDistance(fromCoords.lat, fromCoords.lng, toCoords.lat, toCoords.lng)
    const estimatedHours = distance / ESTIMATED_SPEED
    const transportCost = Math.round(distance * COST_PER_KM)
    const mapsUrl = `https://www.google.com/maps/dir/?api=1&origin=${fromCoords.lat},${fromCoords.lng}&destination=${toCoords.lat},${toCoords.lng}`

    res.json({
      success: true,
      route: {
        type: 'farmer_to_trader',
        distance_km: Math.round(distance * 10) / 10,
        estimated_time: `${Math.floor(estimatedHours)}h ${Math.round((estimatedHours % 1) * 60)}m`,
        estimated_hours: Math.round(estimatedHours * 10) / 10,
        transport_cost: transportCost,
        maps_url: mapsUrl,
        origin: fromCoords,
        destination: toCoords
      }
    })
  } catch (error) {
    console.error('Farmer to trader route error:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to calculate route',
      error: error.message
    })
  }
})

// GET /api/routes/trader-to-mill - Get route from trader to mill
router.get('/trader-to-mill', async (req, res) => {
  try {
    const { trader_id, mill_id } = req.query

    if (!trader_id || !mill_id) {
      return res.status(400).json({
        success: false,
        message: 'trader_id and mill_id are required'
      })
    }

    const fromCoords = await getCoordinates(trader_id)
    const toCoords = await getCoordinates(mill_id)

    if (!fromCoords || !toCoords) {
      return res.status(404).json({
        success: false,
        message: 'Could not find coordinates'
      })
    }

    const distance = calculateDistance(fromCoords.lat, fromCoords.lng, toCoords.lat, toCoords.lng)
    const estimatedHours = distance / ESTIMATED_SPEED
    const transportCost = Math.round(distance * COST_PER_KM)
    const mapsUrl = `https://www.google.com/maps/dir/?api=1&origin=${fromCoords.lat},${fromCoords.lng}&destination=${toCoords.lat},${toCoords.lng}`

    res.json({
      success: true,
      route: {
        type: 'trader_to_mill',
        distance_km: Math.round(distance * 10) / 10,
        estimated_time: `${Math.floor(estimatedHours)}h ${Math.round((estimatedHours % 1) * 60)}m`,
        estimated_hours: Math.round(estimatedHours * 10) / 10,
        transport_cost: transportCost,
        maps_url: mapsUrl,
        origin: fromCoords,
        destination: toCoords
      }
    })
  } catch (error) {
    console.error('Trader to mill route error:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to calculate route',
      error: error.message
    })
  }
})

// GET /api/routes/transport-cost - Get transport cost estimate
router.get('/transport-cost', async (req, res) => {
  try {
    const { from_user_id, to_user_id } = req.query

    if (!from_user_id || !to_user_id) {
      return res.status(400).json({
        success: false,
        message: 'Both from_user_id and to_user_id are required'
      })
    }

    const fromCoords = await getCoordinates(from_user_id)
    const toCoords = await getCoordinates(to_user_id)

    if (!fromCoords || !toCoords) {
      return res.status(404).json({
        success: false,
        message: 'Could not find coordinates'
      })
    }

    const distance = calculateDistance(fromCoords.lat, fromCoords.lng, toCoords.lat, toCoords.lng)
    const transportCost = Math.round(distance * COST_PER_KM)

    res.json({
      success: true,
      estimate: {
        distance_km: Math.round(distance * 10) / 10,
        cost_per_km: COST_PER_KM,
        estimated_transport_cost: transportCost,
        estimated_hours: Math.round((distance / ESTIMATED_SPEED) * 10) / 10
      }
    })
  } catch (error) {
    console.error('Transport cost error:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to calculate transport cost',
      error: error.message
    })
  }
})

module.exports = router

