import { AlignmentType, BorderStyle, Document } from "docx";
import { titleConstants, datasetGroup} from '../ccpmDataset';
import { getGroupTableByCluster, getGroupTableByRegion } from '../ccpmReport';

import { TextRun, Paragraph, ImageRun, SectionType, Table, TableRow, TableCell, WidthType} from 'docx';

const getTable = (data, length, border = false, marginBottom = 150, leftMargin = 40, top = 0, size = 100, comment = false, omitHorizintalBorder = false) => {
  if (!data) return;
  const rows = [...data.map(t => new TableRow({
    children: t.map((tt, ind) => new TableCell({
      margins: { left: 100, right: 100 },
      children: [tt],
      columnSpan: 5,
      verticalAlign: 'center',
      width: {
          size: `${100 / length}%`,
          type: WidthType.PERCENTAGE
        }
    }))
  }))]
  const columWidth = new Array(length);
  return new Table({
    columnWidths: columWidth.map(w => 9000 / columWidth.length),
    width: { size, type: WidthType.PERCENTAGE },
    margins: {
      top: 150,
      bottom: marginBottom,
      left: leftMargin,
      right: 40,
      marginUnitType: 'dxa'
    },
    borders: border ? {
      bottom: { color: '#555555', size: 1, style: BorderStyle.SINGLE },
      top: { color: '#555555', size: 1, style: BorderStyle.THICK },
      left: omitHorizintalBorder ? { style: BorderStyle.NONE } : { color: '#555555', size: 10, style: BorderStyle.THICK },
      right: omitHorizintalBorder ? { style: BorderStyle.NONE } : { color: '#555555', size: 10, style: BorderStyle.THICK },
    } : false,
    rows
  })
}

const getBigTitle = (title) => {
  return new Paragraph({
    spacing: {
      before: 150,
      after: 150,
    },
    border: {
      top: {
        color: '#097ca8',
        size: 25,
        space: 10,
        value: 'single'
      },
    },
    children: [new TextRun({
      text: title,
      color: '#000000',
      size: 32,
      bold: true,
      style: {
        size: 32,
        color: '#000000',
        bold: true
      }
    })
    ]
  })
}

const getTitle = (text) => {
  return new Paragraph({
    spacing: {
      before: 0,
      after: 50,
    },
    children: [new TextRun({
      text,
      color: '#4e4e4e',
      size: 28,
      bold: true,
      style: {
        size: 28,
        color: '#4e4e4e',
        bold: true
      }
    })
    ]

  })
}

const getSubTitle = (text, color = 'black', alignment) => {
  return new Paragraph({
    spacing: {
      before: 100,
      after: 100,
    },
    alignment: alignment,
    children: [
      new TextRun({
        text: text,
        size: 22,
        color,
        bold: true,
        style: {
          size: 22,
          color,
        }
      }),
    ]
  })
}

const getTableContent = (text, color = '#4e4e4e') => {
  return new Paragraph({
    spacing: {
      before: 100,
      after: 100,
    },
    alignment:AlignmentType.CENTER,
    children: [
      new TextRun({
        text: text,
        size: 22,
        color,
        bold: true,
        style: {
          size: 22,
          color,
        }
      }),
    ]
  })
}

