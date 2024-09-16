const db = require("pro.db")
module.exports = {
  name: "set-welcome",
  description: "To set welcome room",
  options: [{
    name: "channel",
    description: "channel to set welcome",
    type: 7,
    required: true,
  }],

  run: async (client, interaction, args) => {
    try {
      if (!interaction.member.permissions.has('ADMINISTRATOR')) return interaction.reply(`** 😕 You don't have permission **`);

      let link = interaction.options.getChannel('channel')

      let chid = link.id;
      db.set(`welcome_${interaction.guild.id}`, chid)
      interaction.reply(`> **Done Set The Welcome Room To ${link} **`)

    } catch (err) {
      console.log(err)
    }
  }
}
