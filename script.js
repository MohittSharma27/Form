console.log("✅ script.js is loaded");


const form = document.querySelector('form');
form.addEventListener('submit', async (e) => {
    e.preventDefault(); // Stop page from reloading

    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());

    try {
        const res = await fetch("/submit", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
        });

        const result = await res.json();
        alert(result.message); // Show success or error message

        if (res.ok) form.reset(); // Reset form on success
    } catch (err) {
        alert("Something went wrong. Try again.");
    }
});
