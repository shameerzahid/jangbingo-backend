# JangbiGO API - Frontend Testing Reference

## Overview
This document provides all allowed values and data for testing each job post flow.

---

## 1. JOB POST TYPES

### Available Types:
- `GLOBAL` - Public job posts visible to all users
- `DESIGNATED` - Job posts sent to specific users
- `COMMUNITY` - Job posts within a specific community

### Available Categories:
- `SKY` - Crane/Sky equipment
- `LADDER` - Ladder truck equipment

---

## 2. SKY EQUIPMENT FLOWS

### A. Global Sky Job Post
```json
{
  "type": "GLOBAL",
  "category": "SKY",
  "equipmentType": "3.5 ton",
  "equipmentLength": 30,
  "workDateType": "TODAY",
  "arrivalTime": "09:00",
  "workSchedule": "1 day",
  "isNightWork": false,
  "paymentMethod": "DIRECT_PAYMENT",
  "expectedPaymentDate": "Same Day",
  "withFee": true,
  "siteAddress": "123 Construction Site, Seoul, South Korea",
  "contactNumber": "010-1234-5678",
  "workContents": "Crane operation for building construction",
  "deliveryInfo": "Please arrive 30 minutes early"
}
```

#### Sky Equipment Types (equipmentType):
- `"1 ton"`, `"2.5 ton"`, `"3.5 ton"`, `"5 ton"`
- `"18 ton"`, `"19 ton"`
- `"3.5 tons of bending"`, `"Refraction 5 tons"`
- `"Refraction 60M"`, `"Refraction 70M"`

#### Equipment Length (equipmentLength):
- Range: `15` to `70` meters
- Common values: `15, 20, 25, 30, 35, 40, 45, 50, 55, 60, 65, 70`

#### Work Schedule (workSchedule):
- `"half day morning"`, `"half day evening"`
- `"1 day"`, `"2 days"`, `"3 days"`
- `"monthly rent"`
- `"1 hour"`, `"2 hours"`, `"3 hours"`, `"4 hours"`, `"5 hours"`
- `"6 hours"`, `"7 hours"`, `"8 hours"`, `"9 hours"`, `"10 hours"`
- `"11 hours"`, `"12 hours"`

### B. Designated Sky Job Post
```json
{
  "type": "DESIGNATED",
  "category": "SKY",
  "designatedUserId": 2,
  "equipmentType": "5 ton",
  "equipmentLength": 40,
  "workDateType": "TOMORROW",
  "arrivalTime": "08:00",
  "workSchedule": "2 days",
  "isNightWork": false,
  "paymentMethod": "SIGNATURE",
  "expectedPaymentDate": "2 days",
  "withFee": true,
  "siteAddress": "456 Industrial Site, Busan, South Korea",
  "contactNumber": "010-9876-5432",
  "workContents": "Heavy lifting operation",
  "deliveryInfo": "Coordinate with designated operator"
}
```

#### Additional Field:
- `designatedUserId`: Integer (user ID to assign the job to)

### C. Community Sky Job Post
```json
{
  "type": "COMMUNITY",
  "category": "SKY",
  "communityId": 1,
  "equipmentType": "3.5 ton",
  "equipmentLength": 30,
  "workDateType": "TODAY",
  "arrivalTime": "10:00",
  "workSchedule": "1 day",
  "isNightWork": false,
  "paymentMethod": "DIRECT_PAYMENT",
  "expectedPaymentDate": "Same Day",
  "withFee": false,
  "siteAddress": "789 Community Site, Incheon, South Korea",
  "contactNumber": "010-5555-1234",
  "workContents": "Community construction project",
  "deliveryInfo": "Community members only"
}
```

#### Additional Field:
- `communityId`: Integer (community ID)

---

## 3. LADDER EQUIPMENT FLOWS

### A. Global Ladder Job Post (Moving Goods)
```json
{
  "type": "GLOBAL",
  "category": "LADDER",
  "ladderType": "MOVING_GOODS",
  "luggageVolume": "5톤짐",
  "workFloor": 10,
  "overallHeight": 30,
  "loadingUnloadingService": "BOTH",
  "travelDistance": "WITHIN_JURISDICTION",
  "dumpService": false,
  "movingFee": 3000,
  "workDateType": "TODAY",
  "arrivalTime": "09:00",
  "isNightWork": false,
  "paymentMethod": "DIRECT_PAYMENT",
  "expectedPaymentDate": "Same Day",
  "withFee": true,
  "siteAddress": "123 Apartment Complex, Seoul, South Korea",
  "contactNumber": "010-1234-5678",
  "workContents": "Moving furniture to 10th floor",
  "deliveryInfo": "Coordinate with building management"
}
```

