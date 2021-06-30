export interface District {
    district_id: number;
    district_name: string;
}

export interface Districts {
    districts: District[];
    ttl: number;
}