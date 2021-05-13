import dataset, {ccpm_getQuestionInRange, ccpm_getAverageInSubGroup, ccpm_getAverageInQuestion, ccpm_getAverageInBoolQuestion} from './ccpmDataset';


// Get label based on the average 
export const ccpm_getStatusLabel = (average) => {
    if(average < 1.25) return 'Weak';
    if(average < 2.5) return 'Unsatisfactory';
    if(average < 3.75) return 'Satisfactory';
    if(average >= 3.75) return 'Good'; 
}

export const ccpm_getStatusLabelBoolean = (average) => {
    if(average < 0.25) return 'Weak';
    if(average < 0.5) return 'Unsatisfactory';
    if(average < 0.75) return 'Satisfactory';
    if(average >= 0.75) return 'Good'; 
}

export const ccpm_getStatusColor = (status) => {
    if(status === 'Weak') return '#FD625E';
    if(status === 'Unsatisfactory') return '#F9A75D';
    if(status === 'Satisfactory') return '#F5D43E';
    if(status === 'Good') return '#00B8AA';
}

const ccpm_getAverageInquestion = (data) => {
    if(data.data.responses.includes('Yes') || data.data.responses.includes('No')){
      return ccpm_getAverageInBoolQuestion(data);
    } 
    return ccpm_getAverageInQuestion(data);
}

const ccpm_getSumOfQuestions = (questions, data) => {
    const result  = data.filter(e => questions.includes(e.name));
    const sum =  result.reduce((a,b) =>{ 
        if(!a.data) return b.data.mean;
        return a.data.mean+b.data.mean}, 0);
    if(isNaN(sum)) return 0;
    return sum;
}

const ccpm_getNumberOfParnerResponseByType = (questionList, data) => {
    const questions  = data.filter(e => questionList.includes(e.name));
    const disagregatedByType = data.find(e => e.name === 'P_GI03');
    const result = [];
    questions.forEach(element => {
        const elementName = element.row.label[0].replace(' ','').toLowerCase();
        const index = disagregatedByType.data.responses.findIndex(e => elementName.replace('ngos', 'ngo') === e.replace(' ', '').toLowerCase());
        result.push({...element, questionsDisagregatedByPartner: disagregatedByType.data.frequencies[index]});
    })
    return result;
}

const ccpm_getResponseGrouped = (q) => {
    const result = {"1":0, "2": 0, "3": 0, "4": 0, "5": 0};
    Object.keys(result).forEach(key => {
        const index = q.data.responses.findIndex(e => e.toString().replace(/\D/g,'') === key);
        if(index >= 0)
            result[key] = q.data.frequencies[index];
    })
    return result;
}


const ccpm_getData = (data) => {
    console.log(data);
    const newReport = {};
    const chartData = {};
    const questionResponseGroup = {};
    Object.keys(dataset).forEach(group => {
        const groupedByLabel = {"1":0, "2": 0, "3": 0, "4": 0, "5": 0};
        Object.keys(dataset[group]).forEach(subGroup => {
            if(subGroup !== 'code' || subGroup !== 'name'){
            newReport[subGroup] = {};
            // Find all the question of a report subgroup, calculate the average and pupulate the charts
            newReport[subGroup].questions = data.filter(e => ccpm_getQuestionInRange(group, subGroup).includes(e.name)).map(q => {
                q.average = ccpm_getAverageInquestion(q);
                if(q.data.responses.includes('Yes') || q.data.responses.includes('No')) {
                    q.averageLabel = ccpm_getStatusLabelBoolean(q.average);
                } else
                q.averageLabel = ccpm_getStatusLabel(q.average);

                const questionGroupedByLabel = ccpm_getResponseGrouped(q);
                Object.keys(questionGroupedByLabel).forEach(v=> {
                    groupedByLabel[v] = groupedByLabel[v] + questionGroupedByLabel[v];
                })

                if(!chartData[group]) chartData[group] = {};
                if(chartData[group][q.averageLabel]) chartData[group][q.averageLabel] = chartData[group][q.averageLabel] + 1;
                else chartData[group][q.averageLabel] = 1;
                return q;
            });
            newReport[subGroup].averageInGroup = ccpm_getAverageInSubGroup(newReport[subGroup].questions);
            newReport[subGroup].group = group;
        }
        })
        questionResponseGroup[group] = groupedByLabel;
    }) 
    
    const totalResponseQuestions = []
    for(let i = 1; i <= 9;i++){
        totalResponseQuestions.push(`C_CP01_0${i}`);
    }

    const totalEffectiveResponseQuestions = []
    for(let i = 1; i <= 9;i++){
        totalEffectiveResponseQuestions.push(`C_CP02_0${i}`);
    }

    const typeOfSurvey = data.find(e => e.name === 'type_of_survey');
    console.log(typeOfSurvey);
    const numberOfPartner = typeOfSurvey.data.frequencies[typeOfSurvey.data.responses.findIndex(l => l === 'Partner Survey')];

    const finalData =  {report : newReport, chartData, totalReponses: {numberOfPartner : isNaN(numberOfPartner) ? 0 : numberOfPartner, sum: ccpm_getSumOfQuestions(totalResponseQuestions, data)}, 
        totalResponseDisagregatedByPartner: ccpm_getNumberOfParnerResponseByType(totalResponseQuestions, data),
        totalEffectiveResponse : {numberOfPartner : isNaN(numberOfPartner) ? 0 : numberOfPartner, sum : ccpm_getSumOfQuestions(totalEffectiveResponseQuestions, data)},
        totalEffectiveResponseDisagregatedByPartner : ccpm_getNumberOfParnerResponseByType(totalEffectiveResponseQuestions, data),
        questionResponseGroup: questionResponseGroup
        }
    return finalData;
    }

export default ccpm_getData;
