// fetching data this url
const randomEmployeeApi = "https://randomuser.me/api";

// form elements
const body = document.querySelector("body");
const gallery = document.getElementById("gallery");
const search = document.getElementsByClassName('search-container')[0];

// initial value
let employees;
let currentEmployeeIndex;
let filteredEmployees;

/**
 * Fetch data from the randomEmployeeApi url and convert to json.
 *
 * @param url
 * @return {Promise<>} return json response
 */
 function fetchData(url) {
    return fetch(url)
        .then(checkStatus)
        .then(response => response.json())
        .catch(error => console.log("Error occurred while processing your request. ", error));

}


/**
 * Check request returns ok or the others statu - HELPER METHOD
 *
 * @param response
 * @return {Promise<never>|Promise<?>}
 */
 function checkStatus(response) {
    if (response.ok) {
        return Promise.resolve(response);
    }

    return Promise.reject(new Error(response.statusText));
}

/**
 * Convert date to a user friendly format - HELPER METHOD
 * @param date
 * @return {String} date
 */
 function formatDate(date) {
    const year = date.slice(0, 4);
    const month = date.slice(5, 7);
    const day = date.slice(8, 10);
    return `${month}/${day}/${year}`;
}


/**
 * fetch employees data
 * @param showingEmployeesCount the number of employees to show on the page
 * @return {Promise<>}
 */
 function fetchEmployeeData(showingEmployeesCount = 12) {
    // Request that returns employees
    return fetchData(`${randomEmployeeApi}/?results=${showingEmployeesCount}`)
        .then(data => data.results)
        .then(data => employees = data)
        .catch(error => console.log(error));
}

/**
 * employee information html element of card from the fetching data
 *
 * @param employee
 * @return {String} html card
 */
 function employeeCard(employee) {
    return `<div class="card">
            <div class="card-img-container">
                <img class="card-img" src="${employee.picture.large}" alt="profile picture">
            </div>
            <div class="card-info-container">
                <h3 id="name" class="card-name cap">${employee.name.first} ${employee.name.last}</h3>
                <p class="card-text">${employee.email}</p>
                <p class="card-text cap">${employee.location.city}, ${employee.location.state}</p>
            </div>
        </div>`;
}

/**
 * Display the employees at page
 * @param data employees list
 */
 function viewEmployees(data) {
    data.forEach(employee => {
        const employeeCard = this.employeeCard(employee);
        gallery.insertAdjacentHTML('beforeend', employeeCard);
    })
}

/**
 * Generate html model box with employee information
 *
 * @param employee single employee
 * @return {String} html model
 */
function generateEmployeeModelBox(employee) {
    return `
        <div class="modal-container">
            <div class="modal">
                <button type="button" id="modal-close-btn" class="modal-close-btn"><strong class="model-close-btn-x">X</strong></button>
                <div class="modal-info-container">
                    <img class="modal-img" src="${employee.picture.large}" alt="profile picture">
                    <h3 id="name" class="modal-name cap">${employee.name.first} ${employee.name.last}</h3>
                    <p class="modal-text">${employee.email}</p>
                    <p class="modal-text cap">${employee.location.city}</p>
                    <hr>
                    <p class="modal-text">${employee.phone}</p>
                    <p class="modal-text">${employee.location.street.number}, ${employee.location.street.name}, ${employee.location.city}, ${employee.location.state} ${employee.location.postcode}</p>
                    <p class="modal-text">Birthday: ${formatDate(employee.dob.date)}</p>
                </div>
            </div>
            <div class="modal-btn-container">
                <button type="button" id="modal-prev" class="modal-prev btn">Prev</button>
                <button type="button" id="modal-next" class="modal-next btn">Next</button>
            </div>
        </div>
    `;
}

/**
 * Display the selected employee model at page
 * @param employeeIndex index of selected employee
 */
function showEmployeeModel(employeeIndex) {
    let employeeList;
    if (filteredEmployees) {
        employeeList = filteredEmployees;
    } else {
        employeeList = employees;
    }
    const employeeModel = generateEmployeeModelBox(employeeList[employeeIndex]);
    body.insertAdjacentHTML('beforeend', employeeModel);
}

/**
 * Shows next or previous employees inside the model dialog box
 *
 * @param event click event
 */
function toggleEmployee(event) {
    // show previous employee info.
    let employeeList;
    if (filteredEmployees) {
        employeeList = filteredEmployees;
    } else {
        employeeList = employees;
    }
    if (event.target.id === "modal-prev") {
        if (currentEmployeeIndex > 0) {
            currentEmployeeIndex -= 1;
        } else {
            // last employee
            currentEmployeeIndex = employeeList.length  - 1;
        }
    // next employee info.
    } else if (event.target.id === "modal-next") {
        if (currentEmployeeIndex < employeeList.length  - 1) {
            currentEmployeeIndex += 1;
        }else {
            // first employee
            currentEmployeeIndex = 0;
        }
    }

    closeModal();
    showEmployeeModel(currentEmployeeIndex);
}

/**
 * Remove model box from page
 */
function closeModal() {
    const modalContainer = document.querySelector(".modal-container");
    body.removeChild(modalContainer);
}

// Add a search form
function addSearch() {
    search.innerHTML = `
        <form action="#" method="get">
            <input type="search" id="search-input" class="search-input" placeholder="Search...">
            <input type="submit" value="&#x1F50D;" id="search-submit" class="search-submit">
        </form>
    `;
}

/**
 * Filters by first and lastname
 *
 * @param employees
 * @param query
 */
function filterItems(employees, query) {
    if (query) {
        return employees.filter(employee =>
            employee.name.first.toLowerCase().indexOf(query.toLowerCase()) !== -1 ||
            employee.name.last.toLowerCase().indexOf(query.toLowerCase()) !== -1)
    }
    return null;
}

/**
 * Search in employees
 *
 * @param searchValue search query
 */
function searchEmployees(searchValue) {
    if (searchValue) {
        const list = filterItems(employees, searchValue);
        filteredEmployees = [...list];
        if (filteredEmployees.length) {
            gallery.innerHTML = '';
            viewEmployees(filteredEmployees);
        } else {
            gallery.innerHTML = `<h2>No find employee</h2>`;
        }

    } else {
        gallery.innerHTML = '';
        filteredEmployees = employees;
        viewEmployees(employees)
    }
}

// get employees page on load
fetchEmployeeData()
    .then(employees => viewEmployees(employees))
    .catch(err => console.log(err));

// add search box
addSearch();

// display the selected employee
gallery.addEventListener("click", event => {
    if (event.target.className !== "gallery") {
        const card = event.target.closest(".card");
        currentEmployeeIndex = [...gallery.children].indexOf(card);
        showEmployeeModel(currentEmployeeIndex);
    }
});

// event handler for model interactions
body.addEventListener("click", event => {
    // close model box when clicked to close button and an empty space other than model box
    if (event.target.id === 'modal-close-btn' || event.target.className === "modal-container" || event.target.className === "model-close-btn-x") {
        closeModal();
    }
    // handle next and previous employee buttons
    if (event.target.id === 'modal-prev' || event.target.id === 'modal-next') {
        toggleEmployee(event);
    }
});

// search form event handler
search.addEventListener("submit", event => {
    event.preventDefault();
    const searchValue = event.target.firstElementChild.value.toLowerCase();
    searchEmployees(searchValue);
});