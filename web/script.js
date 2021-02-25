"use strict";

window.addEventListener("DOMContentLoaded", start);

const Student = {
  firstName: "",
  lastName: "",
  middleName: "",
  nickname: "",
  imageFilename: "",
  house: "",
};

const allStudents = [];

//set global variables for sort and filter
let indexhyphen = 0;
let firstLetterAfterHyphen = "";
let smallLettersAfterHyphen = "";
const search = document.querySelector(".search");
search.addEventListener("input", searchStudent);

const modal = document.querySelector(".modal");

const settings = {
  filterBy: "all",
  sortBy: "firstname",
  sortDir: "asc",
};

function start() {
  // console.log("ready");
  // TODO: Add event-listeners to filter and sort buttons
  registerButtons();
  loadJSON();
}

function searchStudent(event) {
  let searchList = allStudents.filter((student) => {
    let searchName = "";
    if (student.lastName === null) {
      searchName = student.firstName;
    } else {
      searchName = student.firstName + " " + student.lastName;
    }
    return searchName.toLowerCase().includes(event.target.value);
  });

  displayList(searchList);
}

function registerButtons() {
  document
    .querySelectorAll("[data-action='filter']")
    .forEach((button) => button.addEventListener("click", selectFilter));

  document.querySelectorAll("[data-action='sort']").forEach((button) => button.addEventListener("click", selectSort));
}

function loadJSON() {
  fetch("https://petlatkea.dk/2021/hogwarts/students.json")
    .then((response) => response.json())
    .then((jsonData) => {
      prepareObjects(jsonData);
    });
}

function prepareObjects(jsonData) {
  // console.log("jsonprepareloads");
  jsonData.forEach((jsonObject) => {
    // create a new object with clean data
    const student = Object.create(Student);

    const fullNameTrim = jsonObject.fullname.trim();
    const firstSpace = fullNameTrim.indexOf(" ");
    const lastSpace = fullNameTrim.lastIndexOf(" ");

    //FIRST NAME
    let firstName = fullNameTrim.substring(0, firstSpace);
    let firstNameTrim = firstName.trim();
    let firstNameFinal = firstNameTrim.charAt(0).toUpperCase() + firstNameTrim.substring(1).toLowerCase();

    //MIDDLE NAME
    let middleName = fullNameTrim.substring(firstSpace + 1, lastSpace);
    let middleNameTrim = middleName.trim();
    let middleNameFinal = middleNameTrim.charAt(0).toUpperCase() + middleNameTrim.substring(1).toLowerCase();

    //LAST NAME
    let lastName = fullNameTrim.substring(lastSpace);
    let lastNameTrim = lastName.trim();
    let lastNameFinal = lastNameTrim.charAt(0).toUpperCase() + lastNameTrim.substring(1).toLowerCase();

    //HOUSE
    const house = jsonObject.house.trim();
    const houseFinal = house[0].toUpperCase() + house.substring(1).toLowerCase();

    const fullNameFinal = `${firstNameFinal} ${middleNameFinal} ${lastNameFinal}`;

    // showFullname();

    student.firstName = firstNameFinal;
    student.middleName = middleNameFinal;
    student.lastName = lastNameFinal;
    student.fullName = fullNameFinal;
    // student.gender = jsonObject.gender
    // newStudent.nickName = nickNameFinal

    //newStudent.imageFilename = ;
    student.house = houseFinal;

    //store new object with cleaned data
    allStudents.push(student);
  });
  console.log(allStudents);
  displayList(allStudents);
  // buildList();
}

//----------------filtering
function selectFilter(event) {
  const filter = event.target.dataset.filter;
  // console.log(`User selected ${filter}`);
  setFilter(filter);
}

function setFilter(filter) {
  settings.filterBy = filter;
  buildList();
}

function filterList(filteredList) {
  // let filteredList = allAnimals;

  if (settings.filterBy === "griff") {
    filteredList = allStudents.filter(isGriff);
  } else if (settings.filterBy === "huff") {
    filteredList = allStudents.filter(isHuff);
  } else if (settings.filterBy === "rav") {
    filteredList = allStudents.filter(isRav);
  } else if (settings.filterBy === "sly") {
    filteredList = allStudents.filter(isSly);
  }
  return filteredList;
  // displayList(filteredList);
}

function isGriff(student) {
  // console.log("griffruns");
  if (student.house === "Gryffindor") {
    return true;
  } else {
    return false;
  }
}

function isHuff(student) {
  // console.log("griffruns");
  if (student.house === "Hufflepuff") {
    return true;
  } else {
    return false;
  }
}

function isRav(student) {
  // console.log("griffruns");
  if (student.house === "Ravenclaw") {
    return true;
  } else {
    return false;
  }
}

function isSly(student) {
  // console.log("griffruns");
  if (student.house === "Slytherin") {
    return true;
  } else {
    return false;
  }
}

//----------sorting
//generic sort function

