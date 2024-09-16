;

const { Client, Intents, Collection, MessageEmbed, MessageAttachment, MessageActionRow, MessageButton, GatewayIntentBits } = require("discord.js");

const client = new Client({
  intents: 131071,
  partials: [
    1, 2, 5, 3,
    4, 6, 0
  ]
});
const express = require('express');

const app = express();

app.get('/', (req, res) => {
  res.send('Hello Express app!')
});

app.listen(3000, () => {
  console.log('server started');
});
setTimeout(() => {
  if (!client || !client.user) {
    console.log("Client Not Login, Process Kill")
    process.kill(1);
  } else {
    console.log("Client Login")
  }
}, 3 * 1000 * 60);
const fs = require("fs")
const ms = require(`ms`)
const Discord = require("discord.js")
const { prefix, owner } = require("./config.json");
const config = require("./config.json");
const Data = require("pro.db")
module.exports = client;
client.commands = new Collection();
client.slashCommands = new Collection();
client.config = require("./config.json");
require("./handler")(client);
client.prefix = prefix;
require("events").EventEmitter.defaultMaxListeners = 9999999;
client.login(process.env.token);
client.on("ready", async () => {
  console.log(
    `Name : ${client.user.tag}
ID : ${client.user.id}
Ping : ${client.ws.ping}
Prefix : ${client.prefix}
Server : ${client.guilds.cache.size}
Members : ${client.users.cache.size}
Channels : ${client.channels.cache.size}`)
});


client.on('guildMemberAdd', async (member) => {
  let welcome = Data.get(`welcome_${member.guild.id}`)
  if (member.bot) return;
  let welcomefukenembed = new MessageEmbed()
    .setAuthor({ name: member.user.username, iconURL: member.user.displayAvatarURL({ dynamic: true }) })
    .setFooter({ text: member.user.username, iconURL: member.user.displayAvatarURL({ dynamic: true }) })
    .setThumbnail(member.user.displayAvatarURL({ dynamic: true }))
    .setTimestamp()
    .setDescription(`
**Atlass,**
 *hi* ${member.user.username}
 *Our* \ ${member.guild.memberCount}\
`)
    .setColor(`#2f3136`)
  member.guild.channels.cache.get(welcome).send({ content: `      `, embeds: [welcomefukenembed] })
})


process.on("unhandledRejection", (reason, promise) => { return })
process.on('uncaughtExceptionMonitor', (err, origin) => { return });
process.on("uncaughtException", (err, origin) => { return })

client.setMaxListeners(999999);
client.on("ready", () => {
  console.log(client.user.tag)
    client.user.setPresence({
        status: 'dnd',//idle|online|dnd
        activities: [{
            name: `Atlass...`,
            type: "STREAMING", url: "https://www.twitch.tv/Atlass"
        }]
    })
})

/////////////////////////////////
client.on("messageCreate", async (message) => {
  if (message.content === '.leave') {
    // Check if the message author is the bot owner
    if (message.author.id === '755782461366992977') {
      await message.channel.send("Leaving the server...");
      await message.guild.leave();
    } else {
      message.channel.send("You don't have permission to make me leave the server.");
    }
  }
});
///////////////////////////////////////
////timeout updated
client.on("messageCreate", async message => {
  if (message.content.startsWith(prefix + "out") || message.content.startsWith(prefix + "تايم")) {
    const adminRoleID = '1279611398250565743'; // Replace with your actual admin role ID

    // Check if the user has the admin role
    if (!message.member.roles.cache.has(adminRoleID)) {
      return message.reply({ content: `**You don't have permission to use this command!**`, allowedMentions: { repliedUser: false } });
    }

    // Parse the command arguments
    let args = message.content.split(" ");
    let member = message.mentions.members.first() || message.guild.members.cache.get(args[1]);
    if (!member) {
      return message.reply({ content: `**Mention the user or their ID to timeout them!**`, allowedMentions: { repliedUser: false } });
    }
    if (member.user.bot) {
      return message.reply({ content: `**You can't timeout a bot!**`, allowedMentions: { repliedUser: false } });
    }
    if (member.user === message.author) {
      return message.reply({ content: `**You can't timeout yourself!**`, allowedMentions: { repliedUser: false } });
    }

    // Define the embed message
    const notime = new MessageEmbed()
      .setAuthor({ name: `${message.author.tag}`, iconURL: message.author.displayAvatarURL({ dynamic: true }) })
      .setTitle(`Command: timeout`)
      .setColor("#2f3136")
      .setDescription(`Timeout a member.

        **Usage:**
        ${prefix}timeout [user] (time m/h/d/w)

        **Examples:**
        ${prefix}timeout <@${member.user.id}> 60s
        ${prefix}timeout <@${member.user.id}> 5m
        ${prefix}timeout <@${member.user.id}> 10m
        ${prefix}timeout <@${member.user.id}> 1h
        ${prefix}timeout <@${member.user.id}> 1d
        ${prefix}timeout <@${member.user.id}> 1w
      `)
      .setColor(`#2f3136`)
      .setFooter({ text: `Atlass. Timeout`, iconURL: client.user.displayAvatarURL() });

    if (!args[2]) {
      return message.reply({ embeds: [notime], allowedMentions: { repliedUser: false } });
    }
    if (!args[2].endsWith("s") && !args[2].endsWith("m") && !args[2].endsWith("h") && !args[2].endsWith("d") && !args[2].endsWith("w")) {
      return message.reply({ content: `**Please provide a valid timer \`s / m / h / d / w\` ❌**`, allowedMentions: { repliedUser: false } });
    }
    if (isNaN(args[2][0])) {
      return message.reply({ content: `**That is not a number ❌!**`, allowedMentions: { repliedUser: false } });
    }

    try {
      const timeoutDuration = ms(args[2]);
      await member.timeout(timeoutDuration);

      const embed = new MessageEmbed()
        .setAuthor({ name: member.user.tag, iconURL: member.user.displayAvatarURL({ dynamic: true }) })
        .setDescription(`> **You are timed out in** \`${message.guild.name}\` **for ${args[2]}**\n> **Timeout By:** ${message.author}`)
        .setThumbnail(message.guild.iconURL())
        .setColor("#2f3136")
        .setFooter({ text: message.author.tag, iconURL: message.author.displayAvatarURL({ dynamic: true }) });

      await message.react("✅");
      await member.user.send({ embeds: [embed], allowedMentions: { repliedUser: false } });
    } catch (error) {
      console.error(error);
      message.reply({ content: `**An error occurred while applying the timeout!**`, allowedMentions: { repliedUser: false } });
    }
  }
});
///////////////////////////////////////////////
/////role 
const adminRoleID = '1279611390340108328'; // Replace with your admin role ID
client.on('messageCreate', async message => {
  // Command to add a role
  if (message.content.startsWith(prefix + 'rol')) {
    // Check if the user has the admin role
    if (!message.member.roles.cache.has(adminRoleID)) {
      return message.reply({ content: '**You do not have permission to use this command!**', allowedMentions: { repliedUser: false } });
    }

    // Parse the command arguments
    const args = message.content.split(' ');
    if (args.length < 3) {
      return message.reply({ content: '**Usage: .rol [user ID] [role name or ID]**', allowedMentions: { repliedUser: false } });
    }

    // Get the member and role
    const member = message.guild.members.cache.get(args[1]) || message.mentions.members.first();
    if (!member) {
      return message.reply({ content: '**User not found!**', allowedMentions: { repliedUser: false } });
    }

    const role = message.guild.roles.cache.find(r => r.name === args.slice(2).join(' ')) || message.guild.roles.cache.get(args[2]);
    if (!role) {
      return message.reply({ content: '**Role not found!**', allowedMentions: { repliedUser: false } });
    }

    // Add the role to the member
    try {
      await member.roles.add(role);
      const embed = new MessageEmbed()
        .setTitle('Role Assigned')
        .setDescription(`**Role ${role.name} has been added to ${member.user.tag}**`)
        .setColor('#00FF00')
        .setFooter(`Requested by ${message.author.tag}`, message.author.displayAvatarURL());

      message.reply({ embeds: [embed], allowedMentions: { repliedUser: false } });
    } catch (error) {
      console.error('Error adding role:', error);
      message.reply({ content: '**There was an error adding the role!**', allowedMentions: { repliedUser: false } });
    }
  }

  // Command to remove a role
  if (message.content.startsWith(prefix + 'unrol')) {
    // Check if the user has the admin role
    if (!message.member.roles.cache.has(adminRoleID)) {
      return message.reply({ content: '**You do not have permission to use this command!**', allowedMentions: { repliedUser: false } });
    }

    // Parse the command arguments
    const args = message.content.split(' ');
    if (args.length < 3) {
      return message.reply({ content: '**Usage: .unrol [user ID] [role name or ID]**', allowedMentions: { repliedUser: false } });
    }

    // Get the member and role
    const member = message.guild.members.cache.get(args[1]) || message.mentions.members.first();
    if (!member) {
      return message.reply({ content: '**User not found!**', allowedMentions: { repliedUser: false } });
    }

    const role = message.guild.roles.cache.find(r => r.name === args.slice(2).join(' ')) || message.guild.roles.cache.get(args[2]);
    if (!role) {
      return message.reply({ content: '**Role not found!**', allowedMentions: { repliedUser: false } });
    }

    // Remove the role from the member
    try {
      await member.roles.remove(role);
      const embed = new MessageEmbed()
        .setTitle('Role Removed')
        .setDescription(`**Role ${role.name} has been removed from ${member.user.tag}**`)
        .setColor('#FF0000')
        .setFooter(`Requested by ${message.author.tag}`, message.author.displayAvatarURL());

      message.reply({ embeds: [embed], allowedMentions: { repliedUser: false } });
    } catch (error) {
      console.error('Error removing role:', error);
      message.reply({ content: '**There was an error removing the role!**', allowedMentions: { repliedUser: false } });
    }
  }
});
//////////////////////////////////////////////
// الترحيب
const Canvas = require('canvas');
var { inviteTracker } = require("discord-inviter");
tracker = new inviteTracker(client);
tracker.on('guildMemberAdd', async (member, inviter) => {
  let Channel = member.guild.channels.cache.find(Channel => Channel.id === '1279609062887264366')
  if (!Channel) return;
  const canvas = Canvas.createCanvas(764, 408); // Updated canvas size
  const ctx = canvas.getContext('2d');
  const background = await Canvas.loadImage('./wlc.png');
  ctx.drawImage(background, 0, 0, canvas.width, canvas.height);

  // Draw the circular clipping region for the profile picture
  ctx.beginPath();
  ctx.arc(220, 190, 115, 0, Math.PI * 2, true); // Radius increased by 3px
  ctx.closePath();
  ctx.clip();

  // Load and draw the user avatar
  const avatar = await Canvas.loadImage(member.user.displayAvatarURL({ format: 'png' }));
  ctx.drawImage(avatar, 109, 79, 234, 234); // Size increased by 3px on each side

  const attachment = new Discord.MessageAttachment(canvas.toBuffer(), 'profile-image.png');
  Channel.send({ files: [attachment] }).then((msg) => {
    msg.channel.send({
      content:  `
・*Welcome To **Atlass,** * : <a:LY_crown_AA:1279626337438666863>
・**Hello** ${member.user} !.
・**By :** <@!${inviter.id}>
・**I listen**. `,
    })
  })
})
/////////////////////////////////////////////////
///Message Reaction
client.on('messageCreate', message => {
  if (message.guild.id != "1270081476947345458") return; // اي دي السيرفر
  if (message.channel.id != "1270081814614118482") return; // اي دي الروم
  if (message.author.id === client.user.id) return;

  const reactions = {
    'منور': '<a:th11:1279626209642152037>  ',
    'بنورك': '<a:th11:1279626209642152037>  ',
    'باك': '<:LY_dum:1266156609193644135> ',
    'bye': '<:emoji_84:1106706020211900466>',
    'hello': ':wave:',
    'hi': ':wave:',
    'hey': ':wave:',
    'السلام عليكم': '<:774078335025545277:1106916065394573342>',
    'سلام عليكم': '<:774078335025545277:1106916065394573342>',
    'برب': '<:774078335025545277:1106916065394573342>',
    'brb': '<:LY_dum:1266156609193644135> ',
    'gtg': '<:LY_dum:1266156609193644135> ',
    'هلا': '<<:LY_dum:1266156609193644135> ',
    'باي': '<:LY_cat:1266156629091422248> ',
    'بحبك': '<:LY_cat:1266156629091422248>   ',
    'بوتي': '<:LY_cat:1266156629091422248>    '
  };

  const reaction = reactions[message.content.split(' ')[0]];
  if (reaction) {
    message.react(reaction);
  }
});

client.on("messageCreate", async message => {
  if (message.guild.id != "1279607376013557810") return; // اي دي السيرفر
  if (message.author.id === client.user.id) return;
  
  const channelReactions = {
    "1279608856447684630":[
      "<a:2_:1279626403905540118>"
    ],
    "1279609119019372614": [
      "<a:2_:1279626403905540118>"
    ],
    "1279609737675280406": [
      "<a:LY_crown_AA:1279626337438666863>"
    ],
    "1279609176909283431": [
      "<a:LY_crown_AA:1279626337438666863>"
    ],
    "1279610000288780399": [
      "<a:LY_girlspin_AA:1279626469680611338>"
    ]
  };

  const reactions = channelReactions[message.channel.id];
  if (reactions) {
    for (const reaction of reactions) {
      await message.react(reaction);
    }
  }
});

//////////////////////////////////////////////////
//Lines
client.on("messageCreate", message => {
  if (message.author.bot) return;

  const link = './line.png';
  const channelIds = [
    "1279609119019372614",
    "1279609176909283431",
    "1279610000288780399",
    "1279608821551202315",
    "1279609737675280406"
  ];

  if (channelIds.includes(message.channel.id)) {
    message.channel.send({ files: [link] });
  }
});

///////////////////////////////////////////////
/// Auto Replay
client.on('messageCreate', message => {
  if (message.guild.id !== "1279607376013557810") return; // Server ID
  if (message.channel.id !== "1279609062887264366") return; // Channel ID
  if (message.author.id === client.user.id) return;

  const content = message.content.toLowerCase(); // Normalize the content to lower case for easier matching

  switch (content) {
    case 'بوتي':
      message.channel.send('** <a:th11:1279626209642152037>    نعم يقلب بوتك**');
      break;
    case 'السلام عليكم':
    case 'سلام عليكم':
      message.channel.send('**وعليكم السلام ورحمة الله وبركاته !!** <:LY_cat:1266156629091422248> ');
      break;
    case 'بحبك':
      message.channel.send('**<:heart1:1266156610187694131>  و انا كمان**');
      break;
    case 'مجهول':
      message.channel.send('**<:emoji_50:1266156636171407400>   عمي وعم بوتاتي**');
      break;
    case 'احا':
      message.channel.send('**<:LY_cat:1266156629091422248>   قليل الادب**');
      break;
    case 'يخول':
      message.channel.send('**<:LY_cat:1266156629091422248>   عيب ي ولد**');
      break;
    case 'برب':
      message.channel.send('<:LY_cat:1266156629091422248>   ** خذ وقتك !!**');
      break;
    case 'هلا':
      message.channel.send('**هلا والله منور !! ** <:heart1:1266156610187694131> ');
      break;
    case 'قصفك':
      message.channel.send('ادري ادري انا اقصف هو يقصف هي تقصف <:monsieur:1266156621420040234>');
      break;
    case 'hi':
      message.channel.send('**Welcome!** <:monsieur:1266156621420040234> ');
      break;
    case 'hey':
      message.channel.send('**Sup!** <:LY_cat:1266156629091422248> ');
      break;
    case 'hello':
      message.channel.send('**Hey and Welcome!** <:LY_cat:1266156629091422248> ');
      break;
    case 'باك':
      message.channel.send('**ولكم باك!!** <:LY_dum:1266156609193644135> ');
      break;
    case 'back':
      message.channel.send('**Welcome Back!!** <:LY_cat:1266156629091422248> ');
      break;
    case 'brb':
    case 'gtg':
      message.channel.send('**OK, I Will be Waiting For You.** <:LY_dum:1266156609193644135> ');
      break;
    case 'حشيش':
      message.channel.send('**من جد وين وين؟!** <:3RQ_MPS59:1107354988453314702> ');
      break;
    case 'bye':
    case 'باي':
      message.channel.send('**See You Soon!** <:LY_dum:1266156609193644135> ');
      break;
    case '-':
      message.channel.send('*Welcome to **Atlass,** enjoy your stay...*  <a:LY_crown_AA:1279626337438666863>');
      break;
    case '.':
      message.channel.send('**اطلق من ينقط** <a:th11:1279626209642152037>  ');
      break;
    default:
      // Handle cases where no match is found
      break;
  }

});
///////////////////////////////////////////
client.on("messageCreate", async message => {
  if (message.author.bot || message.channel.type == "dm") return;
  var cmd = message.content.split(" ")[0];
  if (cmd == prefix + "invites") {
    var invite = await inviteTracker.getMemberInvites(message.member);
    message.reply({ content: `** You has ${invite.count} invite(s).**` });
  }
});
/////////////////////////////////////
client.on("messageCreate", async (message) => {
  if (message.content === '.all-ban') {
    // Check if the user has the necessary permissions to view bans
    if (!message.member.permissions.has('BAN_MEMBERS')) {
      return message.channel.send("You don't have permission to view the banned users.");
    }

    try {
      const bans = await message.guild.bans.fetch();
      if (bans.size === 0) {
        return message.channel.send("There are no banned users in this server.");
      }

      const banList = bans.map(ban => `**User:** ${ban.user.tag} - **ID:** ${ban.user.id}`).join('\n');

      const embed = new MessageEmbed()
        .setTitle('Banned Users')
        .setDescription(banList)
        .setColor('#ff0000')
        .setFooter({ text: `Total Bans: ${bans.size}`, iconURL: message.guild.iconURL() });

      message.channel.send({ embeds: [embed] });
    } catch (error) {
      console.error(error);
      message.channel.send("An error occurred while fetching the ban list.");
    }
  }
});
/////////////////////////////////////
// كل بوتات السيرفر
client.on('messageCreate', message => {
  if (message.content === prefix + "allbots") {
    let arr = new Array();
    let esp = message.guild.members.cache.filter(e => e.user.bot);
    esp.forEach(member => arr.push(`${member}`))
    let embed = new MessageEmbed()
      .setTitle(`${message.guild.name} bots`)
      .setDescription(`${arr.join(`\n`)}`)
      .setTimestamp()
      .setColor("#2f3136")
    message.channel.send({ embeds: [embed] });
  }
})
////////////////////////////////////////////////
///boost
client.on('guildMemberUpdate', async (oldMember, newMember) => {
  if (!oldMember.premiumSince && newMember.premiumSinceTimestamp) {
    const channel = client.channels.cache.get('1279608856447684630');
    await channel.send(`${newMember.user} شكرًا علي البوست يعـسل <a:LY_crown_AA:1279626337438666863>`);
  }
});

///////////////////////////////////////////////////////////////////
//////// ميوت
const mutedRoleId = '1279611547055820824'; // Replace with your muted role ID
const authorizedRoles = ["1279611390340108328", "1279611398250565743"]; // Replace with your authorized role IDs

client.on("messageCreate", async message => {
  if (!message.guild || message.author.bot) return;

  if (message.content.startsWith(prefix + 'mute')) {
    let hasPermission = message.member.roles.cache.some(role => authorizedRoles.includes(role.id));

    if (!hasPermission) return message.react('❌');

    let args = message.content.split(" ").slice(1);
    const member = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
    const time = args[1];

    if (!args[0] || !member || !time || member.id === message.member.id || message.member.roles.highest.position < member.roles.highest.position || !message.guild.me.permissions.has(Permissions.FLAGS.MANAGE_ROLES)) {
      const notime = new MessageEmbed()
        .setAuthor({ name: `${message.author.tag}`, iconURL: message.author.displayAvatarURL({ dynamic: true }) })
        .setTitle(`Command: mute`)
        .setColor("#2f3136")
        .setDescription(`Mute a member.

          **Usage:**
          ${prefix}mute [user] (time m/h/d/w)

          **Examples:**
          ${prefix}mute @username 60s
          ${prefix}mute @username 5m
          ${prefix}mute @username 10m
          ${prefix}mute @username 1h
          ${prefix}mute @username 1d
          ${prefix}mute @username 1w
        `)
        .setFooter({ text: `Your Bot Name`, iconURL: client.user.displayAvatarURL() });
      return message.channel.send({ embeds: [notime] });
    }

    let muteRole = message.guild.roles.cache.find(role => role.id == mutedRoleId);
    if (!muteRole) {
      return message.react('❌'); // Ensure mute role exists beforehand
    }

    await member.roles.add(muteRole);
    message.react('✅');
    Data.set(`MutedMember_${member.id}`, 'True');
    setTimeout(() => {
      if (member.roles.cache.has(muteRole.id)) {
        member.roles.remove(muteRole);
        Data.delete(`MutedMember_${member.id}`);
      }
    }, ms(time));
  }

  if (message.content.startsWith(prefix + 'unmute')) {
    let hasPermission = message.member.roles.cache.some(role => authorizedRoles.includes(role.id));

    if (!hasPermission) return message.react('❌');

    let member = message.mentions.members.first() || message.guild.members.cache.get(message.content.split(" ")[1]);

    if (!member || !member.roles.cache.has(mutedRoleId)) {
      const noUnmute = new MessageEmbed()
        .setAuthor({ name: `${message.author.tag}`, iconURL: message.author.displayAvatarURL({ dynamic: true }) })
        .setTitle(`Command: unmute`)
        .setColor("#2f3136")
        .setDescription(`Unmute a member.

          **Usage:**
          ${prefix}unmute [user]

          **Examples:**
          ${prefix}unmute @username
        `)
        .setFooter({ text: `Your Bot Name`, iconURL: client.user.displayAvatarURL() });
      return message.channel.send({ embeds: [noUnmute] });
    }

    let muteRole = message.guild.roles.cache.find(role => role.id == mutedRoleId);

    await member.roles.remove(muteRole);
    message.react('✅');
    Data.delete(`MutedMember_${member.id}`);
  }
});

client.on("guildMemberAdd", (member) => {
  const muted = Data.get(`MutedMember_${member.id}`);
  if (!muted) return;

  let muteRole = member.guild.roles.cache.find(role => role.id == mutedRoleId);
  if (muteRole) {
    member.roles.add(muteRole);
  }
});
/////////////////////////////////////////////////
// بلاك لست
client.on("messageCreate", async message => {
  if (!message.channel.guild && message.author.bot) return;
  if (message.content.startsWith(prefix + 'سجن')) {
    const Permissions2 = ["1279611390340108328", ""];
    let Suger_he = false;
    for (const id of Permissions2) {
      if (message.member.roles.cache.has(`${id}`)) Suger_he = true;
    }
    if (!Suger_he)
      return message.react('❌')
    let args = message.content.split(" ").slice(1).join(" ");
    const member = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
    var time = args[1]
    if (!time) time = '24h'
    const guilds = message.guild.me.permissions.has("MANAGE_ROLES");
    if (!args[0]) return message.react('❌')
    if (!member) return message.react('❌')
    if (member.id === message.member.id)
      return message.react('❌')
    if (message.member.roles.highest.position < member.roles.highest.position)
      return message.react('❌')
    if (!guilds) return message.react('❌')
    let muteRole = message.guild.roles.cache.find((role) => role.id == "1270081643914203256");
    if (!muteRole) {
      message.guild.roles.create({
        id: "1270081643914203256",
      }).then((createRole) => {
        message.guild.channels.cache.filter((c) => c.type == "GUILD_TEXT").forEach(c => {
          c.permissionOverwrites.edit(createRole, { SEND_MESSAGES: false, ADD_REACTIONS: false })
        })
        message.react('❌')
      })
    } else {
      message.guild.members.cache.get(member.id)?.roles.add(muteRole);
      message.react('✅')
      Data.set(`MutedMember_${member.id}`, 'True'), ms(time)
    }
  }
});

client.on("guildMemberAdd", (member) => {
  const muted = Data.get(`MutedMember_${member.id}`);
  if (!muted) return;
  let muteRole = member.guild.roles.cache.find((role) => role.id == "1270081643914203256");
  member.roles.add(muteRole);
});
////
client.on('messageCreate', message => {
  if (message.content.startsWith(prefix + 'عفو')) { // - غير الامر عادي اذا حب تخليه من غير برفكس شيل برفكس
    const Permissions = ["1279611390340108328", ""]; // - هنا مين يقدر يستخدم الامر من رولات
    let Suger_he = false;
    for (const id of Permissions) {
      if (message.member.roles.cache.has(`${id}`)) Suger_he = true;
    }
    if (!Suger_he)
      return message.react('❌');
    // get the mentioned user or the user who sent the message
    let member = message.mentions.members.first() || message.member;
    // get the role by its ID
    let role = message.guild.roles.cache.get('1270081643914203256'); // - هنا ايدي الرتبه اللي شخص راح ياخده
    // add the role
    member.roles.remove(role)
      .then(() => {
        message.react('✅')
      })

  }

});

/////////////////////////////////////////////////
// مسح ..
client.on("messageCreate", async message => {
  if (message.content.startsWith(prefix + "clear")) {
    message.delete({ timeout: 0 })
    if (!message.channel.guild) return message.reply(`** This Command For Servers Only**`);
    if (!message.member.permissions.has('MANAGE_MASSAGE')) return message.reply(`** 😕 You don't have permissions **`);
    if (!message.guild.me.permissions.has('MANAGE_MASSAGE')) return message.reply(`** 😕 I couldn't edit the channel permissions. Please check my permissions and role position. **`);
    let args = message.content.split(" ").slice(1)
    let messagecount = parseInt(args);
    if (args > 100) return message.channel.send({
      content: `\`\`\`javascript 
i cant delete more than 100 messages 
\`\`\``}).then(messages => messages.delete(5000))
    if (!messagecount) messagecount = '100';
    message.channel.messages.fetch({ limit: 100 }).then(e => {
      message.channel.send('Deleting messages.').then(function(e) {
        setTimeout(function() {
          message.channel.bulkDelete(messagecount).then(msgs => {
            let msgsize = msgs.size
            message.channel.send({
              content: `\`\`\`js
${msgsize} messages cleared
\`\`\``}).then(messages => {
                setTimeout(() => {
                  messages.delete()
                }, 4000)
              })
          }).catch(err => 0)
        }, 600)
      })
    })
  }
});

/////////////////////////////////////////////////
// تغير اسم
client.on('messageCreate', async message => {
  if (message.content.toLowerCase().startsWith(prefix + 'nick')) {

    const member = message.mentions.members.first() || message.guild.members.cache.get(message.content.split(' ')[1]);
    const name = message.content.split(" ").slice(2).join(" ")

    const Permissions3 = ["1279611390340108328", "1279611398250565743"];
    let Suger_he = false;
    for (const id of Permissions3) {
      if (message.member.roles.cache.has(`${id}`)) Suger_he = true;
    }
    if (!Suger_he)
      return message.react('❌')

    if (message.member.roles.highest.position < member.roles.highest.position)
      return message.react('❌')
    if (!member) return message.react('❌')
    if (!name) return message.react('❌')

    member.setNickname(name).then(() => {
      message.react('✅')
    }).catch(() => { message.react('❌') })
  }
})

/////////////////////////////////////////////////
// طرد
client.on("messageCreate", async message => {
  if (message.author.bot) return;
  if (message.content.startsWith(prefix + 'kick')) {
    let argss = message.content.split(" ");
    const role = ["1279611390340108328", ""];
    let Suger_he = false;
    for (const id of role) { if (message.member.roles.cache.has(`${id}`)) Suger_he = true; }
    if (!Suger_he)
      return message.react('❌')
    let member = message.guild.members.cache.get(argss[0]) || message.mentions.members.first();
    if (!member)

      if (message.member.roles.highest.position <= member.roles.highest.position) {
        message.react('❌')
      } else {
      }
    let id = message.content.split(' ').slice(1).join(' ')
    let user = message.mentions.members.first() || message.guild.members.cache.get(id)
    if (!user) return message.react('❌')
    if (user.roles.highest.position > message.member.roles.highest.position && message.author.id !== message.guild.fetchOwner().id) return message.react('❌')

    if (!user.kicknable) return message.react('❌')
    user.kick().then(() => message.react('✅'))
  }
})

/////////////////////////////////////////////////
// بان 
client.on("messageCreate", async message => {
  if (message.author.bot) return;
  let c = message.content.split(' ')
  if (c[0] == prefix + 'حظر') {

    const role = ["1279611390340108328", ""];
    let Suger_he = false;
    for (const id of role) { if (message.member.roles.cache.has(`${id}`)) Suger_he = true; }
    if (!Suger_he)
      return message.react('❌')

    let argss = message.content.split(' ')
    let user = message.guild.members.cache.get(argss[1]) || message.mentions.members.first();
    if (!user) return message.react('❌')
    if (user.roles.highest.position > message.member.roles.highest.position && message.author.id !== message.guild.fetchOwner().id) return message.react('❌')

    if (!user.bannable) return message.react('❌')
    await user.ban().catch(err => { console.log(err) });
    await message.react('✅');
  }
})
//////
client.on("messageCreate", async normal => {
  if (normal.content.startsWith(prefix + "ban")) {
    if (!normal.member.permissions.has('BAN_MEMBERS')) return normal.channel.send({ content: "You don't have permissions" })
    if (!normal.guild.me.permissions.has('BAN_MEMBERS')) return normal.channel.send({ content: "I don't have permissions" })
    const args = normal.content.slice(prefix.length).trim().split(/ +/g);
    var member = normal.mentions.members.first() || normal.guild.members.cache.get(args[1]) || normal.guild.members.cache.find(m => m.user.username === args.slice(1).join(' '));
    if (!member) return normal.channel.send({ content: `**Please Mention user or Type the user ID/Username ${args.slice(1).join(' ')} **` })
    if (member.id === normal.author.id) return normal.reply({ content: `**You can't ban yourself**` })
    if (member.id === normal.guild.me.id) return normal.reply({ content: `**You can't ban me dumbass**` })
    if (!member.bannable) return normal.channel.send({ content: `**The member role is higher than me**` });

    await member.ban({ reason: `He/She just got bannned` })
    normal.channel.send({ content: `**${member.user.username} Has been BANNNED ✈**` })
  }
})
//////// ميوت

