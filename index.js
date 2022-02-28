// Things this needs: 
// get items inside of trade menu and put them on screen
// working config
const itemsInTrade = []
const itemsInTradeLore = []
const tradeMenuSlots = [5, 6, 7, 8, 14, 15, 16, 17, 23, 24, 25, 26, 32, 33, 34, 35]
const chatLine = '&b-----------------------------------------------------'

register("command", () => {
    ChatLib.chat(`
${chatLine}
&6calcmargin &e[price] [margin (optional)]
&fCalculates percentage margins of a given price
&6setmargin &e[margin]
&fSets default margin for calcmargin
&6lbitems
&fPuts names of the last items put in trade menu in chat
&6lbitemlore &e[item number]
&fPuts lore of given item (from lbitems) in chat
${chatLine}`)
}).setName('lbhelp')

register("command", (price, margin) =>{
    if (margin == undefined) {
        margin = FileLib.read('./config/ChatTriggers/modules/lowball-helper/margin.txt')
    }

    price = unshortenNumber(price)
    profit = price * (margin/100)
    let finalPrice = (price - profit)
    
    ChatLib.chat(`&dPercent lowballed: &e${margin}% \n&dFinal price: &a${finalPrice}\n&dProfit: &6${profit}`)
    
}).setName('calcmargin')

register("command", (margin) => {
    if (isNaN(parseFloat(margin))) {
        ChatLib.chat(`'${margin}' is not a valid margin!`)
    }
    else {
        FileLib.write('./config/ChatTriggers/modules/lowball-helper/margin.txt', parseFloat(margin))
        ChatLib.chat(`Margin has been set to ${margin}!`)
    }
}).setName('setdefaultmargin')

register("command", () => {
    for (i = 0; i < itemsInTrade.length; i ++) {
        if (itemsInTrade[i] == null) {
            break
        }
        ChatLib.chat(`${i + 1}: ${itemsInTrade[i]}`)
    }
}).setName('lbitems')

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

register('tick', () => {
    gui = Player.getOpenedInventory()
    guiname = gui.getName()

    if (guiname.includes('You  ')) {
        wipeItems()
        for (i = 0; i < 16; i++) {
            item = gui.getStackInSlot(tradeMenuSlots[i])

            if (item != null) {
                itemsInTrade[i] = item.getName()
                itemsInTradeLore[i] = item.getLore()
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