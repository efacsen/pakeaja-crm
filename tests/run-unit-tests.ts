import { 
  calculateSurfaceArea,
  calculateCoatingQuantity,
  calculateLaborCost,
  calculateTotalCost,
  formatCurrency,
  formatArea,
  formatNumber,
} from '../src/lib/calculator-utils-extended';
import { 
  SurfaceMeasurement, 
  CoatingSystem,
} from '../src/types/calculator';

// Test runner
let passed = 0;
let failed = 0;

function test(name: string, fn: () => void) {
  try {
    fn();
    console.log(`✅ ${name}`);
    passed++;
  } catch (error) {
    console.log(`❌ ${name}`);
    console.error(`   ${error}`);
    failed++;
  }
}

function assert(condition: boolean, message: string) {
  if (!condition) {
    throw new Error(message);
  }
}

console.log('Running calculator utility tests...\n');

// Test calculateSurfaceArea
test('calculateSurfaceArea with valid inputs', () => {
  const surface: SurfaceMeasurement = {
    id: '1',
    name: 'Wall 1',
    length: 10,
    width: 5,
    quantity: 2,
    unit: 'sqm',
    surfaceType: 'wall',
    condition: 'good',
    preparation: 'light',
  };
  const result = calculateSurfaceArea(surface);
  assert(result === 100, `Expected 100, got ${result}`);
});

test('calculateSurfaceArea with zero dimensions', () => {
  const surface: SurfaceMeasurement = {
    id: '1',
    name: 'Wall 1',
    length: 0,
    width: 5,
    quantity: 1,
    unit: 'sqm',
    surfaceType: 'wall',
    condition: 'good',
    preparation: 'light',
  };
  const result = calculateSurfaceArea(surface);
  assert(result === 0, `Expected 0, got ${result}`);
});

// Test calculateCoatingQuantity
test('calculateCoatingQuantity with valid inputs', () => {
  const result = calculateCoatingQuantity(100, 10, 2, 10);
  assert(result === 22, `Expected 22, got ${result}`);
});

test('calculateCoatingQuantity with zero coverage', () => {
  const result = calculateCoatingQuantity(100, 0, 2, 10);
  assert(result === 0, `Expected 0, got ${result}`);
});

// Test calculateLaborCost
test('calculateLaborCost with light preparation', () => {
  const result = calculateLaborCost(100, 50000, 'light');
  assert(result === 5000000, `Expected 5000000, got ${result}`);
});

test('calculateLaborCost with medium preparation', () => {
  const result = calculateLaborCost(100, 50000, 'medium');
  assert(result === 6000000, `Expected 6000000, got ${result}`);
});

test('calculateLaborCost with heavy preparation', () => {
  const result = calculateLaborCost(100, 50000, 'heavy');
  assert(result === 7500000, `Expected 7500000, got ${result}`);
});

// Test formatCurrency
test('formatCurrency formats Indonesian Rupiah correctly', () => {
  const result = formatCurrency(1000000);
  assert(result.includes('1.000.000'), `Expected to contain 1.000.000, got ${result}`);
});

// Test formatArea
test('formatArea formats area correctly', () => {
  const result = formatArea(100.5);
  assert(result === '100.50 m²', `Expected "100.50 m²", got "${result}"`);
});

// Test formatNumber
test('formatNumber formats with decimal places', () => {
  const result = formatNumber(1234.567, 2);
  assert(result === '1,234.57', `Expected "1,234.57", got "${result}"`);
});

// Test calculateTotalCost
test('calculateTotalCost calculates correctly', () => {
  const surfaces: SurfaceMeasurement[] = [{
    id: '1',
    name: 'Wall 1',
    length: 10,
    width: 10,
    quantity: 1,
    unit: 'sqm',
    surfaceType: 'wall',
    condition: 'good',
    preparation: 'medium',
  }];

  const system: CoatingSystem = {
    id: '1',
    name: 'Epoxy System',
    products: [
      {
        product: {
          id: 'p1',
          name: 'Epoxy Primer',
          type: 'epoxy',
          category: 'primer',
          coverage: 10,
          pricePerLiter: 150000,
          dryingTime: 4,
          minTemperature: 10,
          maxTemperature: 35,
          shelfLife: 12,
        },
        coats: 1,
      },
    ],
    totalCoats: 1,
    totalDryingTime: 4,
  };

  const result = calculateTotalCost(surfaces, system, 50000, 0, 0, 11);
  assert(result.totalArea === 100, `Expected totalArea 100, got ${result.totalArea}`);
  assert(result.materialCost > 0, `Expected materialCost > 0, got ${result.materialCost}`);
  assert(result.laborCost > 0, `Expected laborCost > 0, got ${result.laborCost}`);
});

// Summary
console.log('\n=====================================');
console.log(`Total tests: ${passed + failed}`);
console.log(`Passed: ${passed}`);
console.log(`Failed: ${failed}`);
console.log('=====================================');

if (failed > 0) {
  process.exit(1);
}