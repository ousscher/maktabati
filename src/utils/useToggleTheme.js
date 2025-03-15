const useToggleTheme = () => {
    const theme = document.documentElement.classList.contains('dark') ? 'dark' : 'light';

    const toggleTheme = () => {
        document.documentElement.classList.toggle('dark');
    };

    return { theme, toggleTheme };
}

export default useToggleTheme;