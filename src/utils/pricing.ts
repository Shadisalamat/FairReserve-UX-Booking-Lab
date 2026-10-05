import { Stay, AddOnItem } from '../types';

export interface CalculatedPricing {
  nights: number;
  basePrice: number;
  nightsTotal: number;
  mandatoryFees: { name: string; amount: number }[];
  mandatoryFeesTotal: number;
  selectedAddOnsTotal: number;
  taxes: number;
  grandTotal: number;
}

export function calculateBookingPrice(
  stay: Stay,
  nights: number,
  selectedAddOnIds: string[],
  availableAddOns: AddOnItem[],
  mode: 'good' | 'bad'
): CalculatedPricing {
  const safeNights = Math.max(1, nights);

  if (mode === 'good') {
    // In Good UX: base price is the honest total rate ($240/night)
    const nightsTotal = stay.basePricePerNight * safeNights;
    const taxes = Math.round(nightsTotal * 0.10); // 10% tax clearly stated
    
    // Add-ons
    let addOnsTotal = 0;
    for (const addonId of selectedAddOnIds) {
      const addon = availableAddOns.find(a => a.id === addonId);
      if (addon) {
        addOnsTotal += addon.perNight ? addon.price * safeNights : addon.price;
      }
    }

    return {
      nights: safeNights,
      basePrice: stay.basePricePerNight,
      nightsTotal,
      mandatoryFees: [
        { name: 'Eco-certified hospitality taxes (10%)', amount: taxes }
      ],
      mandatoryFeesTotal: taxes,
      selectedAddOnsTotal: addOnsTotal,
      taxes,
      grandTotal: nightsTotal + taxes + addOnsTotal
    };
  } else {
    // In Bad UX: Deceptive drip pricing!
    // Advertised: stay.fakeBaitPricePerNight ($129/nt)
    // Mandatory hidden fees added at checkout:
    // Resort fee $45/night, Cleaning fee $85 flat, Tech booking surcharge $29 flat
    const nightsTotal = stay.fakeBaitPricePerNight * safeNights;
    const resortFee = 45 * safeNights;
    const cleaningFee = 85;
    const techSurcharge = 29;
    const hiddenTaxes = Math.round((nightsTotal + resortFee + cleaningFee) * 0.14);

    let addOnsTotal = 0;
    for (const addonId of selectedAddOnIds) {
      const addon = availableAddOns.find(a => a.id === addonId);
      if (addon) {
        addOnsTotal += addon.perNight ? addon.price * safeNights : addon.price;
      }
    }

    const mandatoryFees = [
      { name: `Daily Resort & Pool Wellness Fee ($45 × ${safeNights} nights)`, amount: resortFee },
      { name: 'Mandatory Deep Sanitization & Linens Fee', amount: cleaningFee },
      { name: 'Secure Payment & Infrastructure Surcharge', amount: techSurcharge },
      { name: 'State, County & Tourism Occupancy Tax (14%)', amount: hiddenTaxes }
    ];

    const mandatoryTotal = resortFee + cleaningFee + techSurcharge + hiddenTaxes;

    return {
      nights: safeNights,
      basePrice: stay.fakeBaitPricePerNight,
      nightsTotal,
      mandatoryFees,
      mandatoryFeesTotal: mandatoryTotal,
      selectedAddOnsTotal: addOnsTotal,
      taxes: hiddenTaxes,
      grandTotal: nightsTotal + mandatoryTotal + addOnsTotal
    };
  }
}

export function formatDateRange(startDate: string, endDate: string): string {
  try {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const options: Intl.DateTimeFormatOptions = { month: 'short', day: 'numeric', year: 'numeric' };
    return `${start.toLocaleDateString('en-US', options)} – ${end.toLocaleDateString('en-US', options)}`;
  } catch {
    return `${startDate} – ${endDate}`;
  }
}
