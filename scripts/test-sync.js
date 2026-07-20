const fs = require('fs');
const path = require('path');

function runTest() {
  const syncFilePath = path.join(__dirname, '../src/lib/imograficSync.ts');
  const code = fs.readFileSync(syncFilePath, 'utf-8');

  // Look for the payload assignment: const payload = { ... };
  const payloadMatch = code.match(/const payload = \{([\s\S]+?)\};/);
  
  if (!payloadMatch) {
    console.error('TEST FAILED: Could not find payload object in imograficSync.ts');
    process.exit(1);
  }

  // Extract the keys from the payload
  const payloadCode = payloadMatch[1];
  const keys = [];
  
  // A simple regex to find the keys. It matches "key: value" or "key," 
  const lines = payloadCode.split('\n');
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('//')) continue;
    
    // match: "key:"
    const keyMatch = trimmed.match(/^([a-zA-Z0-9_]+)\s*:/);
    if (keyMatch) {
      keys.push(keyMatch[1]);
    }
  }

  const expectedFields = [
    'external_id', 'slug', 'title', 'description', 'price', 'currency',
    'transaction_type', 'property_type',
    'county', 'city', 'zone', 'address',
    'surface_useable', 'surface_total', 'surface_land', 'front_stradal',
    'rooms', 'bedrooms', 'bathrooms', 'floor', 'building_floors',
    'building_construction_year', 'partitioning', 'comfort',
    'status', 'images', 'tags'
  ];

  keys.sort();
  expectedFields.sort();

  const missingInCode = expectedFields.filter(f => !keys.includes(f));
  const newInCode = keys.filter(f => !expectedFields.includes(f));

  if (missingInCode.length > 0 || newInCode.length > 0) {
    console.error('--- SYNC TEST FAILED ---');
    console.error('Mismatched fields in syncPropertyToImografic payload!');
    console.error('Daca ai modificat/adaugat campuri noi (sau scos) la anunturi, trebuie sa actualizezi:');
    console.error('1. g:\\Apps\\siena\\src\\lib\\imograficSync.ts (in payload)');
    console.error('2. scriptul asta de test g:\\Apps\\siena\\scripts\\test-sync.js cu lista de asteptat');
    console.error('3. SI OBLIGATORIU PE SERVER-UL IMOGRAFIC: g:\\Apps\\ANCPI\\src\\app\\[locale]\\api\\agency-sync\\route.ts');
    if (missingInCode.length > 0) console.error('- Expected fields but missing in code:', missingInCode);
    if (newInCode.length > 0) console.error('- New fields in code but not expected:', newInCode);
    process.exit(1);
  } else {
    console.log('SYNC TEST PASSED: Structure matches expected fields.');
  }
}

runTest();