const compareString = (a, b, property) => {
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

const calculatePercentage = (total, sum) => {
  if (isNaN(total)) total = 0;
  if (isNaN(sum) || sum === 0) return 0;
  return (total / sum) * 100;
}

const getOverallCompletionRateRegion = (parentState) => {
  const regions  = [];
  parentState.reports.forEach(rep => {
    const ccpmData = JSON.parse(rep.asset.settings.ccpmData);
    const regionIndex = regions.findIndex(r => ccpmData.region && r.name === ccpmData.region.label);
    if(regionIndex > -1 && ccpmData.region){
      regions[regionIndex].reports.push({...rep, ccpmData});
    } else if(ccpmData.region) regions.push({name: ccpmData.region.label, reports: [{...rep, ccpmData}]});
  })
  return regions.sort((a,b) => compareString(a, b, 'name'));
}


const getNationalLevel  = (reports) => {
  return reports.filter(rep => !rep.ccpmData.addSubCluster).length.toString();
}

const getSubNationalLevel = (reports) => {
  return reports.filter(rep => rep.ccpmData.addSubCluster).length.toString();
}

const getCoordinatorOrPartnerResponses = (reports, type) => {
  let coordinators = 0;
  reports.forEach(rep => {
    const typeOfSurvey = rep.reportData.find(v => v.name ==='type_of_survey');
    if(typeOfSurvey){
      const coordinatorIndex = typeOfSurvey.data.responses.findIndex(v => v.toLowerCase().includes(type));
      if(coordinatorIndex > -1){
        coordinators+= typeOfSurvey.data.frequencies[coordinatorIndex];
      }
    }
  })
  return coordinators;
}

const getGroupTable = (groupData, groupName) => {
  const columns  = [
    [getTableContent(''), ...groupData.columns.map(c => getTableContent(datasetGroup[groupName][c].names['en']))],
    ...groupData.result.map((rg, index) => [
      getTableContent(rg.name),
      ...groupData.columns.map(c => getTableContent(`${rg.data[c]}%`))
    ]
  )
  ]
  return columns;
}


export default class CCPM_ReportContents {
  create(parentState) {
    const completionRateRegions = getOverallCompletionRateRegion(parentState);
    const {languageIndex, languages} = parentState;
    const lcode = languages[languageIndex].code;
    const chartByRegionRect = document.getElementById('chartbyType').getBoundingClientRect();
    const chartbyTypeAndRegionRect = document.getElementById('chartbyTypeAndRegion').getBoundingClientRect()
    const chartByClusterRect = document.getElementById('chartbyCluster').getBoundingClientRect()
    const supportServiceDelievery = getGroupTableByRegion(completionRateRegions, 'supportServiceDelivery');
    const supportServicedeliveryByCountry = getGroupTableByCluster(completionRateRegions, 'supportServiceDelivery');
    return new Promise((resolve) => {
      const sections = [
        {
          properties: {
            type: SectionType.NEXT_PAGE,
          },
          children: [
            getBigTitle(titleConstants.completionAndResponseRate[lcode]),
            new Paragraph(''),
            getTitle(titleConstants.overallCompletionRate[lcode]),
            new Paragraph(''),
            getTable([
              [getTableContent(''),
              getTableContent(titleConstants.nationalLevel[lcode]),
              getTableContent(titleConstants.subNational[lcode]),
              getTableContent(titleConstants.coortinatorResponse[lcode]),
              getTableContent(titleConstants.partnerResponse[lcode])],
              ...completionRateRegions.map(rg => [
                getTableContent(rg.name),
                getTableContent(getNationalLevel(rg.reports)),
                getTableContent(getSubNationalLevel(rg.reports) || ''),
                getTableContent(getCoordinatorOrPartnerResponses(rg.reports, 'coordinator')),
                getTableContent(getCoordinatorOrPartnerResponses(rg.reports, 'partner'))
              ])
            ], 5, true, undefined, undefined, undefined, 50),
            new Paragraph(''),
            getTitle(titleConstants.responseRateByRegionAndType[lcode]),
            new Paragraph(''),
            new Paragraph({
              spacing: {
                before: 100,
                after: 200,
              },
              children: [new ImageRun({
                data: Uint8Array.from(atob((document.getElementById('chartbyType').toDataURL()).replace('data:image/png;base64,', '')), c => c.charCodeAt(0)),
                transformation: {
                  width: chartByRegionRect.width * (600 /chartByRegionRect.width),
                  height: chartByRegionRect.height * (600 / chartByRegionRect.width)
                },
              })]
            }),
            new Paragraph(''),
            getTitle(titleConstants.partnerByRegion[lcode]),
            new Paragraph(''),
            new Paragraph({
              spacing: {
                before: 100,
                after: 200,
              },
              children: [new ImageRun({
                data: Uint8Array.from(atob((document.getElementById('chartbyTypeAndRegion').toDataURL()).replace('data:image/png;base64,', '')), c => c.charCodeAt(0)),
                transformation: {
                  width: chartbyTypeAndRegionRect.width * (600 /chartbyTypeAndRegionRect.width),
                  height: chartbyTypeAndRegionRect.height * (600 / chartbyTypeAndRegionRect.width)
                },
              })]
            }),
            new Paragraph(''),
            getTitle(titleConstants.reponseRateByCOuntry[lcode]),
            new Paragraph(''),
            new Paragraph({
              spacing: {
                before: 100,
                after: 200,
              },
              children: [new ImageRun({
                data: Uint8Array.from(atob((document.getElementById('chartbyCluster').toDataURL()).replace('data:image/png;base64,', '')), c => c.charCodeAt(0)),
                transformation: {
                  width: chartByClusterRect.width * (600 /chartByClusterRect.width),
                  height: chartByClusterRect.height * (600 / chartByClusterRect.width)
                },
              })]
            }),
          ]
        },
        {
          properties: {
            type: SectionType.NEXT_PAGE,
          },
          children: [
            new Paragraph(''),
            getTitle('Support Service delivery'),
            new Paragraph(''),
            getTable(getGroupTable(supportServiceDelievery, 'supportServiceDelivery'), 5, true, undefined, undefined, undefined, 50)
         
          ]
        }
      ];
      resolve(new Document({
        sections: sections
      }))
    })
  }
};
