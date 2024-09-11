import { createClient } from 'urql'

// Query 1: Fetch recent deliveries with their legs and drivers
const recentDeliveriesQuery = `
  query($first: Int!, $orderBy: Delivery_orderBy!, $orderDirection: OrderDirection!) {
    deliveries(first: $first, orderBy: $orderBy, orderDirection: $orderDirection) {
      id
      customer {
        id
        name
      }
      pickupLocation
      dropoffLocation
      totalDistance
      totalCarbonSavings
      legs {
        id
        driver {
          id
          name
          rating
        }
        startLocation
        endLocation
        distance
        carbonSavings
      }
    }
  }
`

async function fetchRecentDeliveries(first = 5) {
  const { data } = await client.query(recentDeliveriesQuery, {
    first: first,
    orderBy: "createdAt",
    orderDirection: "desc"
  }).toPromise()
  console.log('Recent Deliveries:', data.deliveries)
}

// Query 2: Fetch a specific delivery with nested filtering
const specificDeliveryQuery = `
  query($id: ID!, $minLegDistance: BigInt!) {
    delivery(id: $id) {
      id
      customer {
        id
        name
      }
      totalDistance
      totalCarbonSavings
      legs(where: { distance_gte: $minLegDistance }) {
        id
        driver {
          id
          name
          rating
        }
        startLocation
        endLocation
        distance
        carbonSavings
      }
    }
  }
`

async function fetchSpecificDelivery(id, minLegDistance) {
  const { data } = await client.query(specificDeliveryQuery, {
    id: id,
    minLegDistance: minLegDistance
  }).toPromise()
  console.log('Specific Delivery:', data.delivery)
}

// Query 3: Fetch top drivers by carbon savings
const topDriversQuery = `
  query($first: Int!, $minSavings: BigInt!) {
    accounts(
      first: $first,
      where: { isDriver: true, totalCarbonSavings_gte: $minSavings },
      orderBy: totalCarbonSavings,
      orderDirection: desc
    ) {
      id
      name
      totalCarbonSavings
      rating
      drivenLegs(first: 5, orderBy: carbonSavings, orderDirection: desc) {
        id
        delivery {
          id
        }
        carbonSavings
      }
    }
  }
`



// Query 3: Fetch top drivers by carbon savings
const topDriversQuery = `
  query($first: Int!, $minSavings: BigInt!) {
    accounts(
      first: $first,
      where: { isDriver: true, totalCarbonSavings_gte: $minSavings },
      orderBy: totalCarbonSavings,
      orderDirection: desc
    ) {
      id
      name
      totalCarbonSavings
      rating
      drivenLegs(first: 5, orderBy: carbonSavings, orderDirection: desc) {
        id
        delivery {
          id
        }
        carbonSavings
      }
    }
  }
`

async function fetchTopDrivers(first = 10, minSavings = "1000000000000000000") {
  const { data } = await client.query(topDriversQuery, {
    first: first,
    minSavings: minSavings
  }).toPromise()
  console.log('Top Drivers:', data.accounts)
}

// Query 4: Search for deliveries or users
const searchQuery = `
  query($searchTerm: String!, $first: Int!) {
    searchIndices(first: $first, where: { content_contains: $searchTerm }) {
      id
      content
    }
  }