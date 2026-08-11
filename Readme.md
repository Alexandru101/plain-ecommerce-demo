## Testing website steps
1. ping this url and wait for it to succeed - https://plain-ecommerce-demo-backend.onrender.com/api/test
2. Open the website --> [Website](https://plain-ecommerce-demo.alexandru-dev15.workers.dev/home)

### Pros 🟢
1. JWT Authentication - Includes account login/logout + signup, uses static http-only access and refresh
token, lastly uses a function named "authMiddleware" which validates if the users jwt token is valid
and decodes it using jwt to get the users ID within mongodb and stores it within the apis req.user.
Note the "authMiddleware" only is applied to the api's that require the user to be logged.

2. Redis Caching - Api's that are frequently called to query mongoDB are protected by redis caching system where
we first lookup if the data we are requiring exists withing redis if not it then misses and queries the database
once we query the database we store this within redis for the next request and give the user the requested data.

3. Redis Rate Limiting - All api's are protected with redis rate limiting which checks the users IP and if they
are calling the api more than the maxmimum requests limit given to them, then any more requests will get dropped
and ignored until their requests are replenished after the cooldown.

4. Deployment - Frontend Cloudfare Pages / Backend Render