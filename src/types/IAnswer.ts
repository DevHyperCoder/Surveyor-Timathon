export interface IResponse{
    surveyId:string,
    userId:string|undefined,
    answers: IAnswer[]
}

export interface IAnswer{
    questionId:string,
    option?:string,
    answerText?:string|number
}