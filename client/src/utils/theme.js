export const getStoredTheme = () =>
{
    return localStorage.getItem('theme') || 'light';
};

export const setStoredTheme = (theme) =>
{
    localStorage.setItem('theme', theme);
    document.body.classList.toggle('dark', theme === 'dark');
};