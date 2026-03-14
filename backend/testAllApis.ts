/// <reference types="node" />
const API_BASE = 'http://localhost:3001/api';

async function testApi() {
  console.log('--- STARTING COMPREHENSIVE API TESTS ---');

  // 1. Auth Tests
  console.log('\n[1] Testing Auth Endpoints...');
  let token = '';
  try {
    const loginRes = await fetch(`${API_BASE}/auth/signin`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'admin@crm.com', password: 'password123' })
    });
    const loginData = await loginRes.json();
    if (!loginRes.ok) throw new Error(JSON.stringify(loginData));
    token = loginData.session.access_token;
    console.log('✅ POST /auth/signin successful');
  } catch (err: any) {
    console.error('❌ POST /auth/signin failed:', err.message);
    process.exit(1);
  }

  const getOptions = {
    headers: { Authorization: `Bearer ${token}` }
  };

  // 2. Core Entities Tests (GETs)
  const endpoints = [
    '/users',
    '/accounts',
    '/contacts',
    '/leads',
    '/opportunities',
    '/pipeline',
    '/pipeline/stages',
    '/quotes',
    '/campaigns',
    '/products',
    '/tickets',
    '/activities'
  ];

  console.log('\n[2] Testing GET Endpoints...');
  for (const ep of endpoints) {
    try {
      const res = await fetch(`${API_BASE}${ep}`, getOptions);
      const data = await res.json();
      if (!res.ok) throw new Error(JSON.stringify(data));
      const isArray = Array.isArray(data);
      const len = isArray ? data.length : (data ? 'Object records' : 0);
      console.log(`✅ GET ${ep} -> Success (Type: ${isArray ? 'Array' : 'Object'}, Size: ${len})`);
    } catch (err: any) {
      console.error(`❌ GET ${ep} failed:`, err.message);
    }
  }

  // 3. Simple Create Test
  console.log('\n[3] Testing simple POST Creates...');
  try {
    const accRes = await fetch(`${API_BASE}/accounts`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ name: 'Test Account POST' })
    });
    const accData = await accRes.json();
    if (!accRes.ok) throw new Error(JSON.stringify(accData));
    console.log(`✅ POST /accounts -> Created ID: ${accData.id}`);

    const contactRes = await fetch(`${API_BASE}/contacts`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ firstName: 'Bob', lastName: 'Test', accountId: accData.id })
    });
    const contactData = await contactRes.json();
    if (!contactRes.ok) throw new Error(JSON.stringify(contactData));
    console.log(`✅ POST /contacts -> Created ID: ${contactData.id}`);
  } catch (err: any) {
    console.error(`❌ POST endpoints failed:`, err.message);
  }

  console.log('\n--- TESTS COMPLETED ---');
}

testApi();
