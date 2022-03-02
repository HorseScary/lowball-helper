// Things this needs: 
// get items inside of trade menu and put them on screen
// working config
const players = []
const lastTraded = null
const tradeMenuSlots = [5, 6, 7, 8, 14, 15, 16, 17, 23, 24, 25, 26, 32, 33, 34, 35] //im too lazy to actualy do the math on this
const chatLine = '&b-----------------------------------------------------'

//TODO: add /lbtrades command which would list players traded with 
//TODO: adapt /lbitems to save trades from multiple players

//commands
register("command", () => {
    ChatLib.chat(`
${chatLine}
&6lbcalcmargin &e[price] [margin (optional)]
&fCalculates percentage margins of a given price
&6lbsetdefaultmargin &e[margin]
&fSets default margin for calcmargin
&6lbitems
&fPuts names of the last items put in trade menu in chat
&6lbitemlore &e[item number]
&fPuts lore of given item (from lbitems) in chat
&6lbplayers
&fPuts the names of the players that you have traded with in chat
${chatLine}`)
}).setName('lbhelp')

//puts the percentage of a given price in chat
register("command", (price, margin) =>{
    if (margin == undefined) {
        margin = FileLib.read('./config/ChatTriggers/modules/lowball-helper/margin.txt')
    }

    price = unshortenNumber(price)
    profit = price * (margin/100)
    let finalPrice = (price - profit)
    
    ChatLib.chat(`${chatLine}\n&dPercent lowballed: &e${margin}% \n&dFinal price: &a${reshortenNumber(finalPrice)}\n&dProfit: &6${reshortenNumber(profit)}\n${chatLine}`)
    
}).setName('lbcalcmargin')

//sets default margin to be used by 
register("command", (margin) => {
    if (isNaN(parseFloat(margin))) {
        ChatLib.chat(`'${margin}' is not a valid margin!`)
    }
    else {
        FileLib.write('./config/ChatTriggers/modules/lowball-helper/margin.txt', parseFloat(margin))
        ChatLib.chat(`Margin has been set to ${margin}!`)
    }
}).setName('lbsetdefaultmargin')

//lists items put in last trade
register("command", (player) => {
    if (lastTraded == null) {
        ChatLib.chat('&cYou have not traded with anyone!')
    }
    else if (!players.includes(player)) {
        ChatLib.charAt('&cYou have not traded with this player!')
    }

    if (player == undefined) {
        player = lastTraded
    }

    items = eval(`${player}Items]`)
    for (i = 0; i < itemsInTrade.length; i ++) {
        if (items[i] == null) {
            break
        }
        ChatLib.chat(`${i + 1}: ${itemsInTrade[i]}`)
    }
}).setName('lbitems')

//TODO: make this take player name
//puts lore of item of given index (int) in chat 
register("command", (index) => {
    lore = itemsInTradeLore[parseInt(index - 1)]

    if (index == undefined || lore == undefined) {
        ChatLib.chat("&cPlease enter a valid number!")
    } 
    else {
        ChatLib.chat(space)
        for (i = 0; i < lore.length; i++) {
            ChatLib.chat(`${lore[i]}`)
        }
        ChatLib.chat(chatLine)
    }
}).setName('lbitemlore')

//lists players traded with in chat
register("command", () =>{
    if (lastTraded == null) {
        ChatLib.chat('&cYou have not traded with anyone!')
    }
    else {
        for (i = 0; i < players.length; i++) {
            ChatLib.chat(`${i}: ${players[i]}`)
        }
    }
}).setName('lbplayers')

//other things

register('tick', () => {
    gui = Player.getOpenedInventory()
    guiname = gui.getName()

    if (guiname.includes('You  ')) {
        wipeItems()
        
        playerName = guiname.slice(5)
        lastTraded = playerName
        if (!players.includes(playerName)) {
            players[players.length] = playerName
            eval(`
                const ${playerName}Items = []; 
                const ${playerName}Lore = [];`
            )
        }

        for (i = 0; i < 16; i++) {
            item = gui.getStackInSlot(tradeMenuSlots[i])

            if (item != null) {
                eval(`${playerName}Items[${i}] = ${item.getName()}`) 
                eval(`${playerName}Lore[${i}] = ${item.getLore()}`)
            }
        }
    }
});

function unshortenNumber(number) {
    multiplier = number.charAt(number.length - 1)
    number = parseFloat(number)

    if (multiplier == 'k') {
        return(number*1000)
    }
    else if (multiplier == 'm') {
        return(number*1000000)
    }
    else if (multiplier == 'b') {
        return(number*1000000000)
    }
    else {
        return(number)
    }
}

function reshortenNumber(number) {
    if (number >= 1000000000) {
        return(`${number/1000000000}b`)
    }
    else if (number >= 1000000) {
        return(`${number/1000000}m`)
    }
    else if (number >= 1000) {
        return(`${number/1000}k`)
    }
    else {
        return(number)
    }
}

function wipeItems() { 
    for (i = 0; i < itemsInTrade.length; i++) {
        itemsInTrade[i] = null
        itemsInTradeLore[i] = null
    }
}