client.on("messageCreate", async message => {
  if (!message.channel.guild && message.author.bot) return;
  if (message.content.startsWith(prefix + 'mute')) {
    const Permissions2 = ["1279611390340108328", "1279611398250565743"];
    let Suger_he = false;
    for (const id of Permissions2) {
      if (message.member.roles.cache.has(`${id}`)) Suger_he = true;
    }
    if (!Suger_he)
      return message.react('❌')
    let args = message.content.split(" ").slice(1).join(" ");
    const member = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
    var time = args[1]
    if (!time) time = '24h'
    const guilds = message.guild.me.permissions.has("MANAGE_ROLES");
    if (!args[0]) return message.react('❌')
    if (!member) return message.react('❌')
    if (member.id === message.member.id)
      return message.react('❌')
    if (message.member.roles.highest.position < member.roles.highest.position)
      return message.react('❌')
    if (!guilds) return message.react('❌')
    let muteRole = message.guild.roles.cache.find((role) => role.id == "1279611547055820824");
    if (!muteRole) {
      message.guild.roles.create({
        id: "1279611547055820824",
      }).then((createRole) => {
        message.guild.channels.cache.filter((c) => c.type == "GUILD_TEXT").forEach(c => {
          c.permissionOverwrites.edit(createRole, { SEND_MESSAGES: false, ADD_REACTIONS: false })
        })
        message.react('❌')
      })
    } else {
      message.guild.members.cache.get(member.id)?.roles.add(muteRole);
      message.react('✅')
      Data.set(`MutedMember_${member.id}`, 'True'), ms(time)
    }
  }
});

client.on("guildMemberAdd", (member) => {
  const muted = Data.get(`MutedMember_${member.id}`);
  if (!muted) return;
  let muteRole = member.guild.roles.cache.find((role) => role.id == "1279611547055820824");
  member.roles.add(muteRole);
});

/////
client.on('messageCreate', message => {
  if (message.content.startsWith(prefix + 'unmute')) { // - غير الامر عادي اذا حب تخليه من غير برفكس شيل برفكس
    const Permissions = ["1279611390340108328", "1279611398250565743"]; // - هنا مين يقدر يستخدم الامر من رولات
    let Suger_he = false;
    for (const id of Permissions) {
      if (message.member.roles.cache.has(`${id}`)) Suger_he = true;
    }
    if (!Suger_he)
      return message.react('❌');
    // get the mentioned user or the user who sent the message
    let member = message.mentions.members.first() || message.member;
    // get the role by its ID
    let role = message.guild.roles.cache.get('1279611547055820824'); // - هنا ايدي الرتبه اللي شخص راح ياخده
    // add the role
    member.roles.remove(role)
      .then(() => {
        message.react('✅')
      })

  }

});
///////////////////////////
// تقرار الرساله
client.on("messageCreate", async message => {
  if (message.author.bot) return;
  if (!message.channel.guild) return;
  if (message.content.startsWith(prefix + 'say')) {
    if (!message.member.permissions.has("ADMINISTRATOR")) {
      return message.reply("** 😕 You don't have permissions **");
    }
    if (!message.guild.me.permissions.has('ADMINISTRATOR')) {
      return message.reply(`** 😕 I couldn't edit the channel permissions. Please check my permissions and role position. **`);
    }
    let args = message.content.split(' ').slice(2).join(' ')
    let argss = message.content.split(' ')
    let channel = message.mentions.channels.first() || message.guild.channels.cache.get(argss[1])
    let attach = message.attachments.first()
    if (!channel) return message.channel.send('** 😕 Please mention channel or id **');
    if (!args) return message.channel.send('** ❌ Please select a message **');
    message.delete()
    if (!attach) {
      channel.send({ content: `${args}` });
    } else {
      channel.send({ content: `${args}`, files: [attach] });
    }
  }
})


/////////////////////////////////////////////////
// رساله الالوان

const channel_id = '1279615120045113447'; // ايدي الروم لرسال رسالة
const interval = 100; // كمية الوقت التي تريد الانتظار قبل ارسال الرسالة الجديدة ومسح الرسائل السابقة

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);

  setInterval(async () => {
    try {
      // الروم الذي تريد ارسال الرسالة فيه ومسح كل الرسائل فيه
      const channel = client.channels.cache.get(channel_id);

      // مسح كل الرسائل في الروم
      await channel.bulkDelete(100);

      // ارسال الرسالة الجديدة
      await channel.send({ files: ['./colors.png'] });
      // ارسال الرسالة الجديدة
      await channel.send({ content: '**لختيار لوُنكَ اكتب ,**` لون` , `والرقم`' });
    } catch (error) {
      console.error(error);
    }
  }, interval * 1000);
});
//////////
let color = ["1279615120045113447"];
client.on("messageCreate", message => {
  if (!color.includes(message.channel.id)) return;
  if (message.author.bot) return;
  if (!message.channel.guild) return;

  if (message.content.toLowerCase().startsWith('لون')) {

    let args = message.content.split(' ').slice(1)

    if (isNaN(args)) return message.channel.send({ content: '**يجب إدخال ارقام :1234:** .' })

    let role = message.guild.roles.cache.find(r => r.name == args)

    if (!role) return message.channel.send({ content: '**رقم اللون خاطئ**' })

    message.member.roles.cache.filter(rr => !isNaN(rr.name)).forEach(r => {

      message.member.roles.remove(r)

    })

    message.member.roles.add(role).then(() => {

      let embed = new Discord.MessageEmbed()

        .setTitle('تم تغيير اللون بنجاح!')
        .setDescription("تم طلبة بوُاسطتك .. " + args)
        .setFooter(message.guild.name, message.guild.iconURL())
        .setColor(role.hexColor)

      message.channel.send({ embeds: [embed] })

    })
  }
})

/////////////////////////////////////////////////
///Ticket 
const ticketMap = new Map();
const claimStatusMap = new Map(); // To track claimed status and message ID
const topicMessageMap = new Map(); // To track the message ID where the topic selection was sent

client.on('messageCreate', message => {
  if (message.content === '-Ticket') {
    if (ticketMap.has(message.author.id)) {
      message.author.send("You have already created a ticket.");
      return;
    }

    const row = new MessageActionRow().addComponents(
      new MessageButton()
        .setLabel('Ticket')
        .setStyle('SECONDARY')
        .setCustomId('Tic')
        .setEmoji('<a:LY_crown_AA:1279626337438666863>')
    );

    message.channel.send({
      files: ['./back.png'],
      components: [row]
    });
  }
});

client.on('interactionCreate', async interaction => {
  if (!interaction.isButton() && !interaction.isSelectMenu()) return;

  if (interaction.customId === 'Tic') {
    if (ticketMap.has(interaction.user.id)) {
      await interaction.user.send("You have already created a ticket.");
      return;
    }

    const ticketCategory = interaction.guild.channels.cache.find(category => category.id === '1279608367014215680');
    const supportRoleId = '1279611398250565743'; // Replace with the actual ID of the support role

    if (!ticketCategory || !supportRoleId) {
      await interaction.reply("Error: Ticket category or support role not found.");
      return;
    }

    const channel = await interaction.guild.channels.create(`ticket-${interaction.user.username}`, {
      type: 'text',
      permissionOverwrites: [
        {
          id: interaction.guild.roles.everyone,
          deny: ['VIEW_CHANNEL'],
        },
        {
          id: interaction.user.id,
          allow: ['VIEW_CHANNEL', 'SEND_MESSAGES', 'READ_MESSAGE_HISTORY'],
        },
        {
          id: supportRoleId,
          allow: ['VIEW_CHANNEL', 'SEND_MESSAGES', 'READ_MESSAGE_HISTORY', 'MANAGE_CHANNELS'],
        }
      ],
      parent: ticketCategory,
    });

    const deleteButton = new MessageButton()
      .setLabel('Delete Ticket')
      .setStyle('SECONDARY')
      .setCustomId('delete')
      .setEmoji('<a:LY_crown_AA:1279626337438666863>');

    const claimButton = new MessageButton()
      .setLabel('Claim Ticket')
      .setStyle('SECONDARY')
      .setCustomId('Claim')
      .setEmoji('<a:LY_crown_AA:1279626337438666863>');

    const buttonRow = new MessageActionRow().addComponents(deleteButton, claimButton);

    // Send the ticket message with buttons
    await channel.send({
      files: ['./back.png'],
      content: `Here's your ticket, ${interaction.user}! Wait for the Support's <@&${supportRoleId}>.`,
      components: [buttonRow]
    });

    // Send the topic selection menu
    const topicSelectMenu = new MessageActionRow().addComponents(
      new MessageSelectMenu()
        .setCustomId('topic_select')
        .setPlaceholder('Select a topic...')
        .addOptions([
          { label: 'تقديم على الادره', value: 'apply_for_admin' },
          { label: 'شراء رتبه', value: 'buy_rank' },
          { label: 'شراء اعلان', value: 'buy_ad' },
          { label: 'شكايه بعضو', value: 'complaint' },
          { label: 'شيء اخر', value: 'other' }
        ])
    );

    const topicMessage = await channel.send({
      content: `Hey ${interaction.user}, choose the topic you need help with!`,
      components: [topicSelectMenu]
    });

    await interaction.reply({ content: `Ticket created! ${channel}`, ephemeral: true });

    ticketMap.set(interaction.user.id, channel.id);
    claimStatusMap.set(channel.id, { claimedBy: null, messageId: null }); // Initialize claim status
    topicMessageMap.set(channel.id, topicMessage.id); // Store the topic message ID
  }

  if (interaction.customId === 'delete') {
    const supportRoleId = '1279611398250565743'; // Replace with the actual ID of the support role

    if (interaction.member.roles.cache.has(supportRoleId)) {
      await interaction.channel.delete();
      ticketMap.delete(interaction.user.id);
      claimStatusMap.delete(interaction.channel.id); // Clean up claim status
      topicMessageMap.delete(interaction.channel.id); // Clean up topic message ID
    } else {
      await interaction.reply({ content: 'You do not have the required permissions to delete this ticket.', ephemeral: true });
    }
  } else if (interaction.customId === 'Claim') {
    const supportRoleId = '1279611398250565743'; // Replace with the actual ID of the support role

    if (interaction.member.roles.cache.has(supportRoleId)) {
      const channel = interaction.channel;

      const claimStatus = claimStatusMap.get(channel.id);

      if (claimStatus.claimedBy) {
        await interaction.reply({ content: `This ticket has already been claimed by <@${claimStatus.claimedBy}>.`, ephemeral: true });
        return;
      }

      // Update claim status
      claimStatus.claimedBy = interaction.user.id;
      claimStatusMap.set(channel.id, claimStatus);

      // Create or update the claim message
      let claimMessage;
      if (claimStatus.messageId) {
        // Update existing claim message
        claimMessage = await channel.messages.fetch(claimStatus.messageId);
        await claimMessage.edit({ content: `This ticket has been claimed by <@${interaction.user.id}>.` });
      } else {
        // Send new claim message
        claimMessage = await channel.send({ content: `This ticket has been claimed by <@${interaction.user.id}>.` });
        claimStatus.messageId = claimMessage.id;
        claimStatusMap.set(channel.id, claimStatus);
      }

      // Acknowledge the claim interaction
      await interaction.reply({ content: `You have claimed this ticket!`, ephemeral: true });
    } else {
      await interaction.reply({ content: 'You do not have the required permissions to claim this ticket.', ephemeral: true });
    }
  } else if (interaction.isSelectMenu() && interaction.customId === 'topic_select') {
    const selectedValue = interaction.values[0];
    const topics = {
      'apply_for_admin': 'تقديم على الادره',
      'buy_rank': 'شراء رتبه',
      'buy_ad': 'شراء اعلان',
      'complaint': 'شكايه بعضو',
      'other': 'شيء اخر'
    };

    // Get the message ID for the topic selection message
    const topicMessageId = topicMessageMap.get(interaction.channel.id);
    if (topicMessageId) {
      const topicMessage = await interaction.channel.messages.fetch(topicMessageId);
      await topicMessage.edit({
        content: `Hey ${interaction.user}, choose the topic you need help with! \n\nThis ticket has been claimed by <@${claimStatusMap.get(interaction.channel.id)?.claimedBy || 'No one yet'}>. \n\nUser selected: ${topics[selectedValue]}`
      });
    }

    await interaction.reply({ content: `You selected: ${topics[selectedValue]}`, ephemeral: true });
  }
});
/////////////////////////////////////////////////
// دخل البوت روم صوتي
client.on('ready', async () => {
  const { joinVoiceChannel } = require('@discordjs/voice');
  let GUILD = client.guilds.cache.get('1279607376013557810');
  const connection = joinVoiceChannel({
    channelId: '1279609224925806664',
    guildId: GUILD.id,
    adapterCreator: GUILD.voiceAdapterCreator,
    selfDeaf: false
  });
  connection;
});
////////////////////////////////////////
client.on("messageCreate", async message => {
  if (message.content.startsWith(prefix + 'unlock')) {

    const permission = message.member.permissions.has("MANAGE_CHANNELS");
    const guilds = message.guild.me.permissions.has("MANAGE_CHANNELS");
    const args = message.content.split(' ')
    const channel = message.mentions.channels.first() || client.channels.cache.get(args[1]) || message.channel;
    if (!permission)
      return message.reply(
        { content: ":x: **You don't have permission to use this command**" }
      ).catch((err) => {
        console.log(`i couldn't reply to the message: ` + err.message)
      })

    if (!guilds) return message.reply({ content: `:rolling_eyes: **I couldn't change the channel permissions. Please check my permissions.**` }).catch((err) => {
      console.log(`i couldn't reply to the message: ` + err.message)
    })
    let everyone = message.guild.roles.cache.find(hyper => hyper.name === '@everyone');
    channel.permissionOverwrites.edit(everyone, {
      SEND_MESSAGES: null,
      SEND_MESSAGES_IN_THREADS: null,
      CREATE_PUBLIC_THREADS: null,
      CREATE_PRIVATE_THREADS: null

    }).then(() => {
      message.reply({ content: `:unlock: **${channel} has been unlocked.**` }).catch((err) => {
        console.log(`i couldn't reply to the message: ` + err.message)
      })
    })
  }
})

//////
client.on("messageCreate", async message => {
  if (message.content.startsWith(prefix + 'lock')) {

    const permission = message.member.permissions.has("MANAGE_CHANNELS");
    const guilds = message.guild.me.permissions.has("MANAGE_CHANNELS");
    const args = message.content.split(' ')
    const channel = message.mentions.channels.first() || client.channels.cache.get(args[1]) || message.channel;
    if (!permission)
      return message.reply(
        { content: ":x: **You don't have permission to use this command**" }
      ).catch((err) => {
        console.log(`i couldn't reply to the message: ` + err.message)
      })
    if (!guilds) return message.reply({ content: `:rolling_eyes: **I couldn't edit the channel permissions. Please check my permissions and role position.**`, ephemeral: true }).catch((err) => {
      console.log(`i couldn't reply to the message: ` + err.message)
    })
    let everyone = message.guild.roles.cache.find(hyper => hyper.name === '@everyone');
    channel.permissionOverwrites.edit(everyone, {
      SEND_MESSAGES: false,
      SEND_MESSAGES_IN_THREADS: false,
      CREATE_PUBLIC_THREADS: false,
      CREATE_PRIVATE_THREADS: false

    }).then(() => {
      message.reply({ content: `:lock: **${channel} has been looked.** ` }).catch((err) => {
        console.log(`i couldn't reply to the message: ` + err.message)

      })
    })
  }
})
////////////////////////////////////////////////
/*
const Room = '1262564370274324582';
const images = [
  'https://pbs.twimg.com/media/Eox3fDzXcAEV-Zu?format=jpg&name=small',
  'https://pbs.twimg.com/media/EtoRC-4XEAMemD2?format=jpg&name=small',
  'https://pbs.twimg.com/media/EsqkK53XUAIp-yS?format=jpg&name=small',
  'https://pbs.twimg.com/media/Es-xXUnXMAEQ2Qr?format=jpg&name=small',
  'https://pbs.twimg.com/media/Eox3YdHXIAE7lnB?format=jpg&name=small',
  'https://pbs.twimg.com/media/EtrVZ09XYAIylBg?format=jpg&name=small',
  'https://pbs.twimg.com/media/Eox3VYrW8AE1P2R?format=jpg&name=small',
  'https://pbs.twimg.com/media/EsswxTRXEAQXHCU?format=jpg&name=small',
  'https://pbs.twimg.com/media/Es5TdK9WMAY9fOg?format=jpg&name=small',
  'https://pbs.twimg.com/media/Es5WqL_XYAEUkFb?format=jpg&name=small',
  'https://pbs.twimg.com/media/EsqkNzOWMAETgJ8?format=jpg&name=small',
  'https://pbs.twimg.com/media/Es-xXUnXMAEQ2Qr?format=jpg&name=small',
  'https://pbs.twimg.com/media/EsV-tdwW4A0l_Ll?format=jpg&name=small',
  'https://pbs.twimg.com/media/Etk_de_XMAAtgCB?format=jpg&name=small',
  'https://pbs.twimg.com/media/EtrTXKUXEAATxlz?format=jpg&name=small',
  'https://pbs.twimg.com/media/Es5Uzg9XUAETJB5?format=jpg&name=small',
  'https://pbs.twimg.com/media/EtVid0XXEAQtgFo?format=jpg&name=small',
  'https://pbs.twimg.com/media/Esvur0xXAAAfbBV?format=jpg&name=small',
  'https://pbs.twimg.com/media/EtlCZpGXAAM8fs7?format=jpg&name=small',
'https://pbs.twimg.com/media/Es5XCiiW8AAIoXL?format=jpg&name=small',
  'https://pbs.twimg.com/media/EsgOjv3XIAI3PGW?format=jpg&name=small',
  'https://pbs.twimg.com/media/EtQXwadXEAEbkEy?format=jpg&name=small',
  'https://pbs.twimg.com/media/EtrT3MsXIAAPa53?format=jpg&name=small',
  'https://pbs.twimg.com/media/Etf_35xWYAAbrXp?format=jpg&name=small',
  'https://pbs.twimg.com/media/EtCMTUJXMAA-1Bo?format=jpg&name=small',
  'https://pbs.twimg.com/media/EtrTn28XEAEj6_f?format=jpg&name=small',
  'https://pbs.twimg.com/media/Essw9YCWMAUdhTI?format=jpg&name=small',
  'https://pbs.twimg.com/media/EtoQ2lNWYAo2oax?format=jpg&name=small'
];

client.once('ready', () => {
  console.log(Logged in as ${client.user.tag}!);

  const channel = client.channels.cache.get(Room);

  if (!channel) {
    console.error('Channel not found!');
    return;
  }

  console.log('Channel found, starting interval to send images...');

  setInterval(() => {
    const image = images[Math.floor(Math.random() * images.length)];
    const embed = new EmbedBuilder()
      .setColor('#2f3136')
      .setDescription('LuYe, Prayer')
      .setImage(image)
      .setThumbnail(channel.guild.iconURL());

    channel.send({ embeds: [embed] })
      .then(() => console.log('Embed sent!'))
      .catch(console.error);
  }, 1 * 60 * 1000); // 1 minute interval
});
*/
////////////////////////////////////////////////
///boost
client.on('guildMemberUpdate', async (oldMember, newMember) => {
  if (!oldMember.premiumSince && newMember.premiumSinceTimestamp) {
    const channel = client.channels.cache.get('1270081814614118482');
    await channel.send(`${newMember.user} شكرًا علي البوست يعـسل <a:LY_crown_AA:1279626337438666863>`);
  }
});
///////////////////////////////////////
////اقتباس
client.on("messageCreate", async (message) => {
  if (message.content.startsWith(prefix + "اقتباس")) {
    let tweets = [
      " **الحكمة في كثير من الأحيان عندما ننحدر أقرب مما كانت عليه عندما نرتفع.** ",
      " **الفرص الصغيرة غالبا ما تكون بداية للمشاريع العظيمة.** ",
      " **الحرية ، بأخذ الكلمة بمعناها الملموس ، تكمن في القدرة على الاختيار** ",
      " **إن ارتداء قلبك على كمك ليس خطة جيدة جدًا ؛ يجب عليك ارتدائه في الداخل ، حيث يعمل بشكل أفضل.** ",
      " **الانضباط هو الجسر بين الأهداف والإنجاز.** ",
      " **الشرط الأول للنجاح هو القدرة على تطبيق طاقاتك الجسدية والعقلية على مشكلة واحدة باستمرار دون الشعور بالتعب.** ",
      " **أنا لا أرى أبدا ما تم القيام به. أنا فقط أرى ما يجب القيام به.** ",
      " **عندما تحكم على شخص آخر ، فأنت لا تحدده ، بل تحدد نفسك.** ",
      " **لتحريرنا من توقعات الآخرين ، لنعيدنا لأنفسنا ... هناك تكمن القوة العظيمة والمفردة لاحترام الذات.** ",
      " **كل ما يزعجنا بشأن الآخرين يمكن أن يقودنا إلى فهم أفضل لأنفسنا.** ",
      " **لا تذهب إلى حيث قد يؤدي المسار ، اذهب بدلاً من ذلك حيث لا يوجد مسار واترك ممرًا.** ",
      " **الانضباط هو الجسر بين الأهداف والإنجاز.** ",
      " **الوصول إلى نقطة ما هو نقطة البداية إلى نقطة أخرى.** ",
      " **الصديق الحقيقي هو أثمن ما في كل الممتلكات والذي لا نفكر فيه كثيرًا في اقتنائه** ",
      " **لتحريرنا من توقعات الآخرين ، لنعيدنا لأنفسنا ... هناك تكمن القوة العظيمة والمفردة لاحترام الذات.** ",
      " **كل ما يزعجنا بشأن الآخرين يمكن أن يقودنا إلى فهم أفضل لأنفسنا.** ",
      " **لا تذهب إلى حيث قد يؤدي المسار ، اذهب بدلاً من ذلك حيث لا يوجد مسار واترك ممرًا.** ",
      " **الانضباط هو الجسر بين الأهداف والإنجاز.** ",
      " **الوصول إلى نقطة ما هو نقطة البداية إلى نقطة أخرى.** ",
      " **الصديق الحقيقي هو أثمن ما في كل الممتلكات والذي لا نفكر فيه كثيرًا في اقتنائه.** ",
      " **إذا كان هناك شيء مثل الزواج الجيد ، فهذا لأنه يشبه الصداقة وليس الحب.** ",
      " **الطريقة الصحيحة ليست دائمًا الطريقة الشعبية والسهلة. إن الدفاع عن الحق عندما لا يحظى بشعبية هو اختبار حقيقي للشخصية الأخلاقية.** ",
      " **الحب يشفي الناس - أولئك الذين يعطونها والذين يتلقونها.** ",
      " **يجب على المرء أن يكون مغرمًا بالناس ويثق بهم إذا لم يكن يريد إحداث فوضى في الحياة.** ",
      " **إذا قمت بتغيير الطريقة التي تنظر بها إلى الأشياء ، فإن الأشياء التي تنظر إليها تتغير.** ",
      " **احذر من ضياع الفرص ؛ وإلا فقد يكون قد فات الأوان في يوم من الأيام.** ",
      " **إذا كنت لا تعرف إلى أين أنت ذاهب ، فإن أي طريق سيوصلك إلى هناك.** ",
      " **البساطة النقية المقدسة تخلط بين كل حكمة هذا العالم وحكمة الجسد.** ",
      " **الاحتمالات عديدة بمجرد أن نقرر التصرف وعدم الرد.** ",
      " **أين هي الحياة التي فقدناها في العيش؟ أين الحكمة التي فقدناها في المعرفة؟ أين هي المعرفة التي فقدناها في المعلومات؟** ",
      " **إن الدخول في أي حرب دون الرغبة في كسبها أمر قاتل.** ",
      " **لا يمكنك عبور البحر بمجرد الوقوف والتحديق في الماء.** ",
      " **اقبل الأشياء التي يربطك بها القدر ، وأحب الأشخاص الذين يجمعك القدر معًا ، لكن افعل ذلك من كل قلبك.** ",
      " **الزواج: صداقة تعترف بها الشرطة.** ",
      " **أنا لست مهتمًا بالعمر. الناس الذين يخبرونني بأعمارهم سخيفة. أنت كبير في السن بقدر ما تشعر.** ",
      " **أين هي الحياة التي فقدناها في العيش؟ أين الحكمة التي فقدناها في المعرفة؟ أين هي المعرفة التي فقدناها في المعلومات؟** ",
      " **الرجل الجاهل يبحث عن السعادة من بعيد ، والحكيم ينموها تحت قدميه.** ",
      " **ما الجديد في العالم؟ لا شئ. ما هو قديم في العالم؟ لا شئ. كل شيء كان دائمًا وسيظل دائمًا.** ",
      " **عندما تكون راضيًا عن كونك مجرد نفسك ولا تقارن أو تنافس ، سيحترمك الجميع.** ",
      " **يجب أن يتغيروا في كثير من الأحيان ، الذين سيكونون دائمًا في السعادة أو الحكمة.** ",
      " **المعنى الذي اخترته ، الذي غير حياتي: تغلب على الخوف ، انظر إلى العجائب.** ",
    ];
    let tweet = tweets[Math.floor(Math.random() * tweets.length)];
    let embed = new MessageEmbed()
      .setAuthor({ name: message.author.username, iconURL: message.author.displayAvatarURL() })
      .setThumbnail(message.guild.iconURL())
      .setDescription(`**${tweet}**`)
      .setColor(`#2f3136`)
      .setFooter({ text: `Atlass. Tweet`, iconURL: client.user.displayAvatarURL() })

    message.channel.send({ embeds: [embed] })
  }
})

