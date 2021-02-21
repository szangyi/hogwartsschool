"use strict";

window.addEventListener("DOMContentLoaded", start);

const allStudents = [];

const Student = {
  firstName: "",
  lastName: "",
  middleName: "",
  nickname: "",
  imageFilename: "",
  house: "",
};

function start() {
  console.log("ready");
  loadJSON();
}

function loadJSON() {
  fetch("https://petlatkea.dk/2021/hogwarts/students.json")
    .then((response) => response.json())
    .then((jsonData) => {
      prepareObjects(jsonData);
    });
}

function prepareObjects(jsonData) {
  jsonData.forEach((student) => {
    // we use "Student" prototype to create "newStudent"
    const newStudent = Object.create(Student);

    const fullNameTrim = student.fullname.trim();
    const firstSpace = fullNameTrim.indexOf(" ");
    const lastSpace = fullNameTrim.lastIndexOf(" ");

    //FIRST NAME
    let firstName = fullNameTrim.substring(0, firstSpace);
    let firstNameTrim = firstName.trim();
    let firstNameFinal =
      firstNameTrim.charAt(0).toUpperCase() +
      firstNameTrim.substring(1).toLowerCase();

    //MIDDLE NAME
    let middleName = fullNameTrim.substring(firstSpace + 1, lastSpace);
    let middleNameTrim = middleName.trim();
    let middleNameFinal =
      middleNameTrim.charAt(0).toUpperCase() +
      middleNameTrim.substring(1).toLowerCase();

    //LAST NAME
    let lastName = fullNameTrim.substring(lastSpace);
    let lastNameTrim = lastName.trim();
    let lastNameFinal =
      lastNameTrim.charAt(0).toUpperCase() +
      lastNameTrim.substring(1).toLowerCase();

    //FULLNAME
    function showFullname(firstName, middleName, lastName) {
      // console.log("naaaaa")
      if (middleName) {
        const fullNameFinal = `${firstNameFinal} ${middleNameFinal} ${lastNameFinal}`;
        console.log(fullNameFinal);
      } else {
        const fullNameFinal = `${firstNameFinal} ${lastNameFinal}`;
        console.log(fullNameFinal);
      }
    }

    showFullname();

    newStudent.firstName = firstNameFinal;
    newStudent.middleName = middleNameFinal;
    newStudent.lastName = lastNameFinal;
    // newStudent.nickName = nickNameFinal

    //newStudent.imageFilename = ;
    newStudent.house = student.house;

    allStudents.push(newStudent);

    const split = new Set([firstNameFinal, middleNameFinal, lastNameFinal]);
    let nameSplit = Array.from(split);
  });

  displayList();
}

function displayList() {
  // clear the list
  document.querySelector("#list tbody").innerHTML = "";

  // build a new list
  allStudents.forEach(displayStudent);
}

function displayStudent(newStudent) {
  // create clone
  const clone = document
    .querySelector("template#student")
    .content.cloneNode(true);

  // set clone data
  // clone.querySelector("[data-field=fullName]").textContent = newStudent.fullName;
  clone.querySelector("[data-field=firstName]").textContent =
    newStudent.firstName;

  if (newStudent.middleName.includes('"')) {
    // let nickNameFinal = middleNameFinal
    // console.log(nickNameFinal)
    clone.querySelector("[data-field=nickName]").textContent =
      newStudent.middleName;
    clone.querySelector("[data-field=middleName]").textContent = " ";
  } else {
    clone.querySelector("[data-field=middleName]").textContent =
      newStudent.middleName;
    clone.querySelector("[data-field=nickName]").textContent = " ";
  }

  clone.querySelector("[data-field=lastName]").textContent =
    newStudent.lastName;
  // clone.querySelector("[data-field=nickname]").textContent = newStudent.nickName;
  //clone.querySelector("[data-field=imageFilename]").textContent = newStudent.; //imageFilename
  // clone.querySelector("[data-field=house]").textContent = newStudent.house;

  // append clone to list
  document.querySelector("#list tbody").appendChild(clone);
}
