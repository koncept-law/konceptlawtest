import { useState } from "react";

const useTemplate = () => {
    const [template, setTemplate] = useState("");
    const [currentState, setCurrentState] = useState({});

    // Function to set the template
    const set = (newTemplate) => {
        setTemplate(newTemplate);
        setCurrentState({}); // Reset the current state when a new template is set
    };

    // Function to replace placeholders in the template based on the current state
    const get = (values) => {
        // Merge new values with the current state
        const updatedState = { ...currentState, ...values };

        // Replace placeholders in the template based on the updated state
        let updatedTemplate = template;

        // Iterate over each key in the updated state
        for (const key of Object.keys(updatedState)) {
            const value = updatedState[key];
            const placeholder = `\\{\\${key}\\}`; // Regex pattern for {$key}

            // If the value is an empty string, keep the placeholder {$key}
            const replacement = value === "" ? `{${key}}` : value;

            // Replace all occurrences of the placeholder with the replacement value
            const regex = new RegExp(placeholder, 'g');
            updatedTemplate = updatedTemplate.replace(regex, replacement);
        }

        // Update the current state
        setCurrentState(updatedState);

        // Return the updated template
        return updatedTemplate;
    };

    const format = (template = "") => {
        // Regex pattern to match placeholders in the format {$key}
        const regex = /\{\$\w+\}/g;
    
        // Create a Set to store unique placeholder keys
        const keys = new Set();
    
        // Use the regex to find matches and extract keys
        let match;
        while ((match = regex.exec(template)) !== null) {
            const key = match[0].replace(/{\$\s*|\s*}/g, ''); // Extract key without {$ and }
            keys.add(key); // Add key to the Set
        }
    
        // Convert the Set to an Array
        return Array.from(keys);
    };

    // Function to reset the template to the original state if needed
    const reset = (newTemplate = "") => {
        setTemplate(newTemplate);
        setCurrentState({});
    };

    return {
        set,
        get,
        reset,
        currentTemplate: template,
        format,
    };
};

export default useTemplate;
