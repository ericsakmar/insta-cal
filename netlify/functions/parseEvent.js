const chrono = require("chrono-node");
const htmlmetaparser = require("htmlmetaparser");
const htmlparser2 = require("htmlparser2");
const got = require("got");

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

    const p = new htmlparser2.Parser(h, { decodeEntities: true });
    p.write(body);
    p.done();
  });

const getEventData = (meta) => {
  const jsonLd = meta.jsonld[0];

  const eventData = {
    date: chrono.parseDate(jsonLd.caption),
    description: jsonLd.caption,
    location: jsonLd.contentLocation ? jsonLd.contentLocation.name : undefined,
  };

  return eventData;
};

exports.handler = async function (event, context) {
  const { url } = event.queryStringParameters;
  // const meta = await getMeta(url);
  // const eventData = getEventData(meta);

  const fake = {
    date: "2021-08-07T16:00:00.000Z",
    description:
      "First show in a long time and the first one with @whats_a_cormac on bass is August 7th at @thunderbirdmusichall supporting @apolojeesus\n\nSo excited to play for you. Come party!",
  };

  return {
    statusCode: 200,
    body: JSON.stringify(fake),
  };
};
