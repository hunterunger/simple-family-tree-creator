"use client";

import Container from "@/components/Container";
import Mermaid from "@/components/Mermaid";
import { parseFamilyTree } from "@/utils/parseGeneology";
import { useEffect, useRef, useState } from "react";
import treeTemplates from "@/utils/treeTemplates";
import { Menu, Button, Loader } from "@mantine/core";
import config from "@/tailwind.config";
import {
    FolderOpenIcon,
    PlusIcon,
    ArrowUpOnSquareIcon,
    ExclamationCircleIcon,
} from "@heroicons/react/24/outline";
import { useDebouncedValue } from "@mantine/hooks";

const colors: any = config.theme?.extend?.colors;

export default function Home() {
    const [mermaidContent, setMermaidContent] = useState("");
    const [svg, setSvg] = useState("");
    const [error, setError] = useState("");

    const textareaRef = useRef<HTMLTextAreaElement>(null);

    const [textAreaContent, setTextAreaContent] = useState(treeTemplates.basic);
    const [debouncedTextContent] = useDebouncedValue(textAreaContent, 500);

    const updateContent = (yamlStr: string) => {
        setTextAreaContent(yamlStr);
    };

    useEffect(() => {
        try {
            const tree = parseFamilyTree(debouncedTextContent);
            setMermaidContent(tree);
        } catch (e) {
            setError("Invalid Syntax");
        }
    }, [debouncedTextContent]);

    useEffect(() => {
        updateContent(treeTemplates.basic);
    }, []);

    return (
        <div className=" flex flex-col h-full">
            <div className=" px-3 py-2 pt-12 h-[100%] overflow-scroll relative">
                <Mermaid
                    svg={svg}
                    setSvg={(svg) => {
                        setError("");
                        setSvg(svg);
                    }}
                >
                    {mermaidContent}
                </Mermaid>
                {!svg && (
                    <Loader
                        className="absolute top-1/2 left-1/2"
                        color={colors["primary-3"]}
                        size={30}
                    />
                )}
            </div>
            <div
                className="h-full"
                style={{
                    boxShadow: "0px 0px 10px 0px rgba(0,0,0,0.20)",
                }}
            >
                <Container className=" h-full flex flex-col py-2" alt>
                    <h2>Editor</h2>
                    <form className=" h-full flex sm:flex-row flex-col gap-3">
                        <div className="w-full h-full relative">
                            <textarea
                                ref={textareaRef}
                                onChange={(e) => {
                                    updateContent(e.target.value);
                                }}
                                defaultValue={treeTemplates.basic}
                                className=" border-2 font-bold border-gray-300 rounded-md font-mono text-sm p-3 w-full h-full bg-white bg-opacity-20 resize-none "
                            />
                            {error && (
                                <div className="absolute bottom-3 right-3 bg-primary-1 font-bold text-white px-3 py-2 rounded-md flex flex-row gap-1 items-center">
                                    {error}
                                    <ExclamationCircleIcon className=" w-5 inline-block ml-2" />
                                </div>
                            )}
                            {textAreaContent.length !==
                                debouncedTextContent.length && (
                                <Loader
                                    className="absolute bottom-3 right-3"
                                    color={colors["primary-3"]}
                                    size={15}
                                />
                            )}
                        </div>
                        <div className=" flex sm:flex-col flex-row flex-wrap sm:w-min w-full gap-3">
                            <InsertMenu
                                textareaRef={textareaRef}
                                updateContent={updateContent}
                            />
                            <ExportMenu
                                mermaidContent={mermaidContent}
                                svg={svg}
                                textareaRef={textareaRef}
                            />
                            <Button
                                color={colors["primary-1"]}
                                leftSection={
                                    <FolderOpenIcon className=" w-5" />
                                }
                                onClick={(e) => {
                                    e.preventDefault();

                                    const input =
                                        document.createElement("input");

                                    input.type = "file";

                                    input.onchange = (e: any) => {
                                        if (!e.target || !e.target.files)
                                            return;

                                        const file = e.target.files[0];

                                        const reader = new FileReader();

                                        reader.onload = (e) => {
                                            if (!e.target) return;

                                            const yaml = e.target
                                                .result as string;
                                            textareaRef.current!.value = yaml;
                                            updateContent(yaml);
                                        };

                                        reader.readAsText(file);
                                    };

                                    input.click();
                                }}
                            >
                                Upload YAML
                            </Button>
                        </div>
                    </form>
                </Container>
            </div>
        </div>
    );
}

