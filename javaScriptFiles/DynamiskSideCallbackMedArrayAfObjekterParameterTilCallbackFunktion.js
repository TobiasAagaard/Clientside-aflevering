export function init_DynamiskSideCallbackMedArrayAfObjekterParameterTilCallbackFunktion(arrayAfObjektParameter)
{
    console.log(arrayAfObjektParameter);
    let htmlComponent = document.getElementById("UdfyldtFraCallbackFunktion");
    htmlComponent.innerHTML = "";
    let counter = 1;

    arrayAfObjektParameter.forEach(objektParameter => {
        htmlComponent.innerHTML += "Overført Objekt " + counter++ + " : ";
        htmlComponent.innerHTML += "Car Id : " + objektParameter.carId + " ";
        htmlComponent.innerHTML += "Car Name : " + objektParameter.carName + " ";
        htmlComponent.innerHTML += "Car Price : " + objektParameter.carPrice + " ";
        htmlComponent.innerHTML += "Car Year : " + objektParameter.carYear + " ";
        htmlComponent.innerHTML += "<br />";
    });
}