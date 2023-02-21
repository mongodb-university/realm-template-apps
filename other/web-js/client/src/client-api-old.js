// type EmailPasswordInput = {
//   appId: string,
//   email: string,
//   password: string,
// };
// type Session = {
//   access_token: string,
//   device_id: string,
//   refresh_token: string,
//   user_id: string,
// };
// declare function registerEmailPasswordUser(input: EmailPasswordInput): void;
// declare function logInEmailPasswordUser(input: EmailPasswordInput): Session;
// declare function refreshSession(input: { appId: string, refresh_token: string }): Session;

const CLIENT_API_BASE_URL = "https://realm.mongodb.com/api/client/v2.0";

const locationCache = new Map();
export async function getAppLocation(appId) {
  const cached = locationCache.get(appId);
  if (cached) return cached;

  const GLOBAL_BASE_URL = "https://realm.mongodb.com/api/client/v2.0";
  const url = GLOBAL_BASE_URL.concat(`/app/${appId}/location`);
  const resp = await fetch(url);
  if (resp.status === 200) {
    const location = await resp.json();
    locationCache.set(appId, location);
    return location;
  } else {
    throw new Error(`Unexpected status code: ${resp.status}`);
  }
}

async function getBaseUrl(appId) {
  const location = await getAppLocation(appId);
  return `${location.hostname}/api/client/v2.0/app/${appId}`;
}

async function registerEmailPasswordUser({ appId, email, password }) {
  const url = `${getBaseUrl(appId)}/auth/providers/local-userpass/register`;

  const resp = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  });

  if (resp.status === 201) {
    // Status 201 means the user was created. There is no response body.
    return;
  } else {
    const error = await resp.json();
    // Example error: {
    //   error: 'name already in use',
    //   error_code: 'AccountNameInUse',
    //   link: 'https://realm.mongodb.com/groups/{groupId}/apps/{appId}/logs?co_id=63f506d9d243efe65aa33430'
    // }
    throw new Error(`${error.code}: ${error.error}`);
  }
}

