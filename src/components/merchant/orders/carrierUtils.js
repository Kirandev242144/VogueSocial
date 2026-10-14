/**
 * Carrier utilities for VogueSocial Merchant Orders & Logistics
 * Supports auto-detection of courier from AWB format and direct tracking URLs.
 */

export const CARRIERS = [
  'DHL Express',
  'FedEx',
  'UPS',
  'Blue Dart',
  'USPS Priority Mail',
  'Royal Mail'
];

/**
 * Detects carrier name based on airway bill (AWB) or tracking number pattern
 * @param {string} rawNumber - Tracking number input
 * @returns {string|null} - Carrier name or null if unknown
 */
export function detectCarrier(rawNumber) {
  if (!rawNumber) return null;
  const num = rawNumber.trim().replace(/[\s-]+/g, '').toUpperCase();
  if (!num || num.length < 3) return null;

  // UPS: standard 1Z prefix (1Z + 6 char account + 2 char service + 8 char package)
  if (/^1Z[A-Z0-9]{16}$/i.test(num) || /^1Z/i.test(num)) {
    return 'UPS';
  }

  // USPS: 20-22 digits starting with 92, 93, 94, 95 or S10 format ending in US
  if (/^(94|92|93|95)\d{18,20}$/.test(num) || /^[A-Z]{2}\d{9}US$/i.test(num)) {
    return 'USPS Priority Mail';
  }

  // Royal Mail: 13-character S10 format ending in GB (e.g. RN123456789GB)
  if (/^[A-Z]{2}\d{9}GB$/i.test(num)) {
    return 'Royal Mail';
  }

  // Blue Dart: starts with BD or common 8-11 digit numeric sequence
  if (/^BD\d+/i.test(num)) {
    return 'Blue Dart';
  }

  // FedEx: starts with FX, 12 digits (Express), 15 digits (Ground), or 96 prefix SmartPost
  if (/^FX/i.test(num) || /^\d{12}$/.test(num) || /^\d{15}$/.test(num) || /^96\d{20}$/.test(num)) {
    return 'FedEx';
  }

  // DHL Express: 10 digits numeric, or begins with JD / JJD (DHL eCommerce)
  if (/^\d{10}$/.test(num) || /^J(J)?D/i.test(num)) {
    return 'DHL Express';
  }

  return null;
}

/**
 * Generates direct tracking URL for the specified carrier and tracking number
 * @param {string} carrier - Carrier name
 * @param {string} trackingNumber - Tracking number
 * @returns {string} - Direct tracking portal URL
 */
export function getCarrierTrackingUrl(carrier, trackingNumber) {
  if (!trackingNumber) return '#';
  const cleanNum = trackingNumber.trim().replace(/[\s-]+/g, '');
  const c = (carrier || '').toLowerCase();

  if (c.includes('dhl')) {
    return `https://www.dhl.com/en/express/tracking.html?AWB=${cleanNum}`;
  }
  if (c.includes('fedex')) {
    return `https://www.fedex.com/fedextrack/?trknbr=${cleanNum}`;
  }
  if (c.includes('ups')) {
    return `https://www.ups.com/track?tracknum=${cleanNum}`;
  }
  if (c.includes('usps')) {
    return `https://tools.usps.com/go/TrackConfirmAction?tLabels=${cleanNum}`;
  }
  if (c.includes('blue dart')) {
    return `https://www.bluedart.com/tracking?handler=tnt&track=${cleanNum}`;
  }
  if (c.includes('royal mail')) {
    return `https://www.royalmail.com/track-your-item#/tracking-results/${cleanNum}`;
  }

  return `https://www.google.com/search?q=${encodeURIComponent(`${carrier} tracking ${cleanNum}`)}`;
}
