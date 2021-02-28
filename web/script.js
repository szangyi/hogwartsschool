"use strict";

window.addEventListener("DOMContentLoaded", start);

const Student = {
  firstName: "",
  lastName: "",
  middleName: "",
  nickname: "",
  imageFilename: "",
  house: "",
  gender: "",
  prefect: false,
  inqsquad: false,
  expelled: false,
  blood: "",
};

let allStudents = [];
let expelledList = [];

//set global variables for sort and filter
let json;
let blood;
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

  document.querySelector("[data-filter='expelled']").addEventListener("click", showExpelled);

  document.querySelectorAll("[data-action='sort']").forEach((button) => button.addEventListener("click", selectSort));
}

async function loadJSON() {
  const AllStudentsData = await fetch("https://petlatkea.dk/2021/hogwarts/students.json");
  json = await AllStudentsData.json();
  const AllStudentsBloodData = await fetch("https://petlatkea.dk/2021/hogwarts/families.json");
  blood = await AllStudentsBloodData.json();
  prepareObjects(json);
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

    //GENDER
    const gender = jsonObject.gender;

    const fullNameFinal = `${firstNameFinal} ${middleNameFinal} ${lastNameFinal}`;

    student.firstName = firstNameFinal;
    student.middleName = middleNameFinal;
    student.lastName = lastNameFinal;
    student.fullName = fullNameFinal;
    student.prefect = false;
    student.inqsquad = false;
    // student.gender = jsonObject.gender
    // newStudent.nickName = nickNameFinal

    //newStudent.imageFilename = ;
    student.house = houseFinal;
    student.gender = gender;
    student.blood = isBlood(student);

    allStudents.push(student);
  });

  console.table(allStudents);
  displayList(allStudents);
}

