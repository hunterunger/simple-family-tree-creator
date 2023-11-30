"use client";

import Container from "@/components/Container";
import Mermaid from "@/components/Mermaid";
import { parseFamilyTree } from "@/utils/parseGeneology";
import { useEffect, useRef, useState } from "react";
import treeTemplates from "@/utils/treeTemplates";
import { Menu, Button } from "@mantine/core";
import config from "@/tailwind.config";
import {
    FolderOpenIcon,
    PlusIcon,
    ArrowUpOnSquareIcon,
} from "@heroicons/react/24/outline";

const colors: any = config.theme?.extend?.colors;

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

    useEffect(() => {
        updateContent(treeTemplates.basic);
    }, []);

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
                <form className="h-full flex sm:flex-row flex-col gap-3">
                    <div className=" flex flex-col w-min gap-3">
                        <div className=" flex flex-col w-min gap-3"></div>
                    </div>
                    <div className="w-full h-full relative">
                        <textarea
                            ref={textareaRef}
                            onChange={(e) => {
                                updateContent(e.target.value);
                            }}
                            defaultValue={treeTemplates.basic}
                            className=" border-2 border-gray-300 rounded-md font-mono text-sm p-3 w-full h-full "
                        />
                        {error && (
                            <div className="absolute bottom-3 right-3 bg-red-500 text-white px-3 py-2 rounded-md">
                                {error}
                            </div>
                        )}
                    </div>
                    <div className=" flex sm:flex-col flex-row flex-wrap sm:w-min w-full gap-3">
                        <ExportMenu content={content} svg={svg} />
                        <Button
                            color={colors["primary-1"]}
                            leftSection={<FolderOpenIcon className=" w-5" />}
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
                        </Button>
                        <InsertMenu
                            textareaRef={textareaRef}
                            updateContent={updateContent}
                        />
                    </div>
                </form>
            </Container>
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
    content: string;
    svg: string;
    textareaRef?: any;
}) {
    const { content, svg, textareaRef } = props;
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
                    YAML (recommended)
                </Menu.Item>
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
