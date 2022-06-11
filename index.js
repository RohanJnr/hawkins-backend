const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET,POST',
  "Access-Control-Allow-Headers": 'Origin, Content-Type, X-Auth-Token'
};

const hawkinsDiscordWebhookURL = "https://discord.com/api/webhooks/983731882304880690/HquILdCBnVOixQM3qJz3JFRGqsXekYlv4biCf5HGVIDcHIpE0l5iuxtmm9dG0w_zZY_T"


const problemStatementMap = {
  ps1: "In Kali's introductory scene in S2, the only valid identifier the police could've had for the white van she was in was the number plate. Write a CV algorithm to detect a number plate with the resources given.",
  Hdhsiendbd: "While Demogorgons are certainly impeccable at detecting blood across dimensions, when they finally find their target, their brain-equivalent organs must discern the contours of their target to recognize them. Implement an algorithm to detect the contours on the provided image and classify it's shape.",

  Susndhdusie: "The tendrils found throughout the upside down were seemingly very primary creatures with little sentience of their own. Common sense points to the possibility that they navigate using a very single dimensional viewpoint. Simulate the movement of a tendril assuming the presence of eye-like sensory input by constantly finding the midpoint of a path.",

  "7m3hduru3e": "Let's say you ran into a Flayed. Now, unless the Mind Flayer explicitly gives an instruction to said Flayed to behave in a hostile manner to you, it's just going to stand there giving you a menacing stare. Simulate this system by writing a face tracking algorithm with an accompanying arduino script to control two motors mounted to the camera (one per dimension of movement). The camera must move in such a way that the camera tracks the face as it moves (as seen in the test video). Create a tinkercad project to simulate the physical build.",

  "83bbeuri3lss": `Imagine an exceedingly deadly scenario where the Mind Flayer actually uses the Flayed as normally functioning spies to reccy the surroundings in a human dominated area before attacking. Being unfamiliar with the way we've constructed out surroundings and having a total lack of empathy, the Mind Flayer needs to teach it's drones to react appropriately to avoid accidental deaths of other humans rather than coldly murdering them in broad daylight and moving on as if nothing happened.

  Write an algorithm to help a Flayed human see and detect when a pedestrian is crossing a lane and when he's on the edge.
  `
}

const resourcesLinks = {
  ps1: "https://drive.google.com/file/d/1zK5Uq2PNl9_kVWmotVMwbtBWalJwR-ee/view?usp=sharing",
  Hdhsiendbd: "https://drive.google.com/file/d/1By83GDcZLjv1UaMZApJvNSiPfVQp36WT/view?usp=sharing",
  Susndhdusie: "https://drive.google.com/file/d/1sVAE6e7cPKaDGZ2Pe4hZ4QFPmqbmY9pY/view?usp=sharing",
  "7m3hduru3e": "https://drive.google.com/file/d/1WuPFu5LvT1Rchs5-3FSaHmyFYcQ6Ddb5/view?usp=sharing",
  "83bbeuri3lss": "https://drive.google.com/file/d/1LEQx7BS4-sANF459T8n7jGmL3aa6vBcp/view?usp=sharing"

}

async function triggerDiscordWebhook(name, code, valid){
  const dateTimeNow = new Date()

  const embed = {
    "content": null,
    "embeds": [
      {
        "title": "Escape From Hawkins",
        "description": `**Team Name**\n${name}\n**${valid ? "Valid":"Invalid"} Code Accessed**\n${code} ${valid ? "✅":"❌"}`,
        "color": valid ? 5373753:16728385,
        "footer": {
          "text": dateTimeNow.toLocaleString(undefined, {timeZone: 'Asia/Kolkata'})
        }
      }
    ],
    "username": "Escape From Hawkins",
    "attachments": []
  }

  console.log("Sending webhook...")

  const res = await fetch(hawkinsDiscordWebhookURL, {
    method: "post",
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(embed)
  })

}


async function handleRequest(request, event) {

  const content = await request.json()

  const code = content.code
  const name = content.name

  const problem_statement = problemStatementMap[code]

  if (!problem_statement){
    const errorRes = new Response(null, {
      status: 404,
      statusText: "Invalid code."
    })

    errorRes.headers.set('Access-Control-Allow-Origin', "*");

    event.waitUntil(triggerDiscordWebhook(name, code, false))
    return errorRes
  }

  data = JSON.stringify({
    "content": problem_statement,
    "resource": resourcesLinks[code]
  })
  // Recreate the response so you can modify the headers
  response = new Response(data);

  // Set CORS headers
  response.headers.set('Access-Control-Allow-Origin', "*");

  // Append to/Add Vary header so browser will cache response correctly
  response.headers.append('Vary', 'Origin');

  event.waitUntil(triggerDiscordWebhook(name, code, true))
  return response;
}

function handleOptions(request) {
  // Make sure the necessary headers are present
  // for this to be a valid pre-flight request
  let headers = request.headers;
  if (
    headers.get('Origin') !== null &&
    headers.get('Access-Control-Request-Method') !== null &&
    headers.get('Access-Control-Request-Headers') !== null
  ) {
    // Handle CORS pre-flight request.
    // If you want to check or reject the requested method + headers
    // you can do that here.
    let respHeaders = {
      ...corsHeaders,
      // Allow all future content Request headers to go back to browser
      // such as Authorization (Bearer) or X-Client-Name-Version
      'Access-Control-Allow-Headers': request.headers.get('Access-Control-Request-Headers'),
    };

    return new Response(null, {
      headers: respHeaders,
    });
  } else {
    // Handle standard OPTIONS request.
    // If you want to allow other HTTP Methods, you can do that here.
    return new Response(null, {
      headers: {
        Allow: 'GET, HEAD, POST, OPTIONS',
      },
    });
  }
}

addEventListener('fetch', event => {
  const request = event.request;
  if (request.method === 'OPTIONS') {
    // Handle CORS preflight requests
    event.respondWith(handleOptions(request));
  } else if (request.method === 'POST') {
    // Handle requests to the API server
    event.respondWith(handleRequest(request, event));
  } else {
    event.respondWith(
      new Response("Helo hawkins, do not cheat!")
    );
  }

});