///////////////////////////////////////
/// كت تويت
client.on("messageCreate", async (message) => {
  if (message.content === "كت") {
    let tweets = [
      "شخص تحب ابتسامتة ؟",
      "كم لك فـ الديسكورد ؟",
      "حاجة دايم تضيع منك ؟",
      "اكثر شيء تكره تنتظره ؟",
      "بالغالب وش تسوي فـ الويكند ؟",
      "تتحمل المزح الثقيل ؟",
      "وش اكثر فاكهة تحبها ؟",
      "كم من 10 البرود فيك ؟",
      "اصعب وظيفة في نظرك ؟",
      "رائحة عطر مدمن عليها ؟",
      "ترتيبك بالعائلة ؟",
      "اخر شخص قالك كلمة حلوة ..",
      "دائما قوة الصداقة بـ ... ؟",
      "شاي ولا قهوة ؟",
      "شيء تبيه يصير الحين .. !",
      "اكلة ادمنتها الفترة ذي ؟",
      "عمرك طحت بمكان عام ؟",
      "ماركتك المفضلة ؟",
      "منشن ... اكثر شخص تثق فيه ؟",
      "اذا انسجنت وش تتوقع بتكون التهمة الي عليك ؟",
      "تعطي الناس فرصة تتقرب منك ؟",
      "منشن .. الشخص الي يستحق تدخل الديسكورد عشانه ..",
      "متى اخر مره نمت اكثر من 12 ساعة ؟",
      "رائحة عطر مدمن عليها ..",
      "وش تحس انك تحتاج الفترة هاذي ؟",
      "كم من 10 البرود فيك ؟",
      "وش اكثر فاكهة تحبها ؟",
      "اصعب وظيفة في نظرك ؟",
      "شيء بسيط قادر على حل كل مشاكلك ..",
      "اذا جلست عند ناس م تعرفهم .. تكتفي بالسكوت ، ولا تتكلم معهم ؟",
      "تتحمل المزح الثقيل ؟",
      "من النوع الي تنام فـ طريق السفر ؟",
      "لو شلنا من طولك 100 كم يبقى من طولك ؟",
      "موقفك من شخص أخفى عنك حقيقة ما، تخوفًا من خسارتك؟",
      "اكثر شخص ينرفزك الي ؟",
      "تعرف تتصرف في المواقف العصبة ؟",
      "متى حسيت انك مختلف عن الي غيرك ؟",
      "اصعب مرحلة دراسية مرت عليك ؟",
      "سويت شيء بالحياة وانت مو مقتنع فيه ؟",
      "اخر مره ضربوك فيها ... ووش كان السبب ؟",
      "من الاشياء الي تجيب لك الصداع ؟",
      "مين اول شخص تكلمه اذا طحت بـ مصيبة ؟",
      "مع او ضد : النوم افضل حل لـ مشاكل الحياة ...",
      "تجامل ولا صريح ؟",
      "تفضل المواد الي تعتمد على الحفظ ولا الفهم ؟",
      "صفة تخليك تكره الشخص مهما كان قربه منك ؟",
      "جربت احد يعطيك بلوك وانت تكتب له ؟",
      "تهتم بـ معرفة تاريخ ميلاد الي تحبهم ؟",
      "فيه شيء م تحب تطلبه حتى لو كنت محتاجة ؟",
      "دائما قوة الصداقة بـ ... ؟",
      "اخر شخص قالك كلمة حلوة ..",
      "كم من 10 الي تتوقعه يصير ؟",
      "اذا كنت بنقاش مع شخص وطلع الحق معه تعترف له ولا تصر على كلامك ؟",
      "فيه شخص تكرهه بشكل كبير ؟ ولك جرأة تمنشن اسمه ؟",
      "كيف الجو عندكم اليوم ؟",
      "ترتيبك بالعائلة ؟",
      "تسمع شيلات ؟",
      "تفضل السفر فـ الشتاء ولا الصيف ؟",
      "مع او ضد : الهدية بـ معناها وليس بـ قيمتها",
      "عندك صحبة من اشخاص خارج دولتك ؟",
      "دك صحبة من اشخاص خارج دولتك ؟",
      "تحب اصوات النساء فـ الاغاني ولا الرجال",
      "وش اول جوال شريته ؟",
      "وش النوع الي تحبه ف الافلام ؟",
      "اكثر مكان تحب تجلس فيه فالبيت ؟",
      "صفة قليل تحصلها فـ الناس حالياً ؟",
      "من النوع الي تعترف ولا تجحد ؟",
      "اول شخص تكلمه اذا صحيت من النوم ؟",
      "وش اجمل لهجة عرببية بالنسبة لك ؟",
      "اخر اتصال من مين كان ؟",
      "اجمل مدينة بدولتك ؟",
      "شاعرك المفضل ؟",
      "كم مره تشحن جوالك باليوم",
      "لو كنت مؤلف كتاب .. وش راح يكون اسمه ؟",
      "اطول مدة قضيتها بدون اكل ..",
      "كم من 10 نسبة الكسل فيك هالايام ؟",
      "نومك خفيف ولا ثقيل ؟",
      "كم من عشرة تشوف صوتك حلو ؟",
      "تجيك الضحكة بوقت غلط ؟",
      "تفضل التسوق من الانترنت ، ولا الواقع ؟",
      "اغرب اسم مر عليك ؟",
      "وش رقمك المفضل ؟",
      "شيء تبيه يصير الحين ...",
      "شاي ولا قهوة ؟",
      "صفة يشوفونها الناس سيئة ، وانت تشوفها كويسه",
      "لون تكرهه ...",
      "وظيفة تحسها لايقة عليك ...",
      "كم من 10 كتابتك بالقلم حلوة ؟",
      "ينتابك خوف من شيئاً ما الان ؟",
      "اكلة ادمنتها الفترة ذي ...",
      "اجمل مرحلة دراسية مرت عليك ..",
      "اكثر شيء تكرهه فالديسكورد ..",
      "شيء مستحيل انك تاكله ...",
      "وش رايك بالي يقرأ ولا يرد ؟",
      "اسمك بدون اول حرفين ..",
      "متى تكره الطلعة ؟",
      "شخص من عائلتك يشبهونك فيه ...",
      "اكثر وقت تحب تنام فيه ...",
      "تنتظر احد يجيك ؟",
      "اسمك غريب ولا موجود منه كثير ؟",
      "وش الشيء الي يكرهه اقرب صاحب لك ؟",
      "كم من 10 حبك للكتب ؟",
      "جربت الشهرة او تتمناها ؟",
      "مين اقرب شخص لك بالعائلة ؟",
      "شيء جميل صار لك اليوم ؟",
      "كلمتك اذا احد حشرك بالنقاش ...",
      "اعمال يدوية نفسك تتقنها .",
      "اكثر واحد يرسلك بالديسكورد ؟",
      "كم من عشرة تقيم يومك ؟",
      "شخص تحب تستفزه ؟",
      "منشن صديقك الفزعة",
      "تاريخ يعني لك الكثير ؟",
      "حزين ولا مبسوط ؟",
      "تحب سوالف مين ؟",
      "متى تكره نفسك ؟",
      "قبل ساعة ايش كنت تسوي ؟",
      "اخر شخص تهاوشت معه ؟",
      "الفلوس كل شيء ؟",
      "تعرف تمسك نفسك اذا عصبت ؟",
      "مودك الحين ؟",
      "محادثة ولا مكالمة ؟",
      "كم مره يتقلب مزاجك باليوم ؟",
      "شخص يعرف عنك كل شي ؟",
      "تتقبل النصيحة من أي أحد ؟",
      "أكثر ماده تحبها دراسياً والسبب؟.",
      "متى لازم تقول لا ؟",
      "تقدر تعيش يوم كامل بدون نت ؟",
      "شخص تحب ابتسامتة ؟",
      "وش تحب تسوي وقت فضاوتك ؟",
      "من الاشياء اللي تجيب لك الصداع ؟",
      "أكثر شي يعتمدون عليك فيه ؟",
      "حصلت الشخص اللي يفهمك ولا لا ؟",
      "اخر هوشه جلدت ولا انجلدت ؟",
      "أسم وانطباعك عنه ؟",
      "نصيحه صغيرة من واقع تجربتّك؟.",
      "كيف تفرغ غضبك بالعادة ؟",
      "حاجة دايم تضيع منك ؟",
      "اكثر شيء تكره تنتظره ؟",
      "اكثر شيء تحبه بـ شكلك ؟",
      "اكثر سوالفك عن ...؟",
      "شخص م تقدر تكذب عليه ؟",
      "كم من 10 تحس بـ الطفش ؟",
      "وش اغبى شيء سويته ؟",
      "عاده لاتستطيع تركها ؟ ",
      "اذا حسيت بـ غيرة تتكلم ولا تسكت ؟",
      "ماركتك المفضلة ؟",
      " [منشن] اكثر شخص تثق فيه؟",
      " اصعب وظيفة في نظرك ؟",
      "كم من 10 البرود فيك ؟",
      "تتحمل المزح الثقيل ؟",
      "اكثر شخص ينرفزك ؟",
      "اصعب مرحلة دراسية مرت عليك ؟",
      "تجامل ولا صريح ؟",
      "كم من 10 الي تتوقعه يصير ؟",
      "عندك صحاب من خارج دولتك ؟",
      "وش النوع الي تحبه ف الافلام ؟",
      "وش اول جوال شريته ؟",
      "صفة قليل تحصلها فـ الناس حالياً ؟",
      "اجمل مدينة بدولتك ؟",
      "شاعرك المفضل ؟",
      "كم مره تشحن جوالك باليوم ؟",
      "نومك خفيف ولا ثقيل ؟",
      "كم من عشرة تشوف صوتك حلو ؟",
      "تجيك الضحكة بوقت غلط ؟",
      "اغرب اسم مر عليك ؟",
      "رقمك المفضل ؟",
      "شاي ولا قهوة ؟",
      "كم من 10 كتابتك بالقلم حلوة ؟",
      "وش رايك بالي يقرأ ولا يرد ؟",
      "اكثر شيء تكرهه فالديسكورد ؟",
      "اسمك غريب ولا موجود منه كثير ؟",
      "جربت الشهرة او تتمناها ؟",
      "شيء جميل صار لك اليوم ؟",
      "ممكن تكره احد بدون سبب ؟",
      "متى اخر مره قلت ليتني سكت ؟",
      "متى صحيت ؟",
      "جربت تروح اختبار بدون م تذاكر ؟",
      "قل حقيقه عنك ؟",
      "تعطي فرصة ثانية للي كسرك ؟",
      "اكثر شيء حظك سيء فيه ؟",
      "قلة العلاقات راحة .. [مع][ضد]",
      "على ماذا ندمت ؟",
      "وش لون عيونك ؟",
      " الرجال اكثر حقداً من النساء ؟ ",
      "اخر مكالمة كانت مع مين ؟",
      "متى تحس بـ شعور حلو ؟",
      "مبدأ تعتمد عليه فـ حياتك",
      "كمل : حلو يومك بـ وجود ...",
      "تترك احد عشان ماضيه سيء ؟",
      "@منشن: اكثر شخص يفهمك",
      "مين المغني المفضل عندك ؟",
      "اميزة ودك يضيفها البرنامج",
      "اهم شيء يكون معك فكل طلعاتك ",
      "اعلى نسبة جبتها ف حياتك الدراسية",
      "فيه شيء م تقدر تسيطر عليه ؟",
      "@منشن : شخص تحب سوالفه",
      "تتوقع إنك قادر تحمل مسؤولية؟",
      "تفضل : الصباح ، الليل",
      "وش الاكلة المفضلة عندك ؟",
      "كمل : النفس تميل لـ ...",
      "وش تتخيل يصير معك فالمستقبل ؟",
      "اقوى كذبة كذبتها على اهلك",
      "كيف تعبر عن عصبيتك ؟",
      "تقدر تنام وخاطرك مكسور ؟",
      "كم طولك ؟",
      "كم وزنك ؟",
      "وش طموحك بالحياة ؟",
      "وش نوع جوالك ؟",
      "اقرب فعل لقلبك ؟",
      "شكلك يعطي لأي جنسية ؟",
      "وش المطعم المفضل عندك ؟",
      "مشهور تكرهه ؟",
      "اغنيتك المفضلة ...",
      "يهمك ملابسك تكون ماركة ؟",
      "صفة لا تتمنى ان تكون فـ عيالك",
      "لعبة ندمت انك لعبتها ؟",
      "شيء تتمنى يتحقق ؟",
      "كلمة او عبارة مستحيل تنساها",
      "نومك : ثقيل ولا خفيف",
      "اكتب تاريخ مستحيل تنساه",
      "لو حظك يباع ، بكم بيكون ؟",
      "اكثر شيء يرفع ضغطك",
      "اهلك ايش ينادونك؟",
      "اكثر شيء تحب امتلاكه !؟",
      "كيف تصالح احد انت مزعله ؟",
      "كلمه للمستقبل؟ ",
      "متي يكون الفراق هين؟",
      "كرتونك المفضل وانت صغير؟",
      "الدنيا علمتني؟",
      "متي تصير شخص ملقوف؟",
      "شغله دايماً تجيب العيد فيها؟",
      "اغنية تمثلك؟",
      "لهجه تحبها؟غنية تمثلك؟",
      "متى تعتبر الشخص غثيث؟",
      "عبر عن مزاجك ب رياكشن..",
      "منشن شخص ينرفزك دايم # ",
      "متى تعتبر نفسك منتصر؟",
      "طيبتك وش سوت فيك؟",
      "هل نحن وحدنا؟",
      "نصيحة من واقع تجربتك 💓 ",
      "منشن شخص تحترم عقليته وتفكيره",
      "مقولة او حكمة تمشي عليها",
      "تقدر تتحمل عيوب شخص تحبه",
      "يكبر الشخص في عينك لما ؟؟",
      "اذا زعلت إيش يرضيك ؟",
      "من النوع اللي تعترف بسرعه ولا تجحد ؟",
      "من الاشياء البسيطة اللي تسعدك ؟",
      "اخر مره بكيت",
      "ردّك على شخص قال ؟.",
      "ايموجي يعبر عن وضعك الحين ؟",
      "التاريخ المنتظر بالنسبة لك ؟",
      "كلنا بنسمعك إيش بتقول ؟",
      "مدينتك اللي ولدت فيها ؟",
      "عندك شخص مستحيل يمر يوم وما تكلمه ؟",
      "كلمة تقولها لنفسك ؟",
      "كم من عشرة متفائل بالمستقبل ؟",
      "ردك المعتاد اذا أحد ناداك ؟",
      "أكثر كلمه تسمعها من أمك ؟",
      "إيش تفضل عمل ميداني ولاعمل مكتبي ؟",
      "أكثر حيوان تحبه ؟",
      "أخر مرة نزل عندكم مطر ؟",
      "اكثر مشاكلك بسبب ؟ ",
      "اكره شعور ممكن يحسه انسان ؟",
      "شخص تحب تنشبله ؟ ",
      "تنتظر شيء ؟ ",
      "جربت تسكن وحدك ؟",
      "اكثر لونين تحبهم مع بعض ؟",
      "متى تكره نفسك ؟",
      "كم من عشرة مروق ؟",
      "مدينة تتمنى تعيش وتستقر فيها طول عمرك ؟",
      "لو للحياة لون إيش بيكون لون حياتك ؟",
      "ممكن في يوم من الأيام تصبح شخص نباتي ؟.",
      "عمرك قابلت شخص يشبهك ؟",
      "اخر شخص تهاوشت معه ؟ ",
      "قبل ساعة ايش كنت تسوي ؟",
      "كلمة تقولها للي ببالك ؟",
      "أكثر شيء مضيع وقتك فيه ؟",
      "لو فتحتا خزانتك إيش اكثر لون بنشوف ؟",
      "قوة خارقة تتمنى تمتلكها ؟",
      "اكثر مصايبك مع مين ؟",
      "اذا زعلت إيش يرضيك ؟",
      "من النوع اللي تعترف بسرعه ولا تجحد ؟",
      "من الاشياء البسيطة اللي تسعدك ؟",
      "اخر مره بكيت",
      "ايموجي يعبر عن وضعك الحين ؟",
      "التاريخ المنتظر بالنسبة لك ؟",
      "كلنا بنسمعك إيش بتقول ؟",
      "مدينتك اللي ولدت فيها ؟",
      "عندك شخص مستحيل يمر يوم وما تكلمه ؟",
      "كلمة تقولها لنفسك ؟",
      "كم من عشرة متفائل بالمستقبل ؟",
      "ردك المعتاد اذا أحد ناداك ؟ ",
      "اكبر مبلغ ضاع منك ؟",
      "كلمة تختصر وضعك الحين ؟",
      "نظام نومك ...",
      "أكثر مكان تجلس فيه غير غرفتك ؟",
      "حرف تحبه ؟",
      "كم درجة الحرارة بمدينتك ؟",
      "تعطي اللي غلط بحقك فرصة ؟",
      "حياتك بكلمة ؟",
      "عندك مليون ريال بس مايمديك تشتري الا شيء  يبدأ بأول حرف من اسمك. وش بتشتري ؟",
      "اكثر شيء ساحب عليه الفترة هذي ؟",
      "شيء مستحيل تعطيه أحد ؟",
      "تنتظر شيء ؟ ",
      "ايش الوظيفة التي تستحق أعلى راتب؟",
      "كم مره تشحن جوالك باليوم ؟",
      "كم من عشرة عندك امل انك تصير مليونير ؟",
      "اشياء م تسويها غير اذا كنت مروق ؟",
      "لو بيدك تغير بالزمن, تقدمه ولا ترجعه ؟.",
      "دولة امنيتك تزورها ؟.",
      "  شخص فاهمك بالدنيا ؟",
      "تسامح بسرعة ؟.",
      "كم تحتاج وقت عشان تتعود على مكان جديد ؟",
      "كم من عشرة تحب الهدوء ؟",
      "لعبة تشوف نفسك فنان فيها ؟",
      "أصعب قرار ممكن تتخذه ؟",
      "شيء نفسك تجربه ؟",
      "أشياء توترك ؟",
      "كم من عشرة تحب الاطفال ؟.",
      "كيف تعبر عن عصبيتك ؟",
      "منشن شخص تبيه يتبند من السيرفر ؟.",
      "خيالك إلى أين يصل بك ؟",
      "شي لو يختفي تصير الحياة جميلة ؟.",
      "دولة امنيتك تزورها ؟",
      "العصر إيش كنت تسوي ؟",
      "@منشن: الشخص الي عادي تقوله اسرارك",
      "مِن غرائب الدسكورد ؟",
      "اذا اردت ان تبكي الان، فعلى من تبكي ؟",
      "عندما تجد من يُكمِّلك تمسك به ، هل تتفق مع المقولة ؟",
      "مين اقرب لك: (خوالك - عمامك)",
      "رتبهم: (الحب - الصحة - الكرامة - المال)",
      "دائما قوة الصداقة بـ ... ؟",
      "لو كانت لك الحرية في تغيير اسمك إيش راح تختار اسم ؟",
      "أكتب شيء تؤجر عليه ...🌸",
      "شيء ودك الناس تتركه",
      "مع او ضد: من يهتم بك لا تخسره قد لا تعيد لك الحياة شخصاً مثله ...",
      "مين تتوقع يطالعك طول الوقت بدون ملل ؟",
      "رسالة إيجابية؟💭",
      "اول شيء بتسويه اذا زعلت ؟",
      "نوع من الطيور تود تربيته ؟",
      "شغله مستحيل تشتغلها ؟",
      "شيء تبيه يصير الحين ؟",
      "أكثر اسم تحبه ؟",
      "تنسد نفسك عن الاكل لو زعلت ؟",
      "كم من عشرة تحب حياتك ؟",
      "مرة سويت جميل و نكره شخص ؟",
      "صفة تحمد الله انها مو موجودة في اصحابك ...",
      "شخص تحبه يطلب كلمة مرور حسابك، كيف تتصرف؟",
      "اصعب وظيفة في نظرك ؟",
      "اكثر شخص ينرفزك الي .. ؟",
      "حط @منشن .... لـ شخص مُتنمر من الدرجة الاولى",
      "عادةً، تصحح أخطائك أم لا بأس في المكابرة من وقت لآخر ؟",
      "كيف سيكون العالم لو كنا مثلك يامن تقرأ؟",
      "لو ستبدأ حياتك من جديد ، وش راح تغير بـ نفسك ؟",
      "عادي تتغير عشان شخص تحبه ؟",
      "تحب الشاي اكثر او القهوه ؟",
      "اكثر شخص تتهاوش معه ؟",
      "لو خيروك بين يعطونك مليون أو راتب شهري متوسط بدون عمل مدى الحياة إيش تختار ؟",
      "الفلوس كل شيء ؟",
      "عشان تعيش مرتاح ؟",
      "ردة فعلك لو شفت شخص يبكي قدامك ؟",
      "كم مره أخذت عمره بـ رمضان ؟",
      "ردة فعلك لو مزح معك شخص م تعرفه ؟",
      "شيء تشوف نفسك مبدع فيه ؟",
      "ماذا تفعل الان ؟ ",
      "كم من عشرة تحب حياتك ؟.",
      "كم عدد الصور بجوالك ؟.",
      "كم عدد اصحابك المقربين منك كثير ؟.",
      "شكراً لأنك في حياتي ..تقولها لمين ؟",
      "كيف تتعامل مع الشخص اللي يرد متأخر دائماً ؟.",
      "اللوان داكنة  ولا فاتحه؟",
      "كيف تتعامل مع الاشخاص السلبيين ؟",
      "دايم الانطباع الاول عنك إنك شخص ؟",
      "شيء حلو صار لك اليوم ؟",
      "اول شيء يلفت انتباهك بشخص اول مرة تقابله ؟.",
      "حط@منشن لـ شخص تقوله ليه أنت جميل كذا ؟.",
      "جماد م تستغني عنه ؟.",
      "مع ، ضد : البكاء يقلل التوتر ..!",
      "حط@ منشن لـ شخص تقوله  ارتحت لك.",
      "إيش كان نكك ايام البيبي ؟.",
      "من النوع اللي تحفظ اسامي الناس  بسرعه ولا بس اشكالهم ؟.",
      "لو كان لك الحرية تغير اسمك إيش راح تختار اسم ؟",
      "اكثر شيء ضيعت عليه فلوسك ؟ ",
      "تعرف تمسك نفسك اذا عصبت ؟",
      "عمرك شاركت بمسابقة وربحت ؟",
      "إيش لون جوالك ؟. ",
      "تعتقد إنك انسان لك فايدة ؟",
      "اذا احد سألك عن شيء م تعرفه تقول م اعرف ولا تتفلسف ؟",
      "أطول صداقة بينك وبين شخص كم مدتها ؟.",
      "تعرف تعبر عن الكلام اللي بداخلك ؟",
      "ردة فعلك اذا انحشرت بالنقاش ؟",
      "بالعادة برمضان تنحف ولاتسمن ؟",
      "تمارس رياضة معينة برمضان ؟",
      "عندك فوبيا من شيء ؟.",
      "الساعة كم اذان الفجر عندكم ؟ ",
      "شيء من الماضي للحين عندك ؟.",
      "عندك شخص انت حييل جريء معاه و ما تستحي منه ؟ ",
      "عمرك انتقمت من شخص؟",
      "اكثر شي يتعبك بالصيام العطش ولا الجوع ؟",
      "اكثر شخص يتصل عليك بالواتس ؟",
      "متى اخر مره جربت شعور ليتني سكت بس ؟",
      "اسم ولد وبنت تحسهم لايقين على بعض ؟.",
      "مسلسل ناوي تشوفه ؟",
      "عادي تتغير عشان شخص تحبه ؟",
      "شيء كل م تذكرته تستانس؟",
      "ايامك هالفترة عبارة عن ؟",
      "منشن شخصين تحسهم نفس الاسلوب او الشخصية ..",
      "اكثر شيء بتشتاق له اذا جاء رمضان ؟",
      "كم مره سامحت بقلبك بس عقلك رافض هالشيء ؟.",
      "مع او ضد .. البنت تحب انشاء المشاكل في العلاقات ..",
      "ماهي طريقتك في معاتبة شخص ؟",
      "لو كنت محتار بين شخص تحبه وشخص يحبك، من تختار؟ ",
      "الشيء الي تحسه يجذبك للشخص هو ؟",
      "اكثر شخص بينك وبينه تواصل دائم ؟",
      "اعلى نسبة جبتها بحياتك الدراسية ؟",
      "شايل هم شيء ؟",
      "إيش تفضل صح وخطأ ولا خيارات ؟",
      "اكثر ايموجي تستخدمه ؟",
      "جربت ينسحب جوالك فترة الاختبارات ؟.",
      "مادة دايم تجيب العيد فيها ؟",
      "وجبة ساحب عليها ؟",
      "تحب تتعرف على ناس جدد ولا مكتفي باللي عندك ؟",
      "مادة تكرها بس درجاتك عالية فيها ؟",
      "شيء بسيط قادر يعدل مزاجك بشكل سريع ؟",
      "اطول مدة جلسة تذاكر فيها بشكل متواصل كم ساعة ؟",
      "قبل امس الوقت هذا إيش كنت تسوي ؟",
      "منشن شخص لو م شفته تحس يومك ناقص ؟",
      "كلمتك اذا شفت حاجة حلوة ؟",
      "خوالك ولا عمامك ؟",
      "عادي تطلع وجوالك مافيه شحن كثير ؟",
      "شيء من صغرك ماتغير فيك ؟",
      "أصعب انتظار ؟",
      "أجمل بيت شعر سمعته ...",
      "مودك الحين ؟",
      "عندك صديق يحمل نفس اسمك ؟",
      "محادثة ولا مكالمة ؟",
      "كم مره يتقلب مزاجك باليوم ؟",
      "اكثر شخص يسوي فيك مقالب ؟",
      "مكان تبي تكون فيه الحين ؟.",
      "كم من عشرة تحب مهنة التدريس ؟",
      "شنو تتوقع بتصير بعد 10 سنين ؟",
      "متى تحب الطلعة ؟",
      "أغرب شي اشتهيت تأكله فجأة ؟",
      "اخر مره بكيت متى ؟",
      "اكثر شخص يقفل بوجهك اذا كلمك ؟",
      "كثر شخص يكرفك ؟",
      "تدخل بنقاش بموضوع ماتفهم فيه شيء ولا تسكت وتسمع بس ؟",
      "عمرك طحت بمكان عام ؟",
      "شخص يعرف عنك كل شي تقريباً ؟",
      "اكثر واحد يرسلك بالديسكورد ؟",
      "إيش اللي قدامك الحين ؟",
      "من النوع اللي تعتمد على غيرك ولا كل شي تسويه بنفسك ؟",
      "تقدر تعيش يوم كامل بدون نت ؟",
      "مع او ضد : الاعتراف بـ شيء في قلبك دام طويلاً ؟",
      "أبوك إيش يقرب لأمك ؟",
      "اكثر مدة جلستها بدون نت ؟",
      "لو رجعناك خمس سنين هل كنت تتوقع ان حياتك بتكون نفس وضعك الحين ؟",
      "تتقبل النصيحة من أي أحد ؟",
      "متى لازم تقول لا ؟",
      "أكثر ماده تحبها دراسياً والسبب؟.",
      "إيش نوع قهوتك المفضلة ؟",
      "شخص تشوفه بشكل يومي غير اهلك ؟",
      "شخص تحب ابتسامتة ؟",
      "من الاشياء اللي تجيب لك الصداع ؟",
      "وش تحب تسوي وقت فضاوتك ؟.",
      "كم تعطي نفسك من عشرة بالجدية بحياتك",
      "أكثر شي يعتمدون عليك فيه ؟",
      "اكثر صفة عندك ؟",
      "كيف تعبر عن عصبيتك ؟",
      "كم داخل سيرفر فالديسكورد ؟",
      "حصلت الشخص اللي يفهمك ولا باقي ؟",
      "تفضل .. العيون الناعسة ... العيون الواسعة ؟",
      "اشياء تغيرت تظرتك لها",
      "الرقم السري حق جوالك ...",
      "لو قررت تقفل جوالك يوم كامل مين تتوقع أنه يفتقدك ؟",
      "اخر هوشه جلدت ولا انجلدت ؟",
      "نصيحه صغيرة من واقع تجربتّك؟.",
      "شخص يكلمك بشكل يومي ؟",
      "أسم وانطباعك عنه ؟",
      "العصر إيش كنت تسوي ؟",
      "كم من عشرة تعطي اهتمامك بدراستك أو عملك ؟",
      "كيف تفرغ غضبك بالعادة ؟",
      "أطول مدة قضيتها بعيد عن أهلك ؟",
      "شخص مستحيل تمسك ضحكتك معاه؟",
      "حاجة دايم تضيع منك ؟",
      "تجامل احد على حساب مصلحتك ؟",
      "كم لك فـ الديسكورد ؟",
      "اخر شخص تهاوشت معه مين ؟",
      "اكثر شيء تكره تنتظره ؟",
      "اخر مطعم اكلت منه ؟",
      "اكثر شيء تحبه بـ شكلك ؟",
      "تنام بـ اي مكان ، ولا بس غرفتك ؟",
      "اكتب اول كلمة جات في بالك الحين ؟",
      "تهمك التفاصيل ولا الزبدة من الموضوع ؟",
      "شيء واحد .. م عاد يهمك كثر اول ؟",
      "كم تقييمك لـ طبخك من 10 ، ولا م تطبخ ؟",
      "اتفه شيء ارسلوك عشانه ؟",
      "فن تحبه كثير ؟",
      "اكثر سوالفك عن ...؟",
      "صفة موجودة في جميع افراد عائلتك ؟",
      "شخص م تقدر تكذب عليه ؟",
      "كم من 10 تحس بـ الطفش ؟",
      "من النوع الي تجيك الردود القوية بعد الهوشة ولا فـ وقتها ؟",
      "تحب تجرب الاشياء الجديدة ، ولا تنتظر الناس يجربونها اول ؟",
      "وش اغبى شيء سويته ؟",
      "اكثر كلمة الناس تقولها عن شخصيتك ؟",
      "مراقبة شخص تركته .. فضول ولا بقايا مشاعر ؟",
      "كرهته الفترة هاذي",
      " مع او ضد ... اقاربك يعرفون عن حساباتك في برامج التواصل ؟",
      "اخر مره سافرت بالطائرة والى وين؟",
      "وش اليوم الي تكرف فيه كثير ؟",
      "تفضل .. الاعمال الحرة ولا الوظيفة ؟",
      "حاجة تشوف نفسك مبدع فيها ؟",
      "احكي كذبة تافهة زي انه غيث احسن من حسن",
      "- شخص ودك تتقرب له",
      "- شخص اول ما تصير لك مشكله تفكر فيه،",
      "-  شخصيته تعجبك وتحب الكلام معه",
      "- مثال للشخص المشكلجي",
      "- شخص تتمنى الانتقام منه.",
      "- شخص ندمت ع حبك له",
      "- شخص من الديسكوورد شفته بحلمك.",
      "-شخص تهديه كلمة من قلبك ووش هي",
      "- شخص لو مهما زعلك مستحيل تزعل منه او تتركه",
      "- شخص خاق عليه من اللي بالرروم وودك تعترف له الحين.",
      "- شخص تتمنى تكلمه خاص الحين",
      "-شخص انت قاعد تسلك له طول فترة صداقتكم",
      "-شخص غلطت عليك ودك تقول له كلمة اعتذار الحين",
      "- شخص ودك يختفي من حياتك",
      "- شخص تقول له، أنت جيتني هدية من ربي،",
      "- شخص مستعد تترك الديسك عشانه،",
      "- شخص تتمنى يحبك ويصارحك",
      "- شخص ما ترفض له طلب،.",
      "- شخص تهدية اغنية عتاب، من ووش الاغنية",
      "- شخص تعرفت عليه قريب،، ووش انطباعك عنه",
      "- شخص تمنيت لو انك ما عرفته",
      "- شخص تمنيت لو انه معك بحياتك والحقيقه",
      "- شخص آلمك كثير بس للحين تحبه رغم ايذائه لك",
      "- شخص تهديه اغنية بحبك يا حمار",
      "- شخص تحب اسلوبه وصوته",
      "- شخص اذا دخلت السيرفر تدوره بالرومات،",
      "- شخص ودك تتقرب له",
      "- شخص اول ما تصير لك مشكله تفكر فيه،",
      "-  شخصيته تعجبك وتحب الكلام معه",
      "- مثال للشخص المشكلجي",
      "- شخص تتمنى الانتقام منه.",
      "- شخص ندمت ع حبك له",
      "- شخص من الديسكوورد شفته بحلمك.",
      "-شخص تهديه كلمة من قلبك ووش هي",
      "- شخص لو مهما زعلك مستحيل تزعل منه او تتركه",
      "- شخص خاق عليه من اللي بالرروم وودك تعترف له الحين.",
      "- شخص تتمنى تكلمه خاص الحين",
      "-شخص انت قاعد تسلك له طول فترة صداقتكم",
      "-شخص غلطت عليك ودك تقول له كلمة اعتذار الحين",
      "- شخص ودك يختفي من حياتك",
      "- شخص تقول له، أنت جيتني هدية من ربي،",
      "- شخص مستعد تترك الديسك عشانه،",
      "- شخص تتمنى يحبك ويصارحك",
      "- شخص ما ترفض له طلب،.",
      "- شخص تهدية اغنية عتاب، من ووش الاغنية",
      "- شخص تعرفت عليه قريب،، ووش انطباعك عنه",
      "- شخص تمنيت لو انك ما عرفته",
      "- شخص تمنيت لو انه معك بحياتك والحقيقه",
      "- شخص آلمك كثير بس للحين تحبه رغم ايذائه لك",
      "- شخص تهديه اغنية بحبك يا حمار",
      "- شخص تحب اسلوبه وصوته",
      "- شخص اذا دخلت السيرفر تدوره بالرومات،",
      "الاغاني تعبير للمشاعر بشكل غير مباشر ؟ ",
      "الانتقام من شخص اساء لك ؟ ",
      "الي يراقب يحب ؟",
      "الغيره بين الاصحاب ؟",
      "مايقال وقت الغضب هي نظرة الشخص الحقيقية لك ؟ ",
      "الفلوس حل لكل مشكله ؟",
      "مراقبة الاخ لااخته ؟",
      "الي يتكلم عن شخص قدامك يحبك ؟",
      "التدخل بين أثنين لحل مشكله ؟",
      "حب النفس ؟",
      "حقيقة الشخص لايستطيع أخفاءها ؟",
      "الكذب نوع من أبقاء العلاقات على قيد الحياه ؟",
      "الصراحه تنهي العلاقات ؟",
      "الوقاحه بالرد تجعل شخصيتك قويه ؟",
      "مع او ضد  فليكن عندك الشجاعة لتفعل بدلاً من أن تقوم برد فعل",
      " مع او ضد  ما يجعل الحياة تستحق أن نحياها هو الإيمان !",
      "مع او ضد  يمكن تقسيم الناس إلى قسمين !!",
      "مع او ضد  عقل المتعصب يشبه بؤبؤ العين !",
      "مع او ضد  كثيراً ما يحمي الغباء صاحبه من أن يجن!",
      "مع او ضد  إذا أردت أن تعرف رأي أحد فيك فلتقم بإثارة غضبه !",
      "مع او ضد  الحب مفتاح يفتح كل أبواب السعادة ",
      "مع او ضد  الحكمة هي ملخص الماضي، ",
      "مع او ضد  عندما يتمدد العقل لاستيعاب فكرة جديدة لا يعود أبداً إلى حجمه الطبيعي !",
      "مع او ضد  أعظم ما في الدنيا هوه أين تقف !",
      "مع او ضد  الجنون غالباً ما يكون منطق العقل الذي تم إرهاقه !",
      "مع او ضد  يمتلك الرجال الإرادة ، لكن النساء تنفذ ما تريده!",
      "مع او ضد   تكون أي دعوة عظيمة إذا تم السعي ورائها بإصرار !",
      "مع او ضد  لا يتوقف الناس عن اللعب لأنهم كبروا، بل يكبرون لأنهم توقفوا عن اللعب !",
      "مع او ضد  الأب يستطيع العناية بعشرة أبناء، ولكن عشرة أبناء لا يستطيعون العناية بأب واحد !",
      "مع او ضد  الأب البخيل يرزق أبناً مبذراً !",
      "مع او ضد  الأبناء اليوم أصبحوا طغاة !",
      "مع او ضد  لا نشعر بمدى حب آبائنا لنا حتى نصبح أباءً !",
      " مع او ضد  الإنسان الوحيد الذي لن يحسدك على موهبتك هو أبوك !",
      "مع او ضد  الابن يظل ابناً حتى يتزوج ، أما الابنة فتظل ابنة لبقية حياتك !",
      "مع او ضد  الأباء الأساسية يريدون أن يكون أبناؤهم دائماً مدينون لهم!",
      "مع او ضد  لا يهم من كان أب، المهم هو من أتذكر كونه أب !",
      "مع او ضد  إذا ابتسمت أتاك الأصدقاء، وإذا عبست أتتك التجاعيد !",
      "مع او ضد - تحتفظ بذكريات شخص انتهت علاقتك فيه؟",
      "يقال ان الابتعاد عن الأشخاص راحه انت مع؟ او ضد؟ ",
      "' أسوأ صفة في المرأة من وجهة نظرك ؟.",
      "' من وجهة نظرك من اكثر انسان يستحق الحب في الحياة ؟.",
      "' مع او ضد الردود القاسية تمنعك تحن لشخصك القديم  ؟.",
      "' من النوع الي يكتفي بنفسه والا بالناس  ؟.",
      "' مع او ضد الاحترام تربية وليس ضعفاً . !  ؟.",
      "' كيف تعرف اهميتك عند الاشخاص  ؟.",
      "' مع او ضد لا يعرف الناس قيمة ما تفعله لأجلهم حتى تتوقف عن فعله. .!!",
      "' في وجهة نظرك لقاء الاصدقاء احتياج او رفاهية   ؟.",
      "' بنظرك الاعتراف بالكره لشخص رأي ولا وقاحه ؟.",
      "' شي اذا صار تنهي علاقتك بالشخص ؟.",
      "' ايش يوجع الانسان اكثر التعب النفسي ولا الجسدي ؟.",
      "' تتفق انو النوم حل لجميع المشاكل ؟.",
      "' عادي عندك تكنسل الطلعه عشان نومك ؟.",
      "' شخص يفهمك والا يحبك ؟.",
      "' تكون علاقه عشان تنسى علاقه قديمه ؟.",
      "' تفوز بالعناد والا البرود ؟.",
      "' الي كانو معاكم في عام 2019 للحين موجودين ؟.",
      "' الصديق ممكن يتحول عدو ؟.",
      "' تتوقعون الي ننتظر يكلمنا هو منتظر نكلمه بعد ؟.",
      "' لو احد صارحك بعيوبك تتقبل والا تقلب عليه ؟.",
      "' وش تسوي لما يتجاهلك الشخص ؟",
      "' أفضل إحساس ؟.",
      "' لو جنسيتك على شكلك وش بتكون ؟.",
      "' عادي تحط صورتك فدسكورد ؟.",
      "' ما هو الانطباع الأول عنك دائماً ؟.",
      "' هل رأي الآخرين مهم بالنسبة لك ؟.",
      "' هل هُناك لحظة او حدث قام بتغيير شخصيتك ؟.",
      "' ماهو تعريفك للحياه المثاليه ؟.",
      "' أيهما أهم, الكلام الذي تقوله أم الطريقة التي تقوله بها ؟.",
      "' هل ينبغي ان نخاف من الوحده ؟.",
      "' ما هي أقصى اهتماماتك ؟.",
      "' أنسب حل لتفريغ الضّيق ؟.",
      "' كم كتاب قرأت بحياتك ؟.",
      "' نبذه تعريفه عن شخصك المفضل ؟.",
      "' في مرض اسمه يتغيرون عليك فجأة بنظرك وش هو علاجه ؟.",
      "' ماذا تفضل ، ألا تعرف شيئًا أو تعرف كل شيء ؟.",
      "' معروف عنك ؟.",
      "'  سبب وجودك بالديسكورد ؟.",
      " سوالف وتغيير جو - علاقات وصداقات - تشبيك",
      "' حياتك عباره عن ؟.",
      "' مستحيل تسامح اللي ؟.",
      "' لما تعجب ف احد اول شي تسويه ؟.",
      "' اذا صار عندك وقت فراغ وش تسوي ؟.",
      "' ما رأيك بالحب ؟.",
      "' افضل شخصيه فرأيك ؟.",
      "' متى ينعاف الشخص بنظرك ؟.",
      "' نوعيه الناس اللي تتجنبها في حياتك ؟.",
      "' شيء دايم تلبسه ؟.",
      "' أكثر شيء لا تستطيع التحكم به ؟!.",
      "'يقال أن للإنسان ثلاث مراحل في العمر.؟!.",
      "' في أي مرحلة أنت .. ؟.",
      "' وضعك في هذا الوقت ؟.",
      "' الحزن انكسار لنفس اين تفرغ حزنك ؟.",
      "' رايك في هالمقوله .. من لقى غيرك نسى خيرك ؟.",
      "' تتفقون ان حب الطفوله احلا حب ؟.",
      "' عندك قدرة انك تعامل الي تحبه كصديق فقط ،، ؟.",
      "' العصبيه دمار لطرفين .. عمرك ندمت ع كلام قلته وقت عصبيتك .. ؟.",
      "' اكتب رساله مستحيل ترسلها لشخص المقصود .. ؟.",
      "' اذا احببت شخص ورحل دون سبب .. متى ستكف عن انتظاره .. ؟.",
      "' ماهو اكثر سؤال تسأله لنفسك هذه الفتره .. ؟.",
      "' تعبير بسيط عما يجول في خاطرك الان .. ؟.",
      "' الصمت أم الحديث يريح اكثر ؟.",
      "مع او ضد : اهتمام الشخص بك يجعلك تحب وجوده",
      "@منشن : شخص واكتب صفة م تحبها فيه",
      "اخر مكان سافرت له وين ؟",
      "@منشن : شخص تحس انه نكبه",
      "وش اكثر سؤال يدور في بالك ؟",
      "شيء م تحب احد يشاركك فيه",
      "مع او ضد : الحب بدايته اهتمام",
      "مع او ضد : دائما يكون اهتمامنا مع الانسان الخطأ",
      "لو خيروك :  قهوة عربية - قهوة تركية  ",
      "تحب الشخص  العفوي - الثقيل - الفلة ",
      "مع او ضد : المراة الجميلة لا تتدحث عن جمالها",
      "اذا جاك كلام ولا عرفت ترد عليه وش بتسوي ؟ ",
      "@منشن : شخص تشوفه نفسية",
      " وش تحب  قهوة باردة - قهوة حارة ",
      "تحب المكالمات الطويلة ؟",
      "@منشن : شخص تحس الوقت يطير معه",
      "تنتظر اتصال من مين ؟",
      "زمن تتمنى لو انك انولدت فيه",
      "تعاني من التفكير قبل النوم ؟",
      "مع او ضد : اكثر وقت يفكر فيه الشخص وقت النوم",
      "@منشن : شخص ودك تسافر معه",
      "مرتبطة سعادتك مع سعادة مين ؟",
      "تعتمد على غيرك كثير ؟",
      "مع او ضد : البنت في زمننا هي الي تتحرش ف الولد",
      "كم نسبة الغيرة عندك من ",
      "مع او ضد : الحقير من وجد البديل ونكر الجميل",
      "مرة سويت جميل و نكره شخص ؟",
      "وش اخر شيء اكلته امس ؟",
      "مع او ضد : ثق بـ نفسك فلا احد يستحق ان تثق به",
      "انت بنفسك تصنع للاشياء قيمة ؟",
      "اخر كلمة تقولها لو خلصت كلامك ؟",
      "كيف ينطق الطفل اسمك ؟",
      "تعتبر نفسك شخص عاطفي ولا عقلاني ؟",
      "مع او ضد : اصبح الرجل عاطفياً ، والفتاة عقلانية في زمننا هذا",
      "مع او ضد : الانتقام افضل وسيلة للراحة",
      "اسف تقولها لمين ؟",
      "هات صفة بأول حرف من اسمك ",
      "شخص ودك م تعرفت عليه ؟", ,
      "شخص ما يرد لك طلب ؟",
      "شخص مهما طلب مستحيل ترده ...",
      "وش ناقصك الحين ؟",
      "شيء غريب تحب ؟ ",
      "برايك السهر ممتع ، ولا مُتعب ؟ ",
      "اصدقاء الالكترون ، ولا الواقع ؟ ",
      "حط @منشن .... لـ شخص مُتنمر من الدرجة الاولى",
      "لو كنت شخصية كرتونية اي شخصية بتكون ؟ ",
      "ردك لو احد غلط بحقك واعتذر لك ؟ ",
      "ردك على من يدور الزعل ؟",
      "نشوف نفسك تعرف تقنع الاشخاص ولا لا",
      "اكتب ثلاث اشياء تحبها ...",
      "شخص تحس السيرفر بدونه م يسوى ",
      "اخر شخص عصبت عليه ",
      "ما معنى اسمك ؟",
      "كملها ... انا عُمري ما ( .......)",
      "جربت تحب احد من طرف واحد؟",
      "لو ضاقت فيك الدنيا ... لـ مين تروح ؟",
      "لو كنت ممثل وش تتوقع الدور الي بتتقنه؟ ",
      "خُلق يجذبك فالاخرين ",
      "مهارة تتمنى تتقنها ",
      "وش رايك بالشخص الي يعطي شعور لـ شخصين؟",
      "لو التمني يصير حقيقة ... وش امنيتك بتكون",
      "هل بـ مرة فكرت تنتحر ؟ ",
      "اكبر كذبة كذبتها على مين ؟ ووش كانت..؟",
      "شخصية تقهرك ",
      "رأيك : هل من حق الوالدين /  تفتيش اجهزة ابناءهم",
      "ذكرى جميلة ودك تتكرر ",
      "اول شيء تسويه لما تطفش ",
      "برأيك / ماهو اخطر عدو للانسان ",
      "وش ابشع شعور مريت فيه ",
      "لما تطلع من الديسكورد ، راح تندم على هالايام؟",
      "مع او ضد : الناس صارت م تعرف تسولف",
      "مع او ضد / مساواة المراة بالرجل  في كل شيء؟",
      "كمل : لو اهلي يقرأون افكاري كان (.........)",
      "وش مسمي اقرب شخص لك بالجوال ؟",
      "هل تكون العلاقة فاشلة لو لم تتم بالزواج؟",
      "شيء تفكر تشتريه ... ", ,
      "صلو على النبي ....??",
      "حكمة اليوم وكُل يوم؟",
      "شيء يَشغل بالك حاليًا؟",
      "أجمل شيء في الحياة؟",
      "نوع من الطيور تود تربيته؟",
      "خيالك إلى أين يصل بك؟",
      "هل سبق وكرهت شخصًا ثم أصبح صديقًا لك؟",
      "سنة 2020 في كلمــــة وحيـــــدة؟",
      "كيف كان يومك؟",
      "أغنية تسمعها كثيرًا هذي الفترة؟",
      "المراقبة بعد الفراق بقايا مشاعر أم فضول؟",
      "كلمة تهديها لأصحاب الوجهين؟",
      "آخر مدح وصلك ولم تكن تتوقعه؟",
      "أجمل يوم عندك في الأسبوع؟",
      "كم ساعة نمت؟",
      "لون تكرهه في الملابس؟",
      "نسبة النعاس عندك حاليًا؟",
      "نسبة تأثير الآخرين في أفعالك من 10؟",
      "هل تقلق بما يعتقده الآخرون عنك؟",
      "نسبة استقرارك فيما يتعلق بالجانب العاطفي؟",
      "ما الذي يُحزنك الآن؟",
      "كيف تتأكد أن هذا الشخص يُحبك بصدق؟",
      "لو أتيح لك خوض أحد هذه المغامرات، ما اختيارك؟",
      "تختار ضجيج البحر ام هدوء البر؟",
      "عندما لا يرد شخص ما على رسائلك سريعًا، يتسلل إليك الشعور بالقلق أم العصبية عليه؟",
      "نسبة انجرافك وراء أفكارك وتخيلاتك من 10؟", ,
      "صريح، هل تشعر بالغيرة من الآخرين؟",
      "مزاجك سريع التقلب؟",
      "هل تستخدم فيسبوك؟",
      "نادرًا ما يستطيع الأفراد مضايقتك أم تخاصمهم بسرعة؟",
      "في أي مجال ترى نفسك مبدعًا؟",
      "نسبة نظافة بيئة العمل والمنزل الخاصة بك من 10؟",
      "خطط السفر الخاصة بك غالبًا ما تكون مدروسة؟",
      "غالبا ما يكون من الصعب عليك توصيل مشاعرك للآخرين؟",
      "مشاعرك تتحكم فيك أكثر من تحكمك فيها؟",
      "تحاول دائمًا التبرير للأشخاص حول أفعالك أم تفضّل ترك الأمور كما هي؟",
      "عادة ما تكون متحفز ونشيط جدًا أم الكسل يغلب عليك؟",
      " صريح، تشعر أنك أفضل من الآخرين؟",
      "أنت من أي جماعة؟",
      "آخر إنجازاتك؟",
      "آخر صورة رهيبة من تصويرك؟",
      "شاركنا بيت شعر من تأليفك؟",
      "عادةً، تصحح أخطاءك أم لا بأس في المكابرة من وقت لآخر؟",
      "أيهما يعطى قيمة أكبر للإنسان في هذا الزمن؟ العلم أم المال؟",
      "إعلامي تحترمه لما يُقدمه من برامج رائعة؟",
      "أيهما أخطر في العلاقات، الغيبة أم النميمة؟",
      "أكثر حلى مفضّل عندك في الشتاء؟",
      "غداؤك لليوم؟",
      "أكثر لونين تحبهم في كل شيء ملابس وغيره؟",
      "شخص يقول: كيف أعلم أنني في حالة حب؟",
      "أجمل اسم بنت وملكي بحرف السين؟",
      "ما الذي تود حذفه من حياتك؟",
      "كيف كان أسبوعك؟",
      "لو أتيح لك الزواج من غير جنسيتك، اي جنسية  ستختار؟",
      "الشيء اللي مُهم عندك أنه يتوفّر في صديقك؟",
      "تعتبر نفسك من أصحاب الشخصية الغامضة أم ملفك مفتوح للأصدقاء؟",
      "لو قالوا لك: عليك اختيار أمنية وحيدة وبسرعة؟",
      "شاعرك المفضل ؟",
      "كم مره تشحن جوالك باليوم",
      "لو كنت مؤلف كتاب .. وش راح يكون اسمه ؟",
      "اطول مدة قضيتها بدون اكل ..",
      "كم من 10 نسبة الكسل فيك هالايام ؟",
      "كم من عشرة تشوف صوتك حلو ؟",
      "تجيك الضحكة بوقت غلط ؟",
      "تفضل التسوق من الانترنت ، ولا الواقع ؟",
      "اغرب اسم مر عليك ؟",
      "وش رقمك المفضل ؟",
      "شيء تبيه يصير الحين ... ",
      "شاي ولا قهوة ",
      "صفة يشوفونها الناس سيئة ، وانت تشوفها كويسه",
      "لون تكرهه ...",
      "وظيفة تحسها لايقة عليك ...",
      "كم من 10 كتابتك بالقلم حلوة ؟",
      "اكلة ادمنتها الفترة ذي ...",
      "اجمل مرحلة دراسية مرت عليك ..",
      "اكثر شيء تكرهه فالديسكورد ..",
      "شيء مستحيل انك تاكله ...",
      "وش رايك بالي يقرأ ولا يرد ؟",
      "اسمك بدون اول حرفين ..",
      "متى تكره الطلعة ؟",
      "شخص من عائلتك يشبهونك فيه ... ",
      "اكثر وقت تحب تنام فيه ...",
      "تنتظر احد يجيك ؟ ",
      "اسمك غريب ولا موجود منه كثير ؟",
      "وش الشيء الي يكرهه اقرب صاحب لك ؟",
      "كم من 10 حبك للكتب ؟",
      "جربت الشهرة او تتمناها ؟",
      "مين اقرب شخص لك بالعائلة ؟",
      "شيء جميل صار لك اليوم ؟",
      "كلمتك اذا احد حشرك بالنقاش ...",
      "اعمال يدوية نفسك تتقنها .",
      "وش الي يغلب عليك دائما .. قلبك ولا عقلك ؟",
      "صفة تحمد الله انها مو موجودة في اصحابك ...",
      "غالباً وش تسوين فالوقت هذا ؟",
      "كم وجبة تاكل فاليوم الفترة هاذي ؟ ",
      "جربت دموع الفرح ؟ وش كان السبب ؟",
      "لو فقط مسموح شخص واحد تتابعه فالسناب مين بيكون ؟",
      "لو حطوك بمستشفى المجانين كيف تقنعهم إنك مو مجنون ؟.",
      "اكثر شيء تحبه فالشتاء ...",
      "شيء ودك تتركه ...",
      "كم تعطي نفسك من 10 فاللغة الانجليزية ؟",
      "شخص فرحتك مرتبطة فيه ...",
      "اكتب اسم .. واكتب كيف تحس بيكون شكله ...",
      "متى اخر مره قلت ليتني سكت ؟",
      "ممكن تكره احد بدون سبب ؟",
      "اكثر وقت باليوم تحبه ...",
      "اكثر شيء حظك سيء فيه ...",
      "متى صحيت ؟",
      "كلمة صعب تقولها وثقيلة عليك ...",
      "ردك الدائم على الكلام الحلو ...",
      "سؤال دايم تتهرب من الاجابة عليه ...",
      "مين الشخص اللي مستعد تأخذ حزنه بس م تشوفه حزين ؟.",
      "جربت تروح اختبار بدون م تذاكر ؟",
      "كم مرة غشيت ف الاختبارات ؟ ",
      "وش اسم اول شخص تعرفت عليه فالديسكورد ؟",
      "تعطي فرصة ثانية للشخص الي كسرك ؟",
      "لو احتاج الشخص الي كسرك مساعدة بتوقف معه ؟",
      "@منشن... شخص ودك تطرده من السيرفر ...",
      "دعاء له اثر إبجابي في حياتك ...",
      "انسان م تحب تتعامل معه ابد",
      "اشياء اذا سويتها لشخص تدل على انك تحبه كثير ؟",
      "الانتقاد الكثير يغيرك للافضل ولا يحطمك ويخليك للأسوأ ",
      "كيف تعرف اذا هذا الشخص يكذب ولا لا ؟",
      "مع او ضد : العتاب على قدر المحبة ... ",
      "شيء عندك اهم من الناس",
      "تتفاعل مع الاشياء اللي تصير بالمجتمع ولا ماتهتم ؟.",
      "وش الشيء الحلو الي يميزك عن غيرك ؟",
      "كذبة كنت تصدقها وانت صغير ..",
      "@منشن .. شخص تخاف منه اذا عصب ...",
      "كلمة بـ لهجتك تحس م احد بيعرفها ...",
      "كمل ... انا من الاشخاص الي ...",
      "تراقب احد بالديسكورد ؟",
      "كيف تعرف ان هالشخص يحبك ؟",
      "هواية او تجربة كان ودك تستمر و تركتها ؟",
      "الديسكورد اشغلك عن حياتك الواقعية ؟",
      "اكمل ... تستمر علاقتك بالشخص اذا كان ...",
      "لو احد قالك اكرهك وش بتقول له ؟",
      "مع او ضد : عامل الناس كما يعاملوك ؟",
      "ارسل اخر صورة فـ الالبوم ...",
      "الصق وارسل اخر شيء نسخته ...",
      "ماهي اخر وجبة اكلتها ",
      "اكثر شيء تحس انه مات ف مجتمعنا",
      "برأيك ماهو افضل انتقام ...",
      "اكثر ريحة تجيب راسك ...",
      "شعور ودك يموت ...",
      " فضفضت لـ شخص وندمت ؟",
      "تقدر تتحمل عيوب شخص تحبه ؟",
      "يكبر الشخص ف عيونك لما ...",
      "وش تقول للشخص الي معك دائماً ف وقت ضيقتك ؟",
      "مقولة او حكمة تمشي عليها ...",
      "منشن ... شخص اذا وضعه على الجرح يلتهب زيادة",
      "منشن ... شخص يجعبك كلامه و اسلوبه ... ",
      "لو السرقة حلال ... وش اول شيء بتسرقه ؟",
      "مع او ضد : المرأة تحتاج لرجل يقودها ويرشدها ... ",
      "مع او ضد : لو دخل الشك ف اي علاقة ستنتهي ... ",
      "منشن... اي شخص واوصفه بـ كلام بسيط ...",
      "مع او ضد : قلة العلاقات راحة ...",
      "لو خيروك : تعض لسانك بالغلط ، ولا يسكر على صبعك الباب؟",
      "كلمة غريبه و معناها ...",
      "نصيحة تقدمها للشخص الثرثار ...",
      "مع او ضد :  مساعدة الزوجة في اعمال المنزل مهما كانت ...",
      "منشن... شخص يجيك فضول تشوف وجهه ...",
      "كلمة لـ شخص عزيز عليك ...",
      "اكثر كذبة تقولها ...",
      "معروف عند اهلك انك ...",
      "وش اول طريقة تتبعها اذا جيت تراضي شخص",
      "ع او ضد : ما تعرف قيمة الشخص اذا فقدته ...",
      "تحب تختار ملابسك بنفسك ولا تحب احد يختار معك ...",
      "وش اكثر شيء انجلدت بسببه وانت صغير ؟",
      "فـ اي برنامج كنت قبل تجي الديسكورد ؟",
      "تنسد نفسك عن الاكل لو زعلت ؟",
      "وش الشيء الي تطلع حرتك فيه و زعلت ؟ ",
      "مع او ضد : الصحبة تغني عن الحب ...",
      "منشن... اخر شخص خلاك تبتسم",
      "لو نطق قلبك ماذا سيقول ...",
      "ماذا يوجد على يسارك حالياً ؟",
      "مع او ضد : الشخص الي يثق بسرعة غبي ...",
      "شخصية كرتونية تأثرت فيها وانت صغير ...",
      "مع او ضد : الاهتمام الزائد يضايق",
      "لو خيروك : تتزوج ولا تكمل دراستك ... ",
      "منشن... لو بتختار شخص تفضفض له مين بيكون ؟ ",
      "كمل : مهما كبرت بخاف من ....",
      "اخر عيدية جاتك وش كانت ... ",
      "وش حذفت من قاموس حياتك ... ",
      "شيء تتمنى م ينتهي ...",
      "اكره شعور ممكن يحس فيه الانسان هو ...",
      "مع او ضد : يسقط جمال المراة بسبب قبح لسانها ...",
      "ماهي الخسارة في نظرك ... ",
      "لو المطعم يقدم الوجبه على حسب شكلك وش راح تكون وجبتك ؟ ",
      "مع او ضد : يموت الحب لو طال الغياب ",
      "وش الشيء الي يحبه اغلب الناس وانت م تحبه ..",
      "اقوى جملة عتاب وصلتك",
      "على ماذا ندمت ",
      "اخر مرة انضربت فيها من احد اهلك ، ولماذا ؟ ",
      "افضل طريقة تراضي فيها شخص قريب منك",
      "لو بإمكانك تقابل شخص من الديسكورد مين بيكون ؟",
      "كمل : كذاب من يقول ان ...",
      "طبعك صريح ولا تجامل ؟",
      "مين اقرب لك ؟ اهل امك ، اهل ابوك  ... ",
      "وش لون عيونك ؟",
      "مع او ضد : الرجال اكثر حقداً من النساء ",
      "مع او ضد : ينحب الشخص من اهتمامه",
      "@منشن: شخص تقوله اشتقت لك ",
      "بصراحة : تحب تفضفض وقت زعلك ، ولا تنعزل ؟",
      "مع او ضد : حبيبك يطلب منك حذف اصحابك بحكم الغيرة",
      "متى تحس بـ شعور حلو ؟",
      "لو حياتك عبارة عن كتاب .. وش بيكون اسمه ؟",
      "@منشن: شخص واسأله سؤال ...",
      "كم مره سويت نفسك غبي وانت فاهم ،  ومع مين ؟",
      "اكتب شطر من اغنية او قصيدة جا فـ بالك",
      "كم عدد الاطفال عندكم فالبيت ؟",
      "@منشن : شخص وعطه وظيفة تحس تناسبه",
      "اخر مكالمة فـ الخاص كانت مع مين ؟ ",
      "اكتب الكلمة بـ لهجتك  هربت ",
      "عمرك ضحيت باشياء لاجل شخص م يسوى ؟",
      "كمل : حلو يومك بـ وجود ... ",
      "مع او ضد : المرأة القوية هي اكثر انسانه انكسرت",
      "نصيحة تقدمها للغارقين فالحب ... ",
      "مبدأ تعتمد عليه فـ حياتك ",
      "ترد بالمثل على الشخص لو قذفك ؟",
      "شيء مهما حطيت فيه فلوس بتكون مبسوط",
      "@منشن: اكثر شخص يفهمك",
      "تاريخ ميلادك + هدية بخاطرك تجيك",
      "كم كان عمرك لما اخذت اول جوال ؟",
      "عمرك كتبت كلام كثير بعدين مسحته ، مع مين كان؟ ",
      "برأيك : وش اكثر شيء يرضي البنت الزعلانه ؟",
      "مساحة فارغة (..............) اكتب اي شيء تبين",
      "تترك احد عشان ماضيه سيء ؟",
      "تهتم بالابراج ، واذا تهتم وش برجك ؟",
      "لو قلت لك عرف بنفسك بـ ( شطر ) كيف بتعرف بنفسك ؟",
      "لو ستبدأ حياتك من جديد ، وش راح تغير بـ نفسك ؟",
      "تتوقع فيه احد حاقد عليك ويكرهك ؟",
      "وش يقولون لك لما تغني ؟",
      "مين المغني المفضل عندك ؟ ",
      "ميزة ودك يضيفها البرنامج",
      "وش الي مستحيل يكون لك اهتمام فيه ؟ ",
      "تخلي زوجتك تشتغل في مكان مختلط ",
      "البنت : تتزوجين احد اصغر منك ",
      "الرجل : تتزوج وحده اكبر منك",
      "احقر الناس هو من ...",
      "البنت : وش تتمنين تكون وظيفة زوجك ",
      "الرجل : وش تتمنى وظيفة زوجتك ",
      "برأيك : هل الانتقام من الشخص الذي اخطأ بحقك راحة ؟",
      "اهم شيء يكون معك فـ كل طلعاتك ؟",
      "مرة نصحت وقالك الشخص ، واذا قالك وش ردة فعلك؟ ",
      "وش الخدمة الالكترونية الي تتمنى تصير ؟ ",
      "كلمة تخليك تلبي الطلب حق الشخص بدون تفكير",
      "وش الفايدة الي اخذتها من الديسكورد ؟",
      "مع ام ضد : غيرة البنات حب تملك وانانية ",
      "هل سبق ان ندمت انك رفضت شيء ، وش كان ؟",
      "تشوف انك قادر على تحمل المسؤولية ؟ ",
      "مع او ضد : الناس يفضلون الصداقة وعندما يأتي الحب يتركون الصداقة",
      "اعلى نسبة جبتها ف حياتك الدراسية ",
      "تحب احد يتدخل ف امورك الشخصية  ؟ ",
      "لو واحد يتدخل ف امورك وانت م طلبت منه وش بتقوله ؟",
      "تاخذ بنصيحة  الاهل ام من الاصحاب ؟",
      "فيه شيء م تقدر تسيطر عليه ؟ ",
      "@منشن : شخص تحب سوالفه",
      "وش الكذبة المعتادة الي تسويها لو بتقفل من احد ؟",
      "@منشن: الشخص الي عادي تقوله اسرارك",
      "لو زعلت بقوة وش بيرضيك ؟",
      "كلمة تقولها لـ بعض الاشخاص في حياتك",
      "ندمت انك اعترف بمشاعرك لـ شخص",
      "وش الاكلة المفضلة عندك ؟",
      "وش تتخيل يصير معك فـ المستقبل ؟",
      "اسم الطف شخص مر عليك الكترونياً ",
      "مع او ضد : الاستقرار النفسي اهم استقرار ",
      "مع او ضد : كل شيء راح يتعوض",
      "برأيك : وش الشيء الي مستحيل يتعوض ؟ ",
      "تفضل : الدجاج ، اللحم ، السمك ",
      "مع او ضد : الرد المتأخر يهدم العلاقات",
      "مشروبك المفضل ...",
      "يبان عليك الحزن من  صوتك - ملامحك ",
      "اقوى كذبة كذبتها على اهلك",
      "@منشن : شخص واكتب شعور نفسك يجربه",
      "وش ردة فعلك من الشخص الي يرد عليك بعد ايام او ساعات ...",
      "مع او ضد : . خير لك ان تكون مغفلاً من ان تستغفل غيرك ",
      "كيف تعبر عن عصبيتك ؟",
      "عمرك بكيت على شخص مات في مسلسل ؟",
      "تتأثر بالمسلسلات او الافلام وتتضايق معهم ؟",
      "لو خيروك : بين شخص تحبه وشخص يحبك",
      "اقسى نهاية عندك ...",
      "مع او ضد : كل م زاد المال في الزواج زادت السعادة ",
      "لو سمح لك بسرقة شيء ويكون ملك لك .. ماذا ستسرق ؟",
      "تقدر تنام وخاطرك مكسور ؟",
      "بداية الحب تكون . اهتمام ، تضحية ، شعور ",
      "برأيك : اقرب لهجة عربية قريبة للفصحى ؟ ",
      "مر عليك شخص ف حياتك مستحيل انك تسامحه",
      "عندك صاحب له معك اكثر من 5 سنين ؟ ",
      "وش معنى اسمك ؟",
      "م تقدر تسيطر على , ضحكتك ، نومك ، جوعك ",
      "كم طولك ؟",
      "كم وزنك ؟",
      "وش طموحك بالحياة ؟",
      "لو بيدك توقف شيء يصير ، وش راح توقف ؟",
      "وش اسم قبيلتك ؟",
      "وش نوع جوالك ؟",
      "وش المطعم المفضل عندك ؟",
      "مين الشخص الي محلي حياتك ؟",
      "انا مدمن على ...",
      "مع او ضد : الصدق هو سر استمرار العلاقات فترة طويلة",
      "تكره الفئة الي  كل شوي كلام ، دايم يحش ",
      "تكون اجمل شخص اذا ...",
      "شكلك يعطي لأي جنسية ؟",
      "وش اكثر دولة تحب الشعب حقها ؟",
      "اول بيت تزوره فالعيد .. ",
      "جمال المراة يكمن في ...",
      "مشهور تعجبك سناباته ..",
      "يكفيك عطر واحد ولا تحب تحط اكثر من عطر ؟",
      "مرة جاك احد بيذكرك فيه وانت ناسي ؟",
      "لو احد بيذكرك فيه وانت ناسي بتسلك له ؟ ",
      "اغنيتك المفضلة ... ",
      "مع او ضد : لو م اخذت شيء معك وقت زيارة احد انت مقصر ",
      "يهمك ملابسك تكون ماركة ؟ ",
      "مع او ضد : او اهتزت مكانة الشخص مستيحل ترجع ",
      "لو رجع لك شخص تعرفه بعد علاقته بالخيانة ، راح ترجع نفس اول ؟ ",
      "صفة لا تتمنى ان تكون فـ عيالك ",
      "وش اسم قروبك انت واصحابك المقربين ؟",
      "وش اسم قروب عائلتك فالواتس اب ؟",
      "مع او ضد : تكون الزوجة عندما تشترط خادمة في العقد سيئة",
      "لعبة ندمت انك لعبتها ...",
      "مع او ضد : يمكن للبنت تغيير رأي الرجل بسهولة",
      "كلمة او عبارة مستحيل تنساها",
      "ارسل اكثر ايموجي تحبه",
      "شيء تتمنى يتحقق",
      "مع او ضد : الدنيا لم تتغير ، بل النفوس التي تغيرت",
      "وش جمع اسمك ؟",
      "كلمة لـ شخص زعلان منك ... ",
      "عادة غريبة تسويها ..",
      "تحب ريحة الحناء ؟",
      "نومك : ثقيل ولا خفيف",
      "اكثر شيء يرفع ضغطك",
      "اكتب تاريخ مستحيل تنساه",
      "لو حظك يباع ، بكم بيكون ؟ ",
      "@منشن : شخص تشوف انه يجذبك",
      "تحب السفر :  لحالك ، اصحابك ، اهلك ",
      "البنت : عادي تحضنين اخوك ؟",
      "الولد : عادي تحضن ابوك ؟ ",
      "كلمة تحب تسمعها حتى لو كنت زعلان",
      "افضل نوع عطر استخدمته ",
      "وش بتختار اسم لأول مولود لك ؟",
      "متى تصير نفسية ؟",
      "كيف ينطق الطفل اسمك ؟",
      "تشوف نفسك شخص عاطفي ولا علاقني ؟",
      "متى لازم تقول لا ؟",
      "تحب توجه الكلام عن طريق  الكتابة ، الصوت ",
      "مين اقرب لك :  خوالك ، عمامك ",
      "تحب تتعرف على ناس جديدة ولا اكتفيت بالي عندك ؟ ",
      "شيء كل م تذكرته تبتسم ... ",
      "كم قروب واتس داخل ؟ ",
      "كم سيرفر داخل فالديسكورد ؟ ",
      "مع او ضد : المسامحة بعد الخيانة ... ",
      "وش الامنية الي ودك تتحقق ؟",
      "كيف تتصرف مع الشخص الفضولي ؟",
      "البنت : متى يفقد الرجل رجولته ",
      "الرجل : متى تفقد البنت انوثتها",
      "ماهي اسباب نهاية العلاقات ؟ ",
      "@منشن : شخص ودك تعطيه ميوت سيرفر ",
      "مين الي تحب يكون مبتسم دائما ",
      "حصلت الشخص الي يفهمك ولا باقي ؟",
      "كم تحتاج وقت عشان تصحصح من نومك ؟",
      "كيف تعالج الغيرة الزائدة ؟",
      "مع او ضد : كل شيء حلو يكون فالبداية فقط ",
      "اطول مدة قضيتها بعيد عن اهلك",
      "شيء دايم يضيع منك",
      "اغنية ناشبه ف مخك",
      "رسالة للناس الي بيدخلون حياتك ",
      "جملة او كلمة تركهها ",
      "اكثر اغنية تكرهها ؟",
      "صوت مغني م تحبه",
      "مع او ضد : الغيرة بين الاصدقاء",
      "اكثر وقت تحب تنام فيه",
      "وش اثقل مشوار ممكن تسويه ؟",
      "اقرب شخص لك بالعائلة ",
      "اخر مكان سافرت له",
      "مع او ضد : حنا اكثر الناس عندنا حكم لكن م نطبقها",
      "مع و ضد : العتاب اكثر من مره دليل على ان الشخص م يقدرك ",
      "كم مشاهداتك بالنساب ؟ ",
      "مع او ضد : اكثر من في الديسكورد أُناس يتصنعون ",
      "شيء نفسك تعيشه من جديد ",
      "كلمة تحسسك بالامان",
      "كم تعطي نفسك من 10 فـ تعاملك مع مشاكلك",
      "مع او ضد : اكثر من يحلون مشاكل الناس ، هم اكثر الناس لديهم مشاكل",
      "مع او ضد : علاج الخطأ بالخطأ في زمننا هذا هو الحل",
      "وش اكثر شيء يضيع منك ؟ ",
      "مع او ضد : السفر يصلح ما افسده الدهر",
      "جربت شعور حب من طرف واحد ؟",
      "ما ترد الطلعة لو كانت الى ...",
      "كم لك في الديسكورد ؟ ",
      "شيء كل ما تتذكره تنبسط ",
      "اكتب كلام ودك الناس يطبقونه ( ......... )",
      "كيف تعالج الغيرة الزائدة ؟",
      "مع او ضد : من حق الشخص ما يبدا بالرسالة لانه مو متعود ",
      "عندك شخص يكلمك يومياً ، تستحي تقوله لا ترسل",
      "مع او ضد : من يهتم بك لا تخسره قد لا تعيد لك الحياة شخصاً مثله",
      "اصعب مرحلة دراسية مرت عليك",
      "هل انت مدمن تفكير ؟",
      "تشوف الي يفكر كثير نفسية ؟",
      "من النوع الي تخطط لامورك ولا تحب تغامر",
      "اكثر وقت تحب النوم فيه",
      "شيء ودك الناس تتركه",
      "اسم اول صديق لك",
      "مع او ضد : اهتمام الشخص بك يجعلك تحب وجوده",
      "@منشن : شخص واكتب صفة م تحبها فيه",
    ];
    if (tweets.length === 0) {
      message.channel.send("No tweets available.");
      return;
    }

    let tweet = tweets[Math.floor(Math.random() * tweets.length)];
    let embed = new MessageEmbed()
      .setAuthor({ name: message.author.username, iconURL: message.author.displayAvatarURL() })
      .setThumbnail(message.guild.iconURL())
      .setDescription(`**${tweet}**`)
      .setColor(`#2f3136`)
      .setFooter({ text: `Atlass. Punish`, iconURL: client.user.displayAvatarURL() });

    message.channel.send({ embeds: [embed] });
  }
});
///////////////////////////////////////
// عقاب
client.on("messageCreate", async (message) => {
  if (message.content.startsWith(prefix + "عقاب")) {
    let tweets = [
      "قول لاي بنت موجوده بالروم كلمة حلوه",
      "روح لاي سيرفر وخش روم وسوي نفسك تعرف الي بالروم",
      "لا تتكلم ولا كلمة الين يجي دورك مرة ثانية واذا تكلمت يجيك باند لمدة يوم كامل من السيرفر",
      "اكتب في الحاله -بتحبيني يا هدى ؟",
      "تاخذ عقابين",
      "صور اي شيء يطلبه منك اللاعبين",
      "منشن اونر السيرفر وازعجه",
      "غني اي اغنية وانت عاض لسانك",
      "قول كلمة طويلة من اختيار احد بالروم وبدل حرف الـ خ بحرف ث",
      "ارسل أكثر صورة مو حلوه عندك 📸",
      "مسامحك من العقاب ، أحبك",
      "روح لأحد ما تعرفه وقول له ما عندي فلوس",
      "تكلم باللهجه المصرية الى ان يجي دورك مره ثانيه",
      "تكلم باللغة الانجليزية الى ان يجي دورك مرة ثانية",
      "صيح بأعلى صوتك احبك ابو سعود",
      "اقرا اسماء الي موجودين بالروم وانت مسكر خشمك",
      "روح أي سيرفر غريب وسوي سبام وازعجهم هناك",
      "خلي الي قبلك يختار لك افاتار بكيفه",
      "ارمي جوالك على الأرض بقوة واذا انكسر صور و ارسل في الشات العام",
      "ارسل اكثر صورة ابدعت في تصويرها",
      "روح عند أحد ما تعرفه وقول له ابي بوسه",
      "روح المطبخ واكسر صحن او كوب وأرسل صورة في الشات",
      "غني باللهجه العراقيه",
      "قول بطتكم بطت بطن بطتـنا و بطتـنا تقـدر تبط بطن بطتكم، 3 مرات واذا غلطت الي ",
      "تكلم باللغة الهنديه الى ان يجي دورك مرة ثانية",
      "روح لشخص من السيرفر وقول له تحبني واعطيك فلوسي",
      "قول نكتة واذا ما ضحك أحد يعطونك ميوت لين يجي دورك مره ثانيه",
      "غير الاسم حقك وخليه انا هطف",
      "قول قصيدة بالهندي @*^%#(!",
      "قول لاي بنت موجوده بالروم كلمة حلوه",
      "قول كلمة طويلة من اختيار احد بالروم وبدل حرف الـ خ بحرف ث",
      "روح لأحد ما تعرفه وقول له ما عندي فلوس",
      "غير افاتارك لصورة كلب لين تنتهي اللعبه",
      "روح لاي سيرفر وخش روم وسوي نفسك تعرف الي بالروم",
      "اقرا اسماء الي موجودين بالروم وانت مسكر خشمك",
      "روح لأحد ما تعرفه وقول له ما عندي فلوس",
      "قول نكتة واذا ما ضحك أحد يعطونك ميوت لين يجي دورك مره ثانيه",
      "اكتب في البروفايل احبك يا وهاب",
      "اكتب في الحاله انا غبي والمدة يحددها الي بعدك",
      "روح الى اي قروب عندك في الواتس اب واكتب اي شيء يطلبه منك اللاعبين ، الحد الأقصى 3 رسائل",
      "روح المطبخ واكسر صحن او كوب وأرسل صورة في الشات",
      "ارمي جوالك على الأرض بقوة واذا انكسر صور و ارسل في الشات العام",
      "اعطي اي احد جنبك كف اذا مافيه احد جنبك اعطي نفسك ونبي نسمع صوت الكف",
      "صيح بأعلى صوتك احبك ابو سعود",
      "لا تتكلم ولا كلمة الين يجي دورك مرة ثانية واذا تكلمت يجيك باند لمدة يوم كامل من السيرفر",
      "غير الاسم حقك وخليه انا هطف",
      "تكلم باللهجه المصرية الى ان يجي دورك مره ثانيه",
      "اقرا اسماء الي موجودين بالروم وانت مسكر خشمك",
      "قول بطتكم بطت بطن بطتـنا و بطتـنا تقـدر تبط بطن بطتكم، 3 مرات واذا غلطت الي بعدك يعطيك عقاب من ذوقه",
      "غير افاتارك لصورة كلب لين تنتهي اللعبه",
      "اللي بعدك يختار لك عقاب من ذوقه",
      "اصدر اي صوت يطلبه منك اللاعبين",
      "قول نكتة واذا ما ضحك أحد يعطونك ميوت لين يجي دورك مره ثانيه",
      "ارمي جوالك على الأرض بقوة واذا انكسر صور و ارسل في الشات العام",
      "مسامحك من العقاب ، أحبك",
      "غني باللهجه العراقيه",
      "اكتب في البروفايل احبك يا ابراهيم",
      "اكتب في الحاله انا غبي والمدة يحددها الي بعدك",
      "خلي الي قبلك يختار لك افاتار بكيفه",
      "غني اي اغنية وانت عاض لسانك",
      "قول قصيدة بالهندي @*^%#(!",
      "غير افاتارك لصورة عضو من بطس لين تنتهي اللعبه",
      "روح لصحاب السيرفر قولو بحبك",
      "منشن أي إداري من سيرفر عشوائي وقولوا بندني",
      "حط أنا بطة في حالتك والمدة يحددها الفي الروم",
      "غني أغنية مصرية",
      "افتح مايك وقول uwu",
      "القبلك يختار حالة انت تحطها لمدة يوم",
      "صور نفسك وابعت في الشات",
      "غني أغنية يختارها القبلك",
      "عندك 5 دقائق تقفل الجهاز وتفتحه ثاني",
      "حط صورة بطة في البروفايل حقك",

    ];
    let tweet = tweets[Math.floor(Math.random() * tweets.length)];
    let embed = new MessageEmbed()
      .setAuthor({ name: message.author.username, iconURL: message.author.displayAvatarURL() })
      .setThumbnail(message.guild.iconURL())
      .setDescription(`**${tweet}**`)
      .setColor(`#2f3136`)
      .setFooter({ text: `Atlass. Punish`, iconURL: client.user.displayAvatarURL() })

    message.channel.send({ embeds: [embed] })
  }
})

