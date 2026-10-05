import { Stay, AddOnItem } from '../types';

export const MOCK_STAYS: Stay[] = [
  {
    id: 'haven-serenade',
    name: 'Serenade Coastal Villa & Spa',
    tagline: 'Panoramic oceanfront cliffside sanctuary with private heated saltwater plunge pool',
    location: 'Big Sur, California',
    rating: 4.96,
    reviewCount: 318,
    basePricePerNight: 240, // Honest all-inclusive total base
    fakeBaitPricePerNight: 129, // Bad UX displays this low price, then piles on $111/night in mandatory fees!
    image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1200&q=80',
    description: 'Tucked into the rugged Big Sur bluffs, this architectural timber villa offers unobstructed Pacific horizons, floor-to-ceiling glass, an artisan wood-burning hearth, and direct access to coastal wildflower trails.',
    amenities: ['High-speed Starlink Wi-Fi', 'Private Heated Pool', 'EV Fast Charger', 'Organic Breakfast Included', 'Oceanview Cedar Sauna', 'King Latex Mattress'],
    maxGuests: 4,
    bedrooms: 2,
    availableRooms: 3,
    cancellationFreeDays: 3,
    accessibility: {
      wheelchairAccessible: true,
      stepFreeEntrance: true,
      doorwayWidthInches: 36,
      rollInShower: true,
      toiletGrabBars: true,
      elevatorAccess: true,
      visualSmokeAlarm: true,
      brailleSignage: true,
      serviceAnimalSurchargeFree: true,
      certifiedAuditDate: 'Audited & Verified July 2026',
      accessibleHighlights: [
        '36" wide step-free entrance & zero-threshold slider doors',
        'Roll-in rain shower with ADA wall grab bars & fold-down teak bench',
        'Strobe-light emergency smoke alarms & vibratory bed shaker',
        'Ramped access to heated plunge pool & ocean observation deck',
        'Certified Service Animals welcomed with $0 pet fee'
      ]
    }
  },
  {
    id: 'alpine-glasshouse',
    name: 'The Glass Pavilion at Mont Blanc',
    tagline: 'Geometric alpine retreat surrounded by ancient pine forests and jagged peaks',
    location: 'Chamonix, French Alps',
    rating: 4.92,
    reviewCount: 184,
    basePricePerNight: 290,
    fakeBaitPricePerNight: 149,
    image: 'https://images.unsplash.com/photo-1518780664697-55e3ad937233?auto=format&fit=crop&w=1200&q=80',
    description: 'Floor-to-ceiling insulated glass framing breathtaking mountain spires. Features custom Finnish sauna, geothermal underfloor heating, and direct ski-in/ski-out trailheads.',
    amenities: ['Ski Storage & Dryers', 'Panoramic Sauna', 'Nordic Fire Pit', 'Artisan Coffee Roastery Bar', 'Private Helipad Access'],
    maxGuests: 6,
    bedrooms: 3,
    availableRooms: 2,
    cancellationFreeDays: 5,
    accessibility: {
      wheelchairAccessible: true,
      stepFreeEntrance: true,
      doorwayWidthInches: 34,
      rollInShower: true,
      toiletGrabBars: true,
      elevatorAccess: false, // Ground floor only
      visualSmokeAlarm: true,
      brailleSignage: false,
      serviceAnimalSurchargeFree: true,
      certifiedAuditDate: 'Audited & Verified May 2026',
      accessibleHighlights: [
        'Ground-floor step-free suite with 34" wide doorway clearances',
        'Level roll-in shower stall with non-slip heated stone floor',
        'High-contrast thermostat and visual fire alert strobes',
        'Level paved vehicle access with priority disabled parking stall'
      ]
    }
  },
  {
    id: 'kyoto-cedar-machiya',
    name: 'Komorebi Heritage Machiya',
    tagline: 'Restored 1912 traditional townhouse with private moss garden & cypress ofuro tub',
    location: 'Gion, Kyoto, Japan',
    rating: 4.98,
    reviewCount: 412,
    basePricePerNight: 210,
    fakeBaitPricePerNight: 110,
    image: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=1200&q=80',
    description: 'Immerse yourself in authentic Japanese craftsmanship. Hand-woven tatami mats, antique shoji screens, a private courtyard garden with trickle bamboo water fountain, and serene meditation teahouse.',
    amenities: ['Hinoki Wood Tub', 'Matcha Tea Ceremony Set', 'Bicycle Fleet', 'Pocket Wi-Fi', 'Heated Tatami Floors'],
    maxGuests: 3,
    bedrooms: 1,
    availableRooms: 4,
    cancellationFreeDays: 4,
    accessibility: {
      wheelchairAccessible: false,
      stepFreeEntrance: false, // Historic 6-inch genkan threshold
      doorwayWidthInches: 30,
      rollInShower: false,
      toiletGrabBars: true,
      elevatorAccess: false,
      visualSmokeAlarm: true,
      brailleSignage: false,
      serviceAnimalSurchargeFree: true,
      certifiedAuditDate: 'Audited & Verified April 2026',
      accessibleHighlights: [
        'Historic 6" genkan threshold step (portable ramp available on request)',
        'Support grab bars in Western-style ceramic washroom',
        'Sensory-friendly, ultra-quiet garden acoustic sanctuary',
        'Guide dogs welcomed with complimentary bamboo water bowl'
      ]
    }
  }
];

export const AVAILABLE_ADDONS: AddOnItem[] = [
  {
    id: 'addon-protection',
    name: 'Comprehensive Trip & Damage Shield',
    description: 'Zero-deductible coverage for accidental spills, weather disruptions, and medical cancellations.',
    price: 24,
    perNight: false,
    category: 'protection',
    isPrecheckedInBadUx: true, // Sneak into cart!
    badUxConfirmShameText: 'I understand I am risking $1,000+ out of pocket for any unexpected emergency.'
  },
  {
    id: 'addon-clean',
    name: 'Eco-Certified Green Turn-down Service',
    description: 'Daily freshening using 100% biodegradable essential oil botanicals and organic linen refresh.',
    price: 18,
    perNight: true,
    category: 'comfort',
    isPrecheckedInBadUx: true, // Sneak into cart!
    badUxConfirmShameText: 'I decline eco-cleaning and accept a messy room during my stay.'
  },
  {
    id: 'addon-flex',
    name: 'Guaranteed Flexible Check-In / Check-Out',
    description: 'Check in as early as 11:00 AM or check out as late as 3:00 PM without additional hourly fees.',
    price: 35,
    perNight: false,
    category: 'flexibility',
    isPrecheckedInBadUx: true,
    badUxConfirmShameText: 'No, I prefer being forced to wait in the lobby until strict 4:00 PM check-in.'
  },
  {
    id: 'addon-parking',
    name: 'Reserved On-Site EV Parking & Charging',
    description: 'Dedicated reserved stall right next to the entrance with unrestricted 22kW Level 2 charging.',
    price: 15,
    perNight: true,
    category: 'comfort',
    isPrecheckedInBadUx: false,
  },
  {
    id: 'addon-service-animal',
    name: 'Service Animal & Mobility Equipment Registration',
    description: 'Guaranteed $0 surcharge by law (ADA / EAA). Dedicated ground-floor room assignment and relief area map.',
    price: 0,
    perNight: false,
    category: 'accessibility',
    isPrecheckedInBadUx: false,
    isDisabilityService: true
  }
];
