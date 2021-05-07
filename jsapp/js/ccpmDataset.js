const dataset = {
    supportServiceDelivery: {
        name: 'Support to Service Delivery',
        code: 'P_SS',
        comments: ['P_SS05', 'P_SS06'],
        meeting: {code : '01a', starting: 1, end: 6, name: 'Meetings', noteName: 'Notes from the Coordinator', notes: [{code: 'C_SD01', name: 'Meeting Frequency'}, {code: 'C_SD02', name: 'Notes on Meetings'}]},
        clusterStrategicDecisions : {code : '02', starting: 1, end: 3, name: 'Cluster Strategic Decisions',noteName: 'Notes on Strategic Decisions', notes: [{code: 'C_SD03', name: ''}]},
        clusterMapping: {code: '03', starting: 1, end: 5, name: 'Cluster Mapping', noteName: 'Notes on Mapping', notes: [{code: 'C_SD04', name: ''}]},
        identificationNeeds: {code: '04', starting: 1, end: 3, name: 'Identification of Needs, Gaps and Response Priorities', noteName: 'Notes on identification of Needs, Gaps and Priorities', notes: [{code: 'C_SD05', name: ''}] },
    },
    informingStrategicDecisions: {
        name: 'Informing Strategic Decisions',
        code: 'P_IS',
        comments: ['P_IS06', 'P_IS07'],
        assesments: {code: '01', starting: 1, end: 7, name: 'Assessments', noteName: '',notes: [{code: 'C_IS01', name: 'Have Assessments, Tools and Guidance been agreed?'},{code: 'C_IS02', name: 'Have there been any coordinated assessments (that include a focus on health) over the last year?'}]},
        situationAnalyses: {code: '02', name: 'Situation Analyses', noteName: '',notes: [{code: 'C_IS03', name: 'Has the cluster done any situation analysis over the last year?'}]},
        analysisTopicCovered: {code: '03', starting: 1, end: 5, name: 'Analysis Topics Covered'},
        crossCuttingIssues: {code: '04', starting: 1, end: 9, name : 'Cross-Cutting Issues'},
        supportDecisionMaking: {code: '05', starting: 1, end: 2, name: 'Support for Decision Making', noteName: 'Notes on Informing Strategic Decisions',notes: [{code: 'C_IS04', name: ''}]},
    },
    planningStrategyDevelopment: {
        name: 'Planning and Strategy Development',
        code: 'P_PS',
        comments: ['P_PS03', 'P_PS04'],
        strategicPlan: {code: '01b', starting: 1, end: 4, name: 'Strategic Plan', noteName: 'Coordinator Note',notes: [{code: 'C_PS01', name: 'Has the cluster developed a strategic plan?'}]},
        technicalStandard: {code: '02', starting: 1, end: 2, name: 'Technical standards and guidelines',noteName: 'Coordinator Note',notes: [{code: 'C_PS02', name: 'Have technical standards and guidelines been agreed?'}]},
        prioritizationProposal: {code: '02', starting: 3, end: 5, name: 'Prioritization of proposals'},
        updateFundingStatus: {code: '02', starting: 6, end: 6, name: 'Updates on funding status against needs', noteName: 'Coordinator Notes',notes: [{code: 'C_PS04', name: 'How often does the cluster report on funding status against needs?'}, {code: 'C_PS05', name: 'Planning and Strategy Development'}]}
    },
    advocacy: {
        code: 'P_AD',
        name: 'Advocacy',
        comments: ['P_AD02', 'P_AD03'],
        identificationAdvocacy: {code: '01', starting: 1, end: 1, name: 'Identification of advocacy issues'},
        discussionAdvocacyIssue: {code: '01', starting: 2, end: 5, name: 'Discussion on advocacy issues', noteName: '',notes: [{code: 'C_AD01', name: 'Coordinator Notes on Advocacy'}]}
    },
    monitoringReporting: {
        code: 'P_MR',
        name: 'Monitoring and Reporting',
        comments: ['P_MR02', 'P_MR03'],
        clusterBulletins: {code: '01', starting: 1, end: 2, name: 'Cluster Bulletins'},
        programMonitoring: {code: '01', starting: 3, end: 4, name: 'Programme Monitoring and Reporting Formats', noteName: 'Coordinator Notes',notes: [{code: 'C_MR01', name: 'Have programme monitoring and reporting formats been agreed by the cluster?'}]},
        considerationDiverseNeed: {code: '01', starting: 5, end: 5, name: 'Consideration of the diverse needs of women, girls, boys and men in response monitoring', noteName: 'Coordinator Notes on Monitoring and Reporting',notes: [{code: 'C_MR02', name: ''}]}
    },
    preparedness: {
        code: 'P_PR',
        name: 'Preparedness for Recurrent Disasters',
        comments: ['P_PR02', 'P_PR03'],
        preparednessPlan: {code: '01', starting: 1, end: 5, name: 'Preparedness Plans', noteName: 'Coordinator Notes',notes: [{code: 'C_PR02', name: 'Is preparedness for recurrent disasters relevant for this cluster?'},{code: 'C_PR01', name: 'Notes on Preparedness for Recurrent Disasters'}]},
    },
    aap: {
        code: 'P_AA',
        name: 'Accountability to Affected Populations',
        comments: ['P_AA02', 'P_AA03'],
        mechanismForConsulting: {code: '01', starting: 1, end: 2, name: 'Mechanisms for consulting and involving affected populations in decision making', noteName: 'Coordinator Notes',notes: [{code: 'C_AA01', name: 'Has the cluster agreed on mechanisms for consulting and involving affected populations in decision making?'}]},
        mechanismToReceive: {code: '01', starting: 3, end: 4, name: 'Mechanisms to receive, investigate and act on complaints by affected people', noteName: 'Coordinator Notes',notes: [{code: 'C_AA02', name: 'Has the cluster agreed on mechanisms for receiving, investigating and acting on complaints from affected people?'}, {code: 'C_AA03', name: 'Notes on AAP'}]}
    }
}

