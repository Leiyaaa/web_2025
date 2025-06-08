const menuData = {
    "items": [
        {
            "title": "Головна",
            "link": "/",
            "submenu": []
        },
        {
            "title": "Послуги",
            "link": "/services",
            "submenu": [
                {
                    "title": "Веб-розробка",
                    "link": "/services/web-development",
                    "submenu": [
                        {
                            "title": "Frontend",
                            "link": "/services/web-development/frontend",
                            "submenu": []
                        },
                        {
                            "title": "Backend",
                            "link": "/services/web-development/backend",
                            "submenu": []
                        },
                        {
                            "title": "Full-stack",
                            "link": "/services/web-development/fullstack",
                            "submenu": []
                        }
                    ]
                },
                {
                    "title": "Дизайн",
                    "link": "/services/design",
                    "submenu": [
                        {
                            "title": "UI/UX дизайн",
                            "link": "/services/design/ui-ux",
                            "submenu": []
                        },
                        {
                            "title": "Графічний дизайн",
                            "link": "/services/design/graphic",
                            "submenu": []
                        }
                    ]
                },
                {
                    "title": "SEO",
                    "link": "/services/seo",
                    "submenu": []
                }
            ]
        },
        {
            "title": "Портфоліо",
            "link": "/portfolio",
            "submenu": [
                {
                    "title": "Веб-сайти",
                    "link": "/portfolio/websites",
                    "submenu": []
                },
                {
                    "title": "Мобільні додатки",
                    "link": "/portfolio/mobile",
                    "submenu": []
                },
                {
                    "title": "Брендинг",
                    "link": "/portfolio/branding",
                    "submenu": []
                }
            ]
        },
        {
            "title": "Про нас",
            "link": "/about",
            "submenu": [
                {
                    "title": "Наша команда",
                    "link": "/about/team",
                    "submenu": []
                },
                {
                    "title": "Історія компанії",
                    "link": "/about/history",
                    "submenu": []
                }
            ]
        },
        {
            "title": "Контакти",
            "link": "/contact",
            "submenu": []
        }
    ]
};

class DynamicMenu {
    constructor() {
        this.menuContainer = document.getElementById('menuContainer');
        this.burgerMenu = document.querySelector('.burger-menu');
        this.activeMenuItem = null;
        this.isMobile = window.innerWidth <= 768;
        
        this.init();
    }

    init() {
        this.renderMenu();
        this.setupEventListeners();
        this.handleResize();
        this.loadMenuState();
    }

    renderMenu() {
        this.menuContainer.innerHTML = '';
        menuData.items.forEach(item => {
            const menuItem = this.createMenuItem(item);
            this.menuContainer.appendChild(menuItem);
        });
    }

    createMenuItem(item, level = 1) {
        const li = document.createElement('li');
        li.className = 'menu-item';
        
        const a = document.createElement('a');
        a.href = item.link;
        a.textContent = item.title;
        a.setAttribute('tabindex', '0');
        
        if (item.submenu && item.submenu.length > 0) {
            a.classList.add('has-submenu');
            
            const submenu = document.createElement('ul');
            submenu.className = 'submenu';
            
            item.submenu.forEach(subItem => {
                const subMenuItem = this.createMenuItem(subItem, level + 1);
                submenu.appendChild(subMenuItem);
            });
            
            li.appendChild(submenu);
        }
        
        li.appendChild(a);
        return li;
    }

    setupEventListeners() {
        // Burger menu 
        this.burgerMenu.addEventListener('click', () => {
            this.toggleMobileMenu();
        });

        this.menuContainer.addEventListener('click', (e) => {
            e.preventDefault();
            const menuItem = e.target.closest('.menu-item');
            
            if (menuItem) {
                this.handleMenuItemClick(menuItem, e.target);
            }
        });

        this.menuContainer.addEventListener('keydown', (e) => {
            this.handleKeyNavigation(e);
        });

        window.addEventListener('resize', () => {
            this.handleResize();
        });

        document.addEventListener('click', (e) => {
            if (this.isMobile && !e.target.closest('.main-menu')) {
                this.closeMobileMenu();
            }
        });
    }

    handleMenuItemClick(menuItem, target) {
        if (this.isMobile) {
            this.handleMobileMenuClick(menuItem, target);
        } else {
            this.handleDesktopMenuClick(menuItem, target);
        }
    }

    handleMobileMenuClick(menuItem, target) {
        const hasSubmenu = target.classList.contains('has-submenu');
        
        if (hasSubmenu) {
            this.toggleSubmenu(menuItem);
        } else {
            this.setActiveMenuItem(menuItem);
            this.closeMobileMenu();
            console.log('Navigate to:', target.href);
        }
    }

