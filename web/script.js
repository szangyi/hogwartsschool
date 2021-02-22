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

//set global variables for sort and filter
const settings = {
  filterBy: "all",
  sortBy: "firstname",
  sortDir: "asc",
};

function start() {
  console.log("ready");
  // TODO: Add event-listeners to filter and sort buttons
  registerButtons();

  loadJSON();
}

function registerButtons() {
  document
    .querySelectorAll("[data-action='filter']")
    .forEach((button) => button.addEventListener("click", selectFilter));

  document
    .querySelectorAll("[data-action='sort']")
    .forEach((button) => button.addEventListener("click", selectSort));
}

function loadJSON() {
  fetch("https://petlatkea.dk/2021/hogwarts/students.json")
    .then((response) => response.json())
    .then((jsonData) => {
      prepareObjects(jsonData);
    });
}

function prepareObjects(jsonData) {
  console.log("jsonprepareloads");
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
        // console.log(fullNameFinal);
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

    return split;
  });

  displayList(allStudents);
}

//filter
function selectFilter(event) {
  const filter = event.target.dataset.filter;
  console.log(`User selected ${filter}`);
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

function buildList() {
  console.log("buildlist");
  const currentList = filterList(allStudents);
  const sortedList = sortList(currentList);

  displayList(sortedList);
}

//generic sort function
function selectSort(event) {
  const sortBy = event.target.dataset.sort;
  const sortDir = event.target.dataset.sortDirection;

  //find "old" sortby element and remove .sortBy
  // const oldElement = document.querySelector(`[data-sort='${settings.sortBy}']`);
  // oldElement.classList.remove("sortby");

  //indicate active sort
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
    console.log(`sortBy is ${settings.sortBy}`);
    if (nameA[settings.sortBy] < nameB[settings.sortBy]) {
      return -1 * direction;
    } else {
      return 1 * direction;
    }
  }

  return sortedList;
}

function displayList(students) {
  console.log("newstudentlist");
  // clear the list
  document.querySelector("#list tbody").innerHTML = "";

  // build a new list
  students.forEach(displayStudent);
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
  clone.querySelector("[data-field=house]").textContent = newStudent.house;

  // append clone to list
  document.querySelector("#list tbody").appendChild(clone);
}
