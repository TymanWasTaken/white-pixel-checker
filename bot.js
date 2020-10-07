require('dotenv').config()
const Discord = require('discord.js');
const { color } = require('jimp');
const Jimp = require('jimp');
const client = new Discord.Client();
var args = process.argv.slice(2);

function log(text) {
	if (args[0] === "dev") {
		console.log(text);
	}
}

function mode(array)
{
    if(array.length == 0)
        return null;
    var modeMap = {};
    var maxEl = array[0], maxCount = 1;
    for(var i = 0; i < array.length; i++)
    {
        var el = array[i];
        if(modeMap[el] == null)
            modeMap[el] = 1;
        else
            modeMap[el]++;  
        if(modeMap[el] > maxCount)
        {
            maxEl = el;
            maxCount = modeMap[el];
        }
    }
    return maxEl;
}

function avg(arr) {
	var sum = 0;
	for( var i = 0; i < arr.length; i++ ){
		sum += parseInt( arr[i], 10 ); //don't forget to add the base
	}
	var a = Math.round(sum/arr.length);
	return a;
}

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

client.on('message', msg => {
  if (msg.attachments.size > 0) {
    msg.attachments.forEach(function(value, key, map) {
		if (value.height !== null) {
			Jimp.read(value.attachment)
				.then(image => {
					pixels = image.bitmap.height * image.bitmap.width;
					var i;
					var curX = 0;
					var curY = 0;
					var whites = 0;
					var t = 0;
					var rs = [];
					var gs = [];
					var bs = [];
					var alls = [];
					start = new Date();
					for (i = 0; i < pixels; i++) {
						col = Jimp.intToRGBA(image.getPixelColor(curX, curY));
						rs.push(col.r);
						gs.push(col.g);
						bs.push(col.b);
						alls.push(col);
						if (col.r === 255 && col.g === 255 && col.b === 255) {
							whites++;
						}
						curX++;
						if (curX >= image.bitmap.width) {
							t = curX;
							curY++;
							curX = 0;
						}
					}
					end = new Date();
					common = mode(alls);
					log("----------------------------------------------------------------");
					log("Image sent:\n")
					log(`Average color of all pixels: ${avg(rs)}, ${avg(gs)}, ${avg(bs)}`)
					log(`Mode color of all pixels: ${common.r}, ${common.g}, ${common.b}`)
					log(`${whites} White pixels detected!`);
					log(`Image size: ${image.bitmap.height}x${image.bitmap.width}`)
					log(`Total pixels: ${pixels}`);
					log(`Percentage of pixels white: ${Math.round((whites / pixels) * 100)}%`)
					// Check for 50% or more of white pixels
					if (Math.round((whites / pixels) * 100) >= 50) {
						msg.reply("Please check make sure to check <#730330815405228032>!");
					}
					log(`Time taken to calculate: ${end - start}ms`);
					log("----------------------------------------------------------------")
				});
		}
	});
  }
});

client.login(process.env.TOKEN);
