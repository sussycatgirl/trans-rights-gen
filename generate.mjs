import Jimp from "jimp";
import dayjs from "dayjs";
import { execSync as exec } from "child_process";
import path from "path";

exec("rm -rf repo");
exec("cp -r skel/ repo/");
exec("git init", { cwd: path.join(".", "repo") });
exec("git add .", { cwd: path.join(".", "repo") });

const years = [
    {
        year: 2017, // The year for which to process the image
        startOffset: 0, // If the year doesn't start on Monday, you need to set this.
        file: "input.png", // Path to the image to parse. It should be grayscale, otherwise my rudamentary brightness calculation will get thrown off.
        colors: 2, // How many colours to interpolate between. Higher number means more commits will be generated per day.
    },
    {
        year: 2018,
        startOffset: 1,
        file: "input-2.png",
        colors: 3,
    },
    {
        year: 2019,
        startOffset: 2,
        file: "input-3.png",
        colors: 3,
    },
];

const WIDTH = 52, HEIGHT = 7;

for (const year of years) {
    console.log();

    const input = await Jimp.read(year.file);

    function colorStrength(color) {
        const brightnessSteps = 255 / year.colors;
        const brightness = brightnessByColor(color);
        return Math.round(brightness / brightnessSteps);
    }

    for (let y = 0; y < HEIGHT; y++) {
        for (let x = 0; x < WIDTH; x++) {
            let date = dayjs(`${year.year}-01-01 GMT+0`);
            date = date.add(x * 7 + y - year.startOffset, "day");

            const col = input.getPixelColor(x, y) >> 8; // Remove opacity byte
            const count = year.colors - colorStrength(col) - 1;

            if (x == 0 && y < year.startOffset) process.stdout.write(". ");
            else {
                for (let i = 0; i < count; i++) {
                    exec(
                        `git commit -a -m 'ᓚᘏᗢ' --allow-empty`,
                        {
                            cwd: path.join(".", "repo"),
                            env: {
                                // Add 6 hours in case GitHub doesn't like commits being made exactly at midnight
                                "GIT_AUTHOR_DATE": date.add(6, "hour").toISOString(),
                                "GIT_COMMITTER_DATE": date.add(6, "hour").toISOString(),
                                ...process.env
                            }
                        }
                    );
                }

                process.stdout.write((count || ".").toString() + " ");
            }
        }
        process.stdout.write("\n");
    }
}

exec("git remote add origin https://github.com/sussycatgirl/trans-rights", { cwd: path.join(".", "repo") });
exec("git push origin master --force", { cwd: path.join(".", "repo") });

function brightnessByColor(color) {
    const r = color >> 16;
    const g = color >> 8 & 0xff;
    const b = color & 0xff;

    return r/3 + g/3 + b/3;
}
