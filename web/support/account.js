const { randomUUID, randomBytes } = require('node:crypto');
const assert = require('node:assert/strict');

function newAccount() {
  return {
    userName: `qa_${randomUUID().replaceAll('-', '')}`,
    password: `Qa!9${randomBytes(12).toString('hex')}`,
  };
}

async function register(api, account) {
  const response = await api.post('/Account/v1/User', { data: account });
  assert.equal(response.status(), 201, 'Registration must return 201');
  const body = await response.json();
  // Retain the identifier before subsequent assertions so teardown can run.
  account.userId = body.userID || body.userId;
  assert.ok(account.userId, 'Registration must return a user identifier');
  assert.equal(body.username, account.userName);
  assert.deepEqual(body.books, []);
}

async function tokenFor(api, account) {
  const response = await api.post('/Account/v1/GenerateToken', {
    data: { userName: account.userName, password: account.password },
  });
  assert.equal(response.status(), 200, 'Token request must return 200');
  const body = await response.json();
  assert.equal(body.status, 'Success');
  assert.ok(body.token, 'Token must be non-empty');
  return body.token;
}

async function deleteAccount(api, account) {
  if (!account?.userId) return;
  const token = await tokenFor(api, account);
  const response = await api.delete(`/Account/v1/User/${account.userId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  assert.equal(
    response.status(),
    204,
    'Disposable account cleanup must return 204',
  );
}
module.exports = { newAccount, register, deleteAccount };
