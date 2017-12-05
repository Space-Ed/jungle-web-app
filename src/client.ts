import DOMentry from 'jungle-dom'
import { j, J, Construct, Cell, Domain } from 'jungle-core'

let appD = new Domain().on(J)

appD.define('DOM' , DOMentry)

appD.define('app' , j('cell', { 
    
    view:j('DOM', {
        head:{
            mount:'jungle-mount'
        },
        
        anon:[
            j('div', [
                j('h1', {
                    head:
                        {class:'title'},
                    body:"Jungle - Organic Programming Framework"
                }),
                j('img', {
                    head: {
                        id:'logo',
                        src: '/ico/android-chrome-512x512.png',
                        alt: 'Jungle Logo'
                    }
                })
            ]), 
            j('h4', `What is it?`),
            j('p', `Jungle is a tool for building modular systems of all kinds,
             as a framework it provides a way of creating special objects called 
             cells which can be grouped together and connected to make new cells`),
            j('h4', `Who is it for?`),
            j('p', `It is for anyone looking for a high degree of control and flexability in the systems they use: professionals, artists, software developers and non-coders alike`),         
            j('h4', 'Why is it better?'),
            j('p' , `jungle isnt just a framework for web apps, and it is quite different to other frameworks, really jungle is a plugin architecture and cellular connection modelling language it's emphasis is on making software more like `),
            j('h4', 'Why was it made?'),
            j('p', `increasing frustration with the web being dominated by inflexible services that don't let 
            you craft your own experience, let us be the authors of our own experience, travellers on a data landscape,
             rather than sheep herded to the whims of page-rank and feed building algorithms`),
            j('h4', 'how mature is it?'),
            j('p', `It is mature enough to create this webpage, although this is only one area of application and doesn't stretch to the limit`)
        ]
    }),

    model:j('cell', {

    })
}))

window.onload = ()=>{
    let app = appD.recover('app')
}