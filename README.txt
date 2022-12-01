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
- caching (this is actually done automatically in our actions)
  -- CloudFront will not automatically detect changed files. To tell it to use the latest 
      version you need to create an invalidation inside of the s3 settings. This is just for the
      html file (js have hashes in the name so it's not an issue).
  -- invalidation object path: /container/latest/index.html
  

- run: aws cloudfront create-invalidation --distribution-id ${{ secrets.AWS_DISTRIBUTION_ID }} --paths "/container/latest/index.html"
  env:
    AWS_ACCESS_KEY_ID: ${{ secrets.AWS_ACCESS_KEY_ID }}
    AWS_SECRET_ACCESS_KEY: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
    AWS_DEFAULT_REGION: us-east-2