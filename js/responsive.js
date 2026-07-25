(function () {
    "use strict";

    var mobileBreakpoint = 800;

    function initializeNavigation() {
        var nav = document.querySelector("nav");

        if (!nav) {
            return;
        }

        var menu = nav.querySelector(
            ".nav-links, .nav-menu, .navigation-links, ul"
        );

        if (!menu) {
            return;
        }

        var toggle = nav.querySelector(".nav-toggle");

        if (!toggle) {
            toggle = document.createElement("button");
            toggle.type = "button";
            toggle.className = "nav-toggle";
            toggle.setAttribute("aria-label", "Open navigation menu");
            toggle.setAttribute("aria-expanded", "false");
            toggle.innerHTML =
                '<span class="nav-toggle-icon" aria-hidden="true"></span>';

            nav.insertBefore(toggle, nav.firstChild);
        }

        if (!menu.id) {
            menu.id = "responsive-navigation-menu";
        }

        toggle.setAttribute("aria-controls", menu.id);
        document.body.classList.add("responsive-nav-ready");

        function closeMenu() {
            nav.classList.remove("is-open");
            toggle.setAttribute("aria-expanded", "false");
            toggle.setAttribute("aria-label", "Open navigation menu");
        }

        function openMenu() {
            nav.classList.add("is-open");
            toggle.setAttribute("aria-expanded", "true");
            toggle.setAttribute("aria-label", "Close navigation menu");
        }

        toggle.addEventListener("click", function () {
            if (nav.classList.contains("is-open")) {
                closeMenu();
            }
            else {
                openMenu();
            }
        });

        Array.prototype.forEach.call(
            menu.querySelectorAll("a"),
            function (link) {
                link.addEventListener("click", closeMenu);
            }
        );

        document.addEventListener("keydown", function (event) {
            if (event.key === "Escape") {
                closeMenu();
            }
        });

        window.addEventListener("resize", function () {
            if (window.innerWidth > mobileBreakpoint) {
                closeMenu();
            }
        });
    }

    if (document.readyState === "loading") {
        document.addEventListener(
            "DOMContentLoaded",
            initializeNavigation,
            { once: true }
        );
    }
    else {
        initializeNavigation();
    }
}());