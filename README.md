# Vgodogg Backend

## .ENV

### All Options

```md
NODE_APPID=vgodogg
BASE_URL=http://vgodogg.com

RETHINK_DB=
RETHINK_HOST=
RETHINK_PASSWORD=
RETHINK_USER=
RETHINK_PORT=

EXPRESS_SESSION_SECRET=
EXPRESS_PORT=

VGO_ETH_ADDRESS=
VGO_API_KEY=

STEAMAUTH_RETURN_URL=
STEAMAUTH_REALM=
STEAMAUTH_API_KEY=
```

### Minimum Requirements

```md
NODE_APPID=vgodogg
EXPRESS_PORT=

STEAMAUTH_REALM=
STEAMAUTH_API_KEY=

RETHINK_HOST=
RETHINK_PORT=

VGO_ETH_ADDRESS=
VGO_API_KEY=
```

## Express API

### [GET] /auth
Attempt authentication via steam passport.
> Redirects to `/auth/completed`

### [GET] /auth/completed
Authentication callback endpoint.
> Redirects to user data or baseurl.

### [GET] /logout
Invalidates the current session.
> Returns `200` status code.

### [GET] /healthCheck
Testing route used to check the online status of the api.
> Returns simple 200 response

### [GET] /userData
Used to return the current logged in session.
> Returns current session data.

### [GET] /getKeyCount
Get the current key cound for the logged in user.
> Returns object containing the keycount.

### [GET] /getCaseSchema
Gets the current available cgo case schema.
> Returns list of cases.

### [GET] /getItems
Gets item data for the given list of ids.
> Returns list of item data.

### [GET] /sendCaseOpenOffer
Send express trade offer for unboxing.
> returns the created offer.

### [GET] /openOfferState
Check the current vgo case status.
> returns the current offer state.

### [GET] /getServerState
Get the current server-side state.
> Returns server state object.

### [GET] /getStats
Get the current case stats.
> Returns stats object.

### [GET] /removeMessage
Remove a chat message.
> Returns result of the removal.

### [GET] /sendChatMessage
Send a chat message.
> Returns result of sending.