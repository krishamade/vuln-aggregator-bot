let Parser = require('rss-parser');
const axios = require('axios')
var moment = require('moment-timezone');

let parser = new Parser();

const slackWebhookUrl = '{INSERT WEBHOOK URL HERE}'
const hamtechWebhookUrl = '{INSERT WEBHOOK URL HERE}'
const serviceDeskWebhookUrl = '{INSERT WEBHOOK URL HERE}'

// Needed for timezone specific functionality
var now = moment().tz('America/Detroit').format('LLLL');

// Sets last checked time to now
var lastChecked = now

var newCve = {
  "id": "",
  "url": "",
  "date": "",
  "title": "",
}

const sysadminRedditSearch = async () => {
  let feed = await parser.parseURL('https://www.reddit.com/r/sysadmin/search.rss?q=cve&sort=new&restrict_sr=1&t=hour');
  feed.items.forEach(item => {
    if (item.id !== newCve.id) {
      newCve.id = item.id
      newCve.url = item.link
      newCve.title = item.title
      newCve.date = item.pubDate //moment(newCve).format('MM-DD-YYYY-HH:MM');
      console.log(item)
      axios.post(serviceDeskWebhookUrl, {
          content: `${'New CVE found! \n' + newCve.title + '\n' + newCve.url + '\n' + moment(newCve.date).format('LLLL')}`
        })
        .then(res => {
          console.log(`statusCode: ${res.status}`)
          console.log(res)
        })
        .catch(error => {
          console.error(error)
        })
    }
  })
  
}



sysadminRedditSearch()

setInterval(sysadminRedditSearch, 3600000)