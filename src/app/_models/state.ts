export interface State {
    state_id: number;
    state_name: string;
}

export interface States {
    states: State[];
    ttl: number;
}