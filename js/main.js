"use strict";

(() => {
    const MOBILE_BREAKPOINT = 768;

    function ready(callback) {
        if (document.readyState === "loading") {
            document.addEventListener("DOMContentLoaded", callback, { once: true });
        } else {
            callback();
        }
    }

    function findNavigation() {
        return (
            document.querySelector("header nav") ||
            document.querySelector(".site-header nav") ||
            document.querySelector(".navbar") ||
            document.querySelector("nav")
        );
    }

    function findNavigationMenu(nav) {
        if (!nav) {
            return null;
        }

        return (
            nav.querySelector(".nav-links") ||
            nav.querySelector(".nav-menu") ||
            nav.querySelector(".navbar-nav") ||
            nav.querySelector("[role='list']") ||
            nav.querySelector("ul")
        );
    }

    function findOrCreateToggle(nav, menu) {
        let toggle =
            nav.querySelector("button[aria-controls]") ||
            nav.querySelector(".nav-toggle") ||
            nav.querySelector(".menu-toggle") ||
            nav.querySelector(".navbar-toggler") ||
            nav.querySelector(".hamburger") ||
            nav.querySelector("#mobile-menu-button") ||
            nav.querySelector(".mobile-menu-button");

        if (!toggle) {
            toggle = document.createElement("button");
            toggle.type = "button";
            toggle.className = "nav-toggle yn-nav-toggle";
            toggle.innerHTML = [
                '<span class="yn-nav-toggle-line" aria-hidden="true"></span>',
                '<span class="yn-nav-toggle-line" aria-hidden="true"></span>',
                '<span class="yn-nav-toggle-line" aria-hidden="true"></span>'
            ].join("");
            nav.insertBefore(toggle, menu);
        }

        toggle.classList.add("yn-nav-toggle");

        if (!toggle.querySelector(".yn-nav-toggle-line")) {
            toggle.innerHTML = [
                '<span class="yn-nav-toggle-line" aria-hidden="true"></span>',
                '<span class="yn-nav-toggle-line" aria-hidden="true"></span>',
                '<span class="yn-nav-toggle-line" aria-hidden="true"></span>'
            ].join("");
        }

        return toggle;
    }

    function installMobileNavigation() {
        const nav = findNavigation();
        const menu = findNavigationMenu(nav);

        if (!nav || !menu) {
            console.warn("Mobile navigation was not initialized because a nav element or nav menu was not found.");
            return;
        }

        nav.classList.add("yn-responsive-nav");
        menu.classList.add("yn-nav-menu");

        if (!menu.id) {
            menu.id = "primary-navigation-menu";
        }

        const toggle = findOrCreateToggle(nav, menu);

        toggle.setAttribute("aria-controls", menu.id);
        toggle.setAttribute("aria-expanded", "false");
        toggle.setAttribute("aria-label", "Open navigation menu");

        function isMobileViewport() {
            return window.innerWidth <= MOBILE_BREAKPOINT;
        }

        function setMenuState(open) {
            const mobile = isMobileViewport();
            const shouldOpen = Boolean(open) && mobile;

            menu.classList.toggle("is-open", shouldOpen);
            toggle.setAttribute("aria-expanded", shouldOpen ? "true" : "false");
            toggle.setAttribute(
                "aria-label",
                shouldOpen ? "Close navigation menu" : "Open navigation menu"
            );
            document.body.classList.toggle("yn-mobile-menu-open", shouldOpen);

            if (mobile) {
                toggle.style.setProperty("display", "inline-flex", "important");
                toggle.style.setProperty("visibility", "visible", "important");
                toggle.style.setProperty("opacity", "1", "important");

                menu.style.setProperty(
                    "display",
                    shouldOpen ? "flex" : "none",
                    "important"
                );
                menu.style.setProperty(
                    "visibility",
                    shouldOpen ? "visible" : "hidden",
                    "important"
                );
                menu.style.setProperty(
                    "opacity",
                    shouldOpen ? "1" : "0",
                    "important"
                );
                menu.style.setProperty(
                    "pointer-events",
                    shouldOpen ? "auto" : "none",
                    "important"
                );
            } else {
                toggle.style.removeProperty("display");
                toggle.style.removeProperty("visibility");
                toggle.style.removeProperty("opacity");

                menu.style.removeProperty("display");
                menu.style.removeProperty("visibility");
                menu.style.removeProperty("opacity");
                menu.style.removeProperty("pointer-events");
            }
        }

        toggle.addEventListener("click", event => {
            event.preventDefault();
            event.stopPropagation();

            const currentlyOpen = toggle.getAttribute("aria-expanded") === "true";
            setMenuState(!currentlyOpen);
        });

        menu.addEventListener("click", event => {
            const link = event.target.closest("a");
            if (link && isMobileViewport()) {
                setMenuState(false);
            }
        });

        document.addEventListener("click", event => {
            if (
                isMobileViewport() &&
                toggle.getAttribute("aria-expanded") === "true" &&
                !nav.contains(event.target)
            ) {
                setMenuState(false);
            }
        });

        document.addEventListener("keydown", event => {
            if (event.key === "Escape") {
                setMenuState(false);
                toggle.focus();
            }
        });

        window.addEventListener("resize", () => {
            if (!isMobileViewport()) {
                setMenuState(false);
            }
        });

        setMenuState(false);
    }

    function installSmoothScrolling() {
        document.addEventListener("click", event => {
            const link = event.target.closest("a[href^='#']");
            if (!link) {
                return;
            }

            const href = link.getAttribute("href");
            if (!href || href === "#") {
                return;
            }

            let target = null;
            try {
                target = document.querySelector(href);
            } catch (error) {
                console.warn("Invalid internal navigation target:", href);
                return;
            }

            if (!target) {
                return;
            }

            event.preventDefault();
            target.scrollIntoView({
                behavior: "smooth",
                block: "start"
            });

            if (history.pushState) {
                history.pushState(null, "", href);
            } else {
                window.location.hash = href;
            }
        });
    }

    function installActiveNavigationHighlighting() {
        if (!("IntersectionObserver" in window)) {
            return;
        }

        const navigationLinks = Array.from(
            document.querySelectorAll("nav a[href^='#']")
        );

        const sections = navigationLinks
            .map(link => {
                const href = link.getAttribute("href");
                if (!href || href === "#") {
                    return null;
                }

                try {
                    return document.querySelector(href);
                } catch (error) {
                    return null;
                }
            })
            .filter(Boolean);

        if (sections.length === 0) {
            return;
        }

        const observer = new IntersectionObserver(
            entries => {
                const visibleEntries = entries
                    .filter(entry => entry.isIntersecting)
                    .sort((a, b) => b.intersectionRatio - a.intersectionRatio);

                if (visibleEntries.length === 0) {
                    return;
                }

                const activeId = visibleEntries[0].target.id;

                navigationLinks.forEach(link => {
                    const isActive = link.getAttribute("href") === `#${activeId}`;
                    link.classList.toggle("active", isActive);

                    if (isActive) {
                        link.setAttribute("aria-current", "page");
                    } else {
                        link.removeAttribute("aria-current");
                    }
                });
            },
            {
                rootMargin: "-30% 0px -60% 0px",
                threshold: [0.05, 0.25, 0.5]
            }
        );

        sections.forEach(section => observer.observe(section));
    }

    function updateCopyrightYear() {
        const year = String(new Date().getFullYear());

        document
            .querySelectorAll(
                "[data-current-year], #current-year, .current-year, [data-year]"
            )
            .forEach(element => {
                element.textContent = year;
            });
    }

    function enforceMinimumReadableTextSize() {
        const ignoredTags = new Set([
            "SCRIPT",
            "STYLE",
            "NOSCRIPT",
            "SVG",
            "PATH",
            "META",
            "LINK"
        ]);

        const elements = Array.from(document.body.querySelectorAll("*"));

        elements.forEach(element => {
            if (ignoredTags.has(element.tagName)) {
                return;
            }

            const hasDirectText = Array.from(element.childNodes).some(node => {
                return (
                    node.nodeType === Node.TEXT_NODE &&
                    node.textContent.trim().length > 0
                );
            });

            if (!hasDirectText) {
                return;
            }

            const style = window.getComputedStyle(element);
            const fontSize = Number.parseFloat(style.fontSize);

            if (Number.isFinite(fontSize) && fontSize < 12) {
                element.style.fontSize = "12px";
            }
        });
    }

    ready(() => {
        try {
            installMobileNavigation();
            installSmoothScrolling();
            installActiveNavigationHighlighting();
            updateCopyrightYear();
            enforceMinimumReadableTextSize();
        } catch (error) {
            console.error("Website initialization failed:", error);
        }
    });
})();