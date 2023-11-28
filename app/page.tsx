"use client";

import Container from "@/components/Container";
import Mermaid from "@/components/Mermaid";
import { parseFamilyTree } from "@/utils/parseGeneology";
import { useRef, useState } from "react";

export default function Home() {
    const [content, setContent] = useState("");
    const [svg, setSvg] = useState("");
    const [error, setError] = useState("");

    const textareaRef = useRef<HTMLTextAreaElement>(null);

    const updateContent = (yamlStr: string) => {
        try {
            const tree = parseFamilyTree(yamlStr);
            setContent(tree);
        } catch (e) {
            setError("Invalid Syntax");
        }
    };

    return (
        <div className=" flex flex-col h-full">
            <div className=" px-3 py-2 h-[100%] overflow-scroll">
                <Mermaid
                    svg={svg}
                    setSvg={(svg) => {
                        setError("");
                        setSvg(svg);
                    }}
                >
                    {content}
                </Mermaid>
            </div>
            <Container className=" h-full shadow-lg rounded-xl">
                <form className="h-full flex flex-row gap-3">
                    <div className=" flex flex-col w-min gap-3">
                        <button
                            className="bg-blue-500 text-white px-3 py-2 rounded-md mt-2"
                            onClick={(e) => {
                                e.preventDefault();
                                if (
                                    !textareaRef.current ||
                                    textareaRef.current.value === null
                                )
                                    return;

                                const newFamily = `Mom Willson + Dad Smith [Optional Title]:
- Child1
- Child2
- Child3

`;

                                textareaRef.current.value =
                                    textareaRef.current.value + newFamily;

                                updateContent(textareaRef.current.value);
                            }}
                        >
                            Insert Template
                        </button>
                        <div className=" flex flex-col w-min gap-3"></div>
                    </div>
                    <div className="w-full h-full relative">
                        <textarea
                            ref={textareaRef}
                            onChange={(e) => {
                                updateContent(e.target.value);
                            }}
                            className=" border border-gray-300 rounded-md font-mono text-sm p-3 w-full h-full "
                        />
                        {error && (
                            <div className="absolute bottom-3 right-3 bg-red-500 text-white px-3 py-2 rounded-md">
                                {error}
                            </div>
                        )}
                    </div>
                    <div className=" flex flex-col w-min gap-3">
                        <button
                            className="bg-blue-500 text-white px-3 py-2 rounded-md mt-2"
                            onClick={(e) => {
                                e.preventDefault();

                                const md = "```mermaid\n" + content + "\n```";

                                const blob = new Blob([md], {
                                    type: "text/markdown",
                                });

                                const url = URL.createObjectURL(blob);

                                const a = document.createElement("a");

                                a.href = url;
                                a.download = "geneology.md";

                                document.body.appendChild(a);

                                a.click();

                                document.body.removeChild(a);

                                URL.revokeObjectURL(url);
                            }}
                        >
                            Download Markdown
                        </button>
                        <button
                            className="bg-blue-500 text-white px-3 py-2 rounded-md mt-2"
                            onClick={(e) => {
                                e.preventDefault();

                                const blob = new Blob([svg], {
                                    type: "image/svg+xml",
                                });

                                const url = URL.createObjectURL(blob);

                                const a = document.createElement("a");

                                a.href = url;
                                a.download = "geneology.svg";

                                document.body.appendChild(a);

                                a.click();

                                document.body.removeChild(a);

                                URL.revokeObjectURL(url);
                            }}
                        >
                            Download SVG
                        </button>
                        <button
                            className="bg-blue-500 text-white px-3 py-2 rounded-md mt-2"
                            onClick={(e) => {
                                e.preventDefault();
                                if (
                                    !textareaRef.current ||
                                    !textareaRef.current.value
                                )
                                    return;

                                const blob = new Blob(
                                    [textareaRef.current?.value],
                                    {
                                        type: "text/yaml",
                                    }
                                );

                                const url = URL.createObjectURL(blob);

                                const a = document.createElement("a");

                                a.href = url;
                                a.download = "geneology.yaml";

                                document.body.appendChild(a);

                                a.click();

                                document.body.removeChild(a);

                                URL.revokeObjectURL(url);
                            }}
                        >
                            Download YAML
                        </button>
                        {/* file upload button will load yaml */}
                        <button
                            className="bg-blue-500 text-white px-3 py-2 rounded-md mt-2"
                            onClick={(e) => {
                                e.preventDefault();

                                const input = document.createElement("input");

                                input.type = "file";

                                input.onchange = (e: any) => {
                                    if (!e.target || !e.target.files) return;

                                    const file = e.target.files[0];

                                    const reader = new FileReader();

                                    reader.onload = (e) => {
                                        if (!e.target) return;

                                        const yaml = e.target.result as string;
                                        textareaRef.current!.value = yaml;
                                        updateContent(yaml);
                                    };

                                    reader.readAsText(file);
                                };

                                input.click();
                            }}
                        >
                            Upload YAML
                        </button>
                    </div>
                </form>
            </Container>
        </div>
    );
}