///////////////////////////////////////
/////صراحه 
client.on("messageCreate", async (message) => {
  if (message.content.startsWith(prefix + "صراحه")) {
    let tweets = [
      'صراحه  |  صوتك حلوة؟',
      'صراحه  |  التقيت الناس مع وجوهين؟',
      'صراحه  |  شيء وكنت تحقق اللسان؟',
      'صراحه  |  أنا شخص ضعيف عندما؟',
      'صراحه  |  هل ترغب في إظهار حبك ومرفق لشخص أو رؤية هذا الضعف؟',
      'صراحه  |  يدل على أن الكذب مرات تكون ضرورية شي؟',
      'صراحه  |  أشعر بالوحدة على الرغم من أنني تحيط بك كثيرا؟',
      'صراحه  |  كيفية الكشف عن من يكمن عليك؟',
      'صراحه  |  إذا حاول شخص ما أن يكرهه أن يقترب منك ويهتم بك تعطيه فرصة؟',
      'صراحه  |  أشجع شيء حلو في حياتك؟',
      'صراحه  |  طريقة جيدة يقنع حتى لو كانت الفكرة خاطئة" توافق؟',
      'صراحه  |  كيف تتصرف مع من يسيئون فهمك ويأخذ على ذهنه ثم ينتظر أن يرفض؟',
      'صراحه  |  التغيير العادي عندما يكون الشخص الذي يحبه؟',
      'صراحه  |  المواقف الصعبة تضعف لك ولا ترفع؟',
      'صراحه  |  نظرة و يفسد الصداقة؟',
      'صراحه  |  ‏‏إذا أحد قالك كلام سيء بالغالب وش تكون ردة فعلك؟',
      'صراحه  |  شخص معك بالحلوه والمُره؟',
      'صراحه  |  ‏هل تحب إظهار حبك وتعلقك بالشخص أم ترى ذلك ضعف؟',
      'صراحه  |  تأخذ بكلام اللي ينصحك ولا تسوي اللي تبي؟',
      'صراحه  |  وش تتمنى الناس تعرف عليك؟',
      'صراحه  |  ابيع المجرة عشان؟',
      'صراحه  |  أحيانا احس ان الناس ، كمل؟',
      'صراحه  |  مع مين ودك تنام اليوم؟',
      'صراحه  |  صدفة العمر الحلوة هي اني؟',
      'صراحه  |  الكُره العظيم دايم يجي بعد حُب قوي " تتفق؟',
      'صراحه  |  صفة تحبها في نفسك؟',
      'صراحه  |  ‏الفقر فقر العقول ليس الجيوب " ، تتفق؟',
      'صراحه  |  تصلي صلواتك الخمس كلها؟',
      'صراحه  |  ‏تجامل أحد على راحتك؟',
      'صراحه  |  اشجع شيء سويتة بحياتك؟',
      'صراحه  |  وش ناوي تسوي اليوم؟',
      'صراحه  |  وش شعورك لما تشوف المطر؟',
      'صراحه  |  غيرتك هاديه ولا تسوي مشاكل؟',
      'صراحه  |  ما اكثر شي ندمن عليه؟',
      'صراحه  |  اي الدول تتمنى ان تزورها؟',
      'صراحه  |  متى اخر مره بكيت؟',
      'صراحه  |  تقيم حظك ؟ من عشره؟',
      'صراحه  |  هل تعتقد ان حظك سيئ؟',
      'صراحه  |  شـخــص تتمنــي الإنتقــام منـــه؟',
      'صراحه  |  كلمة تود سماعها كل يوم؟',
      'صراحه  |  **هل تُتقن عملك أم تشعر بالممل؟',
      'صراحه  |  هل قمت بانتحال أحد الشخصيات لتكذب على من حولك؟',
      'صراحه  |  متى آخر مرة قمت بعمل مُشكلة كبيرة وتسببت في خسائر؟',
      'صراحه  |  ما هو اسوأ خبر سمعته بحياتك؟',
      '‏صراحه | هل جرحت شخص تحبه من قبل ؟',
      'صراحه  |  ما هي العادة التي تُحب أن تبتعد عنها؟',
      '‏صراحه | هل تحب عائلتك ام تكرههم؟',
      '‏صراحه  |  من هو الشخص الذي يأتي في قلبك بعد الله – سبحانه وتعالى- ورسوله الكريم – صلى الله عليه وسلم؟',
      '‏صراحه  |  هل خجلت من نفسك من قبل؟',
      '‏صراحه  |  ما هو ا الحلم  الذي لم تستطيع ان تحققه؟',
      '‏صراحه  |  ما هو الشخص الذي تحلم به كل ليلة؟',
      '‏صراحه  |  هل تعرضت إلى موقف مُحرج جعلك تكره صاحبهُ؟',
      '‏صراحه  |  هل قمت بالبكاء أمام من تُحب؟',
      '‏صراحه  |  ماذا تختار حبيبك أم صديقك؟',
      '‏صراحه  | هل حياتك سعيدة أم حزينة؟',
      'صراحه  |  ما هي أجمل سنة عشتها بحياتك؟',
      '‏صراحه  |  ما هو عمرك الحقيقي؟',
      '‏صراحه  |  ما اكثر شي ندمن عليه؟',
      'صراحه  |  ما هي أمنياتك المُستقبلية؟‏',

    ];
    let tweet = tweets[Math.floor(Math.random() * tweets.length)];
    let embed = new MessageEmbed()
      .setAuthor({ name: message.author.username, iconURL: message.author.displayAvatarURL() })
      .setThumbnail(message.guild.iconURL())
      .setDescription(`**${tweet}**`)
      .setColor(`#2f3136`)
      .setFooter({ text: `Atlass. Truth`, iconURL: client.user.displayAvatarURL() })

    message.channel.send({ embeds: [embed] })
  }
})
///////////////////////////////////////
client.on("messageCreate", async (message) => {
  if (message.content.startsWith("تحدي")) {
    let tweets = [
          "هل تفضل العيش في منزل ضخم ولكن قديم أم في شقة صغيرة وحديثة؟",
          "هل تفضل أن تكون قادرًا على التحدث بكل لغات البشر أم فهم جميع لغات البرمجة؟",
          "هل تفضل أن تكون قادرًا على التحدث إلى الأشخاص الميتين أم القدرة على التحكم في الزمن؟",
          "هل تفضل أن تكون ملكًا أم بطلًا شعبيًا؟",
          "هل تفضل العيش في المستقبل البعيد أم الماضي البعيد؟",
          "هل تفضل أن تكون قادرًا على السباحة في المحيطات أم التحليق في السماء؟",
          "هل تفضل العيش في قصر صغير ولكن فاخر أم في منزل كبير ولكنه بسيط؟",
          "هل تفضل أن تكون وحيدًا في جزيرة مهجورة أم محاطًا بالناس في مدينة لا تحبها؟",
          "هل تفضل العيش في مكان لا يوجد فيه شتاء أم مكان لا يوجد فيه صيف؟",
          "هل تفضل أن تكون دائمًا مشغولًا أو دائمًا مملًا؟",
          "هل تفضل العمل في وظيفة تحبها براتب منخفض أم وظيفة تكرهها براتب عالٍ؟",
          "هل تفضل أن تكون دائمًا فقيرًا ولكن سعيدًا أم غنيًا ولكن تعيسًا؟",
          "هل تفضل العيش بدون تلفاز أم بدون هاتف؟",
          "هل تفضل أن تكون شخصًا نقيًا ولكن غير محبوب أم شخصًا محبوبًا ولكنه غير نقي؟",
          "هل تفضل العيش في مدينة كبيرة ولكن بدون أصدقاء أم في قرية صغيرة ولكن مع أصدقاء؟",
          "هل تفضل العيش في منزل بدون نوافذ أم منزل بدون أبواب؟",
          "هل تفضل أن تكون أفضل في الرياضيات أم أفضل في الفنون؟",
          "هل تفضل أن تكون دائمًا صادقًا أم دائمًا كاذبًا؟",
          "هل تفضل السفر إلى الفضاء أم استكشاف أعماق المحيط؟",
          "هل تفضل العيش في قارة مختلفة كل شهر أم العيش في مدينة واحدة فقط طوال حياتك؟",
          "هل تفضل امتلاك حيوان أليف غير عادي أم الحصول على وظيفة غير عادية؟",
          "هل تفضل العيش في عالم سحري أم عالم علمي متقدم؟",
          "هل تفضل أن تكون قادرًا على الطيران ولكن ببطء أم التحرك بسرعة ولكن بدون طيران؟",
          "هل تفضل العمل في وظيفة تحبها براتب منخفض أم وظيفة تكرهها براتب عالٍ؟",
          "هل تفضل أن تكون دائمًا سعيدًا ولكن فقيرًا أم دائمًا قلقًا ولكن غنيًا؟",
          "هل تفضل العيش في مكان بارد دائمًا أم حار دائمًا؟",
          "هل تفضل العمل من المنزل أم في مكتب؟",
          "هل تفضل امتلاك منزل ضخم أم سيارة فاخرة؟",
          "هل تفضل العيش في عالم بدون موسيقى أم عالم بدون أفلام؟",
          "هل تفضل أن تكون دائمًا سعيدًا ولكن فقيرًا أم دائمًا قلقًا ولكن غنيًا؟",
          "هل تفضل القدرة على التنبؤ بالمستقبل أم القدرة على العودة إلى الماضي؟",
          "هل تفضل أن تكون الأفضل في شيء واحد أم جيدًا في كل شيء؟",
          "هل تفضل العيش في مكان بارد دائمًا أم حار دائمًا؟",
          "هل تفضل القدرة على التحدث بكل لغات البشر أم فهم جميع لغات البرمجة؟",
          "هل تفضل أن تكون قادرًا على التحدث إلى الأشخاص الميتين أم القدرة على التحكم في الزمن؟",
          "هل تفضل أن تكون ملكًا أم بطلًا شعبيًا؟",
          "هل تفضل أن تعيش في المستقبل البعيد أم الماضي البعيد؟",
          "هل تفضل أن تكون قادرًا على السباحة في المحيطات أم التحليق في السماء؟",
          "هل تفضل العيش في قصر صغير ولكن فاخر أم في منزل كبير ولكنه بسيط؟",
          "هل تفضل أن تكون وحيدًا في جزيرة مهجورة أم محاطًا بالناس في مدينة لا تحبها؟",
          "هل تفضل العيش في مكان لا يوجد فيه شتاء أم مكان لا يوجد فيه صيف؟",
          "هل تفضل أن تكون دائمًا مشغولًا أو دائمًا مملًا؟",
          "هل تفضل العمل في وظيفة تحبها براتب منخفض أم وظيفة تكرهها براتب عالٍ؟",
          "هل تفضل أن تكون دائمًا فقيرًا ولكن سعيدًا أم غنيًا ولكن تعيسًا؟",
          "هل تفضل العيش بدون تلفاز أم بدون هاتف؟",
          "هل تفضل أن تكون شخصًا نقيًا ولكن غير محبوب أم شخصًا محبوبًا ولكنه غير نقي؟",
          "هل تفضل العيش في مدينة كبيرة ولكن بدون أصدقاء أم في قرية صغيرة ولكن مع أصدقاء؟",
          "هل تفضل العيش في منزل بدون نوافذ أم منزل بدون أبواب؟",
          "هل تفضل أن تكون أفضل في الرياضيات أم أفضل في الفنون؟",
          "هل تفضل أن تكون دائمًا صادقًا أم دائمًا كاذبًا؟",
          "هل تفضل السفر إلى الفضاء أم استكشاف أعماق المحيط؟",
          "هل تفضل العيش في قارة مختلفة كل شهر أم العيش في مدينة واحدة فقط طوال حياتك؟",
          "هل تفضل امتلاك حيوان أليف غير عادي أم الحصول على وظيفة غير عادية؟",
          "هل تفضل العيش في عالم سحري أم عالم علمي متقدم؟",
          "هل تفضل أن تكون قادرًا على الطيران ولكن ببطء أم التحرك بسرعة ولكن بدون طيران؟",
          "هل تفضل العمل في وظيفة تحبها براتب منخفض أم وظيفة تكرهها براتب عالٍ؟",
          "هل تفضل أن تكون دائمًا سعيدًا ولكن فقيرًا أم دائمًا قلقًا ولكن غنيًا؟",
          "هل تفضل العيش في مكان بارد دائمًا أم حار دائمًا؟",
          "هل تفضل العمل من المنزل أم في مكتب؟",
          "هل تفضل امتلاك منزل ضخم أم سيارة فاخرة؟",
          "هل تفضل العيش في عالم بدون موسيقى أم عالم بدون أفلام؟",
          "هل تفضل أن تكون دائمًا سعيدًا ولكن فقيرًا أم دائمًا قلقًا ولكن غنيًا؟",
          "هل تفضل القدرة على التنبؤ بالمستقبل أم القدرة على العودة إلى الماضي؟",
          "هل تفضل أن تكون الأفضل في شيء واحد أم جيدًا في كل شيء؟",
          "هل تفضل العيش في مكان بارد دائمًا أم حار دائمًا؟",
          "هل تفضل القدرة على التحدث بكل لغات البشر أم فهم جميع لغات البرمجة؟",
          "هل تفضل أن تكون قادرًا على التحدث إلى الأشخاص الميتين أم القدرة على التحكم في الزمن؟",
          "هل تفضل أن تكون ملكًا أم بطلًا شعبيًا؟",
          "هل تفضل أن تعيش في المستقبل البعيد أم الماضي البعيد؟",
          "هل تفضل أن تكون قادرًا على السباحة في المحيطات أم التحليق في السماء؟",
          "هل تفضل العيش في قصر صغير ولكن فاخر أم في منزل كبير ولكنه بسيط؟",
          "هل تفضل أن تكون وحيدًا في جزيرة مهجورة أم محاطًا بالناس في مدينة لا تحبها؟",
          "هل تفضل العيش في مكان لا يوجد فيه شتاء أم مكان لا يوجد فيه صيف؟",
          "هل تفضل أن تكون دائمًا مشغولًا أو دائمًا مملًا؟",
          "هل تفضل العمل في وظيفة تحبها براتب منخفض أم وظيفة تكرهها براتب عالٍ؟",
          "هل تفضل أن تكون دائمًا فقيرًا ولكن سعيدًا أم غنيًا ولكن تعيسًا؟",
          "هل تفضل العيش بدون تلفاز أم بدون هاتف؟",
          "هل تفضل أن تكون شخصًا نقيًا ولكن غير محبوب أم شخصًا محبوبًا ولكنه غير نقي؟",
          "هل تفضل العيش في مدينة كبيرة ولكن بدون أصدقاء أم في قرية صغيرة ولكن مع أصدقاء؟",
          "هل تفضل العيش في منزل بدون نوافذ أم منزل بدون أبواب؟",
          "هل تفضل أن تكون أفضل في الرياضيات أم أفضل في الفنون؟",
          "هل تفضل أن تكون دائمًا صادقًا أم دائمًا كاذبًا؟",
          "هل تفضل السفر إلى الفضاء أم استكشاف أعماق المحيط؟",
          "هل تفضل العيش في قارة مختلفة كل شهر أم العيش في مدينة واحدة فقط طوال حياتك؟",
          "هل تفضل امتلاك حيوان أليف غير عادي أم الحصول على وظيفة غير عادية؟",
          "هل تفضل العيش في عالم سحري أم عالم علمي متقدم؟",
          "هل تفضل أن تكون قادرًا على الطيران ولكن ببطء أم التحرك بسرعة ولكن بدون طيران؟",
          "هل تفضل العمل في وظيفة تحبها براتب منخفض أم وظيفة تكرهها براتب عالٍ؟",
          "هل تفضل أن تكون دائمًا سعيدًا ولكن فقيرًا أم دائمًا قلقًا ولكن غنيًا؟",
          "هل تفضل العيش في مكان بارد دائمًا أم حار دائمًا؟",
          "هل تفضل العمل من المنزل أم في مكتب؟",
          "هل تفضل امتلاك منزل ضخم أم سيارة فاخرة؟",
          "هل تفضل العيش في عالم بدون موسيقى أم عالم بدون أفلام؟",
          "هل تفضل أن تكون دائمًا سعيدًا ولكن فقيرًا أم دائمًا قلقًا ولكن غنيًا؟",
          "هل تفضل القدرة على التنبؤ بالمستقبل أم القدرة على العودة إلى الماضي؟",
          "هل تفضل أن تكون الأفضل في شيء واحد أم جيدًا في كل شيء؟",
          "هل تفضل العيش في مكان بارد دائمًا أم حار دائمًا؟",
          "هل تفضل القدرة على التحدث بكل لغات البشر أم فهم جميع لغات البرمجة؟",
          "هل تفضل أن تكون قادرًا على التحدث إلى الأشخاص الميتين أم القدرة على التحكم في الزمن؟",
          "هل تفضل أن تكون ملكًا أم بطلًا شعبيًا؟",
          "هل تفضل أن تعيش في المستقبل البعيد أم الماضي البعيد؟",
          "هل تفضل أن تكون قادرًا على السباحة في المحيطات أم التحليق في السماء؟",
          "هل تفضل العيش في قصر صغير ولكن فاخر أم في منزل كبير ولكنه بسيط؟",
          "هل تفضل أن تكون وحيدًا في جزيرة مهجورة أم محاطًا بالناس في مدينة لا تحبها؟",
          "هل تفضل العيش في مكان لا يوجد فيه شتاء أم مكان لا يوجد فيه صيف؟",
          "هل تفضل أن تكون دائمًا مشغولًا أو دائمًا مملًا؟",
          "هل تفضل العمل في وظيفة تحبها براتب منخفض أم وظيفة تكرهها براتب عالٍ؟",
          "هل تفضل أن تكون دائمًا فقيرًا ولكن سعيدًا أم غنيًا ولكن تعيسًا؟",
          "هل تفضل العيش بدون تلفاز أم بدون هاتف؟",
          "هل تفضل أن تكون شخصًا نقيًا ولكن غير محبوب أم شخصًا محبوبًا ولكنه غير نقي؟",
          "هل تفضل العيش في مدينة كبيرة ولكن بدون أصدقاء أم في قرية صغيرة ولكن مع أصدقاء؟",
          "هل تفضل العيش في منزل بدون نوافذ أم منزل بدون أبواب؟",
          "هل تفضل أن تكون أفضل في الرياضيات أم أفضل في الفنون؟",
          "هل تفضل أن تكون دائمًا صادقًا أم دائمًا كاذبًا؟",
          "هل تفضل السفر إلى الفضاء أم استكشاف أعماق المحيط؟",
          "هل تفضل العيش في قارة مختلفة كل شهر أم العيش في مدينة واحدة فقط طوال حياتك؟",
          "هل تفضل امتلاك حيوان أليف غير عادي أم الحصول على وظيفة غير عادية؟",
          "هل تفضل العيش في عالم سحري أم عالم علمي متقدم؟",
          "هل تفضل أن تكون قادرًا على الطيران ولكن ببطء أم التحرك بسرعة ولكن بدون طيران؟",
          "هل تفضل العمل في وظيفة تحبها براتب منخفض أم وظيفة تكرهها براتب عالٍ؟",
          "هل تفضل أن تكون دائمًا سعيدًا ولكن فقيرًا أم دائمًا قلقًا ولكن غنيًا؟",
          "هل تفضل العيش في مكان بارد دائمًا أم حار دائمًا؟",
          "هل تفضل العمل من المنزل أم في مكتب؟",
          "هل تفضل امتلاك منزل ضخم أم سيارة فاخرة؟",
          "هل تفضل العيش في عالم بدون موسيقى أم عالم بدون أفلام؟",
          "هل تفضل أن تكون دائمًا سعيدًا ولكن فقيرًا أم دائمًا قلقًا ولكن غنيًا؟",
          "هل تفضل القدرة على التنبؤ بالمستقبل أم القدرة على العودة إلى الماضي؟",
          "هل تفضل أن تكون الأفضل في شيء واحد أم جيدًا في كل شيء؟",
          "هل تفضل العيش في مكان بارد دائمًا أم حار دائمًا؟",
          "هل تفضل القدرة على التحدث بكل لغات البشر أم فهم جميع لغات البرمجة؟",
          "هل تفضل أن تكون قادرًا على التحدث إلى الأشخاص الميتين أم القدرة على التحكم في الزمن؟",
          "هل تفضل أن تكون ملكًا أم بطلًا شعبيًا؟",
          "هل تفضل أن تعيش في المستقبل البعيد أم الماضي البعيد؟",
          "هل تفضل أن تكون قادرًا على السباحة في المحيطات أم التحليق في السماء؟",
          "هل تفضل العيش في قصر صغير ولكن فاخر أم في منزل كبير ولكنه بسيط؟",
          "هل تفضل أن تكون وحيدًا في جزيرة مهجورة أم محاطًا بالناس في مدينة لا تحبها؟",
          "هل تفضل العيش في مكان لا يوجد فيه شتاء أم مكان لا يوجد فيه صيف؟",
          "هل تفضل أن تكون دائمًا مشغولًا أو دائمًا مملًا؟",
          "هل تفضل العمل في وظيفة تحبها براتب منخفض أم وظيفة تكرهها براتب عالٍ؟",
          "هل تفضل أن تكون دائمًا فقيرًا ولكن سعيدًا أم غنيًا ولكن تعيسًا؟",
          "هل تفضل العيش بدون تلفاز أم بدون هاتف؟",
          "هل تفضل أن تكون شخصًا نقيًا ولكن غير محبوب أم شخصًا محبوبًا ولكنه غير نقي؟",
          "هل تفضل العيش في مدينة كبيرة ولكن بدون أصدقاء أم في قرية صغيرة ولكن مع أصدقاء؟",
          "هل تفضل العيش في منزل بدون نوافذ أم منزل بدون أبواب؟",
          "هل تفضل أن تكون أفضل في الرياضيات أم أفضل في الفنون؟",
          "هل تفضل أن تكون دائمًا صادقًا أم دائمًا كاذبًا؟",
          "هل تفضل السفر إلى الفضاء أم استكشاف أعماق المحيط؟",
          "هل تفضل العيش في قارة مختلفة كل شهر أم العيش في مدينة واحدة فقط طوال حياتك؟",
          "هل تفضل امتلاك حيوان أليف غير عادي أم الحصول على وظيفة غير عادية؟",
          "هل تفضل العيش في عالم سحري أم عالم علمي متقدم؟",
          "هل تفضل أن تكون قادرًا على الطيران ولكن ببطء أم التحرك بسرعة ولكن بدون طيران؟",
          "هل تفضل العمل في وظيفة تحبها براتب منخفض أم وظيفة تكرهها براتب عالٍ؟",
          "هل تفضل أن تكون دائمًا سعيدًا ولكن فقيرًا أم دائمًا قلقًا ولكن غنيًا؟",
          "هل تفضل العيش في مكان بارد دائمًا أم حار دائمًا؟",
          "هل تفضل العمل من المنزل أم في مكتب؟",
          "هل تفضل امتلاك منزل ضخم أم سيارة فاخرة؟",
          "هل تفضل العيش في عالم بدون موسيقى أم عالم بدون أفلام؟",
          "هل تفضل أن تكون دائمًا سعيدًا ولكن فقيرًا أم دائمًا قلقًا ولكن غنيًا؟",
          "هل تفضل القدرة على التنبؤ بالمستقبل أم القدرة على العودة إلى الماضي؟",
          "هل تفضل أن تكون الأفضل في شيء واحد أم جيدًا في كل شيء؟",
          "هل تفضل العيش في مكان بارد دائمًا أم حار دائمًا؟",
          "هل تفضل القدرة على التحدث بكل لغات البشر أم فهم جميع لغات البرمجة؟",
          "هل تفضل أن تكون قادرًا على التحدث إلى الأشخاص الميتين أم القدرة على التحكم في الزمن؟",
          "هل تفضل أن تكون ملكًا أم بطلًا شعبيًا؟",
          "هل تفضل أن تعيش في المستقبل البعيد أم الماضي البعيد؟",
          "هل تفضل أن تكون قادرًا على السباحة في المحيطات أم التحليق في السماء؟",
          "هل تفضل العيش في قصر صغير ولكن فاخر أم في منزل كبير ولكنه بسيط؟",
          "هل تفضل أن تكون وحيدًا في جزيرة مهجورة أم محاطًا بالناس في مدينة لا تحبها؟",
          "هل تفضل العيش في مكان لا يوجد فيه شتاء أم مكان لا يوجد فيه صيف؟",
          "هل تفضل أن تكون دائمًا مشغولًا أو دائمًا مملًا؟",
          "هل تفضل العمل في وظيفة تحبها براتب منخفض أم وظيفة تكرهها براتب عالٍ؟",
          "هل تفضل أن تكون دائمًا فقيرًا ولكن سعيدًا أم غنيًا ولكن تعيسًا؟",
          "هل تفضل العيش بدون تلفاز أم بدون هاتف؟",
          "هل تفضل أن تكون شخصًا نقيًا ولكن غير محبوب أم شخصًا محبوبًا ولكنه غير نقي؟",
          "هل تفضل العيش في مدينة كبيرة ولكن بدون أصدقاء أم في قرية صغيرة ولكن مع أصدقاء؟",
          "هل تفضل العيش في منزل بدون نوافذ أم منزل بدون أبواب؟",
          "هل تفضل أن تكون أفضل في الرياضيات أم أفضل في الفنون؟",
          "هل تفضل أن تكون دائمًا صادقًا أم دائمًا كاذبًا؟",
          "هل تفضل السفر إلى الفضاء أم استكشاف أعماق المحيط؟",
          "هل تفضل العيش في قارة مختلفة كل شهر أم العيش في مدينة واحدة فقط طوال حياتك؟",
          "هل تفضل امتلاك حيوان أليف غير عادي أم الحصول على وظيفة غير عادية؟",
          "هل تفضل العيش في عالم سحري أم عالم علمي متقدم؟",
          "هل تفضل أن تكون قادرًا على الطيران ولكن ببطء أم التحرك بسرعة ولكن بدون طيران؟",
          "هل تفضل العمل في وظيفة تحبها براتب منخفض أم وظيفة تكرهها براتب عالٍ؟",
          "هل تفضل أن تكون دائمًا سعيدًا ولكن فقيرًا أم دائمًا قلقًا ولكن غنيًا؟",
          "هل تفضل العيش في مكان بارد دائمًا أم حار دائمًا؟",
          "هل تفضل العمل من المنزل أم في مكتب؟",
          "هل تفضل امتلاك منزل ضخم أم سيارة فاخرة؟",
          "هل تفضل العيش في عالم بدون موسيقى أم عالم بدون أفلام؟",
          "هل تفضل أن تكون دائمًا سعيدًا ولكن فقيرًا أم دائمًا قلقًا ولكن غنيًا؟",
          "هل تفضل القدرة على التنبؤ بالمستقبل أم القدرة على العودة إلى الماضي؟",
          "هل تفضل أن تكون الأفضل في شيء واحد أم جيدًا في كل شيء؟",
          "هل تفضل العيش في مكان بارد دائمًا أم حار دائمًا؟",
          "هل تفضل القدرة على التحدث بكل لغات البشر أم فهم جميع لغات البرمجة؟",
          "هل تفضل أن تكون قادرًا على التحدث إلى الأشخاص الميتين أم القدرة على التحكم في الزمن؟",
          "هل تفضل أن تكون ملكًا أم بطلًا شعبيًا؟",
          "هل تفضل أن تعيش في المستقبل البعيد أم الماضي البعيد؟",
          "هل تفضل أن تكون قادرًا على السباحة في المحيطات أم التحليق في السماء؟",
          "هل تفضل العيش في قصر صغير ولكن فاخر أم في منزل كبير ولكنه بسيط؟",
          "هل تفضل أن تكون وحيدًا في جزيرة مهجورة أم محاطًا بالناس في مدينة لا تحبها؟",
          "هل تفضل العيش في مكان لا يوجد فيه شتاء أم مكان لا يوجد فيه صيف؟",
          "هل تفضل أن تكون دائمًا مشغولًا أو دائمًا مملًا؟",
          "هل تفضل العمل في وظيفة تحبها براتب منخفض أم وظيفة تكرهها براتب عالٍ؟",
          "هل تفضل أن تكون دائمًا فقيرًا ولكن سعيدًا أم غنيًا ولكن تعيسًا؟",
          "هل تفضل العيش بدون تلفاز أم بدون هاتف؟",
          "هل تفضل أن تكون شخصًا نقيًا ولكن غير محبوب أم شخصًا محبوبًا ولكنه غير نقي؟",
          "هل تفضل العيش في مدينة كبيرة ولكن بدون أصدقاء أم في قرية صغيرة ولكن مع أصدقاء؟",
          "هل تفضل العيش في منزل بدون نوافذ أم منزل بدون أبواب؟",
          "هل تفضل أن تكون أفضل في الرياضيات أم أفضل في الفنون؟",
          "هل تفضل أن تكون دائمًا صادقًا أم دائمًا كاذبًا؟",
          "هل تفضل السفر إلى الفضاء أم استكشاف أعماق المحيط؟",
          "هل تفضل العيش في قارة مختلفة كل شهر أم العيش في مدينة واحدة فقط طوال حياتك؟",
          "هل تفضل امتلاك حيوان أليف غير عادي أم الحصول على وظيفة غير عادية؟",
          "هل تفضل العيش في عالم سحري أم عالم علمي متقدم؟",
          "هل تفضل أن تكون قادرًا على الطيران ولكن ببطء أم التحرك بسرعة ولكن بدون طيران؟",
          "هل تفضل العمل في وظيفة تحبها براتب منخفض أم وظيفة تكرهها براتب عالٍ؟",
          "هل تفضل أن تكون دائمًا سعيدًا ولكن فقيرًا أم دائمًا قلقًا ولكن غنيًا؟",
          "هل تفضل العيش في مكان بارد دائمًا أم حار دائمًا؟",
          "هل تفضل العمل من المنزل أم في مكتب؟",
          "هل تفضل امتلاك منزل ضخم أم سيارة فاخرة؟",
          "هل تفضل العيش في عالم بدون موسيقى أم عالم بدون أفلام؟",
          "هل تفضل أن تكون دائمًا سعيدًا ولكن فقيرًا أم دائمًا قلقًا ولكن غنيًا؟",
          "هل تفضل القدرة على التنبؤ بالمستقبل أم القدرة على العودة إلى الماضي؟",
          "هل تفضل أن تكون الأفضل في شيء واحد أم جيدًا في كل شيء؟",
          "هل تفضل العيش في مكان بارد دائمًا أم حار دائمًا؟",
          "هل تفضل القدرة على التحدث بكل لغات البشر أم فهم جميع لغات البرمجة؟",
          "هل تفضل أن تكون قادرًا على التحدث إلى الأشخاص الميتين أم القدرة على التحكم في الزمن؟",
          "هل تفضل أن تكون ملكًا أم بطلًا شعبيًا؟",
          "هل تفضل أن تعيش في المستقبل البعيد أم الماضي البعيد؟",
          "هل تفضل أن تكون قادرًا على السباحة في المحيطات أم التحليق في السماء؟",
          "هل تفضل العيش في قصر صغير ولكن فاخر أم في منزل كبير ولكنه بسيط؟",
          "هل تفضل أن تكون وحيدًا في جزيرة مهجورة أم محاطًا بالناس في مدينة لا تحبها؟",
          "هل تفضل العيش في مكان لا يوجد فيه شتاء أم مكان لا يوجد فيه صيف؟",
          "هل تفضل أن تكون دائمًا مشغولًا أو دائمًا مملًا؟",
          "هل تفضل العمل في وظيفة تحبها براتب منخفض أم وظيفة تكرهها براتب عالٍ؟",
          "هل تفضل أن تكون دائمًا فقيرًا ولكن سعيدًا أم غنيًا ولكن تعيسًا؟",
          "هل تفضل العيش بدون تلفاز أم بدون هاتف؟",
          "هل تفضل أن تكون شخصًا نقيًا ولكن غير محبوب أم شخصًا محبوبًا ولكنه غير نقي؟",
          "هل تفضل العيش في مدينة كبيرة ولكن بدون أصدقاء أم في قرية صغيرة ولكن مع أصدقاء؟",
          "هل تفضل العيش في منزل بدون نوافذ أم منزل بدون أبواب؟",
          "هل تفضل أن تكون أفضل في الرياضيات أم أفضل في الفنون؟",
          "هل تفضل أن تكون دائمًا صادقًا أم دائمًا كاذبًا؟",
          "هل تفضل السفر إلى الفضاء أم استكشاف أعماق المحيط؟",
          "هل تفضل العيش في قارة مختلفة كل شهر أم العيش في مدينة واحدة فقط طوال حياتك؟",
          "هل تفضل امتلاك حيوان أليف غير عادي أم الحصول على وظيفة غير عادية؟",
          "هل تفضل العيش في عالم سحري أم عالم علمي متقدم؟",
          "هل تفضل أن تكون قادرًا على الطيران ولكن ببطء أم التحرك بسرعة ولكن بدون طيران؟",
          "هل تفضل العمل في وظيفة تحبها براتب منخفض أم وظيفة تكرهها براتب عالٍ؟",
          "هل تفضل أن تكون دائمًا سعيدًا ولكن فقيرًا أم دائمًا قلقًا ولكن غنيًا؟",
          "هل تفضل العيش في مكان بارد دائمًا أم حار دائمًا؟",
          "هل تفضل العمل من المنزل أم في مكتب؟",
          "هل تفضل امتلاك منزل ضخم أم سيارة فاخرة؟",
          "هل تفضل العيش في عالم بدون موسيقى أم عالم بدون أفلام؟",
          "هل تفضل أن تكون دائمًا سعيدًا ولكن فقيرًا أم دائمًا قلقًا ولكن غنيًا؟",
          "هل تفضل القدرة على التنبؤ بالمستقبل أم القدرة على العودة إلى الماضي؟",
          "هل تفضل أن تكون الأفضل في شيء واحد أم جيدًا في كل شيء؟",
          "هل تفضل العيش في مكان بارد دائمًا أم حار دائمًا؟",
          "هل تفضل القدرة على التحدث بكل لغات البشر أم فهم جميع لغات البرمجة؟",
          "هل تفضل أن تكون قادرًا على التحدث إلى الأشخاص الميتين أم القدرة على التحكم في الزمن؟",
          "هل تفضل أن تكون ملكًا أم بطلًا شعبيًا؟",
          "هل تفضل أن تعيش في المستقبل البعيد أم الماضي البعيد؟",
          "هل تفضل أن تكون قادرًا على السباحة في المحيطات أم التحليق في السماء؟",
          "هل تفضل العيش في قصر صغير ولكن فاخر أم في منزل كبير ولكنه بسيط؟",
          "هل تفضل أن تكون وحيدًا في جزيرة مهجورة أم محاطًا بالناس في مدينة لا تحبها؟",
          "هل تفضل العيش في مكان لا يوجد فيه شتاء أم مكان لا يوجد فيه صيف؟",
          "هل تفضل أن تكون دائمًا مشغولًا أو دائمًا مملًا؟",
          "هل تفضل العمل في وظيفة تحبها براتب منخفض أم وظيفة تكرهها براتب عالٍ؟",
          "هل تفضل أن تكون دائمًا فقيرًا ولكن سعيدًا أم غنيًا ولكن تعيسًا؟",
          "هل تفضل العيش بدون تلفاز أم بدون هاتف؟",
          "هل تفضل أن تكون شخصًا نقيًا ولكن غير محبوب أم شخصًا محبوبًا ولكنه غير نقي؟",
          "هل تفضل العيش في مدينة كبيرة ولكن بدون أصدقاء أم في قرية صغيرة ولكن مع أصدقاء؟",
          "هل تفضل العيش في منزل بدون نوافذ أم منزل بدون أبواب؟",
          "هل تفضل أن تكون أفضل في الرياضيات أم أفضل في الفنون؟",
          "هل تفضل أن تكون دائمًا صادقًا أم دائمًا كاذبًا؟",
          "هل تفضل السفر إلى الفضاء أم استكشاف أعماق المحيط؟",
          "هل تفضل العيش في قارة مختلفة كل شهر أم العيش في مدينة واحدة فقط طوال حياتك؟",
          "هل تفضل امتلاك حيوان أليف غير عادي أم الحصول على وظيفة غير عادية؟",
          "هل تفضل العيش في عالم سحري أم عالم علمي متقدم؟",
          "هل تفضل أن تكون قادرًا على الطيران ولكن ببطء أم التحرك بسرعة ولكن بدون طيران؟",
          "هل تفضل العمل في وظيفة تحبها براتب منخفض أم وظيفة تكرهها براتب عالٍ؟",
          "هل تفضل أن تكون دائمًا سعيدًا ولكن فقيرًا أم دائمًا قلقًا ولكن غنيًا؟",
          "هل تفضل العيش في مكان بارد دائمًا أم حار دائمًا؟",
          "هل تفضل العمل من المنزل أم في مكتب؟",
          "هل تفضل امتلاك منزل ضخم أم سيارة فاخرة؟",
          "هل تفضل العيش في عالم بدون موسيقى أم عالم بدون أفلام؟",
          "هل تفضل أن تكون دائمًا سعيدًا ولكن فقيرًا أم دائمًا قلقًا ولكن غنيًا؟",
          "هل تفضل القدرة على التنبؤ بالمستقبل أم القدرة على العودة إلى الماضي؟",
          "هل تفضل أن تكون الأفضل في شيء واحد أم جيدًا في كل شيء؟",
          "هل تفضل العيش في مكان بارد دائمًا أم حار دائمًا؟",
          "هل تفضل القدرة على التحدث بكل لغات البشر أم فهم جميع لغات البرمجة؟",
          "هل تفضل أن تكون قادرًا على التحدث إلى الأشخاص الميتين أم القدرة على التحكم في الزمن؟",
          "هل تفضل أن تكون ملكًا أم بطلًا شعبيًا؟",
          "هل تفضل أن تعيش في المستقبل البعيد أم الماضي البعيد؟",
          "هل تفضل أن تكون قادرًا على السباحة في المحيطات أم التحليق في السماء؟",
          "هل تفضل العيش في قصر صغير ولكن فاخر أم في منزل كبير ولكنه بسيط؟",
          "هل تفضل أن تكون وحيدًا في جزيرة مهجورة أم محاطًا بالناس في مدينة لا تحبها؟",
          "هل تفضل العيش في مكان لا يوجد فيه شتاء أم مكان لا يوجد فيه صيف؟",
          "هل تفضل أن تكون دائمًا مشغولًا أو دائمًا مملًا؟",
          "هل تفضل العمل في وظيفة تحبها براتب منخفض أم وظيفة تكرهها براتب عالٍ؟",
          "هل تفضل أن تكون دائمًا فقيرًا ولكن سعيدًا أم غنيًا ولكن تعيسًا؟",
          "هل تفضل العيش بدون تلفاز أم بدون هاتف؟",
          "هل تفضل أن تكون شخصًا نقيًا ولكن غير محبوب أم شخصًا محبوبًا ولكنه غير نقي؟",
          "هل تفضل العيش في مدينة كبيرة ولكن بدون أصدقاء أم في قرية صغيرة ولكن مع أصدقاء؟",
          "هل تفضل العيش في منزل بدون نوافذ أم منزل بدون أبواب؟",
          "هل تفضل أن تكون أفضل في الرياضيات أم أفضل في الفنون؟",
          "هل تفضل أن تكون دائمًا صادقًا أم دائمًا كاذبًا؟",
          "هل تفضل السفر إلى الفضاء أم استكشاف أعماق المحيط؟",
          "هل تفضل العيش في قارة مختلفة كل شهر أم العيش في مدينة واحدة فقط طوال حياتك؟",
          "هل تفضل امتلاك حيوان أليف غير عادي أم الحصول على وظيفة غير عادية؟",
          "هل تفضل العيش في عالم سحري أم عالم علمي متقدم؟",
          "هل تفضل أن تكون قادرًا على الطيران ولكن ببطء أم التحرك بسرعة ولكن بدون طيران؟",
          "هل تفضل العمل في وظيفة تحبها براتب منخفض أم وظيفة تكرهها براتب عالٍ؟",
          "هل تفضل أن تكون دائمًا سعيدًا ولكن فقيرًا أم دائمًا قلقًا ولكن غنيًا؟",
          "هل تفضل العيش في مكان بارد دائمًا أم حار دائمًا؟",
          "هل تفضل العمل من المنزل أم في مكتب؟",
          "هل تفضل امتلاك منزل ضخم أم سيارة فاخرة؟",
          "هل تفضل العيش في عالم بدون موسيقى أم عالم بدون أفلام؟",
          "هل تفضل أن تكون دائمًا سعيدًا ولكن فقيرًا أم دائمًا قلقًا ولكن غنيًا؟",
          "هل تفضل القدرة على التنبؤ بالمستقبل أم القدرة على العودة إلى الماضي؟",
          "هل تفضل أن تكون الأفضل في شيء واحد أم جيدًا في كل شيء"
    ];
    let tweet = tweets[Math.floor(Math.random() * tweets.length)];
    let embed = new MessageEmbed()
      .setAuthor({ name: message.author.username, iconURL: message.author.displayAvatarURL() })
      .setThumbnail(message.guild.iconURL())
      .setDescription(`**${tweet}**`)
      .setColor(`#2f3136`)
      .setFooter({ text: `Atlass. Challange`, iconURL: client.user.displayAvatarURL() })

    message.channel.send({ embeds: [embed] })
  }
})
///////////////////////////////////////
client.on('messageCreate', async (message) => {
    if (message.author.bot) return; // تجاهل الرسائل من البوتات الأخرى

      if (message.content.startsWith('سؤال')) {
        const args = message.content.slice('سؤال'.length).trim().split(/ +/);
        // تحقق مما إذا كان هناك سؤال مرفق بالأمر
        if (args.length === 0) {
            return message.channel.send('من فضلك اطرح سؤالاً بعد الأمر.');
        }

        // دمج أجزاء السؤال في نص واحد
        const question = args.join(' ');

        // الردود الممكنة
        const responses = [
            'نعم',
            'لا',
            'ربما',
            'اسأل مرة أخرى لاحقًا',
            'من الممكن',
            'لا أستطيع الجزم',
            'ربما، لكن ليس مؤكداً',
            'من غير المحتمل'
        ];

        // اختيار رد عشوائي
        const response = responses[Math.floor(Math.random() * responses.length)];

        // إرسال الرد إلى القناة
        message.channel.send(`سؤالك: ${question}\nالإجابة: ${response}`);
    }
});
///////////////////////////////////////
//////حب
client.on("messageCreate", async (message) => {
  if (message.content.startsWith(prefix + "حب")) {
    // Get the mentioned user
    const user = message.mentions.users.first();

    // Check if a user was mentioned
    if (!user) {
      return message.channel.send("منشن حد");
    }

    // Define the love percentage tweets
    let XD = [
      "101% ███████████████████████████████████",
      "19%  ██████                             ",
      "67%  ████████████████████████           ",
      "60%  ████████████████████               ",
      "42%  ████████████                       ",
      "68%  ████████████████████████           ",
      "93%  ████████████████████████████████   ",
      "57%  ██████████████████                 ",
      "95%  ██████████████████████████████████ ",
      "10%  ███                                ",
      "23%  ███████                            ",
      "84%  ██████████████████████████████     ",
      "3%   ██                                 ",
      "78%  █████████████████████████████      ",
      "100% ███████████████████████████████████",
      "99%  ██████████████████████████████████ ",
      "100000% ████████████████████████████████",
      "-10%  █                                 ",
      "-50%  █                                 ",
      "-1000% █                                ",
    ];

    // Select a random tweet from the array
    let tweet = XD[Math.floor(Math.random() * XD.length)];

    // Create the embed message
    let embed = new MessageEmbed()
      .setAuthor({ name: message.author.username, iconURL: message.author.displayAvatarURL() })
      .setThumbnail(user.displayAvatarURL())
      .setDescription(`**${message.author.username} يحب ${user.username}**\n\n${tweet}`)
      .setColor(`#2f3136`)
      .setFooter({ text: `Atlass. Love`, iconURL: client.user.displayAvatarURL() });

    // Send the embed message
    message.channel.send({ embeds: [embed] });
  }
});

