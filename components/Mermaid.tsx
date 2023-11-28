import mermaid from "mermaid";
import React, { useLayoutEffect, useState } from "react";

let currentId = 0;
const uuid = () => `mermaid-${(currentId++).toString()}`;

export default function Mermaid(props: {
    children: string;
    svg: string;
    setSvg: (svg: string) => void;
}) {
    const { children, setSvg, svg } = props;

    useLayoutEffect(() => {
        if (!children) return;

        mermaid.parse(children).then(() => {
            try {
                mermaid
                    .render(uuid(), children)
                    .then((svgCode) => setSvg(svgCode.svg));
            } catch (e) {
                setSvg("");
            }
        });
    }, [children]);

    if (!svg) return null;

    return <div dangerouslySetInnerHTML={{ __html: svg }} />;
}
