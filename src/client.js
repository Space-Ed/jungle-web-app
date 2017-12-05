"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const jungle_dom_1 = require("jungle-dom");
const jungle_core_1 = require("jungle-core");
let appD = new jungle_core_1.Domain().on(jungle_core_1.J);
appD.define('DOM', jungle_dom_1.default);
appD.define('app', jungle_core_1.j('cell', {
    view: jungle_core_1.j('DOM', {
        head: {
            mount: 'jungle-mount'
        },
        anon: [
            jungle_core_1.j('div', [
                jungle_core_1.j('h1', {
                    head: { class: 'title' },
                    body: "Jungle - Organic Programming Framework"
                }),
                jungle_core_1.j('img', {
                    head: {
                        id: 'logo',
                        src: '/ico/android-chrome-512x512.png',
                        alt: 'Jungle Logo'
                    }
                })
            ]),
            jungle_core_1.j('h4', `What is it?`),
            jungle_core_1.j('p', `Jungle is a tool for building modular systems of all kinds,
             as a framework it provides a way of creating special objects called 
             cells which can be grouped together and connected to make new cells`),
            jungle_core_1.j('h4', `Who is it for?`),
            jungle_core_1.j('p', `It is for anyone looking for a high degree of control and flexability in the systems they use: professionals, artists, software developers and non-coders alike`),
            jungle_core_1.j('h4', 'Why is it better?'),
            jungle_core_1.j('p', `jungle isnt just a framework for web apps, and it is quite different to other frameworks, really jungle is a plugin architecture and cellular connection modelling language it's emphasis is on making software more like `),
            jungle_core_1.j('h4', 'Why was it made?'),
            jungle_core_1.j('p', `increasing frustration with the web being dominated by inflexible services that don't let 
            you craft your own experience, let us be the authors of our own experience, travellers on a data landscape,
             rather than sheep herded to the whims of page-rank and feed building algorithms`),
            jungle_core_1.j('h4', 'how mature is it?'),
            jungle_core_1.j('p', `It is mature enough to create this webpage, although this is only one area of application and doesn't stretch to the limit`)
        ]
    }),
    model: jungle_core_1.j('cell', {})
}));
window.onload = () => {
    let app = appD.recover('app');
};
//# sourceMappingURL=client.js.map