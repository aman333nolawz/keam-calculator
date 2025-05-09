function getSubject(qno) {
  if (qno <= 75) {
    return "math";
  } else if (qno <= 120) {
    return "phy";
  } else {
    return "chem";
  }
}

function calculateScore(data, key) {
  const regex = /(\b\d+)\s+([ABCDEEN])/g;
  let match;
  const questions = [];
  let subjects = {
    math: { mark: 0, qs: 0 },
    phy: { mark: 0, qs: 0 },
    chem: { mark: 0, qs: 0 },
  };

  while ((match = regex.exec(data)) !== null) {
    questions.push([match[1], match[2]]);
  }

  let i = 0;
  for (const [question, myAnswer] of questions) {
    i += 1;
    let subject = getSubject(question);
    subjects[subject].qs += 1;

    if (myAnswer === "N") {
      continue;
    } else if (key[question] === myAnswer) {
      subjects[subject].mark += 4;
    } else {
      subjects[subject].mark -= 1;
    }
  }

  let score =
    subjects["math"].mark * (75 / subjects["math"].qs) +
    subjects["phy"].mark * (45 / subjects["phy"].qs) +
    subjects["chem"].mark * (30 / subjects["chem"].qs);

  return score;
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
  let score = calculateScore(data, key);
  let normalized = score / 2;

  document.querySelector("#score").innerHTML =
    `You got ${score.toFixed(2)} marks out of 600<br />Your normalized score: ${normalized.toFixed(2)}/300`;
});
