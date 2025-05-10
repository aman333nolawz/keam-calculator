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
    math: { mark: 0, qs: 0, incorrect: 0, correct: 0, unattended: 0 },
    phy: { mark: 0, qs: 0, incorrect: 0, correct: 0, unattended: 0 },
    chem: { mark: 0, qs: 0, incorrect: 0, correct: 0, unattended: 0 },
  };

  while ((match = regex.exec(data)) !== null) {
    questions.push([match[1], match[2]]);
  }

  for (const [question, myAnswer] of questions) {
    let subject = getSubject(question);
    subjects[subject].qs += 1;

    if (myAnswer === "N") {
      subjects[subject].unattended += 1;
      continue;
    } else if (key[question] === myAnswer) {
      subjects[subject].correct += 1;
      subjects[subject].mark += 4;
    } else {
      subjects[subject].incorrect += 1;
      subjects[subject].mark -= 1;
    }
  }

  let score =
    subjects["math"].mark * (75 / subjects["math"].qs) +
    subjects["phy"].mark * (45 / subjects["phy"].qs) +
    subjects["chem"].mark * (30 / subjects["chem"].qs);

  return [score, subjects];
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
  let [score, subjects] = calculateScore(data, key);
  let normalized = score / 2;

  // Update table with subjects in the following format
  // Subject, Correct, Incorrect, Unattended, Questions Cancelled
  const table_body = document.querySelector("#score table tbody");
  const total_qs = {
    math: 75,
    phy: 45,
    chem: 30,
  };
  const subject_names = {
    math: "Mathematics",
    phy: "Physics",
    chem: "Chemistry",
  };

  let table_body_contents = "";
  for (const subject in subjects) {
    table_body_contents += `<tr>
      <td>${subject_names[subject]}</td>
      <td>${subjects[subject].correct}</td>
      <td>${subjects[subject].incorrect}</td>
      <td>${subjects[subject].unattended}</td>
      <td>${total_qs[subject] - subjects[subject].qs}</td>
      <td>${subjects[subject].mark}</td>
      </tr>`;
  }

  table_body_contents += `<tr id="total">
      <td>Total</td>
      <td>${subjects["math"].correct + subjects["chem"].correct + subjects["phy"].correct}</td>
      <td>${subjects["math"].incorrect + subjects["chem"].incorrect + subjects["phy"].incorrect}</td>
      <td>${subjects["math"].unattended + subjects["chem"].unattended + subjects["phy"].unattended}</td>
      <td>${150 - (subjects["math"].qs + subjects["chem"].qs + subjects["phy"].qs)}</td>
      <td>${subjects["math"].mark + subjects["chem"].mark + subjects["phy"].mark}</td>
      </tr>`;

  table_body.innerHTML = table_body_contents;

  const p = document.querySelector("#score p");
  p.innerHTML = `You got <strong>${score.toFixed(2)} marks out of 600</strong> <br /> i.e, <strong>${normalized.toFixed(2)} out of 300</strong>`;
});
