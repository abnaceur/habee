class SubPassion {
    subPassionId: string;
    subPassionName: string;
    subPassionCategory: string;
    subPassionImage: string;
    dateOfCreation: string;
    dateOfLastUpdate: string;
}

class Passion {
    passionId: string;
    passionForCommunity: string;
    passionName: string;
    passionImage: string;
    subPassions: SubPassion[]
}

export { SubPassion, Passion };