function selectSort(event) {
  // console.log("selectsort");
  const sortBy = event.target.dataset.sort;
  const sortDir = event.target.dataset.sortDirection;

  //find "old" sortby element and remove .sortBy
  const oldElement = document.querySelector(`[data-sort='${settings.sortBy}']`);
  if (oldElement) {
    oldElement.classList.remove("sortby");
  } else {
  }

  // console.log(oldElement);

  // indicate active sort
  event.target.classList.add("sortby");

  //toggle direction
  if (sortDir === "asc") {
    event.target.dataset.sortDirection = "desc";
  } else {
    event.target.dataset.sortDirection = "asc";
  }

  console.log(`User selected ${sortBy} - ${sortDir}`);
  setSort(sortBy, sortDir);
}

function setSort(sortBy, sortDir) {
  settings.sortBy = sortBy;
  settings.sortDir = sortDir;
  buildList();
}

function sortList(sortedList) {
  let direction = 1;
  if (settings.sortDir === "desc") {
    direction = -1;
  } else {
    settings.direction = 1;
  }

  sortedList = sortedList.sort(sortByProperty);

  function sortByProperty(nameA, nameB) {
    // console.log(`sortBy is ${settings.sortBy}`);
    if (nameA[settings.sortBy] < nameB[settings.sortBy]) {
      // console.log(nameA);
      return -1 * direction;
    } else {
      return 1 * direction;
    }
  }

  return sortedList;
  // console.log(sortedList);
}

//---------display
function buildList() {
  const currentList = filterList(allStudents);
  const sortedList = sortList(currentList);

  displayList(sortedList);
}

function displayList(allStudents) {
  // clear the list
  document.querySelector("#list tbody").innerHTML = "";

  // build a new list
  allStudents.forEach(displayStudent);
}

function displayStudent(student) {
  // create clone
  const clone = document.querySelector("template#student").content.cloneNode(true);

  // set clone data
  clone.querySelector("[data-field=firstName]").textContent = student.firstName;

  if (student.middleName.includes('"')) {
    clone.querySelector("[data-field=nickName]").textContent = student.middleName;
    clone.querySelector("[data-field=middleName]").textContent = " ";
  } else {
    clone.querySelector("[data-field=middleName]").textContent = student.middleName;
    clone.querySelector("[data-field=nickName]").textContent = " ";
  }

  clone.querySelector("[data-field=lastName]").textContent = student.lastName;

  if (student.firstName == "Padma" || student.firstName == "Parvati") {
    clone.querySelector("[data-field=avatar]").children[0].src =
      "images/" + student.lastName.toLowerCase() + "_" + student.firstName.substring(0).toLowerCase() + ".png";
  } else {
    clone.querySelector("[data-field=avatar]").children[0].src =
      "images/" + student.lastName.toLowerCase() + "_" + student.firstName.substring(0, 1).toLowerCase() + ".png";
  }

  clone.querySelector("[data-field=house]").textContent = student.house;

  clone.querySelector(".avatar").addEventListener("click", () => showDetails(student));

  // append clone to list
  document.querySelector("#list tbody").appendChild(clone);
}

function showDetails(student) {
  console.log("singleStudentDataShows");
  modal.classList.remove("hide");

  modal.querySelector("[data-field=fullName]").textContent = student.fullName;
  modal.querySelector("[data-field=firstName]").textContent = `First name: ${student.firstName}`;
  modal.querySelector("[data-field=lastName]").textContent = `Last name: ${student.lastName}`;
  modal.querySelector("[data-field=house]").textContent = `House: ${student.house}`;
  modal.querySelector("[data-field=blood]").textContent = `Blood: ${student.blood}`;

  if (student.middleName.includes('"')) {
    modal.querySelector("[data-field=nickName]").textContent = `Nick name: ${student.middleName}`;
    modal.querySelector("[data-field=middleName]").textContent = " ";
  } else {
    if (student.middleName) {
      modal.querySelector("[data-field=middleName]").textContent = `Middle name: ${student.middleName}`;
      modal.querySelector("[data-field=nickName]").textContent = " ";
    }
  }

  if (student.firstName == "Padma" || student.firstName == "Parvati") {
    modal.querySelector("[data-field=avatar]").children[0].src =
      "images/" + student.lastName.toLowerCase() + "_" + student.firstName.substring(0).toLowerCase() + ".png";
  } else {
    modal.querySelector("[data-field=avatar]").children[0].src =
      "images/" + student.lastName.toLowerCase() + "_" + student.firstName.substring(0, 1).toLowerCase() + ".png";
  }

  //modal
  modal.querySelector(".modal .closebutton").addEventListener("click", closeModal);

  function closeModal() {
    modal.classList.add("hide");
    modal.classList.remove("griff_house");
    modal.classList.remove("huff_house");
    modal.classList.remove("rav_house");
    modal.classList.remove("sly_house");
  }

  //add house crest
  modal.querySelector("[data-field=crest]").children[0].src = "images/" + student.house + ".png";

  if (student.house === "Gryffindor") {
    modal.classList.add("griff_house");
  } else if (student.house === "Hufflepuff") {
    modal.classList.add("huff_house");
  } else if (student.house === "Slytherin") {
    modal.classList.add("sly_house");
  } else if (student.house === "Ravenclaw") {
    modal.classList.add("rav_house");
  }
}
