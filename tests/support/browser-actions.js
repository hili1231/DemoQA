// Accept dialogs while the triggering action is still executing. All promises
// are observed immediately, and a failed action cannot leave a listener behind.
async function actWithDialog(page, action, timeout = 20_000) {
  let handler;
  let timer;
  const dialogMessage = new Promise((resolve, reject) => {
    handler = (dialog) => {
      Promise.resolve()
        .then(async () => {
          const message = dialog.message();
          await dialog.accept();
          return message;
        })
        .then(resolve, reject);
    };
    page.once('dialog', handler);
    // A failure deadline, not a synchronization sleep.
    timer = setTimeout(
      () => reject(new Error('Expected browser dialog did not appear')),
      timeout,
    );
  });
  try {
    const [message] = await Promise.all([
      dialogMessage,
      Promise.resolve().then(action),
    ]);
    return message;
  } finally {
    clearTimeout(timer);
    page.off('dialog', handler);
  }
}

function isResponse(response, pathname, method) {
  return (
    new URL(response.url()).pathname === pathname &&
    response.request().method() === method
  );
}

module.exports = { actWithDialog, isResponse };
