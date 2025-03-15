import colors from "../theme/out/palette.token.json" with { type: "json" };

function formatPrefix(prefix) {
    return prefix.replace(/ /g, '_').toLowerCase();
}

function generateCssVariables(tokens, prefix = '') {
    const cssVariables = {};
    const tailwindColors = {};

    function traverse(obj, currentPrefix) {
        for (const key in obj) {
            if (typeof obj[key] === 'object' && key != 'value' && !Array.isArray(obj[key])) {
                const newPrefix = currentPrefix ? `${currentPrefix}-${key}` : key;
                traverse(obj[key], formatPrefix(newPrefix));
            } else if (obj[key]) {
                const variableName = formatPrefix(`--${currentPrefix}`);
                cssVariables[variableName] = obj[key];

                tailwindColors[`${currentPrefix}`] = `var(${variableName})`;
            }
        }
    }

    traverse(tokens, prefix);

    return cssVariables;
}

function generateTailwindColors(tokens) {
    const tailwindColors = {};

    function traverse(obj, currentPrefix) {
        for (const key in obj) {
            if (typeof obj[key] === 'object' && key != 'value' && !Array.isArray(obj[key])) {
                traverse(obj[key], formatPrefix(`${currentPrefix}-${key}`));
            } else if (obj[key]) {
                tailwindColors[`${currentPrefix}`] = `var(--${formatPrefix(currentPrefix)})`;
            }
        }
    }

    traverse(tokens, 'maktabati');

    return tailwindColors;
}

export const darkCssVariables = generateCssVariables(colors.Tokens.Dark, 'maktabati');
export const lightCssVariables = generateCssVariables(colors.Tokens.Light, 'maktabati');

export const tailwindColors = generateTailwindColors(colors.Tokens.Light); // or colors.Tokens.Dark since they are the same for the config!
