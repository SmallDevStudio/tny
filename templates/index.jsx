import DefaultTemplates from "./default";

const templates = {
    default: DefaultTemplates,
};

export default function getTemplate(base = "default", page = "page") {
    return templates[base]?.[page] || templates["default"]["page"];
}