async function logInEmailPasswordUser({ appId, email, password }) {
  const url = `${getBaseUrl(appId)}/auth/providers/local-userpass/login`;

  const resp = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  });
  if (resp.status === 200) {
    return response;
    // Example 200 Response:
    // {
    //   access_token: "eyJhbGciOiJIUzI1NiIsInA5cCI6IkpXVCJ9.eyJiYWFzX2RldmljZV9pZCI6IjYzZjUwNGE3NWRkZTkxZTZmNjBiYTA5YSIsImJhYXNfZG9tYWluX2lkIjoiNWNkYjEyNDA4ZTIzMmFjNGY5NTg3ZmU4IiwiZXhwIjoxNjc3MDAzNjk1LCJpYXQiOjE2NzcwMDE4OTUsImlzcyI6IjYzZjUwNGE3NWRkZTkxZTZmNjBiYTA5ZCIsInN0aXRjaF9kZXZJZCI6IjYzZjUwNGE3NWRkZTkxZTZmNjBiYTA5YSIsInN0aXRjaF9kb21haW5JZCI6IjVjZGIxMjQwOGUyMzJhYzRmOTU4N2ZlOCIsInN1YiI6IjYzZjUwNGE3NWRkZTkxZTZmNjBiYTA5NSIsInR5cCI6ImFjY2VzcyJ9.R9ZazXGPtngBfaMe1nZkKPjvoPRe3GWNfA77UX28ewo",
    //   device_id: "63f504a75dd881f2f58ba09a",
    //   refresh_token: "eyJhbGciOiJIUzI1BiIsInE5cCI6IkpXVCJ9.eyJiYWFzX2RhdGEiOm51bGwsImJhYXNfZGV2aWNlX2lkIjoiNjNmNTA0YTc1ZGRlOTFlNmY2MGJhMDlhIiwiYmFhc19kb21haW5faWQiOiI1Y2RiMTI0MDhlMjMyYWM0Zjk1ODdmZTgiLCJiYWFzX2lkIjoiNjNmNTA0YTc1ZGRlOTFlNmY2MGJhMDlkIiwiYmFhc19pZGVudGl0eSI6eyJpZCI6IjYzZjUwNGE3NWRkZTkxZTZmNjBiYTA5Mi1qenBncGhsY3puZXpxaXJkb3ljemNwc20iLCJwcm92aWRlcl90eXBlIjoiYW5vbi11c2VyIiwicHJvdmlkZXJfaWQiOiI1ZDQ4OTJlMzU1OGViYjk4Y2VkNmU5MWYifSwiZXhwIjozMjUzODAxODk1LCJpYXQiOjE2NzcwMDE4OTUsInN0aXRjaF9kYXRhIjpudWxsLCJzdGl0Y2hfZGV2SWQiOiI2M2Y1MDRhNzVkZGU5MWU2ZjYwYmEwOWEiLCJzdGl0Y2hfZG9tYWluSWQiOiI1Y2RiMTI0MDhlMjMyYWM0Zjk1ODdmZTgiLCJzdGl0Y2hfaWQiOiI2M2Y1MDRhNzVkZGU5MWU2ZjYwYmEwOWQiLCJzdGl0Y2hfaWRlbnQiOnsiaWQiOiI2M2Y1MDRhNzVkZGU5MWU2ZjYwYmEwOTItanpwZ3BobGN6bmV6cWlyZG95Y3pjcHNtIiwicHJvdmlkZXJfdHlwZSI6ImFub24tdXNlciIsInByb3ZpZGVyX2lkIjoiNWQ0ODkyZTM1NThlYmI5OGNlZDZlOTFmIn0sInN1YiI6IjYzZjUwNGE3NWRkZTkxZTZmNjBiYTA5NSIsInR5cCI6InJlZnJlc2gifQ.k1o_4RQ1diSewmXynIqiC0bxVAdvYJmw3L1358T3UJk",
    //   user_id: "63f504a25dde21e6f10ba025"
    // }
  } else {
    const error = await resp.json();
    // Example error: {
    //   error: 'invalid username or password',
    //   error_code: 'InvalidUsernamePassword',
    //   link: 'https://realm.mongodb.com/groups/{groupId}/apps/{appId}/logs?co_id=63f506d9d243efe65aa33430'
    // }
    throw new Error(`${error.code}: ${error.error}`);
  }
}

async function refreshSession({ appId, refresh_token }) {
  const url = `${getBaseUrl(appId)}/auth/session`;

  const resp = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${refresh_token}}`,
    },
  });

  if (resp.status === 200) {
    return await resp.json();
    // Example 200 Response: {
    //   "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJiYWFzX2RldmljZV9pZCI6IjYzZjUxNWNhNmVmZDZkMjU1OTk5M2U2YiIsImJhYXNfZG9tYWluX2lkIjoiNWNkYjEyNDA4ZTIzMmFjNGY5NTg3ZmU4IiwiZXhwIjoxNjc3MDA5MzI0LCJpYXQiOjE2NzcwMDc1MjQsImlzcyI6IjYzZjUxYTM3ZDI0M2VmZTY1YWFhMGZmZCIsInN0aXRjaF9kZXZJZCI6IjYzZjUxNWNhNmVmZDZkMjU1OTk5M2U2YiIsInN0aXRjaF9kb21haW5JZCI6IjVjZGIxMjQwOGUyMzJhYzRmOTU4N2ZlOCIsInN1YiI6IjYzZjUxNWNhNmVmZDZkMjU1OTk5M2U1ZSIsInR5cCI6ImFjY2VzcyJ9.rbB5ZW8e88P-VKPTYNZYyCM3RKl77FuW_kBf29POr24"
    // }
  } else {
    const error = await resp.json();
    throw new Error(error.error);
    // Example error: {
    //   error: 'signing method (alg) is unspecified.',
    // }
  }
}
