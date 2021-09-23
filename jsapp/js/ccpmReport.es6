import datasetCcpm, { ccpm_getQuestionInRange, ccpm_getAverageInSubGroup, ccpm_getAverageInQuestion, ccpm_getAverageInBoolQuestion, titleConstants, datasetGroup } from './ccpmDataset';


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

export const ccpm_getElementName = (e, data, content) => {
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

const ccpm_getDataGlobalReport = (data, choices, dataSetGroup) => {
    const newReport = {};
    const chartData = {};
    let dataset = dataSetGroup;
    const questionResponseGroup = {};
    Object.keys(dataset).forEach(group => {
        const groupedByLabel = { "1": 0, "2": 0, "3": 0, "4": 0, "5": 0 };

        Object.keys(dataset[group]).forEach(subGroup => {
            if (subGroup !== 'code' && subGroup !== 'name' && subGroup !== 'names') {
                newReport[subGroup] = {};
                // Find all the question of a report subgroup, calculate the average and populate the charts
                newReport[subGroup].questions = data.filter(e => ccpm_getQuestionInRange(group, subGroup, dataSetGroup).includes(e.name)).map(q => {
                    q.average = ccpm_getAverageInquestion(q);
                    if (q.data.responses.includes('Yes') || q.data.responses.includes('No')) {
                        q.averageLabel = ccpm_getStatusLabelBoolean(q.average);
                    } else
                        q.averageLabel = ccpm_getStatusLabel(q.average);
                    return q;
                });
                newReport[subGroup].averageInGroup = ccpm_getAverageInSubGroup(newReport[subGroup].questions);
                newReport[subGroup].group = group;
            }
        })
        questionResponseGroup[group] = groupedByLabel;
    })

    return newReport;
}


const ccpm_getData = (data, choices, dataSetGroup) => {
    const newReport = {};
    const chartData = {};
    let dataset = datasetCcpm;
    const questionResponseGroup = {};
    Object.keys(dataset).forEach(group => {
        const groupedByLabel = { "1": 0, "2": 0, "3": 0, "4": 0, "5": 0 };

        Object.keys(dataset[group]).forEach(subGroup => {
            if (subGroup !== 'code' || subGroup !== 'name') {
                newReport[subGroup] = {};
                // Find all the question of a report subgroup, calculate the average and populate the charts
                newReport[subGroup].questions = data.filter(e => ccpm_getQuestionInRange(group, subGroup).includes(e.name)).map(q => {
                    q.average = ccpm_getAverageInquestion(q, dataSetGroup);
                    if (q.data.responses.includes('Yes') || q.data.responses.includes('No')) {
                        q.averageLabel = ccpm_getStatusLabelBoolean(q.average);
                    } else
                        q.averageLabel = ccpm_getStatusLabel(q.average);

                    const questionGroupedByLabel = ccpm_getResponseGrouped(q);
                    if(!questionResponseGroup[group]) questionResponseGroup[group] = {};
                    questionResponseGroup[group][q.name] = questionGroupedByLabel;
                    // Object.keys(questionGroupedByLabel).forEach(v => {
                    //     groupedByLabel[v] = groupedByLabel[v] + questionGroupedByLabel[v];
                    // })

                    if (!chartData[group]) chartData[group] = {};
                    if (chartData[group][q.averageLabel]) chartData[group][q.averageLabel] = chartData[group][q.averageLabel] + 1;
                    else chartData[group][q.averageLabel] = 1;
                    return q;
                });
                newReport[subGroup].averageInGroup = ccpm_getAverageInSubGroup(newReport[subGroup].questions, dataSetGroup);
                newReport[subGroup].group = group;
            }
        })
        //questionResponseGroup[group] = groupedByLabel;
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
        questionResponseGroup: questionResponseGroup,
        globalReport: dataSetGroup ? ccpm_getDataGlobalReport(data, choices, dataSetGroup) : {}
    }
    return finalData;
}

export const getGroupTableByRegion = (reports, groupName) => {
    let result = {};
    reports.map((region, index) => {
      let reduced = 0;
      result[region.name] = {};
      region.reports.forEach((report)=>{
        const subGroups = Object.keys(report.globalReport).filter(key => report.globalReport[key].group === groupName);
        subGroups.forEach((sg) => {  
          const data = report.globalReport[sg].averageInGroup || 0;
          if(result[region.name][sg]){ 
            result[region.name][sg] += data;
          }
          else {
            result[region.name][sg] = data;
          }
        })
        reduced = 0;
      })
    })
    const result2 = Object.keys(result).map(key => {
      const data  = {name: key, data: {}}
      Object.keys(result[key]).forEach(key2 => {
        data.data[key2] = Math.round(100 * (result[key][key2] / (5 * reports.find(val => val.name === key).reports.length)))
      })
      return data;
    })
    return {result: result2, columns: Object.keys(datasetGroup[groupName]).filter(c => (c !== 'name' && c !== 'names' && c !== 'code'))}
  }

export const compareString = (a, b, property) => {
    var propertyA = property ?  a[property].toUpperCase() : a.toUpperCase();
    var propertyB = property ?  b[property].toUpperCase() : b.toUpperCase();
    if (propertyA < propertyB) {
      return -1;
    }
    if (propertyA > propertyB) {
      return 1;
    }
    return 0;
}

export const compareNumbers = (a, b) => {
  return a - b;
}

export const compareStringAndPercentage = (a, b, property, percentageA, percentageB) =>{
  var propertyA = property ?  a[property].toUpperCase() : a.toUpperCase();
  var propertyB = property ?  b[property].toUpperCase() : b.toUpperCase();
  if(propertyA < propertyB ) return -1;
  if(propertyA > propertyB) return 1 ;
  
  if (percentageA > percentageB) {
    return -1;
  }
  if (percentageA < percentageB) {
    return 1;
  }
  return 0;
}

export const getChartData = (reports, subGroup) => {
    const regions = {};
    reports.map((region) => {
      if(!regions[region.name]) regions[region.name] = {};
      region.reports.forEach((report)=>{
        report.globalReport[subGroup].questions.forEach(q => {
          q.data.responses.forEach((response, index) => {
            if(!regions[region.name][response]) regions[region.name][response] = q.data.frequencies[index];
            else regions[region.name][response] += q.data.frequencies[index];
          })
        })
      })
    })
    return regions;
}

export const getGroupTableByCluster = (reports, groupName) => {
    let result = {};
    reports.map((region) => {
      result[region.name] = {};
      region.reports.forEach((report)=>{
        if(!result[region.name][report.ccpmData.cluster]) result[region.name][report.ccpmData.cluster] = {}
        const subGroups = Object.keys(report.globalReport).filter(key => report.globalReport[key].group === groupName);
        subGroups.forEach((sg => {
          const data  =  report.globalReport[sg].averageInGroup;
          if(!result[region.name][report.ccpmData.cluster][sg]) result[region.name][report.ccpmData.cluster][sg] = data;
          else result[region.name][report.ccpmData.cluster][sg] += data;
        }))
      })
    });
    const regions = {};
    const result2 =[];
    Object.keys(result).forEach(region => {
      Object.keys(result[region]).forEach(cluster => {
        const totalCluster  = reports.find(reg => reg.name === region).reports.filter(r => r.ccpmData.cluster === cluster).length || 1;
        const data = {};
        Object.keys(result[region][cluster]).forEach(key => {
          data[key] = Math.round(100 * result[region][cluster][key] / (5 * totalCluster))
        })
        result2.push({name: cluster, region, data})
        if(!regions[region]) regions[region] = 1;
        else regions[region]++;
      })
    })

    return {result: result2.sort((a,b) => compareString(a, b, 'name')), regions}
  }

export default ccpm_getData;
