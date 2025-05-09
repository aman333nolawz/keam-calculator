function calculateScore(data, key) {
  const regex = /(\b\d+)\s+([ABCDEEN])/g;
  let match;
  const questions = [];

  while ((match = regex.exec(data)) !== null) {
    questions.push([match[1], match[2]]);
  }

  let score = 0;
  let i = 0;
  for (const [question, myAnswer] of questions) {
    i += 1;
    if (myAnswer === "N") {
      continue;
    } else if (key[question] === myAnswer) {
      score += 4;
    } else {
      score -= 1;
    }
  }
  return [score, i];
}

keys_option = Object.keys(keys);

for (let i = 0; i < keys_option.length; i++) {
  let option = document.createElement("option");
  option.value = keys_option[i];
  option.text = keys_option[i];
  document.querySelector("#session").add(option);
}

let button = document.querySelector("button");
button.addEventListener("click", () => {
  let data = document.querySelector("textarea").value;
  let key = keys[document.querySelector("#session").value];
  let info = calculateScore(data, key);
  let score = info[0];
  let deleted = 150 - info[1];
  let total_marks = 600 - deleted * 4;
  let normalized = (score / total_marks) * 300;

  document.querySelector("#score").innerHTML =
    `You got ${score} marks out of ${total_marks} (Marks of cancelled questions are avoided)<br />Your normalized score: ${normalized.toFixed(2)}`;
});
