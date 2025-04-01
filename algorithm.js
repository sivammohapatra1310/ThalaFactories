class Machine {
    constructor(id, type, mttf) {
        this.machine_id = id;
        this.type = type;
        this.mttf = mttf;
        this.last_up = 0.0;
        this.last_down = 0.0;
        this.total_up = 0.0;
        this.total_down = 0.0;
        this.is_up = true;
    }
}

class Adjuster {
    constructor(id, expertise) {
        this.adjuster_id = id;
        this.expertise = expertise;
        this.total_busy = 0.0;
        this.total_idle = 0.0;
        this.last_busy_start = 0.0;
        this.last_idle_start = 0.0;
        this.is_free = true;
    }
}

class Event {
    static MACHINE_FAILURE = 'MACHINE_FAILURE';
    static MACHINE_REPAIRED = 'MACHINE_REPAIRED';

    constructor(time, type, entity_id, adjuster_id = -1) {
        this.time = time;
        this.type = type;
        this.entity_id = entity_id;
        this.adjuster_id = adjuster_id;
    }
}

class Simulation {
    constructor() {
        this.events = [];
        this.machines = [];
        this.adjusters = [];
        this.brokenMachines = [];
        this.freeAdjusters = [];
        this.current_time = 0.0;
        this.rng = Math.random;
    }

    add_machine(id, type, mttf) {
        const machine = new Machine(id, type, mttf);
        this.machines.push(machine);
        const fail_time = this.getRandomTime(mttf);
        this.schedule_event(new Event(fail_time, Event.MACHINE_FAILURE, id));
    }

    add_adjuster(id, expertise) {
        const adjuster = new Adjuster(id, expertise);
        this.adjusters.push(adjuster);
        this.freeAdjusters.push(id);
    }

    run(duration) {
        while (this.events.length > 0) {
            const ev = this.events.shift();
            if (ev.time > duration) break;
            this.current_time = ev.time;
            if (ev.type === Event.MACHINE_FAILURE) {
                this.handle_machine_failure(ev.entity_id);
            } else if (ev.type === Event.MACHINE_REPAIRED) {
                this.handle_machine_repaired(ev.entity_id, ev.adjuster_id);
            }
        }
    }

    handle_machine_failure(machine_id) {
        const machine = this.machines[machine_id];
        machine.is_up = false;
        machine.total_up += (this.current_time - machine.last_up);
        machine.last_down = this.current_time;
        this.brokenMachines.push(machine_id);
        this.try_assign_repair();
    }

    handle_machine_repaired(machine_id, adjuster_id) {
        const machine = this.machines[machine_id];
        const adjuster = this.adjusters[adjuster_id];
        machine.total_down += (this.current_time - machine.last_down);
        machine.is_up = true;
        machine.last_up = this.current_time;
        adjuster.total_busy += (this.current_time - adjuster.last_busy_start);
        adjuster.is_free = true;
        adjuster.last_idle_start = this.current_time;
        this.freeAdjusters.push(adjuster_id);
        const fail_time = this.current_time + this.getRandomTime(machine.mttf);
        this.schedule_event(new Event(fail_time, Event.MACHINE_FAILURE, machine_id));
        this.try_assign_repair();
    }

    try_assign_repair() {
        while (this.brokenMachines.length > 0 && this.freeAdjusters.length > 0) {
            const mach_id = this.brokenMachines.shift();
            const adj_id = this.freeAdjusters.shift();
            const machine = this.machines[mach_id];
            const adjuster = this.adjusters[adj_id];
            if (!this.can_adjust(adjuster, machine)) {
                this.brokenMachines.push(mach_id);
                this.freeAdjusters.push(adj_id);
                break;
            }
            adjuster.is_free = false;
            adjuster.last_busy_start = this.current_time;
            adjuster.total_idle += (this.current_time - adjuster.last_idle_start);
            const repair_time = this.current_time + this.getRandomTime(10);
            this.schedule_event(new Event(repair_time, Event.MACHINE_REPAIRED, mach_id, adj_id));
        }
    }

    can_adjust(adjuster, machine) {
        return adjuster.expertise.includes(machine.type);
    }

    getRandomTime(base) {
        return this.rng() * base;
    }

    schedule_event(event) {
        this.events.push(event);
        this.events.sort((a, b) => a.time - b.time);
    }

    print_stats() {
        console.log(`==== Simulation Stats at time ${this.current_time} ====\n`);
        console.log("Machine Utilization:");
        this.machines.forEach(machine => {
            const total_time = machine.total_up + machine.total_down;
            console.log(`  Machine ${machine.machine_id} (type ${machine.type}):`);
            console.log(`    Total Up Time   = ${machine.total_up}`);
            console.log(`    Total Down Time = ${machine.total_down}`);
            if (total_time > 0) {
                const utilization = (machine.total_up / total_time) * 100.0;
                console.log(`    Utilization     = ${utilization}%`);
            }
            console.log();
        });
        console.log("Adjuster Utilization:");
        this.adjusters.forEach(adjuster => {
            const total_time = adjuster.total_busy + adjuster.total_idle;
            console.log(`  Adjuster ${adjuster.adjuster_id}:`);
            console.log(`    Total Busy Time = ${adjuster.total_busy}`);
            console.log(`    Total Idle Time = ${adjuster.total_idle}`);
            if (total_time > 0) {
                const utilization = (adjuster.total_busy / total_time) * 100.0;
                console.log(`    Utilization     = ${utilization}%`);
            }
            console.log();
        });
    }
}

const sim = new Simulation();
sim.add_machine(0, 1, 100);
sim.add_machine(1, 2, 150);
sim.add_adjuster(0, [1, 2]);
sim.run(1000.0);
sim.print_stats();
