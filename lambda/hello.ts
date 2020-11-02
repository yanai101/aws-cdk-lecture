exports.handler = async function (event: any) {
  console.log("req", JSON.stringify(event, null, 2));
  return {
    statusCode: 200,
    headers: {
      "Content-Type": "text/plain",
      "Access-Control-Allow-Origin": "*",
    },
    body: "hello from lambda",
  };
};
