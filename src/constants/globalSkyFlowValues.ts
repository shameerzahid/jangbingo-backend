/**
 * Valid values for GLOBAL + SKY job post flow
 */

// 1. equipmentType (String, Required)
export const EQUIPMENT_TYPES = [
  '1 ton',
  '2.5 ton',
  '3.5 ton',
  '5 ton',
  '18 ton',
  '19 ton',
  '3.5 tons of bending',
  'Refraction 5 tons',
  'Refraction 60M',
  'Refraction 70M'
] as const;

// 2. equipmentLengths (Array of Numbers, Required)
export const EQUIPMENT_LENGTHS = {
  '1 ton': [16, 18, 20, 21],
  '2.5 ton': [22, 24, 25],
  '3.5 ton': [28, 30, 32, 35],
  '5 ton': [38, 40, 45, 50, 54],
  '18 ton': [58, 60, 65, 70],
  '19 ton': [75],
  '3.5 tons of bending': [28],
  'Refraction 5 tons': [40],
  'Refraction 60M': [60],
  'Refraction 70M': [70]
} as const;

// 3. workDateType (Enum, Required)
export const WORK_DATE_TYPES = [
  'URGENT',
  'TODAY',
  'TOMORROW',
  'CUSTOM_DATE'
] as const;

// 4. arrivalTime (String, Required) - Format: "HH:MM" (24-hour format)
export const ARRIVAL_TIME_EXAMPLES = [
  '06:30',
  '09:00',
  '14:30',
  '18:45'
] as const;

// 5. period (String, Required)
export const PERIOD_VALUES = [
  '1 day',
  '2 days',
  '3 days',
  '1 week',
  '2 weeks',
  '1 month',
  '2 months',
  '3 months'
] as const;

// 6. shift (String, Required)
export const SHIFT_VALUES = [
  'morning',
  'afternoon'
] as const;

// 7. hours (String, Required)
export const HOURS_VALUES = [
  '1 hour',
  '2 hours',
  '3 hours',
  '4 hours',
  '5 hours',
  '6 hours',
  '7 hours',
  '8 hours',
  '9 hours',
  '10 hours',
  '11 hours',
  '12 hours'
] as const;

// 8. paymentMethod (Enum, Required)
export const PAYMENT_METHODS = [
  'SIGNATURE',      // 싸인
  'DIRECT_PAYMENT', // 직수
  'CASH'            // 현수
] as const;

// 9. expectedPaymentDate (String, Required)
export const EXPECTED_PAYMENT_DATES = [
  'Same Day',
  '2 Days',
  '3 Days',
  '7 Days',
  'End of Month',
  'Beginning of Next Month',
  'End of Next Month',
  'Direct Confirmation'
] as const;

// 10. siteAddress (String, Required) - Any string
export const SITE_ADDRESS_EXAMPLES = [
  '123 Construction Site, Seoul, South Korea',
  '456 Industrial Complex, Busan, South Korea',
  '789 Building Project, Incheon, South Korea'
] as const;

// 11. contactNumber (String, Required) - Phone number format
export const CONTACT_NUMBER_EXAMPLES = [
  '010-1234-5678',
  '010-9876-5432',
  '010-5555-1234'
] as const;

// 12. workContents (String, Required) - Work details field
export const WORK_CONTENTS_EXAMPLES = [
  'Crane operation for building construction',
  'Heavy lifting operation for industrial project',
  'Equipment installation and setup',
  'Construction material handling'
] as const;

// 13. deliveryInfo (String, Required) - Note field
export const DELIVERY_INFO_EXAMPLES = [
  'Please arrive 30 minutes early for safety briefing',
  'Please bring safety equipment and arrive 15 minutes early',
  'Coordinate with building management before arrival',
  'Heavy equipment operation required'
] as const;
