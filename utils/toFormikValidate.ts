function convertErrors(errors) {
    const result = {};
    errors.forEach((error) => {
        result[error.path.join('.')] = error.message;
    });

    return result;
}

function createNestedObject(base, path, value) {
    let current = base;

    for (let i = 0; i < path.length - 1; i++) {
        let part = path[i];

        // Check if the part is a number (array index)
        if (!isNaN(part)) {
            part = parseInt(part, 10);
            current[part] = current[part] || {};
        } else {
            // If the next part is a number, prepare an array
            if (!isNaN(path[i + 1])) {
                current[part] = current[part] || [];
            } else {
                current[part] = current[part] || {};
            }
        }

        current = current[part];
    }

    // Set the final value
    current[path[path.length - 1]] = value;
}

function convertPathsToObject(paths) {
    let result = {};

    for (let key in paths) {
        let path = key.split('.');
        createNestedObject(result, path, paths[key]);
    }

    return result;
}

const toFormikValidate = (formSchema) => {
    return (values) => {
        const result = formSchema.safeParse(values);
        if (!result.success) {
            const errors = convertErrors(result.error.issues);
            const converted = convertPathsToObject(errors);
            return converted;
        }

        return {};
    };
};

export { toFormikValidate };
