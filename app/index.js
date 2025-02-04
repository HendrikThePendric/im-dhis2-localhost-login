const username = "admin";
const password = "district";

window.login = async function () {
  const server = document.getElementById("instanceUrl")?.value;
  const isNewLoginApiAvailable = await getIsNewLoginApiAvailable(server);
  if (isNewLoginApiAvailable) {
    await loginWithNewEndpoint(server);
  } else {
    await loginWithOldEndpoint(server);
  }
  await getInfoFromAuthenticatedResource(server);
};

async function getIsNewLoginApiAvailable(server) {
  const path = "api/loginConfig";
  try {
    // if loginConfig is available, the instance can use new endpoints
    await fetch(`${server}/${path}`, {
      headers: {
        "X-Requested-With": "XMLHttpRequest",
        Accept: "application/json",
      },
    }).then(rejectIfNotOK);

    console.log(
      `GET ${path} returned an OK response => use NEW login endpoint`,
    );
    return true;
  } catch (e) {
    // if loginConfig is not available, the instance must use old endpoints
    console.log(
      `GET ${path} returned an ERROR response => use OLD login endpoint`,
    );
    return false;
  }
}

async function loginWithNewEndpoint(server) {
  const path = "api/auth/login";
  try {
    await fetch(`${server}/${path}`, {
      body: JSON.stringify({
        username,
        password,
      }),
      method: "POST",
      headers: {
        "X-Requested-With": "XMLHttpRequest",
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    }).then(rejectIfNotOK);
    console.log(`POST to ${path} returned an OK response => NEW login SUCCESS`);
  } catch (e) {
    console.log(
      `POST to ${path} returned an ERROR response => NEW login FAILURE`,
    );
    throw e;
  }
}

async function loginWithOldEndpoint(server) {
  const path = "dhis-web-commons-security/login.action";
  try {
    await fetch(`${server}/${path}`, {
      body: `j_username=${encodeURIComponent(
        username,
      )}&j_password=${encodeURIComponent(password)}`,
      method: "POST",
      headers: {
        "X-Requested-With": "XMLHttpRequest",
        Accept: "application/json",
        "Content-Type": "application/x-www-form-urlencoded",
      },
    }).then(rejectIfNotOK);
    console.log(`POST to ${path} returned an OK response => OLD login SUCCESS`);
  } catch (e) {
    console.log(
      `POST to ${path} returned an ERROR response => OLD login ERROR`,
    );
    throw e;
  }
}

async function getInfoFromAuthenticatedResource(server) {
  const path = "api/system/info";
  try {
    const data = await fetch(`${server}/${path}`, {
      credentials: "include",
      headers: {
        "X-Requested-With": "XMLHttpRequest",
        Accept: "application/json",
      },
    })
      .then(rejectIfNotOK)
      .then((resp) => resp.json());
    console.log(
      `Authenticated GET request to ${path} returned an OK response => data:\n`,
      data,
    );
  } catch (e) {
    console.log(
      `Authenticated GET request to ${path} returned an ERROR response`,
    );
    throw e;
  }
}

function rejectIfNotOK(response) {
  if (!response.ok) {
    return Promise.reject(response);
  }
  return Promise.resolve(response);
}
