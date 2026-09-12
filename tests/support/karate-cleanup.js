function fn(baseURL, account) {
  if (!account || !account.userId || account.deleted) return;
  var Http = Java.type('com.intuit.karate.Http');
  function client() {
    return Http.to(baseURL)
      .configure('connectTimeout', 20000)
      .configure('readTimeout', 20000);
  }
  var tokenResponse = client()
    .path('/Account/v1/GenerateToken')
    .postJson(JSON.stringify(account.user));
  if (tokenResponse.status !== 200)
    throw new Error('Cleanup token request failed');
  var body = tokenResponse.body;
  if (body.status !== 'Success' || !body.token)
    throw new Error('Cleanup token was not issued');
  var response = client()
    .path('/Account/v1/User', account.userId)
    .header('Authorization', 'Bearer ' + body.token)
    .delete();
  if (response.status !== 204)
    throw new Error('Disposable account deletion failed');
  account.deleted = true;
}
