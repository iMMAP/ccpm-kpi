const dataset = {
    supportServiceDelivery: {
        name: 'Support to Service Delivery',
        names: { en: 'Support to Service Delivery', fr: 'Appui à la Prestation de Services' },
        code: 'P_SS',
        comments: ['P_SS05', 'P_SS06'],
        meeting: { code: '01a', starting: 1, end: 6, name: 'Meetings', names: { en: 'Meetings', fr: 'Réunions' }, noteName: { en: 'Notes from the Coordinator', fr: 'Notes du Coordinateur' }, notes: [{ code: 'C_SD01', name: 'Meeting Frequency' }, { code: 'C_SD02', name: 'Notes on Meetings' }] },
        clusterStrategicDecisions: { code: '02', starting: 1, end: 3, name: 'Cluster Strategic Decisions', names: { en: 'Cluster Strategic Decisions', fr: 'Décisions Stratégiques du Groupe' }, noteName: { en: 'Notes from the Coordinator', fr: 'Notes du Coordinateur' }, notes: [{ code: 'C_SD03', name: '' }] },
        clusterMapping: { code: '03', starting: 1, end: 5, name: 'Cluster Mapping', names: { en: 'Cluster Mapping', fr: 'Cartographie des Clusters' }, noteName: { en: 'Notes from the Coordinator', fr: 'Notes du Coordinateur' }, notes: [{ code: 'C_SD04', name: '' }] },
        identificationNeeds: { code: '04', starting: 1, end: 3, name: 'Identification of Needs, Gaps and Response Priorities', names: { en: 'Identification of Needs, Gaps and Response Priorities', fr: 'Identification des Besoins, des Lacunes et des Priorités de Réponse' }, noteName: { en: 'Notes from the Coordinator', fr: 'Notes du Coordinateur' }, notes: [{ code: 'C_SD05', name: '' }] },
    },
    informingStrategicDecisions: {
        name: 'Informing Strategic Decision-Making of the HC/HCT',
        names: { en: 'Informing Strategic Decision-Making of the HC/HCT', fr: 'Communication sur les Decisions Strategiques du HC/HCT' },
        code: 'P_IS',
        comments: ['P_IS06', 'P_IS07'],
        assesments: { code: '01', starting: 1, end: 7, name: 'Assessments', names: { en: 'Assessments', fr: 'Évaluations' }, noteName: { en: 'Notes from the Coordinator', fr: 'Notes du Coordinateur' }, notes: [{ code: 'C_IS01', name: 'Have Assessments, Tools and Guidance been agreed?' }, { code: 'C_IS02', name: 'Have there been any coordinated assessments (that include a focus on health) over the last year?' }] },
        situationAnalyses: { code: '02', name: 'Situation Analyses', names: { en: 'Situation Analyses', fr: 'Analyses de la Situation' }, noteName: { en: 'Notes from the Coordinator', fr: 'Notes du Coordinateur' }, notes: [{ code: 'C_IS03', name: 'Has the cluster done any situation analysis over the last year?' }] },
        analysisTopicCovered: { code: '03', starting: 1, end: 5, name: 'Analysis Topics Covered', names: { en: 'Analysis Topics Covered', fr: 'Thèmes d\'Analyse Couverts' }, },
        crossCuttingIssues: { code: '04', starting: 1, end: 10, name: 'Cross-Cutting Issues', names: { en: 'Cross-Cutting Issues', fr: 'Questions Transversales' } },
        supportDecisionMaking: { code: '05', starting: 1, end: 2, name: 'Support for Decision Making', names: { en: 'Support for Decision Making', fr: 'Aide à la Prise de Décision' }, noteName: { en: 'Notes from the Coordinator', fr: 'Notes du Coordinateur' }, notes: [{ code: 'C_IS04', name: '' }] },
    },
    planningStrategyDevelopment: {
        name: 'Planning and Strategy Development',
        names: { en: 'Planning and Strategy Development', fr: 'Planification et Développement des Stratégies' },
        code: 'P_PS',
        comments: ['P_PS03', 'P_PS04'],
        strategicPlan: { code: '01b', starting: 1, end: 4, name: 'Strategic Plan', names: { en: 'Strategic Plan', fr: 'Plan Stratégique' }, noteName: { en: 'Notes from the Coordinator', fr: 'Notes du Coordinateur' }, notes: [{ code: 'C_PS01', name: 'Has the cluster developed a strategic plan?' }] },
        technicalStandard: { code: '02', starting: 1, end: 2, name: 'Technical Standards and Guidelines', names: { en: 'Technical Standards and Guidelines', fr: 'Normes Techniques et Directives' }, noteName: { en: 'Notes from the Coordinator', fr: 'Notes du Coordinateur' }, notes: [{ code: 'C_PS02', name: 'Have technical standards and guidelines been agreed?' }] },
        prioritizationProposal: { code: '02', starting: 3, end: 5, name: 'Prioritization of Proposals', names: { en: 'Prioritization of Proposals', fr: 'Hiérarchisation des Propositions' }, },
        updateFundingStatus: { code: '02', starting: 6, end: 6, name: 'Updates on Funding Status against Needs', names: { en: 'Updates on Funding Status against Needs', fr: 'Mises à Jour sur l\'État du Financement par rapport aux Besoins' }, noteName: { en: 'Notes from the Coordinator', fr: 'Notes du Coordinateur' }, notes: [{ code: 'C_PS04', name: 'How often does the cluster report on funding status against needs?' }, { code: 'C_PS05', name: 'Notes on Planning and Strategy Development' }] }
    },
    advocacy: {
        code: 'P_AD',
        name: 'Advocacy',
        names: { en: 'Advocacy', fr: 'Plaidoyer' },
        comments: ['P_AD02', 'P_AD03'],
        identificationAdvocacy: { code: '01', starting: 1, end: 1, name: 'Identification of Advocacy Issues', names: { en: 'Identification of Advocacy Issues', fr: 'Identification des Problèmes de Plaidoyer' }, },
        discussionAdvocacyIssue: { code: '01', starting: 2, end: 5, name: 'Discussion on Advocacy Issues', names: { en: 'Discussion on Advocacy Issues', fr: 'Discussion sur les Questions de Plaidoyer' }, noteName: { en: 'Notes from the Coordinator', fr: 'Notes du Coordinateur' }, notes: [{ code: 'C_AD01', name: '' }] }
    },
    monitoringReporting: {
        code: 'P_MR',
        name: 'Monitoring and Reporting',
        names: { en: 'Monitoring and Reporting', fr: 'Surveillance et Rapports' },
        comments: ['P_MR02', 'P_MR03'],
        clusterBulletins: { code: '01', starting: 1, end: 2, name: 'Cluster Bulletins', names: { en: 'Cluster Bulletins', fr: 'Bulletins du Groupe' } },
        programMonitoring: { code: '01', starting: 3, end: 4, name: 'Programme Monitoring and Reporting Formats', names: { en: 'Programme Monitoring and Reporting Formats', fr: 'Suivi du Programme et Formats de Rapport' }, noteName: { en: 'Notes from the Coordinator', fr: 'Notes du Coordinateur' }, notes: [{ code: 'C_MR01', name: 'Have programme monitoring and reporting formats been agreed by the cluster?' }] },
        considerationDiverseNeed: { code: '01', starting: 5, end: 5, name: 'Consideration of the Diverse Needs of Women, Girls, Boys and Men in Response Monitoring', names: { en: 'Consideration of the Diverse Needs of Women, Girls, Boys and Men in Response Monitoring', fr: 'Prise en Compte des Divers Besoins des Femmes, des Filles, des Garçons et des Hommes dans le Suivi de la Réponse' }, noteName: { en: 'Notes from the Coordinator', fr: 'Notes du Coordinateur' }, notes: [{ code: 'C_MR02', name: '' }] }
    },
    preparedness: {
        code: 'P_PR',
        name: 'Preparedness for Recurrent Disasters',
        names: { en: 'Preparedness for Recurrent Disasters', fr: 'Préparation aux Catastrophes Récurrentes' },
        comments: ['P_PR02', 'P_PR03'],
        preparednessPlan: { code: '01', starting: 1, end: 5, name: 'Preparedness Plans', names: { en: 'Preparedness Plans', fr: 'Plans de Préparation' }, noteName: { en: 'Notes from the Coordinator', fr: 'Notes du Coordinateur' }, notes: [{ code: 'C_PR01', name: 'Notes on Preparedness for Recurrent Disasters' }, { code: 'C_PR02', name: 'Is preparedness for recurrent disasters relevant for this cluster?' }] },
    },
    aap: {
        code: 'P_AA',
        name: 'Accountability to Affected Populations',
        names: { en: 'Accountability to Affected Populations', fr: 'Redevabilité envers les Populations Touchées' },
        comments: ['P_AA02', 'P_AA03'],
        mechanismForConsulting: { code: '01', starting: 1, end: 2, name: 'Mechanisms for Consulting and Involving Affected Populations in Decision Making', names: { en: 'Mechanisms for Consulting and Involving Affected Populations in Decision Making', fr: 'Mécanismes de Consultation et d\'Implication des Populations Affectées dans la Prise de Décision' }, noteName: { en: 'Notes from the Coordinator', fr: 'Notes du Coordinateur' }, notes: [{ code: 'C_AA01', name: 'Has the cluster agreed on mechanisms for consulting and involving affected populations in decision making?' }] },
        mechanismToReceive: { code: '01', starting: 3, end: 4, name: 'Mechanisms to Receive, Investigate and Act on Complaints by Affected People', names: { en: 'Mechanisms to Receive, Investigate and Act on Complaints by Affected People', fr: 'Mécanismes pour Recevoir, Enquêter et Donner Suite aux Plaintes des Personnes Touchées' }, noteName: { en: 'Notes from the Coordinator', fr: 'Notes du Coordinateur' }, notes: [{ code: 'C_AA02', name: 'Has the cluster agreed on mechanisms for receiving, investigating and acting on complaints from affected people?' }, { code: 'C_AA03', name: 'Notes on Accountability to Affected Populations' }] }
    }
}

