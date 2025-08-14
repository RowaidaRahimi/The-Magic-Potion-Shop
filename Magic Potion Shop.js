
/*
 The Magic Potion Shop - Console Adventure
 By: Your Name
*/

// Start the game timer
const startTime = Date.now();

// Helper function to normalize inputs
function normalize(str) {
    return (str ?? "").toString().trim().toLowerCase();
}

// Check yes/no answer
function isYes(str) {
    return ["y", "yes", "yeah", "ok", "yes", "yes"].includes(normalize(str));
}

// Convert string to number
function toNumber(input, defaultValue = 0) {
    const n = parseInt(input, 10);
    return Number.isFinite(n) ? n : defaultValue;
}

// Short functions to display and ask
function show(message) {
    alert(message);
}
function ask(message) {
    return prompt(message);
}

/*
1) Start the game
*/
const rawName = ask("Welcome to the Magic Potion Shop! What's your name?");
const name = (rawName && rawName.trim()) || "Apprentice";

const rawAge = ask("How old are you?");
const age = toNumber(rawAge, 16);

const rawElement = ask("Choose your favorite element: Fire, Water, Earth, or Air");
let element = normalize(rawElement);
const allowed = ["fire", "water", "earth", "air"];
if (!allowed.includes(element)) element = "air";

const title = age >= 18 ? "Experienced Apprentice" :
              age >= 14 ? "Young Prodigy" : "Novice";

show(`Welcome ${name}! At ${age}, you are a ${title} with the power of ${element}!`);

/*
2) Store Inventory
*/
const potions = ['Healing Potion', 'Mana Elixir', 'Invisibility Draft', 'Fire Resistance'];

const potionStock = {
    'Healing Potion': { quantity: 5, price: 10 },
    'Mana Elixir': { quantity: 3, price: 15 },
    'Invisibility Draft': { quantity: 2, price: 25 },
    'Fire Resistance': { quantity: 4, price: 20 }
};

let gold = 0;
let brewedCount = 0;
let customersServed = 0;
let customersLost = 0;

// Create Potions Menu
function menu() {
    return potions.map(
        (name, i) =>
        `${i + 1}. ${name} — ${potionStock[name].price} gold (Stock: ${potionStock[name].quantity})`
    ).join("\n");
}

// select potion based on user input
function choosePotion(input) {
    if (!input) return null;
    const raw = input.trim();
    const n = parseInt(raw, 10);
    if (Number.isFinite(n) && n >= 1 && n <= potions.length) {
        return potions[n - 1];
    }
    const lower = raw.toLowerCase();
    const found = potions.find(p => p.toLowerCase() === lower);
    return found || null;
}

// Sell Potion
function sell(potionName) {
    if (!(potionName in potionStock)) return false;
    if (potionStock[potionName].quantity > 0) {
        potionStock[potionName].quantity--;
        gold += potionStock[potionName].price;
        return true;
    }
    return false;
}

/*
3) Ordering customers
*/
for (let i = 1; i <= 3; i++) {
    const answer = ask(`A customer enters (#${i}). Take their order? (yes/no)`);
    if (!isYes(answer)) {
        show("The customer left without buying.");
        customersLost++;
        continue;
    }

    const choice = ask("Potion Menu:\n" + menu() + "\nWhich potion do they want?");
    const potion = choosePotion(choice);

    if (potion && sell(potion)) {
        customersServed++;
        show(`Sold 1 ${potion}! Stock left: ${potionStock[potion].quantity}`);
    } else if (potion) {
        show(`${potion} is out of stock!`);
    } else {
        show("Invalid choice. No sale made.");
    }
}

/*
4) Making Potion (Brew)
*/
function brew(potionName, amount) {
    if (!(potionName in potionStock)) return false;
    const num = Math.max(0, toNumber(amount, 0));
    if (num <= 0) return false;
    potionStock[potionName].quantity += num;
    brewedCount += num;
    return true;
}

let brewTimes = toNumber(ask("How many brew sessions? (2 or 3)"), 2);
if (brewTimes < 2 || brewTimes > 3) brewTimes = 2;

for (let i = 1; i <= brewTimes; i++) {
    const choice = ask(`Brew session #${i}:\n` + menu() + "\nWhich potion to brew?");
    const potion = choosePotion(choice);
    if (!potion) {
        show("Invalid choice. Skipped.");
        continue;
    }
    const amountRaw = ask(`How many "${potion}" to brew?`);
    if (!brew(potion, amountRaw)) {
        show("Brewing failed.");
    } else {
        show(`Brewed ${amountRaw} ${potion}(s). Stock: ${potionStock[potion].quantity}`);
    }
}

/*
5) Final Report
*/
let totalLeft = 0;
let stockList = [];

for (const [name, info] of Object.entries(potionStock)) {
    totalLeft += info.quantity;
    stockList.push(`${name}: ${info.quantity} left (Price: ${info.price} gold)`);
}

const totalTime = Math.round((Date.now() - startTime) / 1000);

show(
    "=== End of Day Report ===\n" +
    stockList.join("\n") +
    `\n\nTotal potions left: ${totalLeft}\n` +
    `Gold earned: ${gold}\n` +
    `Customers served: ${customersServed}\n` +
    `Customers lost: ${customersLost}\n` +
    `Game time: ${totalTime} seconds`
);

show(`Great job, ${name}! You brewed ${brewedCount} potions and served ${customersServed} customers today!`);
