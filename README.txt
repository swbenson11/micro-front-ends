Micro front end test project

Container runs the 3 other projects, which operate as independent micro front ends. 

Requirements:
- We want to deploy each micro front end independently (including the container)
- Location of the child app remoteEntry.js files must be known at build time
- At present, the remoteEntry.js file name is fixed! need to think about caching issues. 
- Many front-end deployment solutions assume you're deploying a single project.
We need something that cna handle multiple different ones
- Probably need a CI/CD pipeline of some sort