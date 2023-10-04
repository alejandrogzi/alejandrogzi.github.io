__credits__ = ["Neal Wang"]


"use strict";
const CHARSET = "ATCG";
const CHAR_HEIGHT = window.innerWidth < 768 ? 16 : 24;
const CHAR_WIDTH = 0.75 * CHAR_HEIGHT;
const DELAY = 50;
const GLITCH_RATE = 0.2;
const ERROR_RATE = 0.05;
const FADE = 0.9;
const GOLD = 0.5;
const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let SPAWN_RATE = canvas.width / 1920;
window.onresize = () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    SPAWN_RATE = canvas.width / 2500;
};
let frame = 0;
let mouse = { x: -1000, y: -1000, acc: 0 };
document.onmousemove = e => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
    mouse.acc += e.movementX * e.movementX + e.movementY * e.movementY;
};

const clear = () => {
    c.fillStyle = "#1e1e2e";
    c.fillRect(0, 0, canvas.width, canvas.height);
    };

class Stream {
    constructor(x) {
        this.chars = [];
        this.glitches = [];
        this.length = Math.floor(Math.random() * 40) + 4;
        this.speed = Math.floor(Math.random() * 2) + 1;
        this.x = x;
        for (let i = 0; i < canvas.height / CHAR_HEIGHT; i++)
            if (Math.random() < GLITCH_RATE)
                this.glitches.push(i);
        this.error = Math.random() < ERROR_RATE;
    }
    update() {
        if (frame % this.speed === 0) {
            this.chars.push(CHARSET[Math.floor(Math.random() * CHARSET.length)]);
            if (this.chars.length >= this.length)
                this.chars[this.chars.length - this.length] = " ";
        }
        if (this.chars.length - this.length > canvas.height / CHAR_HEIGHT)
            return true;
        ctx.font = `${CHAR_HEIGHT}px Courier New`;
        for (let i = 0; i < this.chars.length; i++) {
            if (this.glitches.includes(i) && this.chars[i] !== " ")
                this.chars[i] = CHARSET[Math.floor(Math.random() * CHARSET.length)];
            let x = this.x + CHAR_WIDTH / 2;
            let y = i * CHAR_HEIGHT - CHAR_HEIGHT / 2;
            if (this.chars[i] !== " ") {
                ctx.fillStyle = "#1e1e2e";
                ctx.fillRect(this.x, i * CHAR_HEIGHT, CHAR_WIDTH, CHAR_HEIGHT);
            }
            ctx.fillStyle =
                (x - mouse.x) * (x - mouse.x) + (y - mouse.y) * (y - mouse.y) <
                    mouse.acc * GOLD
                    ? "#fab387"
                    : this.error
                        ? i === this.chars.length - 1
                            ? "#f38ba8"
                            : "#eba0ac"
                        : i === this.chars.length - 1
                            ? "#6c7086"
                            : "#313244";
            ctx.fillText(this.chars[i], this.x, i * CHAR_HEIGHT);
        }
    }
}
const streams = [];
let lastTick = Date.now();
const tick = () => {
    requestAnimationFrame(tick);
    if (Date.now() > lastTick + DELAY) {
        mouse.acc *= FADE;
        if (Math.random() < SPAWN_RATE)
            streams.push(new Stream(Math.floor((Math.random() * canvas.width) / CHAR_WIDTH) * CHAR_WIDTH));
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        for (let i = 0; i < streams.length; i++) {
            if (streams[i].update()) {
                streams.splice(i, 1);
                i--;
            }
        }
        frame++;
        lastTick = Date.now();
    }
};
setTimeout(() => {
    requestAnimationFrame(tick);
}, 1500);
