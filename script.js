const nthAll = document.querySelectorAll("#nth a");
const dotLinkEffect = document.querySelector(".dot-link-effect");

function removeAllClass_fromNth() {
    const nthAll = document.querySelectorAll("#nth a");
    for (let i = 0; i < nthAll.length; i++) {
        dotLinkEffect.classList.remove("active" + i)
    }
}

for (let i = 0; i < nthAll.length; i++) {
    nthAll[i].addEventListener("click", () => {
        removeAllClass_fromNth()
        dotLinkEffect.classList.add("active" + i)
    })
}

for (let i = 0; i < nthAll.length; i++) {
    nthAll[i].addEventListener("mouseover", () => {
        for (let i = 0; i < nthAll.length; i++) {
            nthAll[i].style.opacity = ".30"
        }
        nthAll[i].style.opacity = "1"
    })

    nthAll[i].addEventListener("mouseout", () => {
        for (let i = 0; i < nthAll.length; i++) {
            nthAll[i].style.opacity = "1"
        }
    })
}

const menuBtn = document.querySelector(".menu-btn");
const navbarLinksM = document.querySelector(".nav-links");
const navLinkContainer = document.querySelector(".nav-link-container");
const downloadBtn = document.querySelector(".download-cv");
const overlay = document.querySelector(".overlay-navbar");



document.addEventListener("click", (e) => {
    target = e.target.parentNode;
    targeto = e.target;

    if (target === menuBtn) {
        navbarLinksM.classList.toggle("active-nav")


        setTimeout(() => {
            navbarLinksM.classList.toggle("anim-navs")
        }, 100);
        overlay.style.display = "flex"
    }

    if (targeto === overlay) {
        setTimeout(() => {
            navbarLinksM.classList.remove("active-nav")
        }, 100);
        navbarLinksM.classList.remove("anim-navs")
        overlay.style.display ="none"

    }


});