const { MessageButton, MessageActionRow, MessageEmbed, Client } = require("discord.js");

module.exports = {
              name: "set-name",
              description: "To change a picture of a Name",
              options: [
                {
                  name: "name",
                  description: "The Name",
                  type: 3,
                  required: true,
                },
              ],
        run: async (client, message , args) => {


if (!message.member.permissions.has('ADMINISTRATOR')) return message.reply(`** 😕 You don't have permission **`);  
    const name = message.options.getString('name')

    await client.user.setUsername(`${name}`)

    message.reply({content: `**Done Change Name Your Bot => ${name}**`, ephemeral: true})
   },
};