### B. Global Ladder Job Post (On Site)
```json
{
  "type": "GLOBAL",
  "category": "LADDER",
  "ladderType": "ON_SITE",
  "luggageVolume": "10톤짐",
  "workFloor": 15,
  "overallHeight": 45,
  "ladderWorkDuration": "8시간",
  "ladderWorkHours": 2,
  "loadingUnloadingService": "NONE",
  "travelDistance": "OUTSIDE_JURISDICTION",
  "dumpService": true,
  "onSiteFee": 5000,
  "workDateType": "TOMORROW",
  "arrivalTime": "08:00",
  "isNightWork": false,
  "paymentMethod": "DIRECT_PAYMENT",
  "expectedPaymentDate": "Same Day",
  "withFee": true,
  "siteAddress": "456 Construction Site, Busan, South Korea",
  "contactNumber": "010-9876-5432",
  "workContents": "Demolition",
  "deliveryInfo": "Heavy equipment operation required"
}
```

#### Ladder Types (ladderType):
- `"MOVING_GOODS"` - For moving furniture/appliances
- `"ON_SITE"` - For construction/repair work

#### Luggage Volume (luggageVolume):
- `"1톤짐"`, `"2.5톤짐"`, `"5톤짐"`, `"6톤짐"`
- `"7.5톤짐"`, `"10톤짐"`, `"12.5톤짐"`, `"15톤짐"`
- `"17.5톤짐"`, `"20톤짐"`

#### Work Floor (workFloor):
- Range: `2` to `25` (floor number)
- Examples: `2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25`

#### Overall Height (overallHeight):
- Range: `5` to `65` meters
- Based on floor: 2층=13M, 3층=18M, 4층=23M, 5층=28M, etc.

#### Loading/Unloading Service (loadingUnloadingService):
- `"NONE"` - No loading/unloading help
- `"LOADING"` - Loading service only
- `"UNLOADING"` - Unloading service only
- `"BOTH"` - Both loading and unloading

#### Travel Distance (travelDistance):
- `"WITHIN_JURISDICTION"` - Local area
- `"OUTSIDE_JURISDICTION"` - Outside local area

#### Ladder Work Duration (for ON_SITE only):
- `"1시간"` - 1 hour (basic)
- `"4시간"` - 4 hours (half day)
- `"8시간"` - 8 hours (full day)
- `"추가1시간"` - Additional 1 hour

#### Ladder Work Hours (for ON_SITE when "추가1시간" selected):
- Range: `1` to `24` (additional hours)

#### Work Contents (for LADDER):
**Moving Goods:**
- `"Moving furniture"`, `"Appliance delivery"`, `"Office relocation"`

**On Site:**
- `"Demolition"` - Demolition work
- `"Waste"` - Waste disposal work
- `"Material Lifting"` - Material lifting work

### C. Designated Ladder Job Posts
Same as Global but add:
- `designatedUserId`: Integer (user ID)

### D. Community Ladder Job Posts
Same as Global but add:
- `communityId`: Integer (community ID)

---

## 4. COMMON FIELDS

### Work Date Type (workDateType):
- **Format:** Any string (free-form text)
- **Examples:** `"URGENT"`, `"TODAY"`, `"TOMORROW"`, `"CUSTOM_DATE"`, `"Next Week"`, `"ASAP"`, `"Flexible"`
- **Note:** No longer restricted to specific enum values

### Arrival Time (arrivalTime):
- Format: `"HH:MM"` (24-hour format)
- Examples: `"06:30"`, `"08:00"`, `"09:30"`, `"14:00"`, `"16:45"`

### Night Work (isNightWork):
- `true` - Night work (1.5x price, special pricing)
- `false` - Regular work

### Payment Method (paymentMethod):
- `"SIGNATURE"` - 싸인 (Signature)
- `"DIRECT_PAYMENT"` - 직수 (Direct Payment)
- `"CASH"` - 현수 (Cash)

### Expected Payment Date (expectedPaymentDate):
**English:**
- `"Same Day"`, `"2 days"`, `"7 days"`
- `"End of Month"`, `"Beginning of Next Month"`, `"End of Next Month"`
- `"Direct Confirmation"`

**Korean:**
- `"당일"`, `"이틀"`, `"7일"`
- `"월말"`, `"익월초"`, `"익월말"`
- `"직접확인"`

### With Fee (withFee):
- `true` - Apply platform fees
- `false` - No platform fees
- **REQUIRED for COMMUNITY job posts** - User must explicitly choose

---

## 5. PRICING FIELDS

### Base Price (basePrice):
- Range: `50000` to `5000000` KRW (auto-calculated)
- Examples: `80000, 120000, 200000, 350000`

### Final Price (finalPrice):
- Range: `50000` to `5000000` KRW (base + adjustments)

### Price Adjustment (priceAdjustment):
- Range: `-100000` to `100000` KRW
- Increments: `1000` KRW units
- Examples: `-5000, -2000, 0, 2000, 5000, 10000`

### Total Work Fee (totalWorkFee):
- Range: `5000` to `500000` KRW (10% of total work)

### Unit Price Fee (unitPriceFee):
- Range: `1000` to `50000` KRW

### Moving Fee (movingFee) - for LADDER MOVING_GOODS:
- Base: `3000` KRW
- Range: `2000` to `10000` KRW

### On-site Fee (onSiteFee) - for LADDER ON_SITE:
- Base: `5000` KRW
- Range: `3000` to `15000` KRW

### Community Fees (for COMMUNITY type):
- `communityWorkFee`: `0` to `100` (percentage)
- `communitySupportFee`: `0` to `100` (percentage)

