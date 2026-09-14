(() => {
  const form = document.querySelector("#rsvp-form");
  const complete = document.querySelector("#complete-message");
  const button = form.querySelector("button[type='submit']");
  const message = document.querySelector("#form-message");
  const radios = [...form.querySelectorAll("input[name='attendance']")];

  radios.forEach((radio) => {
    radio.addEventListener("change", () => {
      radios.forEach((item) => item.closest("label").classList.toggle("selected", item.checked));
      button.disabled = false;
    });
  });

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    if (!form.reportValidity()) return;

    button.disabled = true;
    button.classList.add("is-loading");
    button.firstChild.textContent = "送信しています ";
    message.textContent = "";

    const data = Object.fromEntries(new FormData(form).entries());
    const endpoint = window.RSVP_CONFIG?.endpoint?.trim();

    try {
      if (endpoint) {
        const response = await fetch(endpoint, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data)
        });
        if (!response.ok) throw new Error("送信に失敗しました");
      } else {
        await new Promise((resolve) => setTimeout(resolve, 650));
        console.info("RSVP design demo", data);
      }
      form.hidden = true;
      complete.hidden = false;
      complete.scrollIntoView({ behavior: "smooth", block: "center" });
    } catch (error) {
      message.textContent = "送信できませんでした。時間をおいて、もう一度お試しください。";
      button.disabled = false;
      button.classList.remove("is-loading");
      button.firstChild.textContent = "この内容で回答する ";
    }
  });
})();
