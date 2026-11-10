const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbyxyBWWC3LgHSqMtlQ3MjVDGz6e9mM1APz8ujEawVdC9NxiUHM42L9pfkFdlAOYsNxj/exec";
const form = document.getElementById("catalogueForm");

function fileToBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result.split(",")[1]);
        reader.onerror = () => reject(new Error("Could not read file."));
        reader.readAsDataURL(file);
    });
}

form.addEventListener("submit", async function (event) {
    event.preventDefault();

    const file = document.getElementById("doc").files[0];

    if (file) {
        const ext = file.name.split(".").pop().toLowerCase();
        if (!["pdf", "doc", "docx"].includes(ext)) {
            alert("Please upload a PDF or Word document.");
            return;
        }
        if (file.size > 700 * 1024) {
            alert("File must be below 700 KB.");
            return;
        }
    }

    const button = form.querySelector('button[type="submit"]');
    button.disabled = true;
    button.textContent = "Submitting...";

    try {
        const fileData = file ? await fileToBase64(file) : "";

        const submission = {
            name: document.getElementById("name").value.trim(),
            email: document.getElementById("email").value.trim(),
            phone: document.getElementById("phone").value.trim(),
            title: document.getElementById("title").value.trim(),
            category: document.getElementById("ctgry").value,
            description: document.getElementById("desc").value.trim(),
            fileName: file ? file.name : "",
            fileData: fileData
        };

        await fetch(SCRIPT_URL, {
            method: "POST",
            mode: "no-cors",
            body: new URLSearchParams(submission)
        });

        alert("Submitted successfully!");
        form.reset();
    } catch (error) {
        alert("Something went wrong. Please try again.");
        console.error(error);
    } finally {
        button.disabled = false;
        button.textContent = "Submit";
    }
});