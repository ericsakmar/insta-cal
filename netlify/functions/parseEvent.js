const chrono = require("chrono-node");
const htmlmetaparser = require("htmlmetaparser");
const htmlparser2 = require("htmlparser2");
const got = require("got");

// https%3A%2F%2Fwww.instagram.com%2Fp%2FCQlKElOFl0X%2F

const getMeta = (url) =>
  new Promise(async (resolve, reject) => {
    const h = new htmlmetaparser.Handler(
      (err, res) => {
        if (err) {
          reject(err);
        } else {
          resolve(res);
        }
      },
      { url }
    );

    const { body } = await got(url);
    console.log(JSON.stringify(body, undefined, 2))

    const p = new htmlparser2.Parser(h, { decodeEntities: true });
    p.write(body);
    p.done();
  });

const getEventData = (meta) => {
  const jsonLd = meta.jsonld[0];
  console.log(jsonLd);

  const eventData = {
    date: chrono.parseDate(jsonLd.caption),
    description: jsonLd.caption,
    location: jsonLd.contentLocation.name,
  };

  return eventData;
};

exports.handler = async function (event, context) {
  const { url } = event.queryStringParameters;
  console.log(url);
  const meta = await getMeta(url);
  const eventData = getEventData(meta);

  return {
    statusCode: 200,
    body: JSON.stringify(eventData),
  };
};
