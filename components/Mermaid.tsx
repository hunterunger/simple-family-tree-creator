import mermaid from "mermaid";
import React, { useLayoutEffect, useState } from "react";
import config from "@/tailwind.config";

let currentId = 0;
const uuid = () => `mermaid-${(currentId++).toString()}`;

const colors: any = config.theme?.extend?.colors;

mermaid.initialize({
    startOnLoad: false,
    theme: "base",
    flowchart: {
        useMaxWidth: false,
        htmlLabels: true,
    },
    securityLevel: "loose",
    themeVariables: {
        fontFamily: "Inter",
        fontSize: "16px",
        // get ["primary-1"]
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
                        .then((svgCode) => setSvg(svgCode.svg));
                } catch (e) {
                    setSvg("");
                }
            })
            .catch((e) => {
                setSvg("");
            });
    }, [children]);

    if (!svg) return null;

    return <div dangerouslySetInnerHTML={{ __html: svg }} />;
}
