export interface IQuestion {
    id?: string,
    type: 'mcq' | 'sh-a' | 'p' | 'num',
    text: string,
    option?: string[],
    isRequired: boolean,
};