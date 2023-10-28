# Setting up the development env

## Requirements
- Node (>= 18)
- Discord BOT TOKEN 
- NGROK AUTH TOKEN 
- Functioning brain

## Step 1 : Download dependencies
```npm install```

## Step 2 : Create ENV FILE
create a .env file and place the env variables here as 

```
BOT_TOKEN='REPLACE_WITH_YOUR_DISCORD_BOT_TOKEN'
NGROK_TOKEN='REPLACE_WITH_YOUR_NGROK_TOKEN'
ALLOWED_USERNAMES="REPLACE_WITH_STRING_OF_DISCORD_USERNAMES_SEPERATED_BY_COMMA" EXAMPLE:"lokiloki,reelhazzart"
```

## Step 3 : Create MineCraft Server

- Create A New Folder And Rename To The Name Of Your Desired MC Server.
- Copy The Downloaded server.jar To This Folder And Double Click To Run It Once. 
- Once Files Are Generated , Open eula.txt And Change Content From eula=false To eula=true. 
- Double Click server.jar And Wait For World Files to Be Generated. 
- You can Exit the Server by Pressing CTRL+C or By Typing stop in the Server GUI.
- Setup Is Done . You Can Start Using The Bot to Start and Stop The Server.
- You Can Have Multiple Servers,By Creating Seperate Folders For Seperate Servers Using the Same Methods .

Your Folder Structure Should Look Like This.

- Main Folder
  - node_modules
  - MC_Server1_Name
    -   server.jar
  - .env
  - .gitignore
  - discordBot.js
  - package-lock.json
  - package.json
  - README.md
  - SETUP.md


## Step 4 : Start Discord Bot
```npm run bot```


