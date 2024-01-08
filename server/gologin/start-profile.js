const startProfile = async (profileId) => {
  var request = await import('request');
  var options = {
    method: 'POST',
    url: 'http://localhost:36912/browser/start-profile',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      profileId: profileId,
      sync: false,
    }),
  };
  request(options, function (error, response) {
    if (error) throw new Error(error);
    console.log(response.body);
  });
};

// copy thư mục fonts từ %TEMP%\GOLOGIN\PROFILES\<YOUR_PROFILE_ID>
