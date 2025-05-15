const aphorisms = [
  {
    text: "Less is more.",
    author: "Ludwig Mies van der Rohe"
  },
  {
    text: "Measure what is measurable, and make measurable what is not so.",
    author: "Galileo Galilei"
  },
  {
    text: "It is harder to crack a prejudice than an atom.",
    author: "Albert Einstein"
  },
  {
    text: "If I have seen further, it is by standing on the shoulders of giants.",
    author: "Isaac Newton"
  },
  {
    text: "Imagination is everything. It is the preview of life's coming attractions.",
    author: "Albert Einstein"
  },
  {
    text: "The heart has its reasons which reason knows not.",
    author: "Blaise Pascal"
  },
  {
    text: "Most people overestimate what they can do in one year and underestimate what they can do in ten years.",
    author: "Bill Gates"
  },
  {
    text: "Your time is limited, so don’t waste it living someone else’s life.",
    author: "Steve Jobs"
  },
  {
    text: "Logic will get you from A to B. Imagination will take you everywhere.",
    author: "Albert Einstein"
  }
];


const rnd = Math.floor(Math.random() * aphorisms.length);
const elAp = document.getElementById("aphorism");
elAp.innerText = `"${aphorisms[rnd].text}"
                   ${aphorisms[rnd].author}`;

