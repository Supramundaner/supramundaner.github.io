    (function () {
        'use strict';

        function createIcon(className) {
            var icon = document.createElement('i');
            icon.className = className;
            return icon;
        }

        function appendAuthor(parent, author, isLast) {
            var text = author.name + (author.suffix || '');
            if (author.highlight) {
                var strong = document.createElement('strong');
                strong.textContent = text;
                parent.appendChild(strong);
            } else {
                parent.appendChild(document.createTextNode(text));
            }

            if (!isLast) {
                parent.appendChild(document.createTextNode(', '));
            }
        }

        function renderPublicationCard(publication) {
            var card = document.createElement('div');
            card.className = 'pub-card';

            var cover = document.createElement('div');
            cover.className = 'pub-cover';

            var image = document.createElement('img');
            image.src = publication.cover.src;
            image.alt = publication.cover.alt || publication.title;
            image.loading = 'lazy';
            cover.appendChild(image);

            var info = document.createElement('div');
            info.className = 'pub-info';

            var title = document.createElement('div');
            title.className = 'pub-title';
            if (publication.venueTag) {
                var tag = document.createElement('span');
                tag.className = 'pub-venue-tag';
                tag.textContent = publication.venueTag;
                title.appendChild(tag);
            }
            title.appendChild(document.createTextNode(publication.title));

            var links = document.createElement('div');
            links.className = 'pub-links';
            publication.links.forEach(function (item) {
                var link = document.createElement('a');
                link.href = item.href;
                link.target = '_blank';
                link.rel = 'noopener noreferrer';
                link.appendChild(createIcon(item.icon));
                link.appendChild(document.createTextNode(item.label));
                links.appendChild(link);
            });

            var authors = document.createElement('div');
            authors.className = 'pub-meta-row';
            authors.appendChild(createIcon('fas fa-user'));

            var authorText = document.createElement('span');
            publication.authors.forEach(function (author, index) {
                appendAuthor(authorText, author, index === publication.authors.length - 1);
            });
            authors.appendChild(authorText);

            info.appendChild(title);
            info.appendChild(links);
            info.appendChild(authors);

            if (publication.note) {
                var note = document.createElement('div');
                note.className = 'pub-meta-row';
                note.appendChild(createIcon('fas fa-bookmark'));

                var emphasis = document.createElement('em');
                emphasis.textContent = publication.note;
                note.appendChild(emphasis);
                info.appendChild(note);
            }

            card.appendChild(cover);
            card.appendChild(info);
            return card;
        }

        function renderPublications(publications) {
            var container = document.getElementById('publicationsList');
            if (!container) return;

            var fragment = document.createDocumentFragment();
            var currentYear = '';
            publications.forEach(function (publication) {
                if (publication.year !== currentYear) {
                    var year = document.createElement('div');
                    year.className = 'pub-year';
                    if (currentYear) year.style.marginTop = '1.8rem';
                    year.textContent = publication.year;

                    var line = document.createElement('div');
                    line.className = 'pub-year-line';

                    fragment.appendChild(year);
                    fragment.appendChild(line);
                    currentYear = publication.year;
                }

                fragment.appendChild(renderPublicationCard(publication));
            });

            container.replaceChildren(fragment);
        }

        function loadPublications() {
            fetch('publications.json')
                .then(function (response) {
                    if (!response.ok) throw new Error('Unable to load publications.json');
                    return response.json();
                })
                .then(renderPublications)
                .catch(function () {
                    var container = document.getElementById('publicationsList');
                    if (container) {
                        container.textContent = 'Publications are temporarily unavailable.';
                    }
                });
        }

        loadPublications();

        function setupNewsScrollbar() {
            var list = document.getElementById('newsList');
            var track = document.getElementById('newsScrollbar');
            var thumb = document.getElementById('newsScrollbarThumb');
            if (!list || !track || !thumb) return;

            var dragging = false;
            var dragStartY = 0;
            var dragStartScrollTop = 0;

            function getTrackTravel() {
                return track.clientHeight - thumb.offsetHeight;
            }

            function updateThumb() {
                var overflow = list.scrollHeight - list.clientHeight;
                if (overflow <= 0) {
                    track.classList.add('is-hidden');
                    return;
                }

                track.classList.remove('is-hidden');
                var thumbHeight = Math.max(30, Math.round(track.clientHeight * list.clientHeight / list.scrollHeight));
                thumb.style.height = thumbHeight + 'px';

                var travel = getTrackTravel();
                var top = travel > 0 ? list.scrollTop / overflow * travel : 0;
                thumb.style.transform = 'translateY(' + top + 'px)';
            }

            list.addEventListener('scroll', updateThumb, { passive: true });
            window.addEventListener('resize', updateThumb);

            thumb.addEventListener('pointerdown', function (event) {
                dragging = true;
                dragStartY = event.clientY;
                dragStartScrollTop = list.scrollTop;
                thumb.classList.add('dragging');
                thumb.setPointerCapture(event.pointerId);
                event.preventDefault();
            });

            thumb.addEventListener('pointermove', function (event) {
                if (!dragging) return;

                var overflow = list.scrollHeight - list.clientHeight;
                var travel = getTrackTravel();
                if (travel <= 0 || overflow <= 0) return;

                var delta = event.clientY - dragStartY;
                list.scrollTop = dragStartScrollTop + delta / travel * overflow;
            });

            function stopDragging(event) {
                if (!dragging) return;
                dragging = false;
                thumb.classList.remove('dragging');
                if (event && thumb.hasPointerCapture(event.pointerId)) {
                    thumb.releasePointerCapture(event.pointerId);
                }
            }

            thumb.addEventListener('pointerup', stopDragging);
            thumb.addEventListener('pointercancel', stopDragging);
            updateThumb();
        }

        setupNewsScrollbar();

        /* --- Random background vertical offset --- */
        var heroBgImg = document.getElementById('heroBgImg');
        var heroBg    = document.getElementById('heroBg');
        var hero      = document.querySelector('.hero');
        var ticking   = false;

        function positionBg() {
            var img = heroBgImg;
            if (!img.naturalWidth) return;
            // Cancelled "always retain full width" design to adapt to any window size.
            // Using object-fit: cover in CSS instead.
            img.style.top = '0px';
        }
        heroBgImg.addEventListener('load', positionBg);
        if (heroBgImg.complete) positionBg();
        window.addEventListener('resize', positionBg);

        function onScroll() {
            if (!ticking) {
                window.requestAnimationFrame(function () {
                    var scrolled = window.pageYOffset;

                    /* parallax: background image moves at 35 % of scroll speed */
                    if (heroExpanded) {
                        heroBgImg.style.setProperty('--hero-parallax', '0px');
                    } else if (scrolled <= hero.offsetHeight && window.innerWidth > 768) {
                        heroBgImg.style.setProperty('--hero-parallax', scrolled * 0.35 + 'px');
                    } else {
                        heroBgImg.style.setProperty('--hero-parallax', '0px');
                    }

                    /* navbar solid on scroll */
                    var navbar = document.getElementById('navbar');
                    if (scrolled > 60) {
                        navbar.classList.add('scrolled');
                    } else {
                        navbar.classList.remove('scrolled');
                    }

                    /* active nav link */
                    var sections = document.querySelectorAll('section[id]');
                    var navLinks = document.querySelectorAll('.nav-links a[href^="#"]');
                    var current  = '';
                    for (var i = 0; i < sections.length; i++) {
                        if (scrolled >= sections[i].offsetTop - 120) {
                            current = sections[i].getAttribute('id');
                        }
                    }
                    for (var j = 0; j < navLinks.length; j++) {
                        navLinks[j].classList.remove('active');
                        if (navLinks[j].getAttribute('href') === '#' + current) {
                            navLinks[j].classList.add('active');
                        }
                    }
                    ticking = false;
                });
                ticking = true;
            }
        }
        window.addEventListener('scroll', onScroll, { passive: true });


        /* --- Background expand (desktop only) --- */
        var heroExpanded = false;
        hero.addEventListener('click', function (e) {
            if (window.innerWidth <= 768) return;
            if (!heroExpanded) {
                /* ignore clicks on interactive children */
                if (e.target.closest('.hero-card, .profile-photo, a, button')) return;
                heroBgImg.style.setProperty('--hero-parallax', '0px');
                hero.classList.add('expanded');
                heroExpanded = true;
                window.scrollTo({ top: 0, behavior: 'smooth' });
            } else {
                hero.classList.remove('expanded');
                heroExpanded = false;
                positionBg();
            }
        });
        document.addEventListener('keydown', function (e) {
            if (e.key === 'Escape' && heroExpanded) {
                hero.classList.remove('expanded');
                heroExpanded = false;
                positionBg();
            }
        });

        /* --- Mobile nav toggle --- */
        var navToggle  = document.getElementById('navToggle');
        var navLinksEl = document.getElementById('navLinks');

        function openMobileNav() {
            navLinksEl.classList.add('open');
            navToggle.classList.add('active');
        }

        function closeMobileNav() {
            navLinksEl.classList.remove('open');
            navToggle.classList.remove('active');
        }

        navToggle.addEventListener('click', function (e) {
            e.stopPropagation();
            if (navLinksEl.classList.contains('open')) {
                closeMobileNav();
            } else {
                openMobileNav();
            }
        });

        /* Close on link tap */
        navLinksEl.querySelectorAll('a').forEach(function (link) {
            link.addEventListener('click', function () {
                closeMobileNav();
            });
        });

        /* Close on tap outside */
        document.addEventListener('click', function (e) {
            if (navLinksEl.classList.contains('open') &&
                !navLinksEl.contains(e.target) &&
                !navToggle.contains(e.target)) {
                closeMobileNav();
            }
        });

        /* Close on Escape key */
        document.addEventListener('keydown', function (e) {
            if (e.key === 'Escape' && navLinksEl.classList.contains('open')) {
                closeMobileNav();
            }
        });
    })();