---

## 6. CONTACT FIELDS

### Site Address (siteAddress):
- Format: Full address string
- Examples:
  - `"123 Construction Site, Seoul, South Korea"`
  - `"456 Industrial Complex, Busan, South Korea"`
  - `"789 Apartment Building, Incheon, South Korea"`

### Contact Number (contactNumber):
- Format: Korean phone number
- Examples: `"010-1234-5678"`, `"010-9876-5432"`, `"010-5555-1234"`

### Work Contents (workContents):
- Format: Description string
- Examples:
  - `"Crane operation for building construction"`
  - `"Heavy lifting operation"`
  - `"Moving furniture to 10th floor"`
  - `"Demolition work"`

### Delivery Info (deliveryInfo):
- Format: Instruction string
- Examples:
  - `"Please arrive 30 minutes early"`
  - `"Coordinate with building management"`
  - `"Community members only"`

---

## 7. SAMPLE TEST DATA SETS

### Test Set 1: Basic Global Sky Job
```json
{
  "type": "GLOBAL",
  "category": "SKY",
  "equipmentType": "3.5 ton",
  "equipmentLength": 30,
  "workDateType": "TODAY",
  "arrivalTime": "09:00",
  "workSchedule": "1 day",
  "isNightWork": false,
  "paymentMethod": "DIRECT_PAYMENT",
  "expectedPaymentDate": "Same Day",
  "withFee": true,
  "priceAdjustment": 0,
  "siteAddress": "123 Test Site, Seoul",
  "contactNumber": "010-1234-5678",
  "workContents": "Test crane operation",
  "deliveryInfo": "Test delivery instructions"
}
```

### Test Set 2: Advanced Ladder Moving Job
```json
{
  "type": "DESIGNATED",
  "category": "LADDER",
  "designatedUserId": 2,
  "ladderType": "MOVING_GOODS",
  "luggageVolume": "7.5톤짐",
  "workFloor": 15,
  "overallHeight": 45,
  "loadingUnloadingService": "BOTH",
  "travelDistance": "OUTSIDE_JURISDICTION",
  "dumpService": true,
  "movingFee": 4000,
  "workDateType": "CUSTOM_DATE",
  "workDate": "2024-01-30T08:00:00Z",
  "arrivalTime": "08:00",
  "isNightWork": false,
  "paymentMethod": "SIGNATURE",
  "expectedPaymentDate": "7일",
  "withFee": true,
  "priceAdjustment": 5000,
  "siteAddress": "456 High-rise Building, Busan",
  "contactNumber": "010-9876-5432",
  "workContents": "Moving office furniture",
  "deliveryInfo": "Coordinate with designated driver"
}
```

### Test Set 3: Community On-Site Job
```json
{
  "type": "COMMUNITY",
  "category": "LADDER",
  "communityId": 1,
  "ladderType": "ON_SITE",
  "luggageVolume": "20톤짐",
  "workFloor": 20,
  "overallHeight": 60,
  "ladderWorkDuration": "8시간",
  "ladderWorkHours": 2,
  "loadingUnloadingService": "NONE",
  "travelDistance": "WITHIN_JURISDICTION",
  "dumpService": true,
  "onSiteFee": 8000,
  "workDateType": "TOMORROW",
  "arrivalTime": "07:00",
  "isNightWork": false,
  "paymentMethod": "CASH",
  "expectedPaymentDate": "월말",
  "withFee": false,
  "siteAddress": "789 Community Construction Site",
  "contactNumber": "010-5555-1234",
  "workContents": "Material Lifting",
  "deliveryInfo": "Community project coordination required"
}
```

---

## 8. VALIDATION RULES

### Required Fields:
- `type`, `category` - Always required
- `designatedUserId` - Required for DESIGNATED type
- `communityId` - Required for COMMUNITY type

### Sky Category Requirements:
- `equipmentType` and `equipmentLength` - Required
- `workSchedule` - Required

### Ladder Category Requirements:
- `ladderType` - Required
- `luggageVolume` and `workFloor` - Required
- `ladderWorkDuration` - Required for ON_SITE type only

### Field Ranges:
- `workFloor`: 2-25
- `overallHeight`: 1-100 meters
- `equipmentLength`: 15-70 meters
- `ladderWorkHours`: 1-24 hours
- `priceAdjustment`: -100000 to 100000 KRW
- `communityWorkFee`: 0-100%
- `communitySupportFee`: 0-100%

---

## 9. ERROR SCENARIOS TO TEST

### Invalid Data:
```json
{
  "type": "INVALID_TYPE",  // Should fail
  "category": "SKY",
  "workFloor": 50,         // Should fail (max 25)
  "equipmentLength": 100,  // Should fail (max 70)
  "paymentMethod": "BITCOIN" // Should fail
}
```

### Missing Required Fields:
```json
{
  "type": "DESIGNATED",
  // Missing designatedUserId - should fail
  "category": "LADDER"
  // Missing ladderType - should fail
}
```

This reference covers all possible values and combinations for testing the JangbiGO API endpoints. Use these examples to test different scenarios and edge cases.
