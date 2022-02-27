// Things this needs: 
// get items inside of trade menu and put them on screen
// working config
const itemsInTrade = []
const itemsInTradeLore = []
const tradeMenuSlots = [5, 6, 7, 8, 14, 15, 16, 17, 23, 24, 25, 26, 32, 33, 34, 35]

register("command", (price, margin) =>{
    if (margin == undefined) {
        margin = FileLib.read('./config/ChatTriggers/modules/lowball-helper/margin.txt')
    }

    price = unshortenNumber(price)
    let finalPrice = (price - (price * (margin/100)))
    
    ChatLib.chat(`&dPercent lowballed: &e${margin}% \n&dFinal price: &a${finalPrice}`)
    
}).setName('calcmargin')

register("command", (margin) => {
    //TODO: figure out how config files work so that i can save margin
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
        space = '&b-----------------------------------------------------'
        ChatLib.chat(space)
        for (i = 0; i < lore.length; i++) {
            ChatLib.chat(`${lore[i]}`)
        }
        ChatLib.chat(space)
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

}

function wipeItems() { 
    for (i = 0; i < itemsInTrade.length; i++) {
        itemsInTrade[i] = null
        itemsInTradeLore[i] = null
    }
}