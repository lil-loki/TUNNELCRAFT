const {Client,IntentsBitField,EmbedBuilder} = require('discord.js');
const shell = require('shelljs');
const ngrok = require('ngrok');

require('dotenv').config();

let minecraftServer = '';
let serverStatus=false;

/**
 * Starts the ngrock Tunnel
 * @returns {string} The url of the ngrock Tunnel
 */
async function ngrokStart() {
  let url = ''
  try {
    url = await ngrok.connect({
      proto: 'tcp',
      addr: '25565',//Port in which MineCraft is Running in Local. By defaut is set to 25565.
      authtoken: process.env.NGROK_TOKEN,// Your authtoken from ngrok.com
      region: 'in',// one of ngrok regions (us, eu, au, ap, sa, jp, in), defaults to us
    });
  } catch (error) {
    console.error('Error starting TCP tunnel:', error);
  }
  return url;
}

/**
 * Stops the ngrock Tunnel
 * @returns {void} This function does not return a value.
 */
async function ngrokStop() {
  try {
    await ngrok.disconnect();
  } catch (error) {
    console.error('Error stopping TCP tunnel:', error);
  }  
}

// Creates Bot With Below Permissions
const client = new Client({
  intents: [
    IntentsBitField.Flags.Guilds,
    IntentsBitField.Flags.GuildMembers,
    IntentsBitField.Flags.GuildMessages,
    IntentsBitField.Flags.MessageContent,
  ],
});

// Initialize Bot.
client.on('ready', (bot) => {
  console.log(`✅ ${bot.user.tag} is online.`);
});

// Adds messageCreate eventListner To Bot Which calls the callback function on message create.
client.on('messageCreate', async (message) => {
  
  // Returns So bot does not Activate to Own Message.
  if (message.author.bot) {
    return;
  }

  // Returns if message is not from ALLOWED_USERNAMES.
  if (message.content.includes('! mc') && !process.env.ALLOWED_USERNAMES.split(',').includes(message.author.username)) {
    message.reply("You Do Not have Permission To Start or Stop The Server.");
    return;
  }

  msgArr = message.content.split(' ');

  // Only allows messages with ! mc.
  if(message.content.includes('! mc')){

    // Validates the Length of Message.
    if (msgArr.length < 3) {
      message.reply("Please Enter a Valid Command\nStart Command : ! mc start playthroughname\nStop Command : ! mc stop");
      return;
    }
    
    // Validates The Start Sever Message.
    if (msgArr[2] === 'start' && msgArr.length > 3) {
      try {
        
        // Returns if Server is Already Running.
        if(serverStatus){
          message.reply('Server Already Running!!! Please Stop Existing Server to Start Current Server');
          return; 
        }
        
        // Checks if MineCraft Folder is Present.
        if (shell.cd(msgArr[3]).code === 0) {
          //Shell Command To Start the Server. Please Change Flag According with Respect to Performance.
          minecraftServer = shell.exec('java -Xmx8G -Xms8G -jar server.jar nogui', {
            async: true
          })
          serverStatus=true;
          let minecraftServerURL = await ngrokStart();
          const embed = new EmbedBuilder()
                .setTitle(minecraftServerURL.toString().slice(6))
                .addFields({name:"NOTE" , value:"Please Enter After 2 Mins"})
                .setColor("Green");
          message.reply({content:"Starting Server", embeds : [embed] });
        } 
        else {
          console.error('Error Starting The Server. Please Check the Playthroughname used.');
          message.reply('Error Starting The Server. Please Check the Playthroughname used.');
        }
      } catch (error) {
        console.error('Error Starting The Server:', error);
        message.reply('Error Starting The Server. Please Check the Command used.\nCommand : ! mc start playthroughname');
      }
      return;
    } 
    // Validates The Stop Sever Message.
    else if (msgArr[2] === 'stop') {
        try {
          // Returns if Server is Already Running.
          if(!serverStatus){
                message.reply('No Server Running!!! Please Use Start Command to Start a Server');
                return; 
          }

          minecraftServer.stdin.write('/stop\n');
          minecraftServer.stdin.end();
          serverStatus=false;
          await ngrokStop();
          shell.cd('..');
          message.reply("Server Has Stoped");                
        } catch (error) {
              console.error('Error Stopping The Server:', error);
              message.reply('Error Starting The Server. Please Check the Command used.\nCommand : ! mc stop');
        }
        return;
    }
    else{
        message.reply("Please Enter a Valid Command\nStart Command : ! mc start playthroughname\nStop Command : ! mc stop");
        return;
    }
  }
});

// Authorizes the Bot
client.login(process.env.BOT_TOKEN);