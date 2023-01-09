Micro front end test project

Container runs the 3 other projects, which operate as independent micro front ends. 

Requirements:
- We want to deploy each micro front end independently (including the container)
- Location of the child app remoteEntry.js files must be known at build time
- At present, the remoteEntry.js file name is fixed! need to think about caching issues. 
- Many front-end deployment solutions assume you're deploying a single project.
We need something that cna handle multiple different ones
- Probably need a CI/CD pipeline of some sort


This project also has a CD/CI pipeline install that uses github actions.
 - Whenever code is pushed to the master/main branch and this commit contains changes to the container folder
 -- Change into the container folder
 -- install dependencies
 -- Create a production build using webpack
 -- upload up to S3


That file is missing some stuff to work. It expects that you'd set up:
 - an S3 bucket, configured to host a static s3 bucket, with public access enabled
   --  Additionally set up a policy to allow the cloud front distribution to access this S3 bucked by linking the ARN from the S3 bucket to policy generator with a /* at the end. 
 - Create a CloudFront Distribution that will distribute files from the s3 bucket
 - Use AWS IAM to generate an access key. Create a new user, like mfe-github-actions. 
    -- Give the user policies like AmazonS3FullAccess, CloudFrontFullAccess (yes, this is too much permission). Copy and save the access key Id, and secret access key for git.
 - set update some environment variables inside of github secretes, eg, AWS_DEFAULT_REGION

Additionally you'll need to solve some micro front end issues
- caching. this is actually done automatically in our actions, so we don't need to do this manually. These are just some notes from the course.
  -- CloudFront will not automatically detect changed files. To tell it to use the latest 
      version you need to create an invalidation inside of the s3 settings. This is just for the
      static files, eg html, remote entries, ect (js have hashes in the name so it's not an issue).
  -- invalidation object path: /container/latest/index.html
  

- run: aws cloudfront create-invalidation --distribution-id ${{ secrets.AWS_DISTRIBUTION_ID }} --paths "/container/latest/index.html"
  env:
    AWS_ACCESS_KEY_ID: ${{ secrets.AWS_ACCESS_KEY_ID }}
    AWS_SECRET_ACCESS_KEY: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
    AWS_DEFAULT_REGION: us-east-2


- CSS NOTES

You need to worry about css files between the different MFA impacting each other. 
Navigating around this app will cause the css to effect outside components if we 
don't mediate this situation.

Possible Solutions:
-- Use a Css-in-js library to automatically scope all your css files
-- use Angular or Vue's build in component style scoping
-- manually "namespace" all your CSS

Class name collision - when 2 libraries use the same class name. Happens when using 2 different css libraries, which will happen in mfe
This can happen when the Programmaticly generate css class name get minified when they get moved into a shared css file.
This might not happen in dev, but will happen when we build for prod
So hero-content-header becomes hch1. and then another micro service ends up with the same abbreviation, and the micro services mess with each other. 

Solution
// Make all the production css get generated with the prefix of ma instead of the default jss
// this stops class name collisions between mfe
const generateClassName= createGenerateClassName({ productionPrefix: 'ma'})
      <StylesProvider generateClassName={generateClassName}>

- Routing notes
The goal of our routing is to be able to display the different micro front ends based on the current route. That means 1 or more microfront ends need to look at the route and decided what they should render. 
This info needs to be generically communicated between the container and the different MFEs. 

2 things used by the routing libraries to decide what to show on screen
  History - Object to get and set the current path the user is visiting
  Router - shows different content based on the current path

3 different version of history
-- Browser History - look a the path portion of hte url (everything af ter the domain) to figure out what the current path is.
    eg. `<BrowserRouter>` 
-- Memory or Abstract History  - keep track of the current history inside of the memory
    eg. `<Router history={history}>`  where history is a copy of our in memory history, instead of an automatic history

Our MFE could be running any type of code. This means our different router objects could all be implementing different versions of router. This could lead to weird bugs and race conditions based on how these different routers try to read and change the url.
Solution use Browser History in Container, and Memory History inside the children MFEs. Only the Container can update the browser URL. The child MFEs have there own url copy to internally manage, so they don't end up competing to change the URL. 
will make the 