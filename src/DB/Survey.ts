import { db } from '../firebase'
import type { IQuestion } from '../types/IQuestion'
import type { ISurveyList } from '../types/ISurvey'

export async function getSurveyQuestions(surveyID: string) {
    const questionsCol = await db.collection(`surveys/${surveyID}/questions`).get()
    let questions: IQuestion[] = []
    questionsCol.docs.forEach(question => {
        const q = question.data() as IQuestion
        questions = [...questions, q]
    })
    return questions
}

export async function getSurveysByEmail(uEmail: string,limit:number =5) {
    if(limit === -1){
const docs = await db.collection("surveys").where("created_by","==",uEmail)
.get()
return docs
    }else{
    const docs = await db
        .collection("surveys")
        .limit(limit)
        .where("created_by", "==", uEmail)
        .get();
    return docs
    }

}

export function docListToSurveyList(
    docs: firebase.firestore.QuerySnapshot<firebase.firestore.DocumentData>
) {
    let surveys: ISurveyList[] = [];
    docs.forEach((d) => {
        if (d.exists) {
            const surveyId = d.id;
            const { surveyTitle } = d.data();
            surveys.push({
                surveyId,
                surveyTitle,
            });
        }
    });
    return surveys;
}
export  function formatQuestionObj(q: IQuestion)
  :IQuestion {
    if (q.option === undefined) {
      return {
        type: q.type,
        text: q.text,
        id: q.id,
        isRequired: q.isRequired
      };
    }
    return q
  }
