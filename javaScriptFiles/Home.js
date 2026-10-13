let classElement;

export function initWebSite(text = "Ingen tekst angivet !!!")
{
    classElement = document.querySelector('.FyldUnderOpstart');

    classElement.textContent = text;
}