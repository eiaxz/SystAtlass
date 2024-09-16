const { MessageButton, MessageActionRow, MessageEmbed, Client } = require("discord.js");

module.exports = {
      name: "set-avatar",
      description: `Change new avatar bot`,
                options: [
                {
                  name: "url",
                  description: "The avatar",
                  type: 3,
                  required: true,
                },
              ],
      run: async (client, message , args) => {


          
if (!message.member.permissions.has('ADMINISTRATOR')) return message.reply(`** 😕 You don't have permission **`);


    const url = message.options.getString('url')

    await client.user.setAvatar(`${url}`)

    message.reply({content: `**Done Change Avatar Your Bot **`, ephemeral: true})
          
   },
};
