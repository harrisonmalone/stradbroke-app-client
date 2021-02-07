import getEnvVars from "../environment";
const { apiUrl } = getEnvVars();

export async function fetchSubscriptions(jwt) {
  const response = await fetch(`${apiUrl}/subscriptions`, {
    headers: {
      Authorization: `Bearer ${jwt}`,
    },
  });
  return await response.json();
}

export async function fetchLogin(email, password) {
  const response = await fetch(`${apiUrl}/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      auth: {
        email,
        password,
      },
    }),
  });
  return await response.json();
}

export async function fetchSignUp(email, password) {
  await fetch(`${apiUrl}/sign-up`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      user: {
        email,
        password,
      },
    }),
  });
}