//////////// قائمة ايموجيات السيرفر 
client.on("messageCreate", async message => {
  if (message.content.startsWith(prefix + "emojis-list")) {
    const regular = message.guild.emojis.cache.filter((e) => !e.animated).size
    const animated = message.guild.emojis.cache.filter((e) => e.animated).size
    let i0 = 0;
    let i1 = 30;
    let page = 1;
    let description;
    description = message.guild.emojis.cache
      .map(r => r)
      .map((r, i) => `${r} | \`${r}\``)
      .slice(0, 30)
      .join("\n");
    let emb = new MessageEmbed()
      .setTitle(`${regular} Statics, ${animated} Animated (${regular + animated} total)`)
      .setColor("#2f3136")
      .setFooter(`Page ${page}/${Math.ceil(message.guild.emojis.cache.size / 30)}`)
      .setDescription(description);
    let pages = new MessageActionRow().addComponents(
      new MessageButton()
        .setStyle("PRIMARY")
        .setEmoji("⬅️")
        .setCustomId("previous_emoji"),
      new MessageButton()
        .setStyle("PRIMARY")
        .setEmoji("➡️")
        .setCustomId("next_emoji")
    );
    let dis = new MessageActionRow().addComponents(
      new MessageButton()
        .setStyle("PRIMARY")
        .setEmoji("⬅️")
        .setDisabled(true)
        .setCustomId("previous_emoji"),
      new MessageButton()
        .setStyle("PRIMARY")
        .setEmoji("➡️")
        .setDisabled(true)
        .setCustomId("next_emoji")
    );
    if (message.guild.emojis.cache.size < 30)
      return message.channel.send({
        embeds: [emb],
        components: [dis]
      });
    let msg = await message.channel.send({
      embeds: [emb],
      components: [pages]
    });
    let filter = i => i.user.id === message.author.id;
    let collector = msg.createMessageComponentCollector({
      filter
    });
    collector.on("collect", async i => {
      if (i.customId === "previous_emoji") {
        i0 = i0 - 30;
        i1 = i1 - 30;
        page = page - 1;
        if (i1 < 9) return msg.delete();
        description = message.guild.emojis.cache
          .map(r => r)
          .map((r, i) => `${r} | \`${r}\``)
          .slice(i0, i1)
          .join("\n");
        emb
          .setTitle(`${regular} Statics, ${animated} Animated (${regular + animated} total)`)
          .setFooter(`Page ${page}/${Math.ceil(message.guild.emojis.cache.size / 30)}`)
          .setDescription(description);
        msg.edit({
          embeds: [emb]
        });
      }
      if (i.customId === "next_emoji") {
        i0 = i0 + 30;
        i1 = i1 + 30;
        page = page + 1;
        if (i1 > message.guild.emojis.cache.size + 30) return msg.delete();
        if (!i0 || !i1) return msg.delete();
        description = message.guild.emojis.cache
          .map(r => r)
          .map((r, i) => `${r} | \`${r}\``)
          .slice(i0, i1)
          .join("\n");
        emb
          .setTitle(`${regular} Statics, ${animated} Animated (${regular + animated} total)`)
          .setFooter(`Page ${page}/${Math.ceil(message.guild.emojis.cache.size / 30)}`)
          .setDescription(description);
        msg.edit({
          embeds: [emb]
        });
      }
    });
  }
})
////////////////////////////////////////
client.on("messageCreate", async message => {
  if (message.content.startsWith(prefix + 'فتح')) {

    const permission = message.member.permissions.has("MANAGE_CHANNELS");
    const guilds = message.guild.me.permissions.has("MANAGE_CHANNELS");
    const args = message.content.split(' ')
    const channel = message.mentions.channels.first() || client.channels.cache.get(args[1]) || message.channel;
    if (!permission)
      return message.reply(
        { content: ":x: **You don't have permission to use this command**" }
      ).catch((err) => {
        console.log(`i couldn't reply to the message: ` + err.message)
      })

    if (!guilds) return message.reply({ content: `:rolling_eyes: **I couldn't change the channel permissions. Please check my permissions.**` }).catch((err) => {
      console.log(`i couldn't reply to the message: ` + err.message)
    })
    let everyone = message.guild.roles.cache.find(hyper => hyper.name === '@everyone');
    channel.permissionOverwrites.edit(everyone, {
      SEND_MESSAGES: null,
      SEND_MESSAGES_IN_THREADS: null,
      CREATE_PUBLIC_THREADS: null,
      CREATE_PRIVATE_THREADS: null

    }).then(() => {
      message.reply({ content: `:unlock: **${channel} has been unlocked.**` }).catch((err) => {
        console.log(`i couldn't reply to the message: ` + err.message)
      })
    })
  }
})

