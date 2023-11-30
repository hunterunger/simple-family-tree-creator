import * as yaml from "yaml";
import fs from "fs";

// Define a type to represent an individual in the family tree
type Individual = {
    firstName: string;
    lastName?: string;
    label?: string;
};

// Define a type to represent a family unit
type FamilyUnit = {
    parents: Individual[];
    children: Individual[];
    marriageLabel?: string;
};

// Utility function to extract individual names and label (if present)
function parseIndividual(fname: string, lname?: string): Individual {
    const labelMatch = fname.match(/\((.*?)\)/); // Match for label e.g., (Don)
    const label = labelMatch ? labelMatch[1] : undefined;
    const nameParts = fname
        .replace(/\(.*?\)/, "")
        .trim()
        .split("[")[0]
        .trim()
        .split(" ");

    const lastName =
        lname ||
        (nameParts[nameParts.length - 1] !== "+"
            ? nameParts[nameParts.length - 1]
            : undefined);

    return {
        firstName: nameParts[0],
        lastName,
        label,
    };
}

// Utility function to extract marriage label (if present)
function extractMarriageLabel(parentLine: string): string | undefined {
    const marriageLabelMatch = parentLine.match(/\[(.*?)\]/); // Match for marriage label e.g., [1996]
    return marriageLabelMatch ? marriageLabelMatch[1] : undefined;
}

// Parser that transforms the YAML input into a Mermaid flowchart
export function parseFamilyTree(yamlInput: string) {
    const data = yaml.parse(yamlInput);
    console.log(data);
    const families: FamilyUnit[] = [];

    // Process each family unit
    for (const key in data) {
        const parents = key.split("+").map((p) => parseIndividual(p.trim()));
        const children = data[key]
            .map((child: string) => {
                if (child === "none") return null;

                return parseIndividual(child, parents[1].lastName);
            })
            .filter((child: Individual | null) => child !== null);
        const marriageLabel = extractMarriageLabel(key);

        families.push({ parents, children, marriageLabel });
    }

    // Generate Mermaid markdown based on the family units
    return generateMermaidMarkdown(families);
}

// This function will generate the Mermaid markdown
function generateMermaidMarkdown(families: FamilyUnit[]): string {
    let markdown = "flowchart TB\n\n";

    // Add class definitions for colors
    markdown += "classDef blue fill:#66deff,stroke:#000,color:#000\n";
    markdown += "\n";

    // Utility function to generate a safe ID for use in Mermaid
    const safeId = (name: string, label?: string) =>
        `${name.replace(/\s/g, "")}${label || ""}`;

    // Declare a map to track unique family unions by marriage label (if provided)
    let marriageSet = new Set<string>();

    // Traverse the parsed families to generate markdown for each generation
    let generation = 0;
    for (const family of families) {
        const [mother, father] = family.parents;
        const children = family.children;
        const marriageId =
            safeId(father.firstName + mother.firstName) +
            "(" +
            (family.marriageLabel || "💍") +
            ")";
        // Include generation and marriage union if needed
        if (!marriageSet.has(marriageId)) {
            markdown += `\n%% GENERATION ${generation}%%\n`;

            markdown += `${safeId(father.firstName, father.lastName)}("${
                father.firstName
            } ${father.lastName}") --- ${marriageId}\n`;

            markdown += `${safeId(mother.firstName, mother.lastName)}("${
                mother.firstName
            } ${mother.lastName || ""}") --- ${marriageId}\n\n`;
        }

        // Connect all children to the parents union
        for (const child of children) {
            markdown += `${marriageId} --> ${safeId(
                child.firstName,
                child.lastName
            )}("${child.firstName} ${father.lastName || ""}")\n`;
        }

        generation++;
    }

    // Return the complete mermaid markdown
    return markdown;
}