export const datasetGroup = {
    supportServiceDelivery: {
        name: 'Support to Service Delivery',
        names: { en: 'Support to Service Delivery', fr: 'Appui à la Prestation de Services' },
        code: 'P_SS',
        partnerSatisfaction : {names: {en: 'partner satisfaction'}, code: '01a_01' },
        organizationAbility: {names: {en: 'Organization ability'}, code: '01a', starting: 2, end: 4},
        clusterMeetingAbility: {names: {en: 'Cluster Meeting Ability'}, code: '04', starting: 1, end: 3},
        clusterAbilityStrategic: {names: {en: 'cluster ability to make strategic decisions'}, code: '02', starting: 1, end: 3},
        frequencyPartnerContribution: {names: {en: 'Frequency partner contribution'}, code: '03', starting: 1, end: 2},
        partnerContribution: {names: {en: 'Partner contribution'}, code: '03_03'},
        useOfClusterAnalysis: {names: {en : 'Use of cluster analysis'}, code: '03', starting: 4, end: 5}
    },
    informingStrategicDecisions: {
        name: 'Informing Strategy decision-making of the HC / Humanitarian Country Team',
        names: {en: 'Informing Strategy decision-making of the HC / Humanitarian Country Team',
                fr: 'Informer la prise de décision stratégique du HC / de l\'équipe humanitaire pays'},
        code: 'P_IS',
        organizationThatUsed: {names: {en: 'Organisation that used sectorial needs assessments tools and guidance agreed by cluster partners',
                                       fr: 'Organisation qui a utilisé des outils d\'évaluation des besoins sectoriels et des orientations convenues par les partenaires du cluster'},
                                       code: '01', starting: 1, end: 2},
        organisationInvolved:  {names: {en: 'Organisation involved in coordinated sectorial needs assessments and surveys',
                                       fr: 'Organisation impliquée dans les évaluations et enquêtes coordonnées des besoins sectoriels'},
                                       code: '01', starting: 3, end: 5},
        organisationParticipating: {names: {en: 'Organisations participating in joint situation analyses', fr: 'Organisations participant à des analyses de situation conjointes'}, 
                                       code: '02'},
        organisationShared: {names: {en: 'Organisation that shared reports of this surveys and assessments with cluster', fr : 'Organisation qui a partagé les rapports de ces enquêtes et évaluations avec le cluster'},
                                       code: '01', starting: 6, end: 7 }
    }
}

