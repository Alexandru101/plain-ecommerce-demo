> **Version Control:** All code changes, updates, and maintenance were managed using Git.

## Testing website steps
1. ping this url and wait for it to succeed - https://plain-ecommerce-demo-backend.onrender.com/api/test
2. Open the website --> [Website](https://plain-ecommerce-demo.alexandru-dev15.workers.dev/home)

### Pros 🟢
1. <u>**JWT Authentication**</u> - Includes account login/logout + signup, uses static http-only access and refresh
token, lastly uses a function named "authMiddleware" which validates if the users jwt token is valid
and decodes it using jwt to get the users ID within mongodb and stores it within the apis req.user.
Note the "authMiddleware" only is applied to the api's that require the user to be logged.

2. <u>**Redis Caching**</u> - Api's that are frequently called to query mongoDB are protected by redis caching system where
we first lookup if the data we are requiring exists withing redis if not it then misses and queries the database
once we query the database we store this within redis for the next request and give the user the requested data.

3. <u>**Redis Rate Limiting**</u> - All api's are protected with redis rate limiting which checks the users IP and if they
are calling the api more than the maxmimum requests limit given to them, then any more requests will get dropped
and ignored until their requests are replenished after the cooldown.

4. <u>**Newsletter Subscribe / UnSubscribe**</U> - By using mongoDB and resend I was able to create a collection on mongoDB that contains all the documents
of users that have signed up to the newsletter then creating temporary tokens for security to verify if the user that
has signed up to the newsletter is not a bot, once the user verifies he will then recieve another email which will demonstrate
the ability to unsubscribe ultimately this creates a token using "crypto" like we have been using for the subscribe and verifiy functions, then
calling the backend api "BACKEND_URL/api/newsletter-unsubscribe" that will delete the users document from the mongoDB collection.

6. <u>**Custom Notification**</u> - First I created a class that handles all ui notification logic from creating a notification to waiting
for it to finish and giving it closing animations. Notifications are setup within the file "App.tsx" which mounts a notification listener
that will basically detect once we call the notification event from other files meaning once we call this event the notification event listener
will trigger and create a notification using the notification class, by using a function named "emitNotification" we can make this job even
easier as it will dispatch the event for us and we dont need to remmeber the notification event name. The reason I chose to use an event
rather than render the notification every refresh or whenever called is so that I can have only one notification object created that will
mount once when the "App.tsx" file loads the content and react router, ultimately this means we mount the connection once and can just call
the notification via event whenever needed making it super simple to use and scale.

7. <u>**Deployment**</u> - Frontend Cloudfare Pages / Backend Render. using enviroment variables I was able to create an enviroment
where I can test locally on my computer and once verified I can push changes to github which will then cause cloudfare
pages and render to auto detect the change and redeploy with the latest changes.

### Cons 🔴
1. <u>**Inconsistent Code Design**</u> - During the creation of this project I was still relatively new to css as I understood how to design basic features
and full pages however I did not learn and adapt any design coding patterns therefore causing inconsistency in my html + css. Towards the end of
the project I started adapting to using the correct html elements such as "main" or "nav", I also started using BEM names for my css classes
which follows the format of "`NAME_OF_FILE`__COMPONENT" and example of this is "account__panel" then if necessary we can create a css tree by doing
"account__panel-content", generally I try to avoid creating tree classes and reset back to file name at the start with adding the component at the end
but if not ideal I will always revert back to using the "-" to create a tree. I also had some inconsistencies with my backend as that was still farily
new to me for example returning the response on the end of the try block incase I ever extended the api and add code outside of the try block or
keeping all the api's within the same file if they are related (Note. I did adapt this towards the end of my project but if I had done it from the start
it wouldnt of been inconsistent).

2. <u>**Mobile Incompatibility**</u> - Making a website compatible both for desktop and mobile is still pretty difficult for me as I am dont have a deep
understanding of css however I did learn that you can use "@media" which allows for the use of conditional styling so I can check the current width of
the user then apply the css I want depending on their width. During the start of this project I also had css files that were just using "px" which I believe
to not be ideal and tried to implement "rem" instead of "px" towards the end of my project which should scale better with the width of the website changing
however this does not automatically make it compatible for mobile and I should of used a response web layout where I use "@media" and build the website
on mobile view first then desktop.

### Things I would of done better
- Tracking the jwt access and refresh authentication tokens within the database so that if the user logs out of his account I can delete them therefore
making the approach more hybrid and removing that security flaw of having the tokens stateless which allows any user that has stolen a refresh token
to log into the users account before it expires within 7 days.

- Follow css code patterns and elimanate inconsistencies.
- Design the website for mobile first then desktop make it compatibly for both.
- Start looking into peformance optimizations and avoiding unnecessary code eg using "kiss" principle -> "Keep it super simple"