// Get Questions code list in a subgroup

export const ccpm_getQuestionInRange = (groupIdentifier, subgroupIdentifier) => {
    const group = dataset[groupIdentifier];
    const subgroup = group[subgroupIdentifier]
    const code =  `${group.code}${subgroup.code}`;
    const questions = [];
    if(!subgroup.starting) questions.push(code);
    else{
    for(let i = subgroup.starting; i <= subgroup.end;i++){
        questions.push(`${code}_0${i}`);
    }}
    return questions;
}

// Get the average of responses in a question

export const ccpm_getAverageInQuestion = (question) => {
    if(question){
    const data  = question.data.responses.reduce((a,b) => Number.parseInt(a.toString().replace(/\D/g,''), 10)+Number.parseInt(b.toString().replace(/\D/g,''), 10), 0);
    return data/(question.data.responses.length > 0 ?question.data.responses.length : 1);
    } return 0;
}

// Get the average in a boolean question (Number of YES)

export const ccpm_getAverageInBoolQuestion = (question) => {
    if(question){
    const data = question.data.responses.filter(e => e.toString().toLowerCase() === 'yes');
    return data.length / (question.data.responses.length > 0 ? question.data.responses.length : 1);
    } 
    return question;
}

// Get average in a subgroup (Check wheither que question contains numeric response or boolean and return the result)

export const ccpm_getAverageInSubGroup = (data) =>{
    if(data.length === 0 || !data[0]) return 0;
    if(data[0].data.responses.includes('Yes') || data[0].data.responses.includes('No')){
        return data.map(e => ccpm_getAverageInBoolQuestion(e));
    }
    const questionsAverage = data.map(e => {
        return ccpm_getAverageInQuestion(e) 
    });
    return questionsAverage.reduce((a,b) => a+b, 0) / data.length;
}



export default dataset;