function InsertMenu(props: { textareaRef: any; updateContent: any }) {
    const { textareaRef, updateContent } = props;

    return (
        <Menu shadow="md" width={200}>
            <Menu.Target>
                <Button
                    color={colors["primary-1"]}
                    leftSection={<PlusIcon className=" w-5" />}
                >
                    Insert
                </Button>
            </Menu.Target>

            <Menu.Dropdown>
                <Menu.Label>Templates</Menu.Label>
                <Menu.Item
                    onClick={(e) => {
                        e.preventDefault();
                        textareaRef.current!.value += treeTemplates.basic;
                        updateContent(treeTemplates.basic);
                    }}
                >
                    Basic Family
                </Menu.Item>
                <Menu.Item
                    onClick={(e) => {
                        e.preventDefault();
                        textareaRef.current!.value +=
                            treeTemplates.mediumGeneology;
                        updateContent(treeTemplates.mediumGeneology);
                    }}
                >
                    Medium Geneology
                </Menu.Item>
                <Menu.Item
                    onClick={(e) => {
                        e.preventDefault();
                        textareaRef.current!.value +=
                            treeTemplates.largeGeneology;
                        updateContent(treeTemplates.largeGeneology);
                    }}
                >
                    Large Geneology
                </Menu.Item>
                <Menu.Label>Items</Menu.Label>
                <Menu.Item
                    onClick={(e) => {
                        e.preventDefault();
                        textareaRef.current!.value += treeTemplates.child;
                        updateContent(treeTemplates.child);
                    }}
                >
                    Child
                </Menu.Item>
                <Menu.Item
                    onClick={(e) => {
                        e.preventDefault();
                        textareaRef.current!.value +=
                            treeTemplates.coupleNoChildren;
                        updateContent(treeTemplates.coupleNoChildren);
                    }}
                >
                    Married Couple
                </Menu.Item>
                <Menu.Item
                    onClick={(e) => {
                        e.preventDefault();
                        textareaRef.current!.value +=
                            treeTemplates.coupleWithMarrageDate;
                        updateContent(treeTemplates.coupleWithMarrageDate);
                    }}
                >
                    Married Couple with Date
                </Menu.Item>
            </Menu.Dropdown>
        </Menu>
    );
}

function ExportMenu(props: {
    mermaidContent: string;
    svg: string;
    textareaRef?: any;
}) {
    const { mermaidContent, svg, textareaRef } = props;
    return (
        <Menu shadow="md" width={200}>
            <Menu.Target>
                <Button
                    color={colors["primary-1"]}
                    leftSection={<ArrowUpOnSquareIcon className=" w-5" />}
                >
                    Export
                </Button>
            </Menu.Target>

            <Menu.Dropdown>
                {/* <Menu.Label>Application</Menu.Label> */}

                <Menu.Item
                    onClick={(e) => {
                        e.preventDefault();
                        if (!textareaRef.current || !textareaRef.current.value)
                            return;

                        const blob = new Blob([textareaRef.current?.value], {
                            type: "text/yaml",
                        });

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
                    YAML
                </Menu.Item>
                {/* <Menu.Item
                    onClick={(e) => {
                        e.preventDefault();
                        if (!textareaRef.current || !textareaRef.current.value)
                            return;

                        fetch("/api/svg-to-png", {
                            method: "POST",
                            headers: {
                                "Content-Type": "application/json",
                            },
                            body: JSON.stringify({
                                svg: svg,
                            }),
                        })
                            .then((res) => res.blob())
                            .then((blob) => {
                                const url = URL.createObjectURL(blob);

                                const a = document.createElement("a");

                                a.href = url;
                                a.download = "geneology.png";

                                document.body.appendChild(a);

                                a.click();

                                document.body.removeChild(a);

                                URL.revokeObjectURL(url);
                            });
                    }}
                >
                    PNG Image
                </Menu.Item> */}
                <Menu.Item
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
                    SVG
                </Menu.Item>
                <Menu.Item
                    onClick={(e) => {
                        e.preventDefault();

                        const md = "```mermaid\n" + mermaidContent + "\n```";

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
                    Markdown
                </Menu.Item>
                {/* <Menu.Item>Gallery</Menu.Item>
                <Menu.Item
                    rightSection={
                        <Text size="xs" c="dimmed">
                            ⌘K
                        </Text>
                    }
                >
                    Search
                </Menu.Item>

                <Menu.Divider />

                <Menu.Label>Danger zone</Menu.Label>
                <Menu.Item>Transfer my data</Menu.Item>
                <Menu.Item color="red">Delete my account</Menu.Item> */}
            </Menu.Dropdown>
        </Menu>
    );
}
