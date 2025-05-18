class StorageManager {
    static saveUserSettings(settings) {
        localStorage.setItem('userSettings', JSON.stringify(settings));
    }

    static getUserSettings() {
        const settings = localStorage.getItem('userSettings');
        return settings ? JSON.parse(settings) : null;
    }

    static saveFormData(formId, data) {
        sessionStorage.setItem(`form_${formId}`, JSON.stringify(data));
    }

    static getFormData(formId) {
        const data = sessionStorage.getItem(`form_${formId}`);
        return data ? JSON.parse(data) : null;
    }

    static setTheme(theme) {
        localStorage.setItem('theme', theme);
        document.documentElement.setAttribute('data-theme', theme);
    }

    static getTheme() {
        return localStorage.getItem('theme') || 'light';
    }

    static clearStorage() {
        localStorage.clear();
        sessionStorage.clear();
    }

    static isStorageAvailable() {
        try {
            localStorage.setItem('test', 'test');
            localStorage.removeItem('test');
            return true;
        } catch (e) {
            return false;
        }
    }
}