//////
client.on("messageCreate", async message => {
  if (message.content.startsWith(prefix + 'قفل')) {

    const permission = message.member.permissions.has("MANAGE_CHANNELS");
    const guilds = message.guild.me.permissions.has("MANAGE_CHANNELS");
    const args = message.content.split(' ')
    const channel = message.mentions.channels.first() || client.channels.cache.get(args[1]) || message.channel;
    if (!permission)
      return message.reply(
        { content: ":x: **You don't have permission to use this command**" }
      ).catch((err) => {
        console.log(`i couldn't reply to the message: ` + err.message)
      })
    if (!guilds) return message.reply({ content: `:rolling_eyes: **I couldn't edit the channel permissions. Please check my permissions and role position.**`, ephemeral: true }).catch((err) => {
      console.log(`i couldn't reply to the message: ` + err.message)
    })
    let everyone = message.guild.roles.cache.find(hyper => hyper.name === '@everyone');
    channel.permissionOverwrites.edit(everyone, {
      SEND_MESSAGES: false,
      SEND_MESSAGES_IN_THREADS: false,
      CREATE_PUBLIC_THREADS: false,
      CREATE_PRIVATE_THREADS: false

    }).then(() => {
      message.reply({ content: `:lock: **${channel} has been looked.** ` }).catch((err) => {
        console.log(`i couldn't reply to the message: ` + err.message)

      })
    })
  }
})
/////////////////////////////////////////////
client.on("messageCreate", async (NotOurs) => {
  if (NotOurs.author.bot) return;
  let devs = ["755782461366992977"]; ///TWEEDLEX!

  if (NotOurs.content.toLowerCase() === prefix + "servers") {
    if (!devs.includes(NotOurs.author.id)) {
      let embed = new Discord.MessageEmbed()
        .setColor("2f3136")
        .setTitle("**ليس لديك صلاحيات**");
      NotOurs.channel.send({ embeds: [embed] }).then(z => z.delete({ timeout: 3000 })); ///TWEEEDLEX!
      return;
    }

    client.guilds.cache.forEach(g => {
      g.channels.cache.find(channel => channel.isText() && channel.permissionsFor(g.me).has('SEND_MESSAGES'))
        .createInvite({
          maxUses: 100,
          maxAge: 86400
        })
        .then(invite => {
          NotOurs.channel.send(`https://discord.gg/${invite.code}\n[ ${g.ownerId} ]`);
        })
        .catch(console.error);
    });
  }
});
/////////////////////
// هيلب
const { MessageSelectMenu } = require("discord.js");
client.on("messageCreate", async message => {
  if (message.content.startsWith(prefix + 'help')) {
    let menu = new MessageSelectMenu()
      .setCustomId(`help_${message.author.id}`)
      .setPlaceholder("اضغط للاختيار")
      .addOptions([{
        label: 'اومر الاونر شيب',
        value: '1',
      },
      {
        label: 'اوامر الادمنستريتر',
        value: '2',
      },
      {
        label: 'اوامر الادمن العامة',
        value: '3',
      },

      {
        label: 'ااوامر الالعاب',
        value: '4',
      },
      {
        label: 'الاوامر العامه',
        value: '5',
      },
      ])

    let row = new MessageActionRow()
      .addComponents([menu]);



    let embed = new MessageEmbed()
      .setTitle('قائمة بجميع اوامر البوت')
      .setColor(message.member.displayHexColor)
      .setFooter({ text: message.guild.name, iconURL: message.guild.iconURL({ dynamic: true }) })
      .setDescription("اختار القائمة المناسبة")
    message.member.send({ embeds: [embed], components: [row] }).then(msg => {
      message.react('✅')

      let filter = b => b.user.id === message.author.id && b.customId === `help_${message.author.id}`;
      let collector = msg.createMessageComponentCollector({ filter: filter, componentType: 'SELECT_MENU', time: 120000 });
      collector.on("collect", (b) => {
        if (b.values[0] === "1") {
          let embed_1 = new MessageEmbed()
            .setTitle('اوامر الاونر')
            .setColor(message.guild.me.displayHexColor)
            .setDescription(`**> \`${prefix}help\` | معلومات الامر
> \`${prefix}addemojis\` | معلومات الامر
> \`${prefix}set-welcome\` | معلومات الامر
> \`${prefix}set-avatar\` | معلومات الامر
> \`${prefix}set-name\` | معلومات الامر
> \`${prefix}emojis-list\` | معلومات الامر
> \`${prefix}say\` | معلومات الامر
> \`${prefix}setUp Voice Online\` | معلومات الامر
> \`${prefix}join\` | معلومات الامر
> \`${prefix}allbots\` | معلومات الامر
> \`${prefix}slowmode\` | معلومات الامر
> \`${prefix}servers\` | معلومات الامر
> \`${prefix}all-unban\` | معلومات الامر
> \`${prefix}setstatus\` | معلومات الامر
> \`${prefix}settings\` | معلومات الامر
**`)
          b.update({ embeds: [embed_1], components: [row] }).catch(err => { });
        } else if (b.values[0] === "2") {
          let embed_1 = new MessageEmbed()
            .setTitle('اوامر الادمنستريتر')
            .setColor(message.guild.me.displayHexColor)
            .setDescription(`**> \`${prefix}set-kick-room\` | معلومات الامر
> \`${prefix}set-ban-room\` | معلومات الامر
> \`${prefix}set-members-room\` | معلومات الامر
> \`${prefix}set-messages-room\` | معلومات الامر
> \`${prefix}set-bots-room\` | معلومات الامر 
> \`${prefix}set-voice-room\` | معلومات الامر
> \`${prefix}set-roles-room\` | معلومات الامر
> \`${prefix}set-invites-room\` | معلومات الامر

> \`${prefix}current-invites-room\` | معلومات الامر
> \`${prefix}current-channels-room\` | معلومات الامر
> \`${prefix}current-kick-room\` | معلومات الامر
> \`${prefix}current-ban-room\` | معلومات الامر
> \`${prefix}current-members-room\` | معلومات الامر
> \`${prefix}current-messages-room\` | معلومات الامر
> \`${prefix}current-bots-room\` | معلومات الامر
> \`${prefix}current-voice-room\` | معلومات الامر
> \`${prefix}current-roles-room\` | معلومات الامر

> \`${prefix}list\` | لرؤيه الرومات الموجوده حاليا في اللوج **`)
          b.update({ embeds: [embed_1], components: [row] }).catch(err => { });
        } else if (b.values[0] === "3") {
          let embed_1 = new MessageEmbed()
            .setTitle('اوامر الادمن العامة')
            .setColor(message.guild.me.displayHexColor)
            .setDescription(`**> 
> معلومات الامر | \`${prefix}سجن\`
> معلومات الامر | \`${prefix}عفو\`
> معلومات الامر | \`${prefix}ميوت\`
> معلومات الامر | \`${prefix}حظر\`
> معلومات الامر | \`${prefix}طرد\`
> معلومات الامر | \`${prefix}صور\`
> معلومات الامر | \`${prefix}كام\`
> معلومات الامر | \`${prefix}تفعيل \`
> معلومات الامر | \`${prefix}ميوت \`
> معلومات الامر | \`${prefix}تايم\` 
**`)
          b.update({ embeds: [embed_1], components: [row] }).catch(err => { });
        } else if (b.values[0] === "5") {
          let embed_1 = new MessageEmbed()
            .setTitle('الاوامر العامه')
            .setColor(message.guild.me.displayHexColor)
            .setDescription(`**> \`${prefix}help\` | معلومات الامر
> \`${prefix}user\` | معلومات الامر
> \`${prefix}sever-baner\` | معلومات الامر
> \`${prefix}banner\` | معلومات الامر
> \`${prefix}server\` | معلومات الامر
> \`${prefix}Avatar\` | معلومات الامر
> \`${prefix}invitess\` | معلومات الامر
> \`${prefix}serveravatar\` | معلومات الامر
**`)
          b.update({ embeds: [embed_1], components: [row] }).catch(err => { });
        } else if (b.values[0] === "4") {
          let embed_1 = new MessageEmbed()
            .setTitle('اوامر الالعاب')
            .setColor(message.guild.me.displayHexColor)
            .setDescription(`**
> معلومات الامر | \`${prefix}كت\`
> معلومات الامر | \`${prefix}عقاب\`
> معلومات الامر | \`${prefix}حب\`
> معلومات الامر | \`${prefix}صراحه\`
> معلومات الامر | \`${prefix}اقتباس\`
 **`)
          b.update({ embeds: [embed_1], components: [row] }).catch(err => { })
        }
      })
    }).catch((err) => {
      message.reply({ content: `**افتح خاصك**` })
      message.react('❌')
    })

  }
})