    handleDesktopMenuClick(menuItem, target) {
        this.setActiveMenuItem(menuItem);
        console.log('Navigate to:', target.href);
    }

    toggleSubmenu(menuItem) {
        const isExpanded = menuItem.classList.contains('expanded');
        
        const parentMenu = menuItem.parentElement;
        const siblings = parentMenu.children;
        
        for (let sibling of siblings) {
            if (sibling !== menuItem) {
                sibling.classList.remove('expanded');
            }
        }
        
        menuItem.classList.toggle('expanded', !isExpanded);
    }

    setActiveMenuItem(menuItem) {
        const allItems = this.menuContainer.querySelectorAll('.menu-item');
        allItems.forEach(item => item.classList.remove('active'));
        
        let currentItem = menuItem;
        while (currentItem && currentItem.classList.contains('menu-item')) {
            currentItem.classList.add('active');
            currentItem = currentItem.parentElement.closest('.menu-item');
        }
        
        this.activeMenuItem = menuItem;
        this.saveMenuState();
    }

    toggleMobileMenu() {
        const isActive = this.menuContainer.classList.contains('active');
        
        this.menuContainer.classList.toggle('active', !isActive);
        this.burgerMenu.classList.toggle('active', !isActive);
        this.burgerMenu.setAttribute('aria-expanded', !isActive);
        
        document.body.style.overflow = !isActive ? 'hidden' : '';
    }

    closeMobileMenu() {
        this.menuContainer.classList.remove('active');
        this.burgerMenu.classList.remove('active');
        this.burgerMenu.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
    }

    handleKeyNavigation(e) {
        const focusedElement = document.activeElement;
        const menuItems = Array.from(this.menuContainer.querySelectorAll('a'));
        const currentIndex = menuItems.indexOf(focusedElement);
        
        switch (e.key) {
            case 'ArrowDown':
                e.preventDefault();
                const nextIndex = (currentIndex + 1) % menuItems.length;
                menuItems[nextIndex].focus();
                break;
                
            case 'ArrowUp':
                e.preventDefault();
                const prevIndex = currentIndex > 0 ? currentIndex - 1 : menuItems.length - 1;
                menuItems[prevIndex].focus();
                break;
                
            case 'Enter':
            case ' ':
                e.preventDefault();
                focusedElement.click();
                break;
                
            case 'Escape':
                if (this.isMobile) {
                    this.closeMobileMenu();
                }
                break;
        }
    }

    handleResize() {
        const wasMobile = this.isMobile;
        this.isMobile = window.innerWidth <= 768;
        
        if (wasMobile !== this.isMobile) {
            this.closeMobileMenu();
            
            const expandedItems = this.menuContainer.querySelectorAll('.expanded');
            expandedItems.forEach(item => item.classList.remove('expanded'));
        }
    }

    saveMenuState() {
        if (this.activeMenuItem) {
            const activeLink = this.activeMenuItem.querySelector('a').href;
            localStorage.setItem('activeMenuItem', activeLink);
        }
    }

    loadMenuState() {
        const savedActiveLink = localStorage.getItem('activeMenuItem');
        if (savedActiveLink) {
            const savedMenuItem = this.menuContainer.querySelector(`a[href="${savedActiveLink}"]`);
            if (savedMenuItem) {
                const menuItem = savedMenuItem.closest('.menu-item');
                this.setActiveMenuItem(menuItem);
            }
        }
    }

    addMenuItem(newItem, parentSelector = null) {
        if (parentSelector) {
            const parentItem = this.menuContainer.querySelector(parentSelector);
            if (parentItem) {
                let submenu = parentItem.querySelector('.submenu');
                if (!submenu) {
                    submenu = document.createElement('ul');
                    submenu.className = 'submenu';
                    parentItem.appendChild(submenu);
                    parentItem.querySelector('a').classList.add('has-submenu');
                }
                const newMenuItem = this.createMenuItem(newItem);
                submenu.appendChild(newMenuItem);
            }
        } else {
            const newMenuItem = this.createMenuItem(newItem);
            this.menuContainer.appendChild(newMenuItem);
        }
    }

    removeMenuItem(selector) {
        const menuItem = this.menuContainer.querySelector(selector);
        if (menuItem) {
            menuItem.remove();
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const menu = new DynamicMenu();
    
    window.dynamicMenu = menu;
    
    setTimeout(() => {
        menu.addMenuItem({
            title: "Новий пункт",
            link: "/new-item",
            submenu: []
        });
    }, 3000);
});
