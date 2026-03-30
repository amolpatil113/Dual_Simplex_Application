// public/js/gsap-animations.js
gsap.registerPlugin(ScrollTrigger);

window.addEventListener('load', () => {
    // Hero Title Stagger
    gsap.from('.stagger-title', { 
        duration: 1.5, 
        y: 50, 
        opacity: 0, 
        ease: 'power3.out' 
    });
    
    gsap.from('.subtitle', { 
        duration: 1.5, 
        y: 30, 
        opacity: 0, 
        delay: 0.5,
        ease: 'power3.out' 
    });

    // 3D Plane Scroll Animation
    if (window.threeAirplane) {
        ScrollTrigger.create({
            trigger: "#story-scroll",
            start: "top top",
            end: "bottom bottom",
            onUpdate: (self) => {
                // Move plane up as user scrolls down
                gsap.to(window.threeAirplane.position, {
                    y: self.progress * 5,
                    x: self.progress * 2,
                    duration: 0.5,
                    overwrite: 'auto'
                });
                
                // Rotate Plane taking off
                gsap.to(window.threeAirplane.rotation, {
                    z: self.progress * Math.PI / 4,
                    duration: 0.5,
                    overwrite: 'auto'
                });
            }
        });
    }

    // Story Cards Fade in
    gsap.from('.character-card', {
        scrollTrigger: {
            trigger: "#theory",
            start: "top center",
        },
        y: 100,
        opacity: 0,
        duration: 1,
        stagger: 0.3
    });

    // Crisis Shake Animation
    gsap.from('.shake-constraint', {
        scrollTrigger: {
            trigger: "#crisis",
            start: "top center"
        },
        x: -20,
        opacity: 0,
        duration: 0.5,
        stagger: 0.2,
        ease: "rough({strength: 2, points: 20, template: linear, taper: none, randomize: true, clamp: false})"
    });

    // Recovery Counters
    const counters = document.querySelectorAll('.counter');
    counters.forEach(counter => {
        ScrollTrigger.create({
            trigger: "#recovery",
            start: "top center",
            once: true,
            onEnter: () => {
                const target = +counter.getAttribute('data-target');
                gsap.to(counter, {
                    innerHTML: target,
                    duration: 2,
                    snap: { innerHTML: 1 },
                    ease: "power1.inOut",
                    onUpdate: function() {
                        counter.innerHTML = Math.ceil(this.targets()[0].innerHTML);
                    }
                });
            }
        });
    });

    // Background Color transitions for section
    gsap.to("body", {
        scrollTrigger: {
            trigger: "#algorithm",
            start: "top center",
            end: "bottom center",
            toggleActions: "play reverse play reverse",
        },
        backgroundColor: "#121212",
        color: "#fffdf5",
        duration: 0.5
    });
});
