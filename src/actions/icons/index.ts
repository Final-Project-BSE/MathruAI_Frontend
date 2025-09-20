"use server";

import fs from "fs/promises";
import path from "path";

export async function saveIcon(formData: FormData) {
    const svg = formData.get("svg") as string;
    const className = formData.get("className") as string;
    const displayType = formData.get("displayType") as string;
    const fileName = formData.get("fileName") as string;

    if (!svg || !className || !displayType || !fileName) {
        return { success: false, message: "Missing required fields" };
    }

    let cssContent = "";

    if (displayType === "background") {
        cssContent = `
.${className} {
  background-image: url("data:image/svg+xml,${encodeURIComponent(svg)}");
  background-repeat: no-repeat;
  background-position: center;
  background-size: contain;
}
`;
    } else {
        cssContent = `
.${className} {
  --svg: url("data:image/svg+xml,${encodeURIComponent(svg)}");
  display: inline-block;
  background-color: currentColor;
  -webkit-mask-image: var(--svg);
  mask-image: var(--svg);
  -webkit-mask-repeat: no-repeat;
  mask-repeat: no-repeat;
  -webkit-mask-size: 100% 100%;
  mask-size: 100% 100%;
}
`;
    }

    const publicDir = path.join(process.cwd(), "public");
    const cssFilePath = path.join(publicDir, fileName);

    try {
        await fs.appendFile(cssFilePath, cssContent);

        return { success: true, message: "Icon saved successfully!" };
    } catch (error) {
        console.error("Error saving icon:", error);

        return { success: false, message: `Failed to save icon: ${error}` };
    }
}

export async function editIcon(formData: FormData) {
    const svg = formData.get("svg") as string;
    const className = formData.get("className") as string;
    const displayType = formData.get("displayType") as string;
    const fileName = formData.get("fileName") as string;

    if (!svg || !className || !displayType || !fileName) {
        return { success: false, message: "Missing required fields" };
    }

    let cssContent = "";

    if (displayType === "background") {
        cssContent = `
.${className} {
  background-image: url("data:image/svg+xml,${encodeURIComponent(svg)}");
  background-repeat: no-repeat;
  background-position: center;
  background-size: contain;
}
`;
    } else {
        cssContent = `
.${className} {
  --svg: url("data:image/svg+xml,${encodeURIComponent(svg)}");
  display: inline-block;
  background-color: currentColor;
  -webkit-mask-image: var(--svg);
  mask-image: var(--svg);
  -webkit-mask-repeat: no-repeat;
  mask-repeat: no-repeat;
  -webkit-mask-size: 100% 100%;
  mask-size: 100% 100%;
}
`;
    }

    const publicDir = path.join(process.cwd(), "public");
    const cssFilePath = path.join(publicDir, fileName);

    try {
        const fileContent = await fs.readFile(cssFilePath, "utf-8");

        const updatedContent = fileContent.replace(
            new RegExp(`\\.${className}\\s*{[^}]*}`, "g"),
            cssContent.trim()
        );

        await fs.writeFile(cssFilePath, updatedContent);

        return { success: true, message: "Icon updated successfully!" };
    } catch (error) {
        console.error("Error updating icon:", error);

        return { success: false, message: `Failed to update icon: ${error}` };
    }
}

export async function createCssFile(fileName: string) {
    if (!fileName.endsWith(".css")) {
        fileName += ".css";
    }

    const publicDir = path.join(process.cwd(), "public");
    const filePath = path.join(publicDir, fileName);

    try {
        await fs.writeFile(filePath, "/* Custom Icons */");

        return { success: true, message: "CSS file created successfully!" };
    } catch (error) {
        console.error("Error creating CSS file:", error);

        return { success: false, message: `Failed to create CSS file: ${error}` };
    }
}

export async function getCssFiles() {
    const publicDir = path.join(process.cwd(), "public");

    try {
        const files = await fs.readdir(publicDir);

        return files.filter((file) => file.endsWith(".css"));
    } catch (error) {
        console.error("Error reading CSS files:", error);

        return [];
    }
}