const dataset = {
    supportServiceDelivery: {
        name: 'Support to Service Delivery',
        names: {en: 'Support to Service Delivery',fr: 'Soutien à la prestation de services'},
        code: 'P_SS',
        comments: ['P_SS05', 'P_SS06'],
        meeting: {code : '01a', starting: 1, end: 6, name: 'Meetings', names: {en: 'Meetings',fr: 'Reunions'}, noteName: 'Notes from the Coordinator', notes: [{code: 'C_SD01', name: 'Meeting Frequency'}, {code: 'C_SD02', name: 'Notes on Meetings'}]},
        clusterStrategicDecisions : {code : '02', starting: 1, end: 3, name: 'Cluster Strategic Decisions', names: {en: 'Cluster Strategic Decisions',fr: 'Décisions stratégiques du Groupe'},noteName: 'Notes on Strategic Decisions', notes: [{code: 'C_SD03', name: ''}]},
        clusterMapping: {code: '03', starting: 1, end: 5, name: 'Cluster Mapping', names: {en: 'Cluster Mapping',fr: 'Mappage du groupe'}, noteName: 'Notes on Cluster Mapping', notes: [{code: 'C_SD04', name: ''}]},
        identificationNeeds: {code: '04', starting: 1, end: 3, name: 'Identification of Needs, Gaps and Response Priorities', names: {en: 'Identification of Needs, Gaps and Response Priorities',fr: 'Identification des besoins, des lacunes et des priorités de réponse'}, noteName: 'Notes on identification of Needs, Gaps and Priorities', notes: [{code: 'C_SD05', name: ''}] },
    },
    informingStrategicDecisions: {
        name: 'Informing Strategic Decisions',
        names: {en: 'Informing Strategic Decisions',fr: 'Communication sur les decisions strategiques'},
        code: 'P_IS',
        comments: ['P_IS06', 'P_IS07'],
        assesments: {code: '01', starting: 1, end: 7, name: 'Assessments', names: {en: 'Assessments',fr: 'Évaluations'}, noteName: '',notes: [{code: 'C_IS01', name: 'Have Assessments, Tools and Guidance been agreed?'},{code: 'C_IS02', name: 'Have there been any coordinated assessments (that include a focus on health) over the last year?'}]},
        situationAnalyses: {code: '02', name: 'Situation Analyses', names: {en: 'Assessments',fr: 'Analyses de la situation'}, noteName: '',notes: [{code: 'C_IS03', name: 'Has the cluster done any situation analysis over the last year?'}]},
        analysisTopicCovered: {code: '03', starting: 1, end: 5, name: 'Analysis Topics Covered', names: {en: 'Analysis Topics Covered',fr: 'Thèmes d\'analyse couverts'},},
        crossCuttingIssues: {code: '04', starting: 1, end: 10, name : 'Cross-Cutting Issues', names: {en: 'Cross-Cutting Issues',fr: 'Questions transversales'}},
        supportDecisionMaking: {code: '05', starting: 1, end: 2, name: 'Support for Decision Making', names: {en: 'Support for Decision Making',fr: 'Aide à la prise de décision'}, noteName: 'Notes on Informing Strategic Decisions',notes: [{code: 'C_IS04', name: ''}]},
    },
    planningStrategyDevelopment: {
        name: 'Planning and Strategy Development',
        names: {en: 'Planning and Strategy Development',fr: 'Plannification et developement des strategies'},
        code: 'P_PS',
        comments: ['P_PS03', 'P_PS04'],
        strategicPlan: {code: '01b', starting: 1, end: 4, name: 'Strategic Plan', names: {en: 'Strategic Plan',fr: 'Plan stratégique'},  noteName: 'Coordinator Notes',notes: [{code: 'C_PS01', name: 'Has the cluster developed a strategic plan?'}]},
        technicalStandard: {code: '02', starting: 1, end: 2, name: 'Technical standards and guidelines',names: {en: 'Technical standards and guidelines',fr: 'Normes techniques et directives'},noteName: 'Coordinator Notes',notes: [{code: 'C_PS02', name: 'Have technical standards and guidelines been agreed?'}]},
        prioritizationProposal: {code: '02', starting: 3, end: 5, name: 'Prioritization of proposals', names: {en: 'Prioritization of proposals',fr: 'Hiérarchisation des propositions'},},
        updateFundingStatus: {code: '02', starting: 6, end: 6, name: 'Updates on funding status against needs', names: {en: 'Updates on funding status against needs',fr: 'Mises à jour sur l\'état du financement par rapport aux besoins'}, noteName: 'Coordinator Notes',notes: [{code: 'C_PS04', name: 'How often does the cluster report on funding status against needs?'}, {code: 'C_PS05', name: 'Notes on Planning and Strategy Development'}]}
    },
    advocacy: {
        code: 'P_AD',
        name: 'Advocacy',
        names: {en: 'Advocacy',fr: 'Plaidoyer'},
        comments: ['P_AD02', 'P_AD03'],
        identificationAdvocacy: {code: '01', starting: 1, end: 1, name: 'Identification of advocacy issues', names: {en: 'Identification of advocacy issues',fr: 'Identification des problèmes de plaidoyer'},},
        discussionAdvocacyIssue: {code: '01', starting: 2, end: 5, name: 'Discussion on advocacy issues', names: {en: 'Discussion on advocacy issues',fr: 'Discussion sur les questions de plaidoyer'}, noteName: 'Coordinator Notes',notes: [{code: 'C_AD01', name: ''}]}
    },
    monitoringReporting: {
        code: 'P_MR',
        name: 'Monitoring and Reporting',
        names: {en: 'Monitoring and Reporting',fr: 'Surveillance et rapports'},
        comments: ['P_MR02', 'P_MR03'],
        clusterBulletins: {code: '01', starting: 1, end: 2, name: 'Cluster Bulletins', names: {en: 'Cluster Bulletins',fr: 'Bulletins du groupe'}},
        programMonitoring: {code: '01', starting: 3, end: 4, name: 'Programme Monitoring and Reporting Formats', names: {en: 'Programme Monitoring and Reporting Formats',fr: 'Suivi du programme et formats de rapport'}, noteName: 'Coordinator Notes',notes: [{code: 'C_MR01', name: 'Have programme monitoring and reporting formats been agreed by the cluster?'}]},
        considerationDiverseNeed: {code: '01', starting: 5, end: 5, name: 'Consideration of the diverse needs of women, girls, boys and men in response monitoring', names: {en: 'Consideration of the diverse needs of women, girls, boys and men in response monitoring',fr: 'Prise en compte des divers besoins des femmes, des filles, des garçons et des hommes dans le suivi de la réponse'}, noteName: 'Coordinator Notes',notes: [{code: 'C_MR02', name: ''}]}
    },
    preparedness: {
        code: 'P_PR',
        name: 'Preparedness for Recurrent Disasters',
        names: {en: 'Preparedness for Recurrent Disasters',fr: 'Préparation aux catastrophes récurrentes'},
        comments: ['P_PR02', 'P_PR03'],
        preparednessPlan: {code: '01', starting: 1, end: 5, name: 'Preparedness Plans', noteName: 'Coordinator Notes',notes: [{code: 'C_PR02', name: 'Is preparedness for recurrent disasters relevant for this cluster?'},{code: 'C_PR01', name: 'Notes on Preparedness for Recurrent Disasters'}]},
    },
    aap: {
        code: 'P_AA',
        name: 'Accountability to Affected Populations',
        names: {en: 'Support to Service Delivery',fr: 'Responsabilité envers les populations touchées'},
        comments: ['P_AA02', 'P_AA03'],
        mechanismForConsulting: {code: '01', starting: 1, end: 2, name: 'Mechanisms for consulting and involving affected populations in decision making', names: {en: 'Mechanisms for consulting and involving affected populations in decision making',fr: 'Mécanismes de consultation et d\'implication des populations affectées dans la prise de décision'}, noteName: 'Coordinator Notes',notes: [{code: 'C_AA01', name: 'Has the cluster agreed on mechanisms for consulting and involving affected populations in decision making?'}]},
        mechanismToReceive: {code: '01', starting: 3, end: 4, name: 'Mechanisms to receive, investigate and act on complaints by affected people', names: {en: 'Mechanisms to receive, investigate and act on complaints by affected people',fr: 'Mécanismes pour recevoir, enquêter et donner suite aux plaintes des personnes touchées'}, noteName: 'Coordinator Notes',notes: [{code: 'C_AA02', name: 'Has the cluster agreed on mechanisms for receiving, investigating and acting on complaints from affected people?'}, {code: 'C_AA03', name: 'Notes on Accountability to Affected Populations'}]}
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

export const ccpm_parseNumber = (n = 0) => {
    
    return Number.parseInt(n.toString().replace(/\D/g, ''));
}

export const ccpm_getAverageInQuestion = (question) => {
    let sum = 0;
    let divider = 0;
    if(question){
    question.data.frequencies.forEach((element, index) => {
        if(ccpm_parseNumber(question.data.responses[index]) > 0){
            sum += element * ccpm_parseNumber(question.data.responses[index])
            divider += element;
        }
    });
    if(divider === 0) return 0;
    return sum / divider;
    } return 0;
}

// Get the average in a boolean question (Number of YES)

export const ccpm_getAverageInBoolQuestion = (question) => {
    if(question){
    const sum = question.data.frequencies[question.data.responses.findIndex(e => e.toString().toLowerCase() === 'yes')];
    const total = question.data.frequencies.reduce((a, b) => a +b);
    if(total === 0) return total;
    return sum / total;
    } 
    return 0;
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
