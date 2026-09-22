export interface WordHintData {
  word: string;
  clue: string;
  emoji1: string;
  emoji2: string;
  letter: string;
  pos: number;
}

export const DICTIONARY: Record<string, WordHintData> = {
  CRUMB: { word: "CRUMB", clue: "A small piece of a baked good", emoji1: "🍪", emoji2: "💥", letter: "C", pos: 0 },
  BAKER: { word: "BAKER", clue: "Person who makes delicious bread and pastries", emoji1: "👩‍🍳", emoji2: "🥖", letter: "B", pos: 0 },
  DOUGH: { word: "DOUGH", clue: "Raw mixture used for baking bread or cookies", emoji1: "🥯", emoji2: "🫓", letter: "D", pos: 0 },
  SUGAR: { word: "SUGAR", clue: "Sweet crystalline substance used in baking", emoji1: "🍬", emoji2: "🧂", letter: "S", pos: 0 },
  TOAST: { word: "TOAST", clue: "Golden crispy heated slice of bread", emoji1: "🍞", emoji2: "🔥", letter: "T", pos: 0 },
  FLOUR: { word: "FLOUR", clue: "Powdered grain essential for baking", emoji1: "🌾", emoji2: "🥣", letter: "F", pos: 0 },
  SWEET: { word: "SWEET", clue: "Pleasant sugary taste, opposite of salty", emoji1: "🍭", emoji2: "🍩", letter: "S", pos: 0 },
  CHOMP: { word: "CHOMP", clue: "To take a vigorous bite", emoji1: "🦷", emoji2: "🍪", letter: "C", pos: 0 },
  OVEN:   { word: "OVEN",  clue: "Kitchen appliance used for baking", emoji1: "🍳", emoji2: "🔥", letter: "O", pos: 0 },
  TREAT: { word: "TREAT", clue: "A delightful snack or gift", emoji1: "🎁", emoji2: "🍰", letter: "T", pos: 0 },
  SNACK: { word: "SNACK", clue: "A small light meal taken between regular meals", emoji1: "🥨", emoji2: "🍿", letter: "S", pos: 0 },
  CHIPS: { word: "CHIPS", clue: "Small morsels of chocolate in a cookie", emoji1: "🍫", emoji2: "🍪", letter: "C", pos: 0 },
  COCOA: { word: "COCOA", clue: "Powder derived from cacao beans", emoji1: "☕", emoji2: "🍫", letter: "C", pos: 0 },
  HONEY: { word: "HONEY", clue: "Sweet golden liquid produced by bees", emoji1: "🍯", emoji2: "🐝", letter: "H", pos: 0 },
  CREAM: { word: "CREAM", clue: "Rich fatty part of milk", emoji1: "🥛", emoji2: "🍦", letter: "C", pos: 0 },
  FROST: { word: "FROST", clue: "Sweet topping on cupcakes or cakes", emoji1: "🧁", emoji2: "❄️", letter: "F", pos: 0 },
  PIZZA: { word: "PIZZA", clue: "Savory baked dish with cheese and toppings", emoji1: "🍕", emoji2: "🧀", letter: "P", pos: 0 },
  APPLE: { word: "APPLE", clue: "Popular round fruit often baked in pies", emoji1: "🍎", emoji2: "🥧", letter: "A", pos: 0 },
  BERRY: { word: "BERRY", clue: "Small juicy fruit often added to baked goods", emoji1: "🍓", emoji2: "🫐", letter: "B", pos: 0 },
  LEMON: { word: "LEMON", clue: "Tart yellow citrus fruit", emoji1: "🍋", emoji2: "🧃", letter: "L", pos: 0 },
  PEACH: { word: "PEACH", clue: "Sweet fuzzy stone fruit", emoji1: "🍑", emoji2: "🌳", letter: "P", pos: 0 },
  MANGO: { word: "MANGO", clue: "Tropical juicy orange fruit", emoji1: "🥭", emoji2: "🌴", letter: "M", pos: 0 },
  GRAPE: { word: "GRAPE", clue: "Small round fruit grown on vines", emoji1: "🍇", emoji2: "🍷", letter: "G", pos: 0 },
  MELON: { word: "MELON", clue: "Large sweet gourd fruit", emoji1: "🍈", emoji2: "🍉", letter: "M", pos: 0 },
  CANDY: { word: "CANDY", clue: "Confectionery sweet treat", emoji1: "🍬", emoji2: "🍭", letter: "C", pos: 0 },
  JUICE: { word: "JUICE", clue: "Liquid extracted from fruits", emoji1: "🧃", emoji2: "🍊", letter: "J", pos: 0 },
  WATER: { word: "WATER", clue: "Essential liquid for all doughs", emoji1: "💧", emoji2: "🚰", letter: "W", pos: 0 },
  DRINK: { word: "DRINK", clue: "Liquid consumed for refreshment", emoji1: "🥤", emoji2: "🥛", letter: "D", pos: 0 },
  SMART: { word: "SMART", clue: "Having high intelligence or cleverness", emoji1: "🧠", emoji2: "💡", letter: "S", pos: 0 },
  HAPPY: { word: "HAPPY", clue: "Feeling joy or pleasure", emoji1: "😊", emoji2: "🎉", letter: "H", pos: 0 },
  SMILE: { word: "SMILE", clue: "Facial expression showing delight", emoji1: "😃", emoji2: "✨", letter: "S", pos: 0 },
  LAUGH: { word: "LAUGH", clue: "Expression of amusement and humor", emoji1: "😄", emoji2: "😂", letter: "L", pos: 0 },
  SHINE: { word: "SHINE", clue: "To emit or reflect bright light", emoji1: "✨", emoji2: "☀️", letter: "S", pos: 0 },
  LIGHT: { word: "LIGHT", clue: "Illumination that allows vision", emoji1: "💡", emoji2: "🌟", letter: "L", pos: 0 },
  STORY: { word: "STORY", clue: "Account of events told for entertainment", emoji1: "📖", emoji2: "📜", letter: "S", pos: 0 },
  MUSIC: { word: "MUSIC", clue: "Vocal or instrumental sound harmonies", emoji1: "🎵", emoji2: "🎧", letter: "M", pos: 0 },
  DANCE: { word: "DANCE", clue: "Rhythmic movement to rhythm", emoji1: "💃", emoji2: "🕺", letter: "D", pos: 0 },
  PARTY: { word: "PARTY", clue: "Gathering of people to celebrate", emoji1: "🥳", emoji2: "🎈", letter: "P", pos: 0 },
  MAGIC: { word: "MAGIC", clue: "Power of producing mysterious phenomena", emoji1: "🪄", emoji2: "✨", letter: "M", pos: 0 },
  DREAM: { word: "DREAM", clue: "Thoughts and images during sleep", emoji1: "💭", emoji2: "🌙", letter: "D", pos: 0 },
  SPACE: { word: "SPACE", clue: "The vast universe beyond Earth", emoji1: "🚀", emoji2: "🌌", letter: "S", pos: 0 },
  EARTH: { word: "EARTH", clue: "Our home planet", emoji1: "🌍", emoji2: "🌱", letter: "E", pos: 0 },
  OCEAN: { word: "OCEAN", clue: "Vast body of salt water", emoji1: "🌊", emoji2: "🐋", letter: "O", pos: 0 },
  BEACH: { word: "BEACH", clue: "Sandy shore beside the sea", emoji1: "🏖️", emoji2: "🏖️", letter: "B", pos: 0 },
  CLOUD: { word: "CLOUD", clue: "Fluffy white vapor mass in the sky", emoji1: "☁️", emoji2: "🌧️", letter: "C", pos: 0 },
  STORM: { word: "STORM", clue: "Violent weather with wind and rain", emoji1: "⛈️", emoji2: "⚡", letter: "S", pos: 0 },
  SHARK: { word: "SHARK", clue: "Ocean predator fish", emoji1: "🦈", emoji2: "🌊", letter: "S", pos: 0 },
  TIGER: { word: "TIGER", clue: "Large striped wild cat", emoji1: "🐅", emoji2: "🐾", letter: "T", pos: 0 },
  PANDA: { word: "PANDA", clue: "Black and white bamboo-eating bear", emoji1: "🐼", emoji2: "🎋", letter: "P", pos: 0 },
  KOALA: { word: "KOALA", clue: "Tree-dwelling Australian marsupial", emoji1: "🐨", emoji2: "🌿", letter: "K", pos: 0 },
  EAGLE: { word: "EAGLE", clue: "Majestic bird of prey", emoji1: "🦅", emoji2: "🪶", letter: "E", pos: 0 },
  ROBOT: { word: "ROBOT", clue: "Automated mechanical machine", emoji1: "🤖", emoji2: "⚙️", letter: "R", pos: 0 },
  CROWN: { word: "CROWN", clue: "Royal headpiece worn by monarchs", emoji1: "👑", emoji2: "💎", letter: "C", pos: 0 },
  COIN:   { word: "COIN",  clue: "Flat round piece of metal money", emoji1: "🪙", emoji2: "💰", letter: "C", pos: 0 },
  CHAIN: { word: "CHAIN", clue: "Connected series of links or blocks", emoji1: "🔗", emoji2: "⛓️", letter: "C", pos: 0 },
  BLOCK: { word: "BLOCK", clue: "Solid piece or unit of data on a ledger", emoji1: "🧊", emoji2: "📦", letter: "B", pos: 0 },
  TOKEN: { word: "TOKEN", clue: "Digital asset on a blockchain", emoji1: "🪙", emoji2: "🔑", letter: "T", pos: 0 },
  AFFIX: { word: "AFFIX", clue: "To attach one thing firmly to another", emoji1: "🧷", emoji2: "🧩", letter: "A", pos: 0 },
  FJORD: { word: "FJORD", clue: "A narrow sea inlet between steep cliffs", emoji1: "🏔️", emoji2: "🌊", letter: "F", pos: 0 },
  GLYPH: { word: "GLYPH", clue: "A symbolic mark or carved character", emoji1: "𓂀", emoji2: "🪨", letter: "G", pos: 0 },
  JOUST: { word: "JOUST", clue: "To compete or argue in a spirited contest", emoji1: "🏇", emoji2: "🛡️", letter: "J", pos: 0 },
  KUDZU: { word: "KUDZU", clue: "A fast-growing climbing vine from eastern Asia", emoji1: "🌿", emoji2: "🌀", letter: "K", pos: 0 },
  NYMPH: { word: "NYMPH", clue: "A mythological nature spirit", emoji1: "🧚", emoji2: "🌲", letter: "N", pos: 0 },
  QUERN: { word: "QUERN", clue: "A hand mill used for grinding grain", emoji1: "⚙️", emoji2: "🌾", letter: "Q", pos: 0 },
  VIXEN: { word: "VIXEN", clue: "A female fox, or a sharp-tempered woman", emoji1: "🦊", emoji2: "🌙", letter: "V", pos: 0 },
  WALTZ: { word: "WALTZ", clue: "A graceful dance in triple time", emoji1: "💃", emoji2: "🎼", letter: "W", pos: 0 },
  ZESTY: { word: "ZESTY", clue: "Lively, energetic, or pleasantly tangy", emoji1: "🍋", emoji2: "⚡", letter: "Z", pos: 0 },
  OXIDE: { word: "OXIDE", clue: "A compound formed when oxygen joins another element", emoji1: "⚗️", emoji2: "🧪", letter: "O", pos: 0 },
  VERVE: { word: "VERVE", clue: "Enthusiasm and lively energy", emoji1: "🎭", emoji2: "✨", letter: "V", pos: 0 },
};

export const WORD_LIST = Object.keys(DICTIONARY);

export function getHintForWord(word: string): WordHintData {
  const upper = word.toUpperCase();
  if (DICTIONARY[upper]) {
    return DICTIONARY[upper];
  }
  return {
    word: upper,
    clue: `A word starting with '${upper[0]}'`,
    emoji1: "🍪",
    emoji2: "✨",
    letter: upper[0],
    pos: 0,
  };
}
