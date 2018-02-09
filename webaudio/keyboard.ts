

import {Construct, StdOp, Cell, BaseContact, CallContact, Call} from 'jungle-core'
import { Composite } from 'jungle-core';

const keyNoteMap = {
    A:0, W:1, S:2, E:3, D:4, F:5, T:6, G:7, Y:8, H:9, U:10, J:11, K:12
}

export class NoteEmitter extends Call<any> {

    invertable = false;
    isSeatable = true;
    isTargetable = false;

    octave = 3; 

    constructor(spec){
        super()

        document.addEventListener('keydown', (event) => {
            this.keyDown(event.key, event.ctrlKey)
        }, false);

        document.addEventListener('keyup', (event) => {
            this.keyUp(event.key, event.ctrlKey)
        }, false);

    }


    keyDown(key, ctrl) {
        console.log('note down', key)

        let note = this.octave * 12 + keyNoteMap[key]
        if (note !== undefined) {
            this.emit({ note: note, event: 'on' })
            this.emit({ note: note, event: 'on' })
        }
    }

    keyUp(key, ctrl) {
        console.log('note up', key)
        let note = this.octave * 12 + keyNoteMap[key]

        if (note !== undefined) {
            this.emit({ note: note, event: 'off' })
            this.emit({ note: note, event: 'off' })
        }
    }

}

export class KeyboardInputDevice extends Composite {

    contact:NoteEmitter

    applyHead(head){
        super.applyHead(head)
        this.contact = new NoteEmitter({})
    }

    attach(host:Cell, id){
        super.attach(host, id)
        host.lining.addContact(this.contact, id)
    }
} 