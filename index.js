// Things this needs: 
// get items inside of trade menu and put them on screen
// working config

register("command", (price, margin) =>{
    price = unshortenNumber(price)
    let finalPrice = (price - (price * (margin/100)))
    ChatLib.chat(`${finalPrice}`)
}).setName('calcmargin')

register("command", (margin) => {
    //TODO: figure out how config files work so that i can save margin
}).setName('setmargin')

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