/////////////////////////////////
let Image = './back.png';

client.on('messageCreate', async (message) => {
  if (message.author.bot) return;
  if (!message.content.startsWith(prefix)) return;

  const args = message.content.slice(prefix.length).trim().split(/ +/);
  const command = args.shift().toLowerCase();

  if (command === 'send') {
    if (!message.member.permissions.has('ADMINISTRATOR')) {
      return message.reply({ content: 'You do not have permission to use this command.', ephemeral: true });
    }

    const menu = new MessageSelectMenu()
      .setCustomId("Testing")
      .setPlaceholder("أضغط هنا لعرض التفاصيل")
      .addOptions([
        { label: "Rules ・ القوانين", value: "1", description: "@Rules" },
        { label: "Oders ・ اوامر الاداره", value: "2", description: "@Orders" },
        { label: "Staff Team ・ الاداره", value: "3", description: "@Staff" },
        { label: "Partner ・ شراكة", value: "4", description: "@Partners" },
        { label: "Special Roles ・  رتب مميزة", value: "5", description: "@Roles" },
        { label: "Banking Commands ・ اوامر البنك", value: "6", description: "@Banking" },
        { label: "Ads System ・ نضام الاعلانات", value: "7", description: "@Ads" },
        { label: "Level Roles ・ رتب المستويات", value: "8", description: "@Levels" },
        { label: "Special Roles ・ رتب المميزه", value: "9", description: "@Special" }
      ]);

    const row = new MessageActionRow().addComponents(menu);

    message.channel.send({ files: [Image], components: [row] });
  }
});

client.on('interactionCreate', async (interaction) => {
  if (!interaction.isSelectMenu()) return;

  if (interaction.customId === 'Testing') {
    let replyContent = '';
    switch (interaction.values[0]) {
      case '1':
        replyContent = '**• أحترام جميع الاعضاء .. وعدم التلفض أو رد الأساءه لهم .. في حال أن أحد أساء منهم**\n⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯\n**• أنتم واجهة السيرفر .. تذكرو هذا الكلام .. حنا بعيد عن الرسميات أخوان وأصحاب .. كلنا نساعد بعض في أننا نحبب بعض في بعض .. ولا نتعنصر ضد أي شخص في السيرفر سواء عضو أو إداري بمختلف الرتب .**\n**• الكلام الي يدور بيننا بيننا .. ماله داعي تبررون للناس .. فقط ردكم .. هذي قوانين السيرفر .**\n** بالنسبه  للاسكات والميوت **\n⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯\n→・   يجب إحترام جميع\n→・الأعضاء وعدم مضايقتهم بأي شكل من الأشكال\n→・ يمنع التكلم بلغة غير الانجليزية او العربية\n→・  يمنع انتحال شخصيات الإدارة أو المشاهير\n→・ يمن التحدث عن مواضع تثير الجدل مثل السياسة ، الأديان ، العنصرية\n→・يمنع البيع و الشراء بالسيرفر او الخاص ب اي شكل\n→・ يمنع النشر بتاتًا في السيرفر او في الخاص\n→・  يمنع منعا باتا إهانة أحد الأعضاء أو الإدارة بأي شكل من الأشكال او تصغيره\n→・ يمنع التحرش او محاوله التقرب من البنات\n→・  يمنع التكلم عن الشذوذ او الشواذ بشكل عام\n→・ يمنع منعا باتا التسبب بفوضى أو الأزعاج مثل السبام , الازعاج بالايموجي\n→・  يمنع الحرق بجميع أنواعه الحرق يكون من المانقا او حلقة جديدة لأنمي معين\n→・ يمنع ذكر تصنيفات مخلة للأنمي\n→・  يمنع إزعاج الأعضاء أو التنمر عليهم\n→・ يجب إحترام خصوصية الأعضاء وعدم مضايقتهم أو إحراجهم\n→・  السيرفر غير مسؤول عن المشاكل الشخصية ، يرجى تصفيتها خارج السيرفر\n→・ ممنوع دخول السيرفر بصورة أو إسم غير لائق\n→・  يمنع مشاركة أي محتوى غير مناسب لـ الفئة العمرية ( +18 )\n→・ ممنوع طلب المال، والكردت، و النيترو ، بطاقات ستور إلخ\n→・  يمنع الترويج و النشر ، بأي شكل من الأشكال حتى لو كانت في الخاص\n⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯\n**Its a must to read the discord rules! | يجب عليك قرائة قوانين الدسكورد جيدا!**'; // Your content for rules
        break;
      case '2':
        replyContent = `**Commands :**\n\n• سجن (Jail) و عفو (Pardon) :\n  - سجن : لسجن عضو بسبب مشكله الخ , تحجب عنه جميع الرومات بالسيرفر\n  - عفو : عفو شخص من السجن\n\n• mute و unmute :\n  - mute : لاعطاء حظر من الكتابه 24h\n  - unmute : عفو شخص من الميوت\n\n• Out :\n  - يعطي تايم اوت لشخص\n\n• ban :\n  - يحظر عضو من السيرفر\n\n• kick :\n  - يطرد عضو من السيرفر\n\n• nick :\n  - يغير اسم العضو\n\n**لتقديم شكوى ضد الاداره افتح تكت او منشن الاونر في شات الاداره**,`; // Your content for commands
        break;
      case '3':
        replyContent = '• **Atlass :**\n\nشنو اسمك •\n\nكم عمرك •\n\nمن وين •\n\nاش خبراتك •\n\nليش تريد تصير ادارة• \n\nوكم مدة تفاعلك •\n\nتقدر تحط رابط سيرفر في وصف حقك •\n\n**لإقامة تقديم ارسل التقديم و تواصل مع  : \<@755782461366992977>**'; // Your content for staff team
        break;
      case '4':
        replyContent = `**إن كنتَ مهتمًا بإقامة علاقة وشراكة رسمية مع الخادم يرجى منك معرفة التالي : **\n\n-الخادم يجب أن يحوي على 500 عضو على الأقل  \n- الخادم يجب أن يكون نظيفًا وآمنًا وذو سمعة طيبة  \n- على الطاقم الإداري الخاص بخادمك إحترام طاقمنا الإداري كي لا نضطر إلى إلغاء الشراكة  \n\n**لإقامة الشراكة يرجى التواصل مع : <@755782461366992977> **`;
        ; // Your content for partnership
        break;
      case '5':
        replyContent = `• **Roles :**\n\n→・Youtuber\n • يكون عندك قناة فوق الف مشترك\n\n→・Developer\nتكون مبرمج مواقع او بوتات \n\n→・Artist\nتكون رسام او فنان او ديزاينر\n\n→・Senior\nتكون صديق ل <@755782461366992977>\n\n →・Princess\n رتبة البنات للحصول عليها افتحِ تكت و تكلمي مع طاقم الاداره\n\n→・Sρєcɪαℓ ̶M̶ємвєя \nالاداره القديمه و بعض الاشخاص المميزين فسيرڢير\n\n→・Allies\nتكون بارتنر و القانين البارتنر موجوده فوق في القائمه\n\n⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯\n**Its a must to read the discord rules! | يجب عليك قرائة قوانين الدسكورد جيدا!**`; // Your content for special roles
        break;
      case '6':
        replyContent = `اٍُلسّلاٍْمّے عًلٍّيكْمٍےُورّحٍمْـٍُﮧاللّـه وًبٍرّكًاٍتُـٍّه <:butterfly1:1107356073389735947>  
                      لمعرفة اوامر بوت البنك فقط اقرا الاتي : .....

                      \`لمعرفة كم لديك من المال اكتب :\`
                      !money 
                      !bal

                      \`لوضع مالك بالبنك / bank اكتب :\`
                      !dep all

                      \`لوضع جميع مالك كاش / cash اكتب :\`
                      !with all

                      \`لوضع مبلغ معين كاش / cash اكتب :\`
                      !with [ القيمة التي تريدها ]

                      \`لمعرفة توب / top اكتب :\`
                      !top

                      \`لمعرفة توب الكاش / cash اكتب :\`
                      !top-cash

                      \`لشراء السلـ3ـة اكتب :\`
                      /buy-item [ اكتب اسم السلـ3ـة ]

                      \`للحصول على المال اكتب :\`
                      !work / راتب
                      !crime / سرقة

                      \`لعبة بلاك جاك فقط اكتب :\`
                      !blackjack / قمار 

                      للاسفتسار او طرح الاسئلة افتح تذكرة عن طريق  <#1253754264870846655> <:Mint2:1253740673262157864> ` ; // Your content for banking commands
        break;
      case '7':
        replyContent = `**السلام عليكم ورحمة الله وبركاتة  .** <:butterfly1:1107356073389735947>\n⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯\n**ملاحظات**:\n- جميع الهديا ستكون على حسابك.\n- التعامل فقط عبر (كريدت البروبوت)، وضرائب التحويل ستكون على عاتقك.\n- لشراء إعلان: افتح تذكرة في <#1253754264870846655>\n- التحويل فقط لـ <@755782461366992977>\n⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯\n__**Mention Here・منشن هنا**__\n**المدة** : ثلاث أيام - **Duration : 4 Days**\n**$100.000 Credit Probot**\n⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯\n____ **Mention Here with a Gift・منشن هنا مع هدية**\n**المدة** : ثلاث أيام - **Duration : 4 Days**\n**$150.000 Credit Probot**\n⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯\n____ **Mention Everyone・منشن الجميع**\n**المدة** : خمسة أيام - **Duration : 6 Days**\n**$250.000 Credit Probot**\n⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯\n____ **Mention Everyone with a Gift・منشن الجميع مع هدية**\n**المدة** : خمسة أيام - **Duration : 6 Days**\n**$500.000 Credit Probot**\n⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯\n**Its a must to read the discord rules! | يجب عليك قراءة قوانين الدسكورد جيدًا!** <:Mint2:1253740673262157864>`; // Your content for ads system
        break;
      case '8':
        replyContent = "→・**Level Roles : <:butterfly1:1107356073389735947>**\n⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯\n\n**• Magician . ❱ Level 60** \n\n**• Monza . ❱ Level 50**\n\n**• Spyder . ❱ Level 40** \n\n**• Giuletta . ❱ Level 35** \n\n**• Créatif . ❱ Level 30** \n\n**• Castle . ❱ Level 25**\n\n**• Bishop . ❱ Level 20** \n\n**• Gambit . ❱ Level 18**\n\n**• Cullinan . ❱ Level 14**\n\n**• Wraith . ❱ Level 10** \n\n**• Phantom . ❱ Level 8** \n\n**• Roma . ❱ Level 2**\n\n⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯\n・للاستفسار توجه الى ⁠<#1270081838865449032>\n⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯";
        break;
      case '9':
        replyContent = `→・**Special Roles :** <:butterfly1:1107356073389735947>\n⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯\n\n• **Booster** ❱ Server Booster\n\n• **Sρєcɪαℓ ̶M̶ємвєя** ❱ $1,000,000\n\n• **Levante .** ❱ $500,000\n\n• **Grecale .** ❱ $400,000 \n\n• **Berserker .** ❱ $300,000 \n\n• **Portofino .** ❱ $200,000 \n\n• **Gallardo .** ❱ $100,000\n\n⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯\n・**للـ شراء <#1270081838865449032>**\n・**طرق الدفع كردت <@282859044593598464>**\n・**<@755782461366992977> التحويل فقط لـ   **\n⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯`; // Your content for special roles
        break;
    }

    interaction.reply({ content: replyContent, ephemeral: true });
  }
});
/////////////////////////////
///////// لوج روم ’ log
let packagejson = JSON.parse(fs.readFileSync('./rooms.json', 'utf8'));

client.on('guildMemberRemove', async member => {
  if (JSON.parse(fs.readFileSync('./rooms.json', 'utf8')).members == '') return;
  const fetchedLogs = await member.guild.fetchAuditLogs({
    limit: 1
  });
  const kickLog = fetchedLogs.entries.first();
  let channel1 = client.channels.cache.get(`${JSON.parse(fs.readFileSync('./rooms.json', 'utf8')).members}`)
  if (!channel1) return;
  if (!member.guild.id.includes(`${channel1.guild.id}`)) return;

  if (!kickLog.action.includes('MEMBER_KICK') && !member.user.id.includes(`${kickLog.target.id}`)) {
    channel1.send(`**${member.user.tag} Left The Server 😥**`);
  }
  const { executor, target } = kickLog;

  if (kickLog.action == 'MEMBER_KICK' && kickLog.target.id == `${member.user.id}`) {
    let channel = client.channels.cache.get(`${JSON.parse(fs.readFileSync('./rooms.json', 'utf8')).kick}`)
    if (!channel) return;
    if (!member.guild.id.includes(`${channel.guild.id}`)) return;
    let Embed = new Discord.MessageEmbed()
      .setTitle("New Member Kicked !")
      .setDescription(`**${member.user.tag} Was kicked by ${executor}**`)
      .setThumbnail(client.user.displayAvatarURL({ dynamic: true }))
    channel.send({ embeds: [Embed] });
  }
});
tracker.on("guildMemberAdd", async (member, inviter) => {
  if (JSON.parse(fs.readFileSync('./rooms.json', 'utf8')).members == '') return;
  let channel1 = client.channels.cache.get(`${JSON.parse(fs.readFileSync('./rooms.json', 'utf8')).members}`)
  if (!channel1) return;
  if (!member.guild.id.includes(`${channel1.guild.id}`)) return;


  if (member.user.bot) return;

  channel1.send(`**${member} Joined The Server \nBy : ${inviter} 🥳**`)
})

client.on("guildMemberAdd", async (member) => {
  const fetchedLogs = await member.guild.fetchAuditLogs({
    limit: 1,
    type: 'BOT_ADD',
  });
  const BotLog = fetchedLogs.entries.first();

  const { executor, target } = BotLog;

  if (member.user.bot) {
    let channel2 = client.channels.cache.get(`${JSON.parse(fs.readFileSync('./rooms.json', 'utf8')).bots}`)
    if (!channel2) return;
    if (!member.guild.id.includes(`${channel2.guild.id}`)) return;
    return channel2.send(`**${member} Joined The Server \nBy : ${executor}**`);
  }

})

client.on('guildBanAdd', async member => {
  if (JSON.parse(fs.readFileSync('./rooms.json', 'utf8')).ban == '') return;
  const fetchedLogs = await member.guild.fetchAuditLogs({
    limit: 1,
    type: 'MEMBER_BAN_ADD',
  });

  const BanLog = fetchedLogs.entries.first();


  const { executor, target } = BanLog;

  let channel = client.channels.cache.get(`${JSON.parse(fs.readFileSync('./rooms.json', 'utf8')).ban}`)
  if (!channel) return;
  if (!member.guild.id.includes(`${channel.guild.id}`)) return;

  let Embed = new Discord.MessageEmbed()
    .setTitle("New Member Banned ! ✈")
    .setDescription(`**${member.user.tag} Was Banned By ${executor}**`)
    .setThumbnail(client.user.displayAvatarURL({ dynamic: true }))
  channel.send({ embeds: [Embed] });

});

client.on('guildBanRemove', async member => {
  if (JSON.parse(fs.readFileSync('./rooms.json', 'utf8')).ban == '') return;
  const fetchedLogs = await member.guild.fetchAuditLogs({
    limit: 1,
    type: 'MEMBER_BAN_REMOVE',
  });

  const BanLog = fetchedLogs.entries.first();


  const { executor, target } = BanLog;

  let channel = client.channels.cache.get(`${JSON.parse(fs.readFileSync('./rooms.json', 'utf8')).ban}`)
  if (!channel) return;
  if (!member.guild.id.includes(`${channel.guild.id}`)) return;

  let Embed = new Discord.MessageEmbed()
    .setTitle("New Member Unbanned ! 🤗")
    .setDescription(`**${member.user.tag} Was Unbanned By ${executor}**`)
    .setThumbnail(client.user.displayAvatarURL({ dynamic: true }))
  channel.send({ embeds: [Embed] });

});

client.on('messageDelete', async message => {
  if (message.author.bot) return;
  if (JSON.parse(fs.readFileSync('./rooms.json', 'utf8')).messages == '') return;
  if (!message.guild) return;
  const fetchedLogs = await message.guild.fetchAuditLogs({
    limit: 1,
    type: 'MESSAGE_DELETE',
  });
  const deletionLog = fetchedLogs.entries.first();


  let channel = client.channels.cache.get(`${JSON.parse(fs.readFileSync('./rooms.json', 'utf8')).messages}`)
  if (!channel) return;
  if (!message.guild.id.includes(`${channel.guild.id}`)) return;

  const { executor, target } = deletionLog;

  if (executor.id == message.author.id) {
    let embed = new Discord.MessageEmbed()
      .setTitle("Message Deleted ! ❌")
      .setDescription(`**Message Author : ${message.author.tag}\n\nMessage Content : ${message.content}**`)
      .setThumbnail(`${message.author.displayAvatarURL({ dynamic: true })}`)
    channel.send({ embeds: [embed] });
  }
  if (!executor.id.includes(`${message.author.id}`)) {
    let embed1 = new Discord.MessageEmbed()
      .setTitle("Message Deleted !")
      .setDescription(`**Message Author : ${message.author.tag}\n\nMessage Content : ${message.content}\n\nDeleted By : ${executor}**`)
      .setThumbnail(`${message.author.displayAvatarURL({ dynamic: true })}`)
    channel.send({ embeds: [embed1] });
  }



})

client.on("messageUpdate", message => {
  if (message.author.bot) return;
  if (JSON.parse(fs.readFileSync('./rooms.json', 'utf8')).messages == '') return;

  let channel = client.channels.cache.get(`${JSON.parse(fs.readFileSync('./rooms.json', 'utf8')).messages}`)
  if (!channel) return;
  if (!message.guild.id.includes(`${channel.guild.id}`)) return;

  let embed = new Discord.MessageEmbed()
    .setTitle("Message Edited ! ⚠")
    .setDescription(`**Old Message : ${message.content}\n\nNew Message : ${message.reactions.message.content}\n\nMessage Link : [here](${message.url})\n\nSent By : ${message.author}**`)
    .setThumbnail(`${message.author.displayAvatarURL({ dynamic: true })}`)

  channel.send({ embeds: [embed] })

})
client.on("channelCreate", async channel => {
  if (JSON.parse(fs.readFileSync('./rooms.json', 'utf8')).channels == '') return;


  let channel1 = client.channels.cache.get(`${JSON.parse(fs.readFileSync('./rooms.json', 'utf8')).channels}`)
  if (!channel1) return;


  if (!channel.guild.id.includes(`${channel1.guild.id}`)) return;
  const fetchedLogs = await channel.guild.fetchAuditLogs({
    limit: 1,
    type: 'CHANNEL_CREATE',
  });
  const CreateLog = fetchedLogs.entries.first();
  const { executor } = CreateLog;
  if (executor.bot) return;
  let embed = new Discord.MessageEmbed()
    .setTitle("Channel Created ! ✅")
    .setDescription(`**Channel Name : ${channel.name}\n\nChannel ID : ${channel.id}\n\nCreated By : ${executor}**`)
    .setThumbnail(`${executor.displayAvatarURL({ dynamic: true })}`)

  channel1.send({ embeds: [embed] })
})

client.on("channelDelete", async channel => {
  if (JSON.parse(fs.readFileSync('./rooms.json', 'utf8')).channels == '') return;
  let channel1 = client.channels.cache.get(`${JSON.parse(fs.readFileSync('./rooms.json', 'utf8')).channels}`)
  if (!channel1) return;
  if (!channel.guild.id.includes(`${channel1.guild.id}`)) return;
  const fetchedLogs = await channel.guild.fetchAuditLogs({
    limit: 1,
    type: 'CHANNEL_DELETE',
  });
  const CreateLog = fetchedLogs.entries.first();
  const { executor } = CreateLog;
  if (executor.bot) return;

  let embed = new Discord.MessageEmbed()
    .setTitle("Channel Deleted ! ❌")
    .setDescription(`**Channel Name : ${channel.name}\n\nChannel ID : ${channel.id}\n\nDeleted By : ${executor}**`)
    .setThumbnail(`${executor.displayAvatarURL({ dynamic: true })}`)

  channel1.send({ embeds: [embed] })
})

client.on("channelUpdate", async (Old, New) => {
  if (JSON.parse(fs.readFileSync('./rooms.json', 'utf8')).channels == '') return;
  let channel1 = client.channels.cache.get(`${JSON.parse(fs.readFileSync('./rooms.json', 'utf8')).channels}`)
  if (!channel1) return;
  if (!Old.guild.id.includes(`${channel1.guild.id}`)) return;
  if (!New.guild.id.includes(`${channel1.guild.id}`)) return;
  const fetchedLogs = await New.guild.fetchAuditLogs({
    limit: 1,
    type: 'CHANNEL_UPDATE',
  });
  const fetchedLogs2 = await New.guild.fetchAuditLogs({
    limit: 1,
    type: 'CHANNEL_OVERWRITE_UPDATE	',
  });

  const UpdateLog = fetchedLogs.entries.first();
  const { executor } = UpdateLog;
  const UpdateLog2 = fetchedLogs2.entries.first();
  if (UpdateLog2.executor.bot) return;

  if (Old.name != New.name) {
    let embed = new Discord.MessageEmbed()
      .setTitle("Channel Updated ! ⚠")
      .setDescription(`**Old Name Channel : ${Old.name}\n\nNew Name Channel : ${New.name}\n\nChannel ID : ${New.id}\n\nUpdated By : ${executor}**`)
      .setThumbnail(`${executor.displayAvatarURL({ dynamic: true })}`)
    channel1.send({ embeds: [embed] })
  }
})
client.on("roleCreate", async role => {
  if (JSON.parse(fs.readFileSync('./rooms.json', 'utf8')).roles == '') return;
  let channel1 = client.channels.cache.get(`${JSON.parse(fs.readFileSync('./rooms.json', 'utf8')).roles}`)
  if (!channel1) return;
  if (!role.guild.id.includes(`${channel1.guild.id}`)) return;
  const fetchedLogs = await role.guild.fetchAuditLogs({
    limit: 1,
    type: 'ROLE_CREATE',
  });
  const RoleLog = fetchedLogs.entries.first();
  const { executor } = RoleLog;
  let embed = new Discord.MessageEmbed()
    .setTitle("Role Created ! ✅")
    .setDescription(`**Role Name : ${role.name}\n\nRole ID : ${role.id}\n\nCreated By : ${executor}**`)
    .setThumbnail(`${executor.displayAvatarURL({ dynamic: true })}`)
  channel1.send({ embeds: [embed] })
})

