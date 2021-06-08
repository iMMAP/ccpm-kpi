import dataset, { ccpm_getQuestionInRange, ccpm_getAverageInSubGroup, ccpm_getAverageInQuestion, ccpm_getAverageInBoolQuestion, titleConstants } from './ccpmDataset';


// Get label based on the average 
export const ccpm_getStatusLabel = (average, choosenLanguage = 'en') => {
    if (average < 1.25) return titleConstants.weak[choosenLanguage];
    if (average < 2.5) return titleConstants.unsatisfactory[choosenLanguage];
    if (average < 3.75) return titleConstants.satifactory[choosenLanguage];
    if (average > 3.75) return titleConstants.good[choosenLanguage];
}

export const ccpm_getStatusLabelBoolean = (average, choosenLanguage = 'en') => {
    if (average < 0.25) return titleConstants.weak[choosenLanguage];
    if (average < 0.5) titleConstants.unsatisfactory[choosenLanguage];
    if (average < 0.75) return titleConstants.satifactory[choosenLanguage];
    if (average >= 0.75) return titleConstants.good[choosenLanguage];
}

export const ccpm_getStatusColor = (status) => {
    if (status === 'Weak') return '#FD625E';
    if (status === 'Unsatisfactory') return '#F9A75D';
    if (status === 'Satisfactory') return '#F5D43E';
    if (status === 'Good') return '#00B8AA';
}

export const ccpm_getLabel = (index, label) => {
    if (label[index]) return label[index];
    return label[0];
}

export const ccpm_getName = (o, choosenLanguage) => {
    if (!o) return '';
    if (o.names && o.names[choosenLanguage]) return o.names[choosenLanguage];
    return o.name;
}

const ccpm_getAverageInquestion = (data) => {
    if (data.data.responses.includes('Yes') || data.data.responses.includes('No')) {
        return ccpm_getAverageInBoolQuestion(data);
    }
    return ccpm_getAverageInQuestion(data);
}

const ccpm_getSumOfQuestions = (questions, data) => {
    const result = data.filter(e => questions.includes(e.name));
    const sum = result.reduce((a, b) => {
        return a + b.data.mean
    }, 0);
    if (isNaN(sum)) return 0;
    return sum;
}

const singulirize = (a = '') => {
    if(a.substring(a.length - 3) === "ies") return `${a.substring(0, a.length - 3 )}y`;
    if(a[a.length - 1] === 's') return a.substring(0, a.length - 1);
    return a; 
}

const lowerArray = (a) => {
    return a.map(v => v ?  singulirize(v.toLowerCase().replace(' ', '-')) : '');
}

const ccpm_getElementName = (e, data, content) => {
   /* const question = content.survey.find(v => v.name === e);
    const xmlQuestion = content.choices.find(v => lowerArray(v.label).includes(singulirize(question.label[0].toLowerCase().replace(' ', '-'))))
    if(xmlQuestion) return xmlQuestion.name;*/
    switch (e) {
        case "C_CP01_01":
        case "C_CP02_01": return "international_org";
        case "C_CP01_02":
        case "C_CP02_02": return "national_org";
        case "C_CP01_03":
        case "C_CP02_03": return "un_org";
        case "C_CP01_04":
        case "C_CP02_04": return "authority_org";
        case "C_CP01_05":
        case "C_CP02_05": return "donor_org";
        case "C_CP01_06":
        case "C_CP02_06": return "academia_org";
        case "C_CP01_07":
        case "C_CP02_07": return "private_org";
        case "C_CP01_08":
        case "C_CP02_08": return "observer_org";
        case "C_CP01_09":
        case "C_CP02_09": return "other";
        default: return "";
    }
}

const ccpm_getNumberOfParnerResponseByType = (questionList, data, choices) => {
    const questions = data.filter(e => questionList.includes(e.name));
    const disagregatedByType = data.find(e => e.name === 'P_GI03');
    if(disagregatedByType){
    const result = [];
    questions.forEach(element => {
        const elementName = ccpm_getElementName(element.name, questionList, choices);
        const index = disagregatedByType.data.responses.indexOf(elementName);
        var numberResponses = 0;
        if (index > -1)
            numberResponses = disagregatedByType.data.frequencies[index];
        result.push({ ...element, questionsDisagregatedByPartner: numberResponses });
    })
    return result;}
    return questions.map(element => ({...element, questionsDisagregatedByPartner: 0}));
}

const ccpm_getResponseGrouped = (q) => {
    const result = { "1": 0, "2": 0, "3": 0, "4": 0, "5": 0 };
    Object.keys(result).forEach(key => {
        const index = q.data.responses.findIndex(e => e.toString().replace(/\D/g, '') === key);
        if (index >= 0)
            result[key] = q.data.frequencies[index];
    })
    return result;
}


const ccpm_getData = (data, choices) => {
    const newReport = {};
    const chartData = {};
    const questionResponseGroup = {};
    Object.keys(dataset).forEach(group => {
        const groupedByLabel = { "1": 0, "2": 0, "3": 0, "4": 0, "5": 0 };
        Object.keys(dataset[group]).forEach(subGroup => {
            if (subGroup !== 'code' || subGroup !== 'name') {
                newReport[subGroup] = {};
                // Find all the question of a report subgroup, calculate the average and populate the charts
                newReport[subGroup].questions = data.filter(e => ccpm_getQuestionInRange(group, subGroup).includes(e.name)).map(q => {
                    q.average = ccpm_getAverageInquestion(q);
                    if (q.data.responses.includes('Yes') || q.data.responses.includes('No')) {
                        q.averageLabel = ccpm_getStatusLabelBoolean(q.average);
                    } else
                        q.averageLabel = ccpm_getStatusLabel(q.average);

                    const questionGroupedByLabel = ccpm_getResponseGrouped(q);
                    Object.keys(questionGroupedByLabel).forEach(v => {
                        groupedByLabel[v] = groupedByLabel[v] + questionGroupedByLabel[v];
                    })

                    if (!chartData[group]) chartData[group] = {};
                    if (chartData[group][q.averageLabel]) chartData[group][q.averageLabel] = chartData[group][q.averageLabel] + 1;
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
    for (let i = 1; i <= 9; i++) {
        totalResponseQuestions.push(`C_CP01_0${i}`);
    }

    const totalEffectiveResponseQuestions = []
    for (let i = 1; i <= 9; i++) {
        totalEffectiveResponseQuestions.push(`C_CP02_0${i}`);
    }

    const typeOfSurvey = data.find(e => e.name === 'type_of_survey');
    const numberOfPartner = typeOfSurvey.data.frequencies[typeOfSurvey.data.responses.findIndex(l => l === 'partner')];

    const finalData = {
        report: newReport, chartData, totalReponses: { numberOfPartner: isNaN(numberOfPartner) ? 0 : numberOfPartner, sum: ccpm_getSumOfQuestions(totalResponseQuestions, data) },
        totalResponseDisagregatedByPartner: ccpm_getNumberOfParnerResponseByType(totalResponseQuestions, data, choices),
        totalEffectiveResponse: { numberOfPartner: isNaN(numberOfPartner) ? 0 : numberOfPartner, sum: ccpm_getSumOfQuestions(totalEffectiveResponseQuestions, data) },
        totalEffectiveResponseDisagregatedByPartner: ccpm_getNumberOfParnerResponseByType(totalEffectiveResponseQuestions, data, choices),
        questionResponseGroup: questionResponseGroup
    }
    return finalData;
}

export default ccpm_getData;
