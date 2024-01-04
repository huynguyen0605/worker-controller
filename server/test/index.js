const wrap = (s) => '{ return ' + s + ' };';
(async () => {
  const res = await fetch(`http://localhost:3000/api/interactions?page=1&pageSize=100`);

  const steps = await res.json();

  let lastStepResult = {};

  for (const step of steps) {
    const body = step.content;
    const stringifyParams = step.params && step.params != '' ? step.params : '{}';
    console.log('huynvq::=========>strinfifyParams', stringifyParams);
    const params = JSON.parse(stringifyParams);

    const executeFunction = new Function(wrap(body));

    lastStepResult = await executeFunction.call(null).call(null, {
      ...params,
      ...lastStepResult,
    });
  }
})();
