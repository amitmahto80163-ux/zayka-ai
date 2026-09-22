const fs = require("fs");
let content = fs.readFileSync("src/lib/actions.ts", "utf8");

const helper = `
function parseJSONResponse(text: string) {
  try {
    const cleanText = text.replace(/^\\s*\\`\\`\\`(?:json)?/gim, "").replace(/\\`\\`\\`\\s*$/gim, "").trim();
    return JSON.parse(cleanText);
  } catch (e) {
    console.error("Raw AI Output:", text);
    throw new Error("Failed to parse AI JSON");
  }
}
`;

content = content.replace("import { auth } from @/lib/firebase;", "import { auth } from \"@/lib/firebase\";\n" + helper);
// Actually the import is import { auth } from "@/lib/firebase"; wait let me just prepend it after GoogleGenerativeAI
content = content.replace("const genAI = new GoogleGenerativeAI", helper + "\nconst genAI = new GoogleGenerativeAI");

content = content.replace(/JSON\.parse\(result\.response\.text\(\)\)/g, "parseJSONResponse(result.response.text())");

const oldPrompt = /Return JSON array exactly in this format:[\s\S]*?Make sure they look appetizing\.\`/g;
const newPrompt = `Return JSON array exactly in this format:
[
  {
    "id": "gen_dish_xyz",
    "name": "Dish Name",
    "cuisine": "indian",
    "isVeg": true,
    "time": 20,
    "calories": 300,
    "rating": 4.5,
    "tags": ["${category}"],
    "image": "https://image.pollinations.ai/prompt/Dish+Name+delicious+food?width=800&height=800&nologo=true"
  }
]
IMPORTANT: For the "image" field, ALWAYS use this exact URL structure: https://image.pollinations.ai/prompt/{URL-ENCODED-DISH-NAME}+delicious+food?width=800&height=800&nologo=true . Encode spaces as +.\``;

content = content.replace(oldPrompt, newPrompt);
fs.writeFileSync("src/lib/actions.ts", content);
console.log("actions.ts patched!");
