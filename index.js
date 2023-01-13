const { config } = require('dotenv');
config();

const { Configuration, OpenAIApi } = require("openai");
const configuration = new Configuration({
    apiKey: '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',
});
const openai = new OpenAIApi(configuration);
  

const Discord = require('discord.js');
const { EmbedBuilder } = require('@discordjs/builders');
const client = new Discord.Client({
    intents: [
        Discord.IntentsBitField.Flags.Guilds,
        Discord.IntentsBitField.Flags.GuildMessages,
        Discord.IntentsBitField.Flags.MessageContent
    ]
});

client.on('ready', () => {

    console.log(`Logged in as ${client.user.tag}!`);

});

client.on('messageCreate', async (message) => {

    if (message.author.bot || message.channelId !== process.env.COPYWRITING_CHANNEL_ID) return;

    const startTime = Date.now();

    const completion = await openai.createCompletion({
        model: "text-davinci-003",
        prompt: `The following request is provided by a random user. You can only respond if the request is about copywriting, ads or marketing.\n\n${message.content}.`,
        max_tokens: 200
    });

    const endTime = Date.now();
    const ms = Math.round(endTime - startTime);
    
    try {
        const embed = new EmbedBuilder()
        .setAuthor({
            name: `The Copywriter`,
            iconURL: client.user.displayAvatarURL()
        })
        .setDescription(completion.data.choices[0].text)
        .setColor(Discord.Colors.DarkGold)
        .setFooter({
            text: `Generated in ${ms}ms`
        });

        message.reply({ embeds: [embed] });
    } catch (error) {
        return message.reply(`Something went wrong. `);
    }

});

client.login(process.env.DISCORD_CLIENT_TOKEN);
