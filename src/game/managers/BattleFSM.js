
export default class BattleFSM {
    constructor(initialState) {
        this.state = initialState;
        this.transitions = {}; // { fromState: [{ to, condition }] }
        this.onEnter = {}; // optional state entry callbacks
    }

    addTransition(from, to, condition) {
        if(!this.transitions[from]) this.transitions[from] = [];
        this.transitions[from].push({ to, condition });
    }

    setOnEnter(state, callback) {
        this.onEnter[state] = callback;
    }

    update() {
        const transitions = this.transitions[this.state] || [];
        for (const { to, condition } of transitions) {
            if(condition()) {
                this.state = to;
                if(this.onEnter[to]) {
                    this.onEnter[to](); // trigger entry logic
                }
                return;
            }
        }
    }
}