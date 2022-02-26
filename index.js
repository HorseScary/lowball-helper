// Things this needs: 
// get items inside of trade menu and put them on screen
// working config

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

register('tick', () => {
    let gui = Player.getOpenedInventory()
    let guiname = gui.getName()

    ChatLib.chat(guiname)
    if (guiname.includes('You  ')) {
        items = gui.getStackInSlot(0)
        if (items != null) {
            ChatLib.chat(`${items.getName()}\n${items.getLore()}`)
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