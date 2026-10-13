import { IS_LOG_ENABLED } from '../javaScriptFiles/javaScriptSettings.js'
import { IS_DEBUG_MODE } from '../javaScriptFiles/javaScriptSettings.js'

let MAIN_URL;

if (IS_DEBUG_MODE)
{
    MAIN_URL = "https://localhost:7267";
}
else
{
    MAIN_URL = "https://h2pd080126.buchwaldshave34.dk";
}
let API_URL = MAIN_URL + "/api/CarFamily";
let SWAGGER_URL = MAIN_URL + "/swagger/index.html";
let LOGINFO_URL = MAIN_URL + "/api/loginfo";
let DATABASEINFO_URL = MAIN_URL + "/api/databaseinfo";

const ForklaringsTekst = "Åben link i et Browser Tab for at blive klogere på ServerSide info/opbygning !!!";
const UrlsToInfo = [
    ["Api", API_URL, ForklaringsTekst],
    ["Swagger", SWAGGER_URL, ForklaringsTekst],
    ["Log Info", LOGINFO_URL, ForklaringsTekst],
    ["Database Info", DATABASEINFO_URL, ForklaringsTekst],
];

const MIN_USERNAME_LENGTH = 3;

let USER_NAME = 'Default VSCode User';
let connection = null;
let refreshOnServerChange = null;

