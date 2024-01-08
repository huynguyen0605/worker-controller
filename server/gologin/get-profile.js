const getProfile = async (profileId, gologinToken) => {
  var request = await import('request');
  var options = {
    method: 'GET',
    url: `https://api.gologin.com/browser/${profileId}`,
    headers: {
      Authorization: `Bearer ${gologinToken}`,
    },
  };
  request(options, function (error, response) {
    if (error) throw new Error(error);
    console.log(response.body);
  });
};
