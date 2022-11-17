Micro front end test project

Container runs the 3 other projects, which operate as independent micro front ends. 

Requirements:
- We want to deploy each micro front end independently (including the container)
- Location of the child app remoteEntry.js files must be known at build time
- At present, the remoteEntry.js file name is fixed! need to think about caching issues. 
- Many front-end deployment solutions assume you're deploying a single project.
We need something that cna handle multiple different ones
- Probably need a CI/CD pipeline of some sort


We will also be setting up a CI/CD pipeline:
 - Whenever code is pushed to the master/main branch and this commit contains changes to the container folder
 -- Change into the container folder
 -- install dependencies
 -- Create a production build using webpack
 -- upload up to S3


      - uses: shinyinc/action-aws-cli@v1.2
      - run: aws s3 sync dist s3://${{ secrets.AWS_S3_BUCKET_NAME }}/container/latest
        env:
          AWS_ACCESS_KEY_ID: ${{ secrets.AWS_ACCESS_KEY_ID }}
          AWS_SECRET_ACCESS_KEY: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
          AWS_DEFAULT_REGION: ""