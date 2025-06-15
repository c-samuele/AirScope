const aphorisms = [
  {
    text: "Less is more.",
    author: "Ludwig Mies van der Rohe"
  },
  {
    text: "The question is, can we change our course in time?",
    author: "Leonardo Wilhelm DiCaprio"
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
    text: "The value of an idea lies in its usage.",
    author: "Thomas Edison"
  },
  {
    text: "The best time of the day is now.",
    author: "Pierre Bonnard"
  },
  {
    text: "Imagination is everything. It is the preview of life's coming attractions.",
    author: "Albert Einstein"
  },
  {
    text: "Dont' find fault, find a remedy.",
    author: "Henry Ford"
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

