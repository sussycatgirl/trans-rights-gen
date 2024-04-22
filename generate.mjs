import Jimp from "jimp";
import dayjs from "dayjs";
import { execSync as exec } from "child_process";
import path from "path";

const input = await Jimp.read("input.png");

exec("rm -rf repo");
exec("cp -r skel/ repo/");
exec("git init", { cwd: path.join(".", "repo") });
exec("git add .", { cwd: path.join(".", "repo") });

let date = dayjs("2017-01-01 GMT+0");

const WIDTH = 52, HEIGHT = 7;

for (let y = 0; y < HEIGHT; y++) {
    for (let x = 0; x < WIDTH; x++) {
        const col = input.getPixelColor(x, y);
        process.stdout.write(col < 0x88888888 ? "x " : "  ");
    }
    process.stdout.write("\n");
}

for (let x = 0; x < WIDTH; x++) {
    for (let y = 0; y < HEIGHT; y++) {
        const col = input.getPixelColor(x, y);
        if (col < 0x88888888 && !date.isSame(dayjs('2017-03-02 GMT+0'))) {
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

            console.log(`Created commit for ${date} (0x${col.toString(16)})`);
        } else console.log(`Skipping ${date} (0x${col.toString(16)})`);

        date = date.add(1, "day");
    }
}

exec("git remote add origin https://github.com/sussycatgirl/trans-rights", { cwd: path.join(".", "repo") });
exec("git push origin master --force", { cwd: path.join(".", "repo") });

