document.addEventListener("DOMContentLoaded", () => {
    const themeToggle = document.getElementById("theme-toggle");

    // Check localStorage for saved theme, otherwise default to 'light'
    const savedTheme = localStorage.getItem("theme") || "light";
    document.documentElement.setAttribute("data-theme", savedTheme);
    updateButtonIcon(savedTheme);

    // Add event listener to button
    themeToggle.addEventListener("click", () => {
        const currentTheme = document.documentElement.getAttribute("data-theme");
        const newTheme = (currentTheme === "light") ? "dark" : "light";

        // Set new theme
        document.documentElement.setAttribute("data-theme", newTheme);
        localStorage.setItem("theme", newTheme);

        // Update button icon
        updateButtonIcon(newTheme);
    });

    // Function to update the button icon and label
    function updateButtonIcon(theme) {
        if (theme === "dark") {
            themeToggle.textContent = "☀️";  // Sun icon for light mode
            themeToggle.setAttribute("aria-label", "Switch to light mode");
        } else {
            themeToggle.textContent = "🌙";  // Moon icon for dark mode
            themeToggle.setAttribute("aria-label", "Switch to dark mode");
        }
    }
});
