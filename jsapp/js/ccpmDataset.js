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
        partnerSatisfaction : {names: {en: 'partner satisfaction', fr: 'satisfaction du partenaire'}, code: '01a_01' },
        organizationAbility: {names: {en: 'Organization ability', fr: 'Capacité d\'organisation'}, code: '01a', starting: 2, end: 4},
        clusterMeetingAbility: {names: {en: 'Cluster Meeting Ability', fr: 'Capacité de réunion de cluster'}, code: '04', starting: 1, end: 3},
        clusterAbilityStrategic: {names: {en: 'cluster ability to make strategic decisions', fr: 'capacité du cluster à prendre des décisions stratégiques'}, code: '02', starting: 1, end: 3},
        frequencyPartnerContribution: {names: {en: 'Frequency partner contribution', fr: 'Contribution du partenaire de fréquence'}, code: '03', starting: 1, end: 2},
        partnerContribution: {names: {en: 'Partner contribution', fr: 'Contribution du partenaire'}, code: '03_03'},
        useOfClusterAnalysis: {names: {en : 'Use of cluster analysis', fr: 'Utilisation de l\'analyse de cluster'}, code: '03', starting: 4, end: 5}
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
    },
    planningStrategyDevelopment: {
        name: 'Planning and Strategy Development',
        names: { en: 'Planning and Strategy Development', fr: 'Planification et Développement des Stratégies' },
        code: 'P_PS',
        organizationHelped2: {names: {en: 'Organization have helped to develop cluster strategic plans', fr: 'Organisation ont aidé à développer des plans stratégiques de cluster'}, code: '01b', starting: 2, end: 3, stackedChart: true, stackTitle: ['Graph 3.9. Regional breakdown of reponses to "Organizations have helped to develop cluster strategic plans', 'Graphique 3.9. Répartition régionale des réponses à « Les organisations ont aidé à élaborer des plans stratégiques de cluster'],stackedLabels: [['No strategic plan developed', 'Aucun plan stratégique élaboré'], ['Not asked to participate', 'Pas demandé de participer'], ['Chose not to contribute', 'A choisi de ne pas contribuer'], ['Not considered','N\'a pas considéré'], ['Somewhat considered', 'Un peu considéré'], ['Fully considered', 'totalement considéré']]},
        clusterPartnersAgreedTechnical: {names: {en: 'CLuster partners agreed technical standards and guidance and have applied them', fr: 'Les partenaires CLuster ont convenu de normes et d\'orientations techniques et les ont appliquées'}, wholeCode: 'C_PS02'},
        clusterPartnerParticipatedIn: {names: {en: 'Cluster partners participating in prioritizing proposals under strategic plan with a transparent process', fr: 'Partenaires du cluster participant à la hiérarchisation des propositions dans le cadre du plan stratégique avec un processus transparent'}, code: '02', starting: 3, end: 4},
        proposalsPrioritized: {names: {en: 'Proposals were prioritised against the strategic plan in a manner that was fair to all partners', fr: 'Les propositions ont été classées par ordre de priorité par rapport au plan stratégique d\'une manière équitable pour tous les partenaires'}, code: '02_05'},
        clusterCoordinatorReported: {names: {en: 'The cluster coordinator reported on the cluster funding status against needs in appropriate time frames', fr: 'Le coordinateur du cluster a rendu compte de l\'état du financement du cluster par rapport aux besoins dans des délais appropriés'}, code: '02_06'}
    },
    advocacy: {
        code: 'P_AD',
        name: 'Advocacy',
        names: { en: 'Advocacy', fr: 'Plaidoyer' },
        issuesRequiringAdvocacy: {names: {en: 'Issues requiring advocacy been identified and discussed together', fr: 'Les problèmes nécessitant un plaidoyer ont été identifiés et discutés ensemble'}, code: '01', starting: 1, end: 1},
        organizationParticipating: {names: {en: 'Organization have participated in cluster advocacy activities', fr: 'Les problèmes nécessitant un plaidoyer ont été identifiés et discutés L\'organisation a participé ensemble aux activités de plaidoyer du cluster'}, code: '01', starting: 3, end: 5, stackTitle: ['Graph 3.11 Regional Breakdown to responses to "Organizations have participated in cluster advocacy activities"', 'Graphique 3.11 Répartition régionale des réponses à « Les organisations ont participé aux activités de plaidoyer du cluster »'], stackedChart: true, stackedLabels: [['No advocacy activities', 'Aucune activité de plaidoyer'], ['Not invited to participate', 'Non invité à participer'], ['None', 'Aucun'], ['some', 'certain'], ['Most', 'La majorité']]}
    },
    monitoringReporting: {
        code: 'P_MR',
        name: 'Monitoring and Reporting',
        names: { en: 'Monitoring and Reporting', fr: 'Surveillance et Rapports' },
        clusterBulletins: {names: {en: 'Cluster bullettins or updates highlight risks, gaps and changing needs', fr: 'Les bulletins ou mises à jour des clusters mettent en évidence les risques, les lacunes et les besoins changeants'}, code: '01_01'},
        programMonitoring: {names: {en: 'Program monitoring and reporting formats are agreed by the cluster', fr: 'Les formats de suivi du programme et de rapport sont convenus par le cluster'}, code: '01_03'},
        hasTheclusterTaken: {names: {en: 'Has the cluster taken into account the district needs, contributions and capacities of women, girl, men and boys in its response and monitoring', fr:'Le cluster a-t-il pris en compte les besoins, les contributions et les capacités du district des femmes, des filles, des hommes et des garçons dans sa réponse et son suivi'}, code: '01_05'}
    },
    preparednessPlan: {
        code: 'P_PR',
        name: 'Preparedness for Recurrent Disasters',
        names: { en: 'Preparedness for Recurrent Disasters', fr: 'Préparation aux Catastrophes Récurrentes' },
        organizationHelped: {names: {en: 'Organization helped to develop or update preparedness plans (Including multisectorial ones) that address hazards and risks', fr: 'L\'organisation a aidé à élaborer ou à mettre à jour des plans de préparation (y compris multisectoriels) qui traitent des dangers et des risques'}, code: '01', starting: 1, end: 3, stackTitle: [['Graph 3.13. Regional breakdown of responses to "Has your organization helped to develop or', 'update preparedness plans (including multisectoral ones) that address hazards and risks ? Shown in terms of','how adequately partners felt their contributions were reflected '], ['Graphique 3.13. Répartition régionale des réponses à « Votre organisation a-t-elle aidé à élaborer ou à mettre à jour des','plans de préparation (y compris des plans multisectoriels) qui traitent des dangers et des risques ?']], stackedChart: true, stackedLabels: [['No plan developped / updated', 'Aucun plan développé / mis à jour'], ['Not invited to participate', 'Non invité à participe'], ['Did not contribute', 'N\'a pas contribué'], ['Inadequatly reflected', 'Insuffisamment reflété'], ['adequately reflected', 'correctement reflété']]},
        organizationCommittedStaff: {names: {en: 'Organization committed staff or resources that can be mobilized when preparedness plans are activated', fr: 'Personnel ou ressources engagés par l\'organisation qui peuvent être mobilisés lorsque les plans de préparation sont activés'}, code: '01', starting: 4, end: 5}
    },
    accoutabilityAffected: {
        code: 'P_AA',
        name: 'Accountability to affected populations',
        names: {en: 'Accountability to affected populations', fr: 'Responsabilité envers les populations affectées'},
        clusterPartnersConsulting: {names: {en: 'Cluster partners and applied mechanisms (procedures, tools or methodologies) for consulting and involving affected people in decision-making', fr: 'Partenaires du cluster et mécanismes appliqués (procédures, outils ou méthodologies) pour consulter et impliquer les personnes affectées dans la prise de décision'}, code: '01', content: [1, 3], stackedChart: true, stackTitle: [['Graph 3.13. Regional breakdowns of responses to "Cluster partners and applied mechanisms (procedures, tools or methodologies)', 'for consulting and involving affected people in decision-making"'], ['Graphique 3.13. Répartition régionale des réponses à « Votre organisation a-t-elle aidé à', 'élaborer ou à mettre à jour des plans de préparation (y compris des plans multisectoriels)', 'qui traitent des dangers et des risques ?']], stackedLabels: [['No Mechanisms agreed', 'Pas de mécanismes convenus'], ['Never', 'Jamais'], ['Seldom', 'Rarement'], ['Sometimes', 'De fois'], ['Often', 'Souvent'], ['Always', 'Toujours']]},
        clusterPartnersReceiving: {names: {en: 'Cluster partners and applied mechanisms (procedures, tools or methodologies) to receive, investigate and act on complaints by affected people', fr: 'Partenaires du cluster et mécanismes appliqués (procédures, outils ou méthodologies) pour recevoir, enquêter et agir sur les plaintes des personnes affectées'}, code: '01', content: [2,4], stackedChart: true, stackTitle: [['Graph 3.14. Regional breakdowns of responses to "Cluster partners and applied mechanisms(procedures, tools or methodologies)', 'to receive, investigate and act complaints by affected people"'], ['Graphique 3.14. Répartition régionale des réponses aux « Partenaires du cluster et mécanismes appliqués (procédures, outils ou méthodologies)', 'pour recevoir, enquêter et traiter les plaintes des personnes concernées »']], stackedLabels: [['No Mechanisms agreed', 'Pas de mécanismes convenus'], ['Never', 'Jamais'], ['Seldom', 'Rarement'], ['Sometimes', 'De fois'], ['Often', 'Souvent'], ['Always', 'Toujours']]}
    }
}

// Get Questions code list in a subgroup

export const ccpm_getQuestionInRange = (groupIdentifier, subgroupIdentifier, datasetGroup) => {
    let group = {};
    if(datasetGroup) group = datasetGroup[groupIdentifier];
    else group = dataset[groupIdentifier]
    
    const subgroup = group[subgroupIdentifier]

    const questions = [];
    const code = `${group.code}${subgroup.code}`;
    if(subgroup){
        if(subgroup.wholeCode){
             questions.push(subgroup.wholeCode);
        }
        else if(subgroup.content){
            subgroup.content.forEach(c => {
                if (c >= 10) {
                    questions.push(`${code}_${c}`);
                } else {
                    questions.push(`${code}_0${c}`);
                }
            })
        } else {
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
    }
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
    partnerResponse: {en: 'Partner Responses', fr: 'Réponses des Partenaires'},
    summaryResults: {en: 'Summary Results - Overall Performance', fr: 'Résumé des résultats - Performance globale'}
}

export default dataset;