export function init_javaScriptCarWebAPi()
{
    let addCarBtn = document.getElementById("btnAddCar");
    let cancelBtn = document.getElementById("cancel-button");
    let htmlElement = document.getElementById("data-table-body");
    let clearTextFieldsBtn = document.getElementById("btnClearTextFields");

    let inputCarName = document.getElementById("txtCarName");
    let inputCarYear = document.getElementById("txtCarYear");
    let inputCarPrice = document.getElementById("txtCarPrice");
    let inputCarModel = document.getElementById("txtCarModel");

    let inputUserName = document.getElementById("user-name");
    let userNameBtn = document.getElementById("btnUserName");
    let inputPageSize = document.getElementById("pageSize");
    let paginationElement = document.getElementById("pagination");
    let totalCountElement = document.getElementById("total-count");
    let loadingDataSpinner = document.getElementById("loadingDataSpinner");
    let urlTableBody = document.getElementById("table-body-urls");

    let editCarBtn = document.createElement("input");
    editCarBtn.type = "button";
    editCarBtn.value = "Ret";
    editCarBtn.style.display = "none";
    addCarBtn.insertAdjacentElement("afterend", editCarBtn);

    let editingCarId = null;
    let carArray = [];
    let currentPage = 1;
    let pageSize = parseInt(inputPageSize.value, 10) || 5;

    function carAge(carYear) {
        let carAge = new Date().getFullYear() - carYear;
        return carAge;
    }

    function escapeHtml(text) {
        let div = document.createElement("div");
        div.textContent = text ?? "";
        return div.innerHTML;
    }

    function clearInputFields() {
        inputCarName.value = "";
        inputCarYear.value = "";
        inputCarPrice.value = "";
        inputCarModel.value = "";
    }

    function enterEditMode(objektParameter) {
        editingCarId = objektParameter.carId;
        inputCarName.value = objektParameter.carName;
        inputCarYear.value = objektParameter.carYear;
        inputCarPrice.value = objektParameter.carPrice;
        inputCarModel.value = objektParameter.carModel ?? "";

        addCarBtn.style.display = "none";
        editCarBtn.style.display = "";
        cancelBtn.style.display = "";
    }

    function validateInputFields() {
        if (inputCarName.value.trim() == "") {
            alert("Bilenavn må ikke være tomt");
            return false;
        }
        if (inputCarYear.value.trim() == "") {
            alert("År for bilen må ikke være tomt");
            return false;
        }
        if (!(inputCarYear.value >= 1990 && inputCarYear.value <= 2026)) {
            alert("År for bilen skal være mellem 1990 og 2026");
            return false;
        }

        if (inputCarPrice.value.trim() == "") {
            alert("Bilens pris må ikke være tom");
            return false;
        }
        return true;
    }

    function exitEditMode() {
        editingCarId = null;
        clearInputFields();

        addCarBtn.style.display = "";
        editCarBtn.style.display = "none";
        cancelBtn.style.display = "none";
    }

    function getCarFromInputFields() {
        let car = {
            carName: inputCarName.value.trim(),
            carYear: parseInt(inputCarYear.value, 10),
            carPrice: parseInt(inputCarPrice.value, 10)
        };

        // Kun en Car Model har feltet carModel
        if (inputCarModel.value.trim() != "") {
            car.carModel = inputCarModel.value.trim();
        }
        return car;
    }

    function buildUrl(carId) {
        let params = new URLSearchParams({ userName: USER_NAME });
        if (carId === undefined) {
            return `${API_URL}?${params.toString()}`;
        }
        return `${API_URL}/${carId}?${params.toString()}`;
    }


    function addTypeToCar(car) {
        let typedCar = {};
        typedCar.$type = car.carModel !== undefined ? "carModel" : "car";
        Object.assign(typedCar, car);
        return typedCar;
    }

    // GET: Hent alle biler fra API'et
    async function getItems() {
        loadingDataSpinner.style.display = "block";
        let url = buildUrl();

        if (IS_LOG_ENABLED) {
            console.log(url);
        }

        try {
            let response = await fetch(url, {
                method: 'GET'
            });
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            carArray = await response.json();

            if (IS_LOG_ENABLED) {
                console.log(carArray);
            }
            renderTable();
        } catch (error) {
            console.error("Fejl ved hentning af data:", error);
        }
        finally {
            loadingDataSpinner.style.display = "none";
        }
    }

    // POST: Tilføj en ny bil
    async function addItem(car) {
        try {
            let response = await fetch(buildUrl(), {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(addTypeToCar(car))
            });
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return true;
        } catch (error) {
            console.error("Fejl ved tilføjelse af data:", error);
            alert("Bilen kunne ikke tilføjes");
            return false;
        }
    }

    // PUT: Opdater en eksisterende bil
    async function updateItem(car) {
        try {
            let response = await fetch(buildUrl(car.carId), {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(addTypeToCar(car))
            });
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return true;
        } catch (error) {
            console.error("Fejl ved opdatering af data:", error);
            alert("Bilen kunne ikke rettes");
            return false;
        }
    }

    // DELETE: Slet en bil
    async function deleteItem(carId) {
        try {
            let response = await fetch(buildUrl(carId), {
                method: 'DELETE'
            });
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return true;
        } catch (error) {
            console.error("Fejl ved sletning af data:", error);
            alert("Bilen kunne ikke slettes");
            return false;
        }
    }

    addCarBtn.addEventListener("click", async () => {
        if (!validateInputFields()) {
            return;
        }

        if (await addItem(getCarFromInputFields())) {
            clearInputFields();
            getItems();
        }
    })

    editCarBtn.addEventListener("click", async () => {
        if (!validateInputFields()) {
            return;
        }

        let car = getCarFromInputFields();
        car.carId = editingCarId;

        if (await updateItem(car)) {
            exitEditMode();
            getItems();
        }
    })

    cancelBtn.addEventListener("click", () => {
        exitEditMode();
    })

    clearTextFieldsBtn.addEventListener("click", () => {
        clearInputFields();
    })

    inputPageSize.addEventListener("change", () => {
        pageSize = parseInt(inputPageSize.value, 10);
        if (!(pageSize >= 1)) {
            pageSize = 1;
        }
        currentPage = 1;
        renderTable();
    })

    userNameBtn.addEventListener("click", () => {
        if (inputUserName.value.length >= MIN_USERNAME_LENGTH) {
            localStorage.setItem('userName', inputUserName.value);
            USER_NAME = inputUserName.value;
        }
        else {
            alert("User Name skal være på minimum " + MIN_USERNAME_LENGTH + " karakterer !!!");
            inputUserName.value = USER_NAME;
        }
    })

    function renderUrlTable() {
        urlTableBody.innerHTML = "";

        UrlsToInfo.forEach(urlInfo => {
            let row = document.createElement("tr");
            row.innerHTML = `
                <td>${urlInfo[0]}</td>
                <td>${urlInfo[1]}</td>
                <td>${urlInfo[2]}</td>
            `;
            urlTableBody.appendChild(row);
        })
    }

    function renderPagination() {
        paginationElement.innerHTML = "";

        let pageCount = Math.ceil(carArray.length / pageSize);

        for (let page = 1; page <= pageCount; page++) {
            let listItem = document.createElement("li");
            listItem.className = `page-item ${page === currentPage ? "active" : ""}`;
            listItem.innerHTML = `<a class="page-link" href="#">${page}</a>`;
            paginationElement.appendChild(listItem);

            listItem.querySelector("a").addEventListener("click", (event) => {
                event.preventDefault();
                currentPage = page;
                renderTable();
            })
        }
    }

    function renderTable() {
        htmlElement.innerHTML = "";

        let pageCount = Math.max(1, Math.ceil(carArray.length / pageSize));
        if (currentPage > pageCount) {
            currentPage = pageCount;
        }

        let startIndex = (currentPage - 1) * pageSize;
        let carsToShow = carArray.slice(startIndex, startIndex + pageSize);

        carsToShow.forEach(objektParameter => {
            let render = `
                <td>${objektParameter.carId}</td>
                <td>${escapeHtml(objektParameter.carName)}</td>
                <td>${objektParameter.carYear}</td>
                <td>${carAge(objektParameter.carYear)}</td>
                <td>${objektParameter.carPrice}</td>
                <td>${escapeHtml(objektParameter.carModel)}</td>
                <td>
                    <button class="delete-btn">Slet</button>
                    <button class="edit-btn">Ret</button>
                </td>
            `;
            let row = document.createElement("tr");
            row.innerHTML = render;
            htmlElement.appendChild(row);

            row.querySelector(".delete-btn").addEventListener("click", async () => {
                if (!confirm("Do you really wish to delete : " + objektParameter.carName)) {
                    return;
                }

                if (await deleteItem(objektParameter.carId)) {
                    if (editingCarId === objektParameter.carId) {
                        exitEditMode();
                    }
                    getItems();
                }
            });

            row.querySelector(".edit-btn").addEventListener("click", () => {
                enterEditMode(objektParameter);
            })
        })

        totalCountElement.textContent = carArray.length;
        renderPagination();
    }

    // SignalR-forbindelse, så tabellen også opdateres, når andre klienter ændrer data.
    // Forbindelsen oprettes kun én gang, selvom siden åbnes flere gange.
    refreshOnServerChange = getItems;

    if (connection === null) {
        connection = new signalR.HubConnectionBuilder()
            .withUrl(MAIN_URL + "/TodoHub")
            .configureLogging(signalR.LogLevel.Information)
            .build();

        connection.on("ReceiveMessage", function (user, message) {
            console.log("SignalR: " + user + " - " + message);
            refreshOnServerChange();
        });

        connection.start().then(function () {
            console.log("SignalR-forbindelse oprettet.");
        }).catch(function (err) {
            return console.error(err.toString());
        });
    }

    let userName = localStorage.getItem('userName');
    if (userName) {
        USER_NAME = userName;
    }
    inputUserName.value = USER_NAME;

    renderUrlTable();
    getItems();
}
