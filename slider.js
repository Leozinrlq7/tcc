document.querySelectorAll(".slider").forEach(slider => {

    const images = slider.querySelectorAll(":scope > img");
    const prev = slider.querySelector(".arrow.left");
    const next = slider.querySelector(".arrow.right");

    let index = 0;

    function showImage(i) {
        images.forEach(img => img.classList.remove("active"));
        images[i].classList.add("active");
    }

    next.addEventListener("click", () => {
        index = (index + 1) % images.length;
        showImage(index);
    });

    prev.addEventListener("click", () => {
        index = (index - 1 + images.length) % images.length;
        showImage(index);
    });
});
