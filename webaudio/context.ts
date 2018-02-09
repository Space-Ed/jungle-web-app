

import {j , J, Domain, Cell, BaseContact, BaseMedium, Construct, Link, Claim, Membrane, CallContact, isPrimative, CallOut, StdOp, Call} from 'jungle-core'
import { ObjectMode } from 'jungle-core/build/util/junction/modes';

// import {KeyboardInputDevice} from './keyboard'

// class AudioParamSource extends BaseContact<CallParamConverter> {
    

//     createPartner(){
//         return new CallParamConverter()
//     }
// }

// class CallParamConverter extends BaseContact<AudioParamSource> {

// }


function ntof (note){
    return 440 * Math.pow(2, (note-48)/12)
}
class AudioContactSpec {
    node:AudioNode
}

class AudioContact extends BaseContact<AudioContact> {
    isSeatable = true;
    isTargetable = true;
    invertable = true;

    audioNode: AudioNode;

    constructor(spec:AudioContactSpec){
        super();
        this.audioNode = spec.node
    }

    createPartner(){
        return new AudioContact({node:this.audioNode})
    }

}

class AudioConnectMedium extends BaseMedium<AudioContact, AudioContact>{
    fanIn = false
    fanOut = true

    seatType = AudioContact
    targetType = AudioContact
    
    //all direct connections to nodes
    inductTarget(){}
    inductSeat(){}
    retractSeat(){}
    retractTarget(){}

    disconnect(link: Link<AudioContact, AudioContact>){
        link.seat.contact.audioNode.disconnect(link.target.contact.audioNode)
    }

    connect(link:Link<AudioContact,AudioContact>){
        console.log('audio connected')
        link.seat.contact.audioNode.connect(link.target.contact.audioNode)
    }
}


class AudioParamContact extends BaseContact<any>{ 
    invertable = false;
    isTargetable = true;
    isSeatable = false;

    constructor(public param:AudioParam){
        super()
    }
}

class CallToParam extends BaseMedium<CallContact, AudioParamContact> {
    fanIn = false
    fanOut = true

    seatType = BaseContact;
    targetType = AudioContact

    //all direct connections to nodes
    inductTarget(seat: Claim<AudioParamContact>) {

    }

    emitToParams(seat:Claim<CallContact>, value){
        if(isPrimative(value)){
            for (let targk in seat.outbound){
                let target = (<AudioParamContact>seat.outbound[targk].target.contact)
                target.param.value = value
            }
        }else if(typeof value == 'object'){ 
            for (let targk in seat.outbound) {
                let target = (<AudioParamContact>seat.outbound[targk].target.contact)
                let method = Object.keys(value)[0]
                target.param[method](...value[method])
            }
        }
    }

    inductSeat(seat:Claim<CallContact>){
        seat.contact.emit = this.emitToParams.bind(this, seat)
    }

    retractSeat() {

    }
    retractTarget() { }

    disconnect(link: Link<AudioContact, AudioContact>) {

    }

    connect(link: Link<AudioContact, AudioContact>) {
    }

}

class AudioAtom extends Construct {

    audioNode:AudioNode
    audioContact:AudioContact
    domain:AudioDomain
    shell:Membrane

    constructor(domain){
        super(domain)

        this.shell = new Membrane()
    }

    applyHead(head){
        super.applyHead()

        let props = (head.props);
        let factory = 'create' + head.nodeType;
        this.audioNode = this.domain.exposed.context[factory]()
        
        for (let k in head){
            if (head.props.indexOf(k) !== -1){
                this.audioNode[k] = head[k]
            }
            if (head.params.indexOf(k) !== -1) {
                this.audioNode[k].value = head[k]
                this.shell.addContact(new AudioParamContact(this.audioNode[k]), k)
            }
        }

        if(head.start){
            (<OscillatorNode>this.audioNode).start()
        }

        if(head.nodeType == 'Oscillator'){

            let dropNote = function(this:AudioAtom, note){ 

                let node = <OscillatorNode> this.audioNode

                // if(note.event === 'on') node.;
                // if(note.event === 'off') node.stop();

                console.log("note", note)
                if(note.event === 'on'){
                    let freq = ntof(note.note)
                    console.log("frequency", freq)
                    node.frequency.value = freq
                }
            }

            let op = new StdOp({
                context: this,
                mode: 'resolve',
                inner_op: dropNote,
                outer_op: dropNote,
                label: 'note input for: ' + this.getLocation()
            })

            op.invert()

            this.shell.addContact(op, 'note')
        }

        this.audioContact = new AudioContact({node:this.audioNode})
    }

    attach(host:Cell, id){
        host.lining.addSubrane(this.shell, id)
        host.lining.addContact(this.audioContact, id)
    }
}

class AudioComposite extends Cell {

}

const keyNoteMap = {
    a: 0, w: 1, s: 2, e: 3, d: 4, f: 5, t: 6, g: 7, y: 8, h: 9, u: 10, j: 11, k: 12
}

export class NoteEmitter extends Call<any> {

    invertable = false;
    isSeatable = true;
    isTargetable = false;

    octave = 3;

    constructor(spec) {
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

        let note = keyNoteMap[key]
        if (note !== undefined) {
            let tone = this.octave * 12 + note
            this.emit({ note: tone, event: 'on' })
            this.emit({ note: tone, event: 'on' })
        }
    }

    keyUp(key, ctrl) {
        console.log('note up', key)
        let note =  keyNoteMap[key]
        if (note !== undefined) {
            let tone = this.octave * 12 + note
            this.emit({ note: tone, event: 'off' })
            this.emit({ note: tone, event: 'off' })
        }
    }

}

export class KeyboardInputDevice extends Construct {

    contact: NoteEmitter

    applyHead(head) {
        super.applyHead(head)
        this.contact = new NoteEmitter({})
    }

    attach(host: Cell, id) {
        super.attach(host, id)
        host.lining.addContact(this.contact, id)
    }
} 

interface AudioDomainStatic {
    context: AudioContext
}

class AudioDomain extends Domain{

    exposed:AudioDomainStatic

    constructor(){
        super()
        
        this.define('keyboard', KeyboardInputDevice)

        this.define('context', new AudioContext())

        this.define('atom', AudioAtom)

        this.define('osc', j('atom', {
            head:{
                nodeType: 'Oscillator',
                props:['type'],
                params:['frequency'],
                start:true
            }
        }))

        this.define('filter', j('atom', {
            head:{
                nodeType:"BiquadFilter",
                props:['type'],
                params:['frequency', 'Q', 'gain']
            }
        }))

        let filtertypes = <any>['highpass', 'lowpass', 'bandpass', 'highshelf', 'lowshelf', 'notch', 'peaking', 'allpass']
        
        for (let filtertype of filtertypes){
            this.define(filtertype, j('filter',{
                head:{
                    type:filtertype
                }
            }))
        }

    }
}



export class AudioRoot extends Cell{

    domain:AudioDomain
    destination:AudioContact
    connect:AudioConnectMedium;
    modulate:CallToParam;

    constructor(domain) {
        super(new AudioDomain().on(domain))

        this.destination = new AudioContact({
            node:this.domain.exposed.context.destination
        })

        this.connect = new AudioConnectMedium()
        this.modulate = new CallToParam()

        this.weave.addMedium(this.connect, 'connect')
        this.weave.addMedium(this.modulate, 'mod')
        this.lining.addContact(this.destination, 'dest')

    }
    
    applyHead(head){
        super.applyHead(head)
    }

    init(patch){
        super.init(patch)
    }

    attach(host, id ){
        super.attach(host, id)   
    }
}

