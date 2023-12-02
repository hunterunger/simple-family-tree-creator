import sharp from "sharp";

export async function POST(req: Request) {
    const { svg } = await req.json();

    if (!svg) {
        return new Response("Bad request", { status: 400 });
    }

    // convert to png
    const buffer = await sharp(Buffer.from(svg)).png().toBuffer();

    return new Response(buffer, {
        headers: {
            "Content-Type": "image/png",
        },
    });
}
