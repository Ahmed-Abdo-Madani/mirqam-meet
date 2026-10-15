import assert from 'assert';

async function testWorkspace() {
  console.log('--- 1. Testing GET /api/health ---');
  const healthRes = await fetch('http://localhost:3000/api/health');
  assert.strictEqual(healthRes.status, 200);
  const health = await healthRes.json();
  console.log('Health:', health.service, health.version, health.company);
  assert.strictEqual(health.cr, '7055011105');

  console.log('\n--- 2. Testing GET /api/workspace ---');
  const wsRes = await fetch('http://localhost:3000/api/workspace');
  assert.strictEqual(wsRes.status, 200);
  const ws = await wsRes.json();
  console.log('Company:', ws.company.nameAr);
  console.log('CR:', ws.company.cr);
  console.log('Tasks Count:', ws.tasks.length);
  console.log('Sales Count:', ws.sales.length);
  console.log('Team Members:', ws.team.length);
  console.log('Core Members (3):', ws.team.filter(m => m.type === 'core').map(m => m.nameAr).join(', '));
  console.log('Sales Reps:', ws.team.filter(m => m.type === 'sales').map(m => m.nameAr).join(', '));
  console.log('Stats:', ws.stats);

  assert.strictEqual(ws.team.filter(m => m.type === 'core').length, 3);
  assert.ok(ws.tasks.length >= 5);
  assert.ok(ws.sales.length >= 5);

  console.log('\n--- 3. Testing POST /api/tasks ---');
  const taskRes = await fetch('http://localhost:3000/api/tasks', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      title: 'مهمة اختبارية للنظام',
      description: 'اختبار API المهام',
      assignedTo: 'emp-1',
      priority: 'urgent',
      dueDate: '2026-10-25'
    })
  });
  assert.strictEqual(taskRes.status, 201);
  const taskData = await taskRes.json();
  console.log('Created Task ID:', taskData.newTask.id);

  console.log('\n--- 4. Testing PATCH /api/tasks/:id ---');
  const updateRes = await fetch(`http://localhost:3000/api/tasks/${taskData.newTask.id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status: 'completed' })
  });
  assert.strictEqual(updateRes.status, 200);
  const updatedTask = await updateRes.json();
  assert.strictEqual(updatedTask.updatedTask.status, 'completed');
  console.log('Task Status Updated to Completed:', updatedTask.updatedTask.status);

  console.log('\n--- 5. Testing DELETE /api/tasks/:id ---');
  const delTaskRes = await fetch(`http://localhost:3000/api/tasks/${taskData.newTask.id}`, {
    method: 'DELETE'
  });
  assert.strictEqual(delTaskRes.status, 200);
  console.log('Task Deleted Successfully.');

  console.log('\n--- 6. Testing POST /api/sales ---');
  const saleRes = await fetch('http://localhost:3000/api/sales', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      clientName: 'متجر اختبار تجريبي',
      contactPhone: '+966 50 111 9999',
      salesRepId: 'sales-1',
      packageValue: 5000,
      commissionAmount: 500,
      status: 'pending',
      notes: 'عميل تجريبي للاختبار'
    })
  });
  assert.strictEqual(saleRes.status, 201);
  const saleData = await saleRes.json();
  console.log('Created Sale ID:', saleData.newSale.id, 'Commission:', saleData.newSale.commissionAmount);

  console.log('\n--- 7. Testing PATCH /api/sales/:id ---');
  const updateSaleRes = await fetch(`http://localhost:3000/api/sales/${saleData.newSale.id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status: 'paid' })
  });
  assert.strictEqual(updateSaleRes.status, 200);
  const updatedSale = await updateSaleRes.json();
  assert.strictEqual(updatedSale.updatedSale.status, 'paid');
  console.log('Sale Status Updated to Paid.');

  console.log('\n--- 8. Testing DELETE /api/sales/:id ---');
  const delSaleRes = await fetch(`http://localhost:3000/api/sales/${saleData.newSale.id}`, {
    method: 'DELETE'
  });
  assert.strictEqual(delSaleRes.status, 200);
  console.log('Sale Record Deleted Successfully.');

  console.log('\n✅ ALL WORKSPACE DASHBOARD TESTS PASSED 100%!');
}

testWorkspace().catch(e => {
  console.error('❌ Test failed:', e);
  process.exit(1);
});
