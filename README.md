# Introduction 
TODO: set an introduction for UN Proj

# Getting Started
To RUN the Project
1.	Installation of dependencies
- make sure you have npm installed 
- run ``` npm install```
2.	Run project on localhost
- run ``` npm run hot```
- open Browser that you like and go to http://localhost:8080/


# Build and Test
To Run build for production 
1. run ``` npm run prod```



# Contribute
TODO: Explain how other users and developers can contribute to make your code better. 


# Server Linking
1. Create a file in Env.js in /src folder with the following content: 

    const env = {
        API_URL: '{api server name}',       //API server name
        client_secret : "LYt8REBMv7whWgG3l4yoOmJM4kUcpTjbvRo6spXY",    //google client secret
        grant_type : "password",
        client_id : 2,
        GOOGLE_API_KEY: "AIzaSyCGabeaehORQx4r9UYJ6zGW6WE5aQjRAxw",     //google api key
        GOOGLE_ANALYTICS_TRACKING_ID: "UA-122381360-6"                 //google analytics tracking id
    };
    export default env;
