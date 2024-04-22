import Jimp from "jimp";
import dayjs from "dayjs";
import { execSync as exec } from "child_process";
import path from "path";

const input = await Jimp.read("input.png");

exec("rm -rf repo");
exec("cp -r skel/ repo/");
exec("git init", { cwd: path.join(".", "repo") });
exec("git add .", { cwd: path.join(".", "repo") });

for (let x = 0; x < 51; x++) {
    for (let y = 0; y < 7; y++) {
        const pos = 7*x + y;
        const date = dayjs("2017-01-01 GMT+0").add(pos, "day");

        if (date.isSame(dayjs('2017-02-02 GMT+0'))) continue; // There already is a contribution listed on March 2nd

        const col = input.getPixelColor(x, y);
        if (col == 0x000000ff) {
            exec(
                `git commit -a -m 'ᓚᘏᗢ' --allow-empty`,
                {
                    cwd: path.join(".", "repo"),
                    env: {
                        "GIT_AUTHOR_DATE": date.toISOString(),
                        "GIT_COMMITTER_DATE": date.toISOString(),
                        ...process.env
                    }
                }
            );

            console.log(`Created commit for ${date}`);
        }
    }
}