// Get Questions code list in a subgroup

export const ccpm_getQuestionInRange = (groupIdentifier, subgroupIdentifier, datasetGroup) => {
    let group = {};
    if(datasetGroup) group = datasetGroup[groupIdentifier];
    else group = dataset[groupIdentifier]
    
    const subgroup = group[subgroupIdentifier]

    const questions = [];
    if(subgroup){
        const code = `${group.code}${subgroup.code}`;
        if (!subgroup.starting)
            questions.push(code);
        else {
            for (let i = subgroup.starting; i <= subgroup.end; i++) {
                if (i >= 10) {
                    questions.push(`${code}_${i}`);
                } else {
                    questions.push(`${code}_0${i}`);
                }
            }
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
    if (question) {
        question.data.frequencies.forEach((element, index) => {
            if (ccpm_parseNumber(question.data.responses[index]) > 0) {
                sum += element * ccpm_parseNumber(question.data.responses[index])
                divider += element;
            }
        });
        if (divider === 0) return 0;
        return sum / divider;
    } return 0;
}

// Get the average in a boolean question (Number of YES)

export const ccpm_getAverageInBoolQuestion = (question) => {
    if (question) {
        const sum = question.data.frequencies[question.data.responses.findIndex(e => e.toString().toLowerCase() === 'yes')];
        const total = question.data.frequencies.reduce((a, b) => a + b);
        if (total === 0) return total;
        return sum / total;
    }
    return 0;
}

// Get average in a subgroup (Check wheither que question contains numeric response or boolean and return the result)

export const ccpm_getAverageInSubGroup = (data, datasetGroup) => {
    if (data.length === 0 || !data[0]) return 0;
    if (data[0].data.responses.includes('yes') || data[0].data.responses.includes('no')) {
        const d = data.map(e => ccpm_getAverageInBoolQuestion(e, datasetGroup));
        return (d.reduce((a, b) => a + b)) / d.length;
    }
    const questionsAverage = data.map(e => {
        return ccpm_getAverageInQuestion(e, datasetGroup)
    });
    return questionsAverage.reduce((a, b) => a + b, 0) / data.length;
}

export const titleConstants = {
    overallResponseRate: { en: 'Overall Response Rate', fr: 'Taux de Réponse Global' },
    overallActivePartner: { en: 'Total Response', fr: 'Total des Réponses' },
    responseByType: { en: 'Response By Type', fr: 'Réponse par Type' },
    effectiveResponseRate: { en: 'Effective Response Rate', fr: 'Taux de Réponse Effective' },
    totalResponse: { en: 'Total Response', fr: 'Total des Réponses' },
    overallPerformance: { en: 'Overall Performance', fr: 'Performance Global' },
    scoreBreakdown: { en: 'Score Breakdown', fr: 'Répartition des Scores' },
    qustionByquestionBreakdown: { en: 'Question by Question Breakdowns of Results', fr: 'Repartition des Resultats Question par Question' },
    finalComments: { en: 'Final Comments', fr: 'Commentaires Finaux' },
    commentSuggestedImprovment: { en: 'Comments on Suggested Improvements', fr: 'Commentaires sur les Améliorations Suggérées' },
    commentSuccessStories: { en: 'Comments on Success Stories', fr: 'Commentaires sur les Histoires de Réussite' },
    partner: { en: 'Partner', fr: 'Partenaire' },
    coordinator: { en: 'Coordinator', fr: 'Coordinateur' },
    topic: { en: 'Topic', fr: 'Sujet' },
    haveDoneSituationAnalysis: { en: 'Have done situation analyses with the cluster', fr: 'Avoir fait des analyses de situation avec le cluster' },
    haveNotDoneSituationAnalysis: { en: 'Have not done situation analyses with the cluster', fr: 'N\'ont pas fait d\'analyses de situation avec le cluster' },
    numberPartnerResponding: { en: 'Number Partners Responding', fr: 'Nombre de Partenaires ayant Répondu' },
    totalNumberOfPartner: { en: 'Total Number of Partners', fr: 'Nombre Total de Partenaires' },
    weak: { en: 'Weak', fr: 'Faible' },
    unsatisfactory: { en: 'Unsatisfactory', fr: 'Non satisfaisant' },
    satifactory: { en: 'Satisfactory', fr: 'Satisfaisant' },
    good: { en: 'Good', fr: 'Bon' },
    completionAndResponseRate: {en: 'Completion and Response Rate', fr: 'Taux de Réponse et Completion'},
    overallCompletionRate: {en: 'Overall Completion Rate', fr: 'Taux de Completion Total'},
    responseRateByRegionAndType: {en: 'Response Rate of Partners by Type of Organization and Region', fr: 'Taux de Réponse des Partenaires par Type d\'Organisation et par Région'},
    partnerByRegion: {en: 'Partners by Region', fr: 'Partenaires par Région'},
    reponseRateByCOuntry: {en: 'Response Rate by Country', fr: 'Taux de Réponse par Pays'},
    region: {en:'Region', fr:'Région'},
    nationalLevel: {en:'National Level', fr: 'Niveau National'},
    subNational: {en: 'Sub National', fr: 'Interieur'},
    coortinatorResponse: {en: 'Coordinators Responses', fr: 'Réponses des Coordinateurs'},
    partnerResponse: {en: 'Partner Responses', fr: 'Réponses des Partenaires'}
}

export default dataset;
