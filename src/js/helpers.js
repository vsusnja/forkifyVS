import { TIMEOUT_SEC } from './config';
// export const getJSON = async function (url) {
//   try {
//     const res = await Promise.race([fetch(url), timeout(TIMEOUT_SEC)]);
//     const data = await res.json();
//     if (!res.ok)
//       throw new Error(
//         `There is a bug!${data.message} Res status is: ${res.status}`
//       );
//     return data; // this functions returns data, so this data is going to be the resolved value of the promise that the getjson function returns
//   } catch (err) {
//     throw err;
//     //In practical terms, you might use this pattern when you want to catch an error at a specific level of your code, log it, and then let a higher-level error handler or the global error handler deal with it.
//     // u principu to se koristi kad ne zelimo tu da nam prikaze error vec na nekome drugome mjestu, throw znaci kao prebaci dalje
//   }
// };

// export const sendJSON = async function (url, uploadData) {
//   try {
//     const fetchPro =
//     const res = await Promise.race([fetchPro, timeout(TIMEOUT_SEC)]);
//     const data = await res.json();
//     if (!res.ok)
//       throw new Error(
//         `There is a bug!${data.message} Res status is: ${res.status}`
//       );
//     return data; // this functions returns data, so this data is going to be the resolved value of the promise that the getjson function returns
//   } catch (err) {
//     throw err;
//   }
// };

const timeout = function (s) {
  return new Promise(function (_, reject) {
    setTimeout(function () {
      reject(new Error(`Request took too long! Timeout after ${s} second`));
    }, s * 1000);
  });
};

export const AJAX = async function (url, uploadData = undefined) {
  try {
    console.log(url);
    const fetchPro = uploadData
      ? fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json', // we say that the data we are going to send is gonna be in the json format
          },
          body: JSON.stringify(uploadData),
        })
      : fetch(url);

    const res = await Promise.race([fetchPro, timeout(TIMEOUT_SEC)]);
    const data = await res.json();
    if (!res.ok)
      throw new Error(
        `There is a bug!${data.message} Res status is: ${res.status}`
      );
    return data;
  } catch (err) {
    throw err;
  }
};
