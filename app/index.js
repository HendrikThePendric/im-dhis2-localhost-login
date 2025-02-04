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
  try {
    // if loginConfig is available, the instance can use new endpoints
    await fetch(`${server}/api/loginConfig`, {
      headers: {
        "X-Requested-With": "XMLHttpRequest",
        Accept: "application/json",
      },
    });
    console.log("USE NEW ENDPOINT");
    return true;
  } catch (e) {
    // if loginConfig is not available, the instance must use old endpoints
    console.log("USE OLD ENPOINT");
    return false;
  }
}

async function loginWithNewEndpoint(server) {
  try {
    await fetch(`${server}/api/auth/login`, {
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
    });
  } catch (e) {
    console.log("LOGIN ERROR - NEW: ", e);
  }
}

async function loginWithOldEndpoint(server) {
  try {
    await fetch(`${server}/dhis-web-commons-security/login.action`, {
      body: `j_username=${encodeURIComponent(
        username,
      )}&j_password=${encodeURIComponent(password)}`,
      method: "POST",
      headers: {
        "X-Requested-With": "XMLHttpRequest",
        Accept: "application/json",
        "Content-Type": "application/x-www-form-urlencoded",
      },
    });
  } catch (e) {
    console.error("LOGIN ERROR - OLD: ", e);
  }
}

async function getInfoFromAuthenticatedResource(server) {
  try {
    const data = await fetch(`${server}/api/system/info`, {
      credentials: "include",
      headers: {
        "X-Requested-With": "XMLHttpRequest",
        Accept: "application/json",
      },
    }).then((resp) => resp.json());
    console.log("AUTHENTICATED REQUEST SUCCESS", data);
  } catch (e) {
    console.error("AUTHENTICATED REQUEST FAILURE", e);
  }
}