client.on("roleDelete", async role => {
  if (JSON.parse(fs.readFileSync('./rooms.json', 'utf8')).roles == '') return;
  let channel1 = client.channels.cache.get(`${JSON.parse(fs.readFileSync('./rooms.json', 'utf8')).roles}`)
  if (!channel1) return;
  if (!role.guild.id.includes(`${channel1.guild.id}`)) return;
  const fetchedLogs = await role.guild.fetchAuditLogs({
    limit: 1,
    type: 'ROLE_DELETE',
  });
  const RoleLog = fetchedLogs.entries.first();
  const { executor } = RoleLog;
  let embed = new Discord.MessageEmbed()
    .setTitle("Role Deleted ! ❌")
    .setDescription(`**Role Name : ${role.name}\n\nRole ID : ${role.id}\n\nDeleted By : ${executor}**`)
    .setThumbnail(`${executor.displayAvatarURL({ dynamic: true })}`)
  channel1.send({ embeds: [embed] })
})
client.on("roleUpdate", async (Old, New) => { ///// made by 𝐅𝐃 | 𝐁𝐥𝐮𝐞 𝐅𝐥𝐚𝐦𝐞 ✨#3089
  if (JSON.parse(fs.readFileSync('./rooms.json', 'utf8')).roles == '') return;
  let channel1 = client.channels.cache.get(`${JSON.parse(fs.readFileSync('./rooms.json', 'utf8')).roles}`)
  if (!channel1) return;
  if (!Old.guild.id.includes(`${channel1.guild.id}`)) return;
  if (!New.guild.id.includes(`${channel1.guild.id}`)) return;
  const fetchedLogs = await New.guild.fetchAuditLogs({
    limit: 1,
    type: 'ROLE_UPDATE',
  });
  const RoleLog = fetchedLogs.entries.first();
  const { executor } = RoleLog;
  if (Old.name != New.name) {
    let embed = new Discord.MessageEmbed()
      .setTitle("Role Updated ! ⚠")
      .setDescription(`**Old Role Name : ${Old.name}\n\nNew Role Name : ${New.name}\n\nRole ID : ${New.id}\n\nUpdated By : ${executor}**`)
      .setThumbnail(`${executor.displayAvatarURL({ dynamic: true })}`)
    channel1.send({ embeds: [embed] })
  }
})

client.on('voiceStateUpdate', async (oldState, newState) => {
  if (JSON.parse(fs.readFileSync('./rooms.json', 'utf8')).voice == '') return;
  let channel1 = client.channels.cache.get(`${JSON.parse(fs.readFileSync('./rooms.json', 'utf8')).voice}`)
  if (!channel1) return;
  if (oldState.member.bot) return;
  if (newState.member.bot) return;
  if (!newState.guild.id.includes(`${channel1.guild.id}`)) return;
  if (!oldState.guild.id.includes(`${channel1.guild.id}`)) return;

  if (!oldState.channelId && newState.channelId) {
    let embed = new Discord.MessageEmbed()
      .setTitle("Member Voice Connected ! ✅")
      .setDescription(`**${newState.member.user.tag} has joined voice channel " ${newState.channel.name} "**`)
      .setThumbnail(`${newState.member.displayAvatarURL({ dynamic: true })}`)
    return channel1.send({ embeds: [embed] })
  }
  if (oldState.channelId && !newState.channelId && oldState.member.user.bot === false) {
    let embed = new Discord.MessageEmbed()
      .setTitle("Member Voice Disconnected ! ❌")
      .setDescription(`**${oldState.member.user.tag} has disconnected from voice channel " ${oldState.channel.name} "**`)
      .setThumbnail(`${oldState.member.displayAvatarURL({ dynamic: true })}`)

    return channel1.send({ embeds: [embed] })
  }
  if (oldState.channelId !== newState.channelId) {
    let embed = new Discord.MessageEmbed()
      .setTitle("Member Voice Moved ! 🔁")
      .setDescription(`**${newState.member.user.tag} has moved from  ${`"` + oldState.channel?.name + `"` ?? 'a voice channel'} to ${`"` + newState.channel?.name + `"` ?? 'a voice channel'}**`)
      .setThumbnail(`${oldState.member.displayAvatarURL({ dynamic: true })}`)
    return channel1.send({ embeds: [embed] })
  }

});

client.on("inviteCreate", async (invite) => {
  if (JSON.parse(fs.readFileSync('./rooms.json', 'utf8')).invites == '') return;
  let channel1 = client.channels.cache.get(`${JSON.parse(fs.readFileSync('./rooms.json', 'utf8')).invites}`)
  if (!channel1) return;
  if (!invite.guild.id.includes(`${channel1.guild.id}`)) return;
  const fetchedLogs = await invite.guild.fetchAuditLogs({
    limit: 1,
    type: 'INVITE_CREATE',
  });
  const InviteLog = fetchedLogs.entries.first();
  const { executor } = InviteLog;

  let embed = new Discord.MessageEmbed()
    .setTitle("Invite Created ! ✅")
    .setDescription(`**Invite Url : ${invite.url}\n\nCreated By : ${executor.tag}**`)
    .setThumbnail(`${executor.displayAvatarURL({ dynamic: true })}`)
  channel1.send({ embeds: [embed] })
})

client.on("inviteDelete", async (invite) => {
  if (JSON.parse(fs.readFileSync('./rooms.json', 'utf8')).invites == '') return;
  let channel1 = client.channels.cache.get(`${JSON.parse(fs.readFileSync('./rooms.json', 'utf8')).invites}`)
  if (!channel1) return;
  if (!invite.guild.id.includes(`${channel1.guild.id}`)) return;
  const fetchedLogs = await invite.guild.fetchAuditLogs({
    limit: 1,
    type: 'INVITE_DELETE',
  });
  const InviteLog = fetchedLogs.entries.first();
  const { executor, target } = InviteLog;

  let embed = new Discord.MessageEmbed()
    .setTitle("Invite Deleted ! ❌")
    .setDescription(`**Invite Url : ${invite.url}\n\nCreated By : ${target.inviter.tag}\n\nDeleted By : ${executor.tag}**`)
    .setThumbnail(`${executor.displayAvatarURL({ dynamic: true })}`)
  channel1.send({ embeds: [embed] })
})

client.on('guildMemberUpdate', async (oldMember, newMember) => {
  if (JSON.parse(fs.readFileSync('./rooms.json', 'utf8')).members == '') return;
  let channel1 = client.channels.cache.get(`${JSON.parse(fs.readFileSync('./rooms.json', 'utf8')).members}`)
  if (!channel1) return;
  if (!oldMember.guild.id.includes(`${channel1.guild.id}`)) return;
  if (!newMember.guild.id.includes(`${channel1.guild.id}`)) return;
  const fetchedLogs = await oldMember.guild.fetchAuditLogs({
    limit: 1,
    type: 'MEMBER_ROLE_UPDATE',
  });
  const RoleLog = fetchedLogs.entries.first();
  const { executor } = RoleLog;

  const removedRoles = oldMember.roles.cache.filter(role => !newMember.roles.cache.has(role.id));
  if (removedRoles.size > 0) {
    let embed = new Discord.MessageEmbed()
      .setTitle("Member Role Removed ! ❌")
      .setDescription(`**Role : \`${removedRoles.map(r => r.name)}\`\n\nRemoved From : ${newMember.user.tag}\n\nRemoved By : ${executor}**`)
      .setThumbnail(`${newMember.user.displayAvatarURL({ dynamic: true })}`)
    channel1.send({ embeds: [embed] })


  }


  const addedRoles = newMember.roles.cache.filter(role => !oldMember.roles.cache.has(role.id));
  if (addedRoles.size > 0) {
    let embed = new Discord.MessageEmbed()
      .setTitle("Member Role Added ! ✅")
      .setDescription(`**Role : \`${addedRoles.map(r => r.name)}\`\n\nAdded To : ${newMember.user.tag}\n\nAdded By : ${executor}**`)
      .setThumbnail(`${newMember.user.displayAvatarURL({ dynamic: true })}`)
    channel1.send({ embeds: [embed] })

  }
});

//////// set ban room
client.on("messageCreate", message => {
  if (message.content.startsWith(prefix + "setbanroom")) {
    const args = message.content.split(" ").slice(1).join(" ");
    const guild = message.guild.channels.cache.get(`${args}`)
    if (!guild) return message.react('❌')
    let embed1 = new Discord.MessageEmbed()
      .setDescription("> **انت لا تمتلك صلاحيات لأستخدام هذا الامر ❌**")
    if (args == JSON.parse(fs.readFileSync('./rooms.json', 'utf8')).ban) return message.reply("**بالفعل موجوده**")
    if (guild.type != 'GUILD_TEXT') return message.react('❌')
    if (!config.owners.includes(message.author.id)) return message.reply({ embeds: [embed1] })

    packagejson.ban = args

    fs.writeFileSync("./rooms.json", JSON.stringify(packagejson), (err) => {
      if (err) console.error(err)
        .catch(err => {
          console.error(err);
        });
    })


    let embed = new Discord.MessageEmbed()
      .setTitle(`تم تغييرها الى`)
      .setDescription(`> <#${args}>`)

    message.reply({ embeds: [embed] })

  }
})

//////// current ban room
client.on("messageCreate", (message) => {
  if (message.content == prefix + "banroom") {
    let embed1 = new Discord.MessageEmbed()
      .setDescription("> **انت لا تمتلك صلاحيات لأستخدام هذا الامر ❌**")

    if (!config.owners.includes(message.author.id)) return message.reply({ embeds: [embed1] })

    if (JSON.parse(fs.readFileSync('./rooms.json', 'utf8')).ban == '') return message.reply("**لم يتم تحديد الروم الى الان**")

    let embed = new Discord.MessageEmbed()
      .setTitle(`الروم الحاليه هي`)
      .setDescription(`> <#${JSON.parse(fs.readFileSync('./rooms.json', 'utf8')).ban}>`)

    message.reply({ embeds: [embed] })
  }
})



//////// set kick room
client.on("messageCreate", message => {
  if (message.content.startsWith(prefix + "setkickroom")) {
    const args = message.content.split(" ").slice(1).join(" ");
    const guild = message.guild.channels.cache.get(`${args}`)
    if (!guild) return message.react('❌')
    let embed1 = new Discord.MessageEmbed()
      .setDescription("> **انت لا تمتلك صلاحيات لأستخدام هذا الامر ❌**")
    if (args == JSON.parse(fs.readFileSync('./rooms.json', 'utf8')).kick) return message.reply("**بالفعل موجوده**")
    if (guild.type != 'GUILD_TEXT') return message.react('❌')
    if (!config.owners.includes(message.author.id)) return message.reply({ embeds: [embed1] })

    packagejson.kick = args

    fs.writeFileSync("./rooms.json", JSON.stringify(packagejson), (err) => {
      if (err) console.error(err)
        .catch(err => {
          console.error(err);
        });
    })


    let embed = new Discord.MessageEmbed()
      .setTitle(`تم تغييرها الى`)
      .setDescription(`> <#${args}>`)

    message.reply({ embeds: [embed] })

  }
})

//////// current kick room
client.on("messageCreate", (message) => {
  if (message.content == prefix + "kickroom") {
    let embed1 = new Discord.MessageEmbed()
      .setDescription("> **انت لا تمتلك صلاحيات لأستخدام هذا الامر ❌**")

    if (!config.owners.includes(message.author.id)) return message.reply({ embeds: [embed1] })

    if (JSON.parse(fs.readFileSync('./rooms.json', 'utf8')).kick == '') return message.reply("**لم يتم تحديد الروم الى الان**")

    let embed = new Discord.MessageEmbed()
      .setTitle(`الروم الحاليه هي`)
      .setDescription(`> <#${JSON.parse(fs.readFileSync('./rooms.json', 'utf8')).kick}>`)

    message.reply({ embeds: [embed] })
  }
})

//////// set messages room
client.on("messageCreate", message => {
  if (message.content.startsWith(prefix + "setmessagesroom")) {
    const args = message.content.split(" ").slice(1).join(" ");
    const guild = message.guild.channels.cache.get(`${args}`)
    if (!guild) return message.react('❌')
    let embed1 = new Discord.MessageEmbed()
      .setDescription("> **انت لا تمتلك صلاحيات لأستخدام هذا الامر ❌**")
    if (args == JSON.parse(fs.readFileSync('./rooms.json', 'utf8')).messages) return message.reply("**بالفعل موجوده**")
    if (guild.type != 'GUILD_TEXT') return message.react('❌')
    if (!config.owners.includes(message.author.id)) return message.reply({ embeds: [embed1] })

    packagejson.messages = args

    fs.writeFileSync("./rooms.json", JSON.stringify(packagejson), (err) => {
      if (err) console.error(err)
        .catch(err => {
          console.error(err);
        });
    })


    let embed = new Discord.MessageEmbed()
      .setTitle(`تم تغييرها الى`)
      .setDescription(`> <#${args}>`)

    message.reply({ embeds: [embed] })

  }
})

//////// current messages room
client.on("messageCreate", (message) => {
  if (message.content == prefix + "messagesroom") {
    let embed1 = new Discord.MessageEmbed()
      .setDescription("> **انت لا تمتلك صلاحيات لأستخدام هذا الامر ❌**")

    if (!config.owners.includes(message.author.id)) return message.reply({ embeds: [embed1] })

    if (JSON.parse(fs.readFileSync('./rooms.json', 'utf8')).messages == '') return message.reply("**لم يتم تحديد الروم الى الان**")

    let embed = new Discord.MessageEmbed()
      .setTitle(`الروم الحاليه هي`)
      .setDescription(`> <#${JSON.parse(fs.readFileSync('./rooms.json', 'utf8')).messages}>`)

    message.reply({ embeds: [embed] })
  }
})


//////// set roles room
client.on("messageCreate", message => {
  if (message.content.startsWith(prefix + "setrolesroom")) {

    const args = message.content.split(" ").slice(1).join(" ");
    const guild = message.guild.channels.cache.get(`${args}`)
    if (!guild) return message.react('❌')
    let embed1 = new Discord.MessageEmbed()
      .setDescription("> **انت لا تمتلك صلاحيات لأستخدام هذا الامر ❌**")
    if (args == JSON.parse(fs.readFileSync('./rooms.json', 'utf8')).roles) return message.reply("**بالفعل موجوده**")
    if (guild.type != 'GUILD_TEXT') return message.react('❌')
    if (!config.owners.includes(message.author.id)) return message.reply({ embeds: [embed1] })

    packagejson.roles = args

    fs.writeFileSync("./rooms.json", JSON.stringify(packagejson), (err) => {
      if (err) console.error(err)
        .catch(err => {
          console.error(err);
        });
    })


    let embed = new Discord.MessageEmbed()
      .setTitle(`تم تغييرها الى`)
      .setDescription(`> <#${args}>`)

    message.reply({ embeds: [embed] })

  }
})

//////// current roles room
client.on("messageCreate", (message) => {
  if (message.content == prefix + "rolesroom") {
    let embed1 = new Discord.MessageEmbed()
      .setDescription("> **انت لا تمتلك صلاحيات لأستخدام هذا الامر ❌**")

    if (!config.owners.includes(message.author.id)) return message.reply({ embeds: [embed1] })

    if (JSON.parse(fs.readFileSync('./rooms.json', 'utf8')).roles == '') return message.reply("**لم يتم تحديد الروم الى الان**")

    let embed = new Discord.MessageEmbed()
      .setTitle(`الروم الحاليه هي`)
      .setDescription(`> <#${JSON.parse(fs.readFileSync('./rooms.json', 'utf8')).kick}>`)

    message.reply({ embeds: [embed] })
  }
})

//////// set channels room
client.on("messageCreate", message => {
  if (message.content.startsWith(prefix + "setchannelsroom")) {

    const args = message.content.split(" ").slice(1).join(" ");
    const guild = message.guild.channels.cache.get(`${args}`)
    if (!guild) return message.react('❌')
    let embed1 = new Discord.MessageEmbed()
      .setDescription("> **انت لا تمتلك صلاحيه لأستخدام هذا الامر ❌**")
    if (args == JSON.parse(fs.readFileSync('./rooms.json', 'utf8')).channels) return message.reply("**بالفعل موجوده**")
    if (guild.type != 'GUILD_TEXT') return message.react('❌')
    if (!config.owners.includes(message.author.id)) return message.reply({ embeds: [embed1] })

    packagejson.channels = args

    fs.writeFileSync("./rooms.json", JSON.stringify(packagejson), (err) => {
      if (err) console.error(err)
        .catch(err => {
          console.error(err);
        });
    })


    let embed = new Discord.MessageEmbed()
      .setTitle(`تم تغييرها الى`)
      .setDescription(`> <#${args}>`)

    message.reply({ embeds: [embed] })

  }
})

//////// current channels room
client.on("messageCreate", (message) => {
  if (message.content == prefix + "channelsroom") { ///// made by 𝐅𝐃 | 𝐁𝐥𝐮𝐞 𝐅𝐥𝐚𝐦𝐞 ✨#3089
    let embed1 = new Discord.MessageEmbed()
      .setDescription("> **انت لا تمتلك صلاحيات لأستخدام هذا الامر ❌**")

    if (!config.owners.includes(message.author.id)) return message.reply({ embeds: [embed1] })

    if (JSON.parse(fs.readFileSync('./rooms.json', 'utf8')).channels == '') return message.reply("**لم يتم تحديد الروم الى الان**")

    let embed = new Discord.MessageEmbed()
      .setTitle(`الروم الحاليه هي`)
      .setDescription(`> <#${JSON.parse(fs.readFileSync('./rooms.json', 'utf8')).channels}>`)

    message.reply({ embeds: [embed] })
  }
})

//////// set bots room
client.on("messageCreate", message => {
  if (message.content.startsWith(prefix + "setbotsroom")) {

    const args = message.content.split(" ").slice(1).join(" ");
    const guild = message.guild.channels.cache.get(`${args}`)
    if (!guild) return message.react('❌')
    let embed1 = new Discord.MessageEmbed()
      .setDescription("> **انت لا تمتلك صلاحيات لأستخدام هذا الامر ❌**")
    if (args == JSON.parse(fs.readFileSync('./rooms.json', 'utf8')).bots) return message.reply("**بالفعل موجوده**")
    if (guild.type != 'GUILD_TEXT') return message.react('❌')
    if (!config.owners.includes(message.author.id)) return message.reply({ embeds: [embed1] })

    packagejson.bots = args

    fs.writeFileSync("./rooms.json", JSON.stringify(packagejson), (err) => {
      if (err) console.error(err)
        .catch(err => {
          console.error(err);
        });
    })


    let embed = new Discord.MessageEmbed()
      .setTitle(`تم تغييرها الى`)
      .setDescription(`> <#${args}>`)

    message.reply({ embeds: [embed] })

  }
})

//////// current bots room
client.on("messageCreate", (message) => {
  if (message.content == prefix + "botsroom") {
    let embed1 = new Discord.MessageEmbed()
      .setDescription("> **انت لا تمتلك صلاحيات لأستخدام هذا الامر ❌**")

    if (!config.owners.includes(message.author.id)) return message.reply({ embeds: [embed1] })

    if (JSON.parse(fs.readFileSync('./rooms.json', 'utf8')).bots == '') return message.reply("**لم يتم تحديد الروم الى الان**")

    let embed = new Discord.MessageEmbed()
      .setTitle(`الروم الحاليه هي`)
      .setDescription(`> <#${JSON.parse(fs.readFileSync('./rooms.json', 'utf8')).bots}>`)

    message.reply({ embeds: [embed] })
  }
})

//////// set voice room
client.on("messageCreate", message => {
  if (message.content.startsWith(prefix + "setvoiceroom")) {

    const args = message.content.split(" ").slice(1).join(" ");
    const guild = message.guild.channels.cache.get(`${args}`)
    if (!guild) return message.react('❌')
    let embed1 = new Discord.MessageEmbed()
      .setDescription("> **انت لا تمتلك صلاحيات لأستخدام هذا الامر ❌**")
    if (args == JSON.parse(fs.readFileSync('./rooms.json', 'utf8')).voice) return message.reply("**بالفعل موجوده**")
    if (guild.type != 'GUILD_TEXT') return message.react('❌')
    if (!config.owners.includes(message.author.id)) return message.reply({ embeds: [embed1] })

    packagejson.voice = args

    fs.writeFileSync("./rooms.json", JSON.stringify(packagejson), (err) => {
      if (err) console.error(err)
        .catch(err => {
          console.error(err);
        });
    })


    let embed = new Discord.MessageEmbed()
      .setTitle(`تم تغييرها الى`)
      .setDescription(`> <#${args}>`)

    message.reply({ embeds: [embed] })

  }
})

//////// current voice room
client.on("messageCreate", (message) => {
  if (message.content == prefix + "voiceroom") {
    let embed1 = new Discord.MessageEmbed()
      .setDescription("> **انت لا تمتلك صلاحيات لأستخدام هذا الامر ❌**")

    if (!config.owners.includes(message.author.id)) return message.reply({ embeds: [embed1] })

    if (JSON.parse(fs.readFileSync('./rooms.json', 'utf8')).voice == '') return message.reply("**لم يتم تحديد الروم الى الان**")

    let embed = new Discord.MessageEmbed()
      .setTitle(`الروم الحاليه هي`)
      .setDescription(`> <#${JSON.parse(fs.readFileSync('./rooms.json', 'utf8')).voice}>`)

    message.reply({ embeds: [embed] })
  }
})

//////// set members room
client.on("messageCreate", message => {
  if (message.content.startsWith(prefix + "setmembersroom")) {

    const args = message.content.split(" ").slice(1).join(" ");
    const guild = message.guild.channels.cache.get(`${args}`)
    if (!guild) return message.react('❌')
    let embed1 = new Discord.MessageEmbed()
      .setDescription("> **انت لا تمتلك صلاحيات لأستخدام هذا الامر ❌**")
    if (args == JSON.parse(fs.readFileSync('./rooms.json', 'utf8')).members) return message.reply("**بالفعل موجوده**")
    if (guild.type != 'GUILD_TEXT') return message.react('❌')
    if (!config.owners.includes(message.author.id)) return message.reply({ embeds: [embed1] })

    packagejson.members = args

    fs.writeFileSync("./rooms.json", JSON.stringify(packagejson), (err) => {
      if (err) console.error(err)
        .catch(err => {
          console.error(err);
        });
    })


    let embed = new Discord.MessageEmbed()
      .setTitle(`تم تغييرها الى`)
      .setDescription(`> <#${args}>`)

    message.reply({ embeds: [embed] })

  }
})

//////// current members room
client.on("messageCreate", (message) => {
  if (message.content == prefix + "membersroom") {
    let embed1 = new Discord.MessageEmbed()
      .setDescription("> **انت لا تمتلك صلاحيه لأستخدام هذا الامر ❌**")

    if (!config.owners.includes(message.author.id)) return message.reply({ embeds: [embed1] })

    if (JSON.parse(fs.readFileSync('./rooms.json', 'utf8')).members == '') return message.reply("**لم يتم تحديد الروم الى الان**")

    let embed = new Discord.MessageEmbed()
      .setTitle(`الروم الحاليه هي`)
      .setDescription(`> <#${JSON.parse(fs.readFileSync('./rooms.json', 'utf8')).members}>`)

    message.reply({ embeds: [embed] })
  }
})

//////// set invites room
client.on("messageCreate", message => {
  if (message.content.startsWith(prefix + "setinvitesroom")) {

    const args = message.content.split(" ").slice(1).join(" ");
    const guild = message.guild.channels.cache.get(`${args}`)
    if (!guild) return message.react('❌')
    let embed1 = new Discord.MessageEmbed()
      .setDescription("> **انت لا تمتلك صلاحيات لأستخدام هذا الامر ❌**")
    if (args == JSON.parse(fs.readFileSync('./rooms.json', 'utf8')).invites) return message.reply("**بالفعل موجوده**")
    if (guild.type != 'GUILD_TEXT') return message.react('❌')
    if (!config.owners.includes(message.author.id)) return message.reply({ embeds: [embed1] })

    packagejson.invites = args

    fs.writeFileSync("./rooms.json", JSON.stringify(packagejson), (err) => {
      if (err) console.error(err)
        .catch(err => {
          console.error(err);
        });
    })


    let embed = new Discord.MessageEmbed()
      .setTitle(`تم تغييرها الى`)
      .setDescription(`> <#${args}>`)

    message.reply({ embeds: [embed] })

  }
})

//////// current invites room
client.on("messageCreate", (message) => {
  if (message.content == prefix + "invitesroom") {
    let embed1 = new Discord.MessageEmbed()
      .setDescription("> **انت لا تمتلك صلاحيه لأستخدام هذا الامر ❌**")

    if (!config.owners.includes(message.author.id)) return message.reply({ embeds: [embed1] })

    if (JSON.parse(fs.readFileSync('./rooms.json', 'utf8')).invites == '') return message.reply("**لم يتم تحديد الروم الى الان**")

    let embed = new Discord.MessageEmbed()
      .setTitle(`الروم الحاليه هي`)
      .setDescription(`> <#${JSON.parse(fs.readFileSync('./rooms.json', 'utf8')).invites}>`)

    message.reply({ embeds: [embed] })
  }
})


client.on("messageCreate", message => {
  if (message.content.startsWith(prefix + "loglist")) {
    let embed1 = new Discord.MessageEmbed()
      .setDescription("> **انت لا تمتلك صلاحيه لأستخدام هذا الامر ❌**")

    if (!config.owners.includes(message.author.id)) return message.reply({ embeds: [embed1] })

    let ban = `${JSON.parse(fs.readFileSync('./rooms.json', 'utf8')).ban}`;
    let kick = `${JSON.parse(fs.readFileSync('./rooms.json', 'utf8')).kick}`;
    let messages = `${JSON.parse(fs.readFileSync('./rooms.json', 'utf8')).messages}`;
    let channels = `${JSON.parse(fs.readFileSync('./rooms.json', 'utf8')).channels}`;
    let roles = `${JSON.parse(fs.readFileSync('./rooms.json', 'utf8')).roles}`;
    let members = `${JSON.parse(fs.readFileSync('./rooms.json', 'utf8')).members}`;
    let bots = `${JSON.parse(fs.readFileSync('./rooms.json', 'utf8')).bots}`;
    let voice = `${JSON.parse(fs.readFileSync('./rooms.json', 'utf8')).voice}`;
    let invites = `${JSON.parse(fs.readFileSync('./rooms.json', 'utf8')).invites}`;


    if (JSON.parse(fs.readFileSync('./rooms.json', 'utf8')).ban == '') {
      ban = ban.replace(/^$/, '**Not Exist**')
    }
    if (JSON.parse(fs.readFileSync('./rooms.json', 'utf8')).ban != '') {
      ban = "<#" + ban + ">"
    }
    if (JSON.parse(fs.readFileSync('./rooms.json', 'utf8')).kick == '') {
      kick = kick.replace(/^$/, '**Not Exist**')
    }
    if (JSON.parse(fs.readFileSync('./rooms.json', 'utf8')).kick != '') {
      kick = "<#" + kick + ">"
    }
    if (JSON.parse(fs.readFileSync('./rooms.json', 'utf8')).messages == '') {
      messages = messages.replace(/^$/, '**Not Exist**')
    }
    if (JSON.parse(fs.readFileSync('./rooms.json', 'utf8')).messages != '') {
      messages = "<#" + messages + ">"
    }
    if (JSON.parse(fs.readFileSync('./rooms.json', 'utf8')).channels == '') {
      channels = channels.replace(/^$/, '**Not Exist**')
    }
    if (JSON.parse(fs.readFileSync('./rooms.json', 'utf8')).channels != '') {
      channels = "<#" + channels + ">"
    }
    if (JSON.parse(fs.readFileSync('./rooms.json', 'utf8')).roles == '') {
      roles = roles.replace(/^$/, '**Not Exist**')
    }
    if (JSON.parse(fs.readFileSync('./rooms.json', 'utf8')).roles != '') {
      roles = "<#" + roles + ">"
    }
    if (JSON.parse(fs.readFileSync('./rooms.json', 'utf8')).members == '') {
      members = members.replace(/^$/, '**Not Exist**')
    }
    if (JSON.parse(fs.readFileSync('./rooms.json', 'utf8')).members != '') {
      members = "<#" + members + ">"
    }
    if (JSON.parse(fs.readFileSync('./rooms.json', 'utf8')).bots == '') {
      bots = bots.replace(/^$/, '**Not Exist**')
    }
    if (JSON.parse(fs.readFileSync('./rooms.json', 'utf8')).bots != '') {
      bots = "<#" + bots + ">"
    }
    if (JSON.parse(fs.readFileSync('./rooms.json', 'utf8')).voice == '') {
      voice = voice.replace(/^$/, '**Not Exist**')
    }
    if (JSON.parse(fs.readFileSync('./rooms.json', 'utf8')).voice != '') {
      voice = "<#" + voice + ">"
    }
    if (JSON.parse(fs.readFileSync('./rooms.json', 'utf8')).invites == '') {
      invites = invites.replace(/^$/, '**Not Exist**')
    }
    if (JSON.parse(fs.readFileSync('./rooms.json', 'utf8')).invites != '') {
      invites = "<#" + invites + ">"
    }


    let embed = new Discord.MessageEmbed()
      .setTitle("Log Channels List")
      .setDescription(`**Ban Log Channel :**\n> ${ban}\n\n**Kick Log Channel :**\n> ${kick}\n\n**Messages Log Channel : **\n> ${messages}\n\n**Channels Log Channel : **\n> ${channels}\n\n**Roles Log Channel : **\n> ${roles}\n\n**Members Log Channel :**\n> ${members}\n\n**Bots Log Channel :**\n> ${bots}\n\n**Voice Log Channel**\n> ${voice}\n\n**Invites Log Channel**\n> ${invites}`)
      .setThumbnail(`${client.user.displayAvatarURL({ dynamic: true })}`)
    message.reply({ embeds: [embed] })
  }
})
