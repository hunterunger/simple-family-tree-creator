import mermaid from "mermaid";
import React, { useLayoutEffect } from "react";
import config from "@/tailwind.config";

let currentId = 0;
const uuid = () => `mermaid-${(currentId++).toString()}`;

const colors: any = config.theme?.extend?.colors;

mermaid.initialize({
    startOnLoad: false,
    theme: "base",

    htmlLabels: false,
    flowchart: {
        useMaxWidth: false,
        htmlLabels: true,
    },
    securityLevel: "loose",
    themeVariables: {
        fontFamily: "Inter, --font-inter, sans-serif",
        fontSize: "14px",
        primaryColor: colors["primary-2"] || "white",
        primaryBorderColor: "white",
        primaryTextColor: "white",
    },
});

export default function Mermaid(props: {
    children: string;
    svg: string;
    setSvg: (svg: string) => void;
}) {
    const { children, setSvg, svg } = props;

    useLayoutEffect(() => {
        if (!children) return;

        mermaid
            .parse(children)
            .then(() => {
                try {
                    mermaid
                        .render(uuid(), children)
                        .then(({ svg }) => setSvg(svg));
                } catch (e) {
                    setSvg("");
                }
            })
            .catch((e) => {
                setSvg("");
            });
    }, [children]);

    if (!svg) return null;

    return (
        <div className="text-sm " dangerouslySetInnerHTML={{ __html: svg }} />
    );
}