function isBlood(student) {
  if (blood.half.indexOf(student.lastName) != -1) {
    return "Half-blood";
  } else if (blood.pure.indexOf(student.lastName) != -1) {
    return "Pure-blood";
  } else {
    return "Muggle";
  }
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
  if (settings.filterBy === "griff") {
    filteredList = allStudents.filter(isGriff);
    document.querySelector("#griff_filter").classList.add("activefilter");
    document.querySelector("#huff_filter").classList.remove("activefilter");
    document.querySelector("#rav_filter").classList.remove("activefilter");
    document.querySelector("#sly_filter").classList.remove("activefilter");
    document.querySelector("#expelled_filter").classList.remove("activefilter");
    document.querySelector("#allhouse_filter").classList.remove("activefilter");
  } else if (settings.filterBy === "huff") {
    document.querySelector("#griff_filter").classList.remove("activefilter");
    document.querySelector("#huff_filter").classList.add("activefilter");
    document.querySelector("#rav_filter").classList.remove("activefilter");
    document.querySelector("#sly_filter").classList.remove("activefilter");
    document.querySelector("#expelled_filter").classList.remove("activefilter");
    document.querySelector("#allhouse_filter").classList.remove("activefilter");
    filteredList = allStudents.filter(isHuff);
  } else if (settings.filterBy === "rav") {
    document.querySelector("#griff_filter").classList.remove("activefilter");
    document.querySelector("#huff_filter").classList.remove("activefilter");
    document.querySelector("#rav_filter").classList.add("activefilter");
    document.querySelector("#sly_filter").classList.remove("activefilter");
    document.querySelector("#expelled_filter").classList.remove("activefilter");
    document.querySelector("#allhouse_filter").classList.remove("activefilter");
    filteredList = allStudents.filter(isRav);
  } else if (settings.filterBy === "sly") {
    document.querySelector("#griff_filter").classList.remove("activefilter");
    document.querySelector("#huff_filter").classList.remove("activefilter");
    document.querySelector("#rav_filter").classList.remove("activefilter");
    document.querySelector("#sly_filter").classList.add("activefilter");
    document.querySelector("#expelled_filter").classList.remove("activefilter");
    document.querySelector("#allhouse_filter").classList.remove("activefilter");
    filteredList = allStudents.filter(isSly);
  }

  document.querySelector("#allhouse_filter").addEventListener("click", selectAllFilter);

  function selectAllFilter() {
    document.querySelector("#griff_filter").classList.remove("activefilter");
    document.querySelector("#huff_filter").classList.remove("activefilter");
    document.querySelector("#rav_filter").classList.remove("activefilter");
    document.querySelector("#sly_filter").classList.remove("activefilter");
    document.querySelector("#expelled_filter").classList.remove("activefilter");
    document.querySelector("#allhouse_filter").classList.add("activefilter");
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

  event.target.classList.add("sortby");

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

  //show numbers
  // document.querySelector(".total-number-of-students").textContent = `${allStudents.length} students`;
  document.querySelector(".expelled-number-of-students").textContent = `${expelledList.length} students`;

  document.querySelector(".house-1-studentsnr").textContent = `${allStudents.filter(isGriff).length} students`;
  document.querySelector(".house-2-studentsnr").textContent = `${allStudents.filter(isHuff).length} students`;
  document.querySelector(".house-3-studentsnr").textContent = `${allStudents.filter(isRav).length} students`;
  document.querySelector(".house-4-studentsnr").textContent = `${allStudents.filter(isSly).length} students`;
}

function displayStudent(student) {
  // create clone
  const clone = document.querySelector("template#student").content.cloneNode(true);

  // set clone data
  clone.querySelector("[data-field=firstName]").textContent = student.firstName;

  // if (student.middleName.includes('"')) {
  //   clone.querySelector("[data-field=nickName]").textContent = student.middleName;
  //   clone.querySelector("[data-field=middleName]").textContent = " ";
  // } else {
  //   clone.querySelector("[data-field=middleName]").textContent = student.middleName;
  //   clone.querySelector("[data-field=nickName]").textContent = " ";
  // }

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

  //-----------------prefect
  if (student.prefect === true) {
    clone.querySelector("[data-field=prefect]").classList.add("color");
  } else {
    clone.querySelector("[data-field=prefect]").classList.remove("color");
  }

  clone.querySelector("[data-field=prefect]").dataset.prefect = student.prefect;
  clone.querySelector("[data-field=prefect]").addEventListener("click", clickPrefect);

  function clickPrefect() {
    const conflictingStudent = allStudents.filter(checkGenderAndHouse);
    if (student.prefect === true) {
      console.log("if");
      togglePrefect(student);
      buildList();
    } else if (conflictingStudent.length >= 1) {
      console.log("else if");
      prefectConflict(conflictingStudent[0]);
    } else {
      togglePrefect(student);
      buildList();
    }
  }

  function togglePrefect(student) {
    console.log("toggle");
    student.prefect = !student.prefect;
  }

  function checkGenderAndHouse(compareStudent) {
    console.log("checkgender runs");

    if (
      student.house === compareStudent.house &&
      student.gender === compareStudent.gender &&
      compareStudent.prefect === true
    ) {
      return true;
    } else {
      return false;
    }
  }

  function prefectConflict(prefectedStudent) {
    console.log("there can be only one winner of each type!");
    removeOther(prefectedStudent);
  }

  function removeOther(prefectedStudent) {
    document.querySelector("#remove-other").classList.remove("hide");
    document.querySelector("#remove-other .closebutton").addEventListener("click", closeDialog);
    document.querySelector("#remove-other #remove-other-button").addEventListener("click", clickRemoveOther);
    document.querySelector("#remove-other [data-field=other-prefect]").textContent = prefectedStudent.firstName;

    function closeDialog() {
      document.querySelector("#remove-other").classList.add("hide");
      document.querySelector("#remove-other .closebutton").removeEventListener("click", closeDialog);
      document.querySelector("#remove-other #remove-other-button").removeEventListener("click", clickRemoveOther);
    }

    function clickRemoveOther() {
      removePrefect(prefectedStudent);
      makePrefect(student);
      buildList();
      closeDialog();
    }
  }

  // function removeAorB(prefectA, prefectB) {
  //   //ask the user to ignore or remove a or b
  //   document.querySelector("#remove-aorb").classList.remove("hide");
  //   document.querySelector("#remove-aorb .closebutton").addEventListener("click", closeDialog);
  //   document.querySelector("#remove-aorb #remove-a").addEventListener("click", clickRemoveA);
  //   document.querySelector("#remove-aorb #remove-b").addEventListener("click", clickRemoveB);

  //   //Show names on the buttons
  //   document.querySelector("#remove-aorb [data-field=prefectA]").textContent = prefectA.firstName;
  //   document.querySelector("#remove-aorb [data-field=prefectB]").textContent = prefectB.firstName;

  //   //if user ignore do nothing
  //   function closeDialog() {
  //     document.querySelector("#remove-aorb").classList.add("hide");
  //     document.querySelector("#remove-aorb .closebutton").removeEventListener("click", closeDialog);
  //     document.querySelector("#remove-aorb #remove-a").removeEventListener("click", clickRemoveA);
  //     document.querySelector("#remove-aorb #remove-b").removeEventListener("click", clickRemoveB);
  //   }

  //   function clickRemoveA() {
  //     //if remove a
  //     removePrefect(prefectA);
  //     makePrefect(selectedStudent);
  //     buildList();
  //     closeDialog();
  //   }

  //   // else if remove b
  //   function clickRemoveB() {
  //     removePrefect(prefectB);
  //     makePrefect(selectedStudent);
  //     buildList();
  //     closeDialog();
  //   }
  // }
  function removePrefect(prefectStudent) {
    prefectStudent.prefect = false;
  }

  function makePrefect(student) {
    student.prefect = true;
  }

  //----------------inq squad
  if (student.inqsquad === true) {
    clone.querySelector("[data-field=inq]").classList.add("color");
  } else {
    clone.querySelector("[data-field=inq]").classList.remove("color");
  }

  clone.querySelector("[data-field=inq]").dataset.inq = student.inqsquad;
  clone.querySelector("[data-field=inq]").addEventListener("click", clickInqSquad);

  function clickInqSquad() {
    console.log("click inq squad");
    const index = allStudents.indexOf(student);
    if (student.inqsquad === false) {
      houseSquadCheck();
    } else {
      removeSquad();
    }
  }

  function houseSquadCheck() {
    console.log("cheking for house squads");
    if (student.blood === "Pure-blood" || student.house === "Slytherin") {
      makeSquad();
    } else {
      let dialog = document.querySelector("#inq-dialog");

      dialog.classList.remove("hide");
      dialog.querySelector(".closebutton").addEventListener("click", closeInqDialog);

      function closeInqDialog() {
        dialog.classList.add("hide");
        dialog.querySelector(".closebutton").removeEventListener("click", closeInqDialog);
      }
    }
  }

  function makeSquad() {
    console.log("makesquad");
    student.inqsquad = true;
    // clone.querySelector("[data-field=inq]").classList.add("color");
    if (student.inqsquad === true) {
      console.log("squaaaaaad");
      document.querySelector("[data-field=inq]").classList.add("color");
    } else {
      document.querySelector("[data-field=inq]").classList.remove("color");
    }
  }

  function removeSquad() {
    // document.querySelector("#isbtn").classList.remove("clickedbutton");
    // allStudents[index].inqsquad = false;
    student.inqsquad = false;
    // clone.querySelector("[data-field=inq]").classList.remove("color");
    if (student.inqsquad === true) {
      // console.log("prefect true");
      console.log("squaaaaaad");
      // clone.querySelector("[data-field=inq]").classList.add("color");
    } else {
      // clone.querySelector("[data-field=inq]").classList.remove("color");
      // console.log("prefect false");
    }
    // document.querySelector("[data-field=inq]").classList.remove("color");
  }

  // -------------expel

  function tryToExpelStudent(student) {
    let dialog = document.querySelector("#expell-dialog");

    dialog.classList.remove("hide");
    dialog.querySelector("#expell").addEventListener("click", clickExpelStudent);
    dialog.querySelector(".closebutton").addEventListener("click", closeExpellDialog);

    function clickExpelStudent() {
      dialog.classList.add("hide");
      dialog.querySelector("#expell").removeEventListener("click", clickExpelStudent);
      dialog.querySelector(".closebutton").removeEventListener("click", closeExpellDialog);

      student.expelled = true;
      expelledList.push(student);
      console.log(allStudents.filter((student) => student.expelled === false));
      allStudents = allStudents.filter((student) => student.expelled === false);

      displayList(allStudents);
      closeExpellDialog();
    }

    function closeExpellDialog() {
      dialog.classList.add("hide");
      dialog.querySelector("#expell").removeEventListener("click", clickExpelStudent);
      dialog.querySelector(".closebutton").removeEventListener("click", closeExpellDialog);
    }
  }

  clone.querySelector("[data-field=expelled]").addEventListener("click", clickExpel);

  function clickExpel() {
    if (student.expelled === true) {
      student.expelled = false;
    } else {
      tryToExpelStudent(student);
    }
    //buildList();
  }

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

  if (student.prefect === true) {
    modal.querySelector("[data-field=prefect]").textContent = "🎖";
  } else {
    modal.querySelector("[data-field=prefect]").textContent = "";
  }

  if (student.inqsquad === true) {
    modal.querySelector("[data-field=inq]").textContent = "🧙";
  } else {
    modal.querySelector("[data-field=inq]").textContent = "";
  }

  // if (student.expelled === true) {
  //   modal.querySelector("[data-field=expelled]").textContent = "🚫";
  //   modal.classList.add("greyscale");
  // } else {
  //   modal.querySelector("[data-field=expelled]").textContent = "";
  // }

  // modal.querySelector("[data-field=prefect]").textContent = `Prefect: ${student.prefect}`;
  // modal.querySelector("[data-field=inq]").textContent = `Inquisitor Squad: ${student.inqsquad}`;
  // modal.querySelector("[data-field=expelled]").textContent = `Expelled: ${student.expelled}`;
  if (student.middleName) {
    if (student.middleName.includes('"')) {
      modal.querySelector("[data-field=nickName]").textContent = `Nick name: ${student.middleName}`;
      modal.querySelector("[data-field=middleName]").textContent = " ";
    } else {
      if (student.middleName) {
        modal.querySelector("[data-field=middleName]").textContent = `Middle name: ${student.middleName}`;
        modal.querySelector("[data-field=nickName]").textContent = " ";
      }
    }
  }

  if (student.firstName == "Padma" || student.firstName == "Parvati") {
    modal.querySelector("[data-field=avatar]").children[0].src =
      "images/" + student.lastName.toLowerCase() + "_" + student.firstName.substring(0).toLowerCase() + ".png";
  } else {
    modal.querySelector("[data-field=avatar]").children[0].src =
      "images/" + student.lastName.toLowerCase() + "_" + student.firstName.substring(0, 1).toLowerCase() + ".png";
  }

  // student.bloodstatus = isBlood(student);

  //modal
  modal.querySelector(".modal .closebutton").addEventListener("click", closeModal);

  function closeModal() {
    modal.classList.add("hide");
    modal.classList.remove("griff_house");
    modal.classList.remove("huff_house");
    modal.classList.remove("rav_house");
    modal.classList.remove("sly_house");
    modal.querySelector("[data-field=middleName]").textContent = " ";
  }
}

//expel
function tryToExpelStudent(student) {
  let dialog = document.querySelector("#expell-dialog");

  dialog.classList.remove("hide");
  dialog.querySelector("#expell").addEventListener("click", clickExpelStudent);
  dialog.querySelector(".closebutton").addEventListener("click", closeExpellDialog);

  function clickExpelStudent() {
    dialog.classList.add("hide");
    dialog.querySelector("#expell").removeEventListener("click", clickExpelStudent);
    dialog.querySelector(".closebutton").removeEventListener("click", closeExpellDialog);

    student.expelled = true;
    expelledList.push(student);
    console.log(allStudents.filter((student) => student.expelled === false));
    allStudents = allStudents.filter((student) => student.expelled === false);

    displayList(allStudents);
    closeExpellDialog();
  }

  function closeExpellDialog() {
    dialog.classList.add("hide");
    dialog.querySelector("#expell").removeEventListener("click", clickExpelStudent);
    dialog.querySelector(".closebutton").removeEventListener("click", closeExpellDialog);
  }
}

function showExpelled() {
  console.log(expelledList);
  console.log(allStudents);
  displayList(expelledList);
  document.querySelector("#expelled_filter").classList.add("activefilter");
  document.querySelector("#griff_filter").classList.remove("activefilter");
  document.querySelector("#huff_filter").classList.remove("activefilter");
  document.querySelector("#rav_filter").classList.remove("activefilter");
  document.querySelector("#sly_filter").classList.remove("activefilter");
}

// actionstab
document.querySelector(".actionstab").addEventListener("mouseover", actionsmodalOpen);

function actionsmodalOpen() {
  console.log("onmouse");
  document.querySelector(".introtext").classList.remove("hide");
}
document.querySelector(".actionstab").addEventListener("mouseout", actionsmodalCloses);
function actionsmodalCloses() {
  console.log("mouseout");
  document.querySelector(".introtext").classList.add("hide");
}
