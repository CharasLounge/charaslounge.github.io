document.addEventListener("DOMContentLoaded", function() {
    const buttons = document.querySelectorAll(".collapsible-button");

    buttons.forEach(button => {
        button.addEventListener("click", function() {
            const content = this.previousElementSibling;
            
            if (content.style.display === "none" || content.style.display === "") {
                content.style.display = "block";
                this.textContent = "Weniger anzeigen";
            } else {
                content.style.display = "none";
                this.textContent = "Mehr anzeigen";
            }
        });
    });
});
