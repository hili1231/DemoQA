// Evaluated by Karate's GraalJS engine, not by Node or Cucumber.
function fn() {
  var baseURL = karate.properties['demoqa.baseUrl'] || 'https://demoqa.com';
  var cleanup = karate.read('file:tests/support/karate-cleanup.js');
  var uuid = java.util.UUID.randomUUID() + '';
  var account = {
    user: {
      userName: 'user_' + uuid,
      password: 'Qa!9' + java.util.UUID.randomUUID(),
    },
    userId: null,
    token: null,
    deleted: false,
  };
  karate.configure('connectTimeout', 20000);
  karate.configure('readTimeout', 20000);
  karate.configure('afterScenario', function () {
    var current = karate.get('account');
    if (current && current.userId && !current.deleted) {
      try {
        cleanup(baseURL, current);
      } catch (error) {
        karate.write(
          { userId: current.userId },
          'cleanup-errors/' +
            karate.properties['demoqa.cleanupRun'] +
            '/' +
            java.util.UUID.randomUUID() +
            '.json',
        );
        karate.log(
          'Disposable account cleanup failed; investigate account ID:',
          current.userId,
        );
        throw error;
      }
    }
  });
  return {
    baseURL: baseURL,
    account: account,
  };
}
