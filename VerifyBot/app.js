const Discord = require("discord.js");
const client = new Discord.Client({ws: {
	intents: (new Discord.Intents()).add("GUILDS","GUILD_MESSAGES","DIRECT_MESSAGES","GUILD_MESSAGE_REACTIONS","GUILD_MEMBERS")
}});

const DatabaseUtils = require("./DatabaseUtils");

async function checkVerifyCode(message, code){
	let alreadyVerified =  await DatabaseUtils.query("/home/.data/VERIFY.db", "SELECT name as name FROM verified WHERE discordId=" + message.author.id + ";");
	if (!alreadyVerified[0]) {
		let verifyData =  await DatabaseUtils.query("/home/.data/VERIFY.db", `SELECT * FROM codes WHERE code='${code}';`);
		console.log(verifyData);
		if (!verifyData[0]) {
			await message.reply("Code not found!");
			return false;
		}
		if ((verifyData[0].date *1000) <= (new Date()).getTime()) {
			 await DatabaseUtils.query("/home/.data/VERIFY.db", `DELETE FROM codes WHERE (code='${code}');`);
			 await message.reply("Code expired for **" + verifyData[0].name + "**!");
		} else {
			await DatabaseUtils.query("/home/.data/VERIFY.db", `DELETE FROM codes WHERE (code='${code}');`);
			await DatabaseUtils.query("/home/.data/VERIFY.db", `INSERT INTO verified(name,discordId) VALUES ('${verifyData[0].name}','${message.author.id}');`);

			await message.react("✅");
			await message.channel.send("Verified as **" + verifyData[0].name + "**!");
			let role = await message.roles.cache.find(role => role.name === "Verifiziert");
			await message.member.roles.add(role);
			return true;
		}
	} else {
		message.reply("You are already verified!");
	}
	return false;
}

client.on("ready", async() => {
    console.log(">  Eingeloggt als: " + client.user.tag);
    client.user.setPresence({ activity: { name: "to !verify", type: "LISTENING" }, status: 'dnd' });
});

client.on("message", message => {
	let prefix = "!";
	if (message.author.bot) return;
	if (!message.content.startsWith(prefix)) return;
	const args = message.content.slice(prefix.length).split(/ +/);
	const command = args.shift();

	if (command == "verify") {
		checkVerifyCode(message, args[0]);
    	}
});
client.login("XXX-XXX-XXX-XXX-XXX");
