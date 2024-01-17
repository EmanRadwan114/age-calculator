/*
steps:
  1. check for values validation on value change
  2. show error msgs if there is any invalid input value
  3. get user values when he clicks on submit btn
  4. calculate user age
  5. check for the validity of these values on submit
  6. display user age
*/

// * prepare the project with some declarations & definitions
const day = document.getElementById("day");
const month = document.getElementById("month");
const year = document.getElementById("year");
const userDay = document.querySelector(".ageCalculation .days");
const userMonth = document.querySelector(".ageCalculation .months");
const userYear = document.querySelector(".ageCalculation .year");
const form = document.querySelector("form");
const InputFields = document.querySelectorAll("input[type='number'");

const validValues = {
  day: /^([0-2][0-9]|3[0-1])$/, //from 1 - 31 in 2 digits (eg: 01)
  month: /^(0[0-9]|1[[0-2])$/, //from 1 - 12 in 2 digits (eg: 01)
  year: new Date().getFullYear(), // get current year
};
const months30D = [4, 6, 9, 11];
const months31D = [1, 3, 5, 7, 8, 10, 12];
let monthDays = 31;

function styleValidity(input, color) {
  input.style.outline = `1px solid var(--${color})`;
  input.previousElementSibling.style.color = `var(--${color})`;
}

function validateDay() {
  return validValues.day.test(day.value);
}
function validateMonth() {
  return validValues.month.test(month.value);
}

function validateYear() {
  return year.value <= validValues.year;
}

// &prevent user from entering wrong date (eg: 31/04/2005), April has 30 days only
function validateDayNo(arr, isLeap) {
  if (month.value != 2) {
    // * when user type 31 days in a 30day month, the browser automatically increases the month by one,
    //* that's why I checked here on userBirthDate.getMonth() not userBirthDate.getMonth() + 1
    for (let i = 0; i < arr.length; i++) {
      if (month.value == arr[i] && day.value == 31) {
        day.nextElementSibling.textContent = "this month has 30 days only";
        return false;
      }
    }
  } else {
    if (isLeap && day.value > 29) {
      day.nextElementSibling.textContent =
        "this is a leap year, enter a day between 1 - 29";
      return false;
    } else if (!isLeap && day.value >= 29) {
      day.nextElementSibling.textContent =
        "this is not a leap year, enter a day between 1 - 28";
      return false;
    }
  }
  return true;
}

// & to calculate days by subtracting no of days in a month from the calculation when the user
// &birth day is graeter than the current day
function getDaysNo(isLeap) {
  months30D.forEach((monthValue) => {
    if (month.value == monthValue) {
      monthDays = 30;
    }
  });
  if (month.value == 2) {
    if (isLeap) {
      monthDays = 29;
    } else {
      monthDays = 28;
    }
  }
  return monthDays;
}

// * step 1 & 2
InputFields.forEach((input, indx) => {
  input.addEventListener("change", function (e) {
    input.nextElementSibling.textContent = ``;
    styleValidity(e.target, "smokeyGrey");

    if (indx == 0) {
      if (!validateDay()) {
        e.target.nextElementSibling.textContent = `Must be a valid day`;
        styleValidity(e.target, "lightRed");
      }
    } else if (indx == 1) {
      if (!validateMonth()) {
        e.target.nextElementSibling.textContent = `Must be a valid month`;
        styleValidity(e.target, "lightRed");
      }
    } else if (indx == 2) {
      if (!validateYear()) {
        e.target.nextElementSibling.textContent = `Must be a valid year`;
        styleValidity(e.target, "lightRed");
      }
    }

    // &prevent empty data
    if (e.target.value == "") {
      e.target.nextElementSibling.textContent = `${e.target.id} can't be empty`;
      styleValidity(e.target, "lightRed");
    }
  });
});

// *step 3, 4 , 5 & 6
form.addEventListener("submit", function (e) {
  e.preventDefault();
  userDay.textContent = "- -";
  userMonth.textContent = "- -";
  userYear.textContent = "- -";

  //   & step 4
  const currentDate = new Date();
  const userBirthDate = new Date(`${year.value}-${month.value}-${day.value}`);
  const isLeapYear =
    currentDate.getFullYear() % 4 === 0
      ? currentDate.getFullYear() % 100 === 0
      : currentDate.getFullYear() % 400 === 0;
  let calculatedMonths, calculatedDays, calculatedYears;

  //   ^calculate days
  function calculateDays() {
    if (currentDate.getDate() > userBirthDate.getDate()) {
      calculatedDays = currentDate.getDate() - userBirthDate.getDate();
    } else if (currentDate.getDate() < userBirthDate.getDate()) {
      calculatedDays =
        getDaysNo(isLeapYear) -
        (userBirthDate.getDate() - currentDate.getDate());

      calculatedMonths = calculatedMonths - 1;
    } else if (currentDate.getDate() == userBirthDate.getDate()) {
      calculatedDays = 0;
    }
  }
  // ^calculate month

  function calculateMonths() {
    if (currentDate.getMonth() > userBirthDate.getMonth()) {
      calculatedMonths =
        11 - (currentDate.getMonth() - userBirthDate.getMonth()) + 1;
    } else if (currentDate.getMonth() < userBirthDate.getMonth()) {
      calculatedMonths =
        11 - (userBirthDate.getMonth() - currentDate.getMonth()) + 1;
    } else if (currentDate.getMonth() == userBirthDate.getMonth()) {
      calculatedMonths = 0;
    }

    calculateDays();
  }

  // ^ calculate year

  function calculateYear() {
    if (currentDate.getMonth() !== userBirthDate.getMonth()) {
      calculatedYears =
        currentDate.getFullYear() - userBirthDate.getFullYear() - 1;
    } else {
      calculatedYears = currentDate.getFullYear() - userBirthDate.getFullYear();
    }
  }

  //   &steps 5 & 6
  if (day.value && month.value && year.value) {
    if (
      validateDay() &&
      validateMonth() &&
      validateYear() &&
      validateDayNo(months30D, isLeapYear)
    ) {
      calculateMonths();
      calculateYear();
      userDay.textContent = calculatedDays;
      userMonth.textContent = calculatedMonths;
      userYear.textContent = calculatedYears;
    }
  }
});
