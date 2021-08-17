import { AlignmentType, BorderStyle, Document, ShadingType } from "docx";
import { titleConstants, datasetGroup} from '../ccpmDataset';
import { getGroupTableByCluster, getGroupTableByRegion } from '../ccpmReport';

import { TextRun, Paragraph, ImageRun, SectionType, Table, TableRow, TableCell, WidthType} from 'docx';

const getTable = (data, length, border = false, marginBottom = 150, leftMargin = 40,  omitHorizintalBorder = false, fillSecondCell = false) => {
  if (!data) return;
  const rowLength = 100 / length;
  const remainingRowLength = 100 - (Math.round(rowLength) * length);
  const rows = [...data.map((t, index) => new TableRow({
    children: t.map((tt, ind) => new TableCell({
      margins: { left: 100, right: 100 },
      children: [tt ? tt : getTableContent('')],
      verticalAlign: 'center',
      borders: border ? {
        bottom: { color: '#555555', size: tt ? 1 : 0, style: tt ? BorderStyle.SINGLE : BorderStyle.NONE, },
        top: { color: '#555555', size: tt ? 1 : 0, style: tt ? BorderStyle.SINGLE : BorderStyle.NONE },
        left: omitHorizintalBorder ? { size: 0, style: BorderStyle.NONE } : { color: '#555555', size: tt ? 1 : 0, style: BorderStyle.THICK },
        right: omitHorizintalBorder ? {size: 0, style: BorderStyle.NONE } : { color: '#555555', size: tt ? 1 : 0, style: BorderStyle.THICK },
      } : false,
      shading:!tt ? '' : index === 0 || ind === 0 || (ind === 1 && fillSecondCell) ? {color: tt.background || '#1f5782', fill: tt.background || '#1f5782', val:ShadingType.SOLID}: null,
      width: {
          size: `${ind === 0 ? Math.round(rowLength) + remainingRowLength : Math.round(rowLength)}%`,
          type: WidthType.PERCENTAGE
        }
    }))
  }))]
  const columWidth = new Array(length);
  const columnWidthSingle = (9000 / columWidth.length);
  const remaining = 9000 - (Math.round(columnWidthSingle) * columWidth.length);
  return new Table({
    columnWidths: columWidth.map((w, index) => index === 0 ? Math.round(columnWidthSingle) + remaining : Math.round(columnWidthSingle)),
    width: { size: 100, type: WidthType.PERCENTAGE },
    margins: {
      top: 150,
      bottom: marginBottom,
      left: leftMargin,
      right: 40,
      marginUnitType: 'dxa'
    },
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

const getTableContent = (text, color = '#4e4e4e', bold = false, background) => {
  const pp = new Paragraph({
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
        bold,
        style: {
          size: 22,
          color,
        }
      }),
    ]
  })
  pp.background = background;
  return pp;
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

const colors  = ['#007899', '#009898', '#48b484', '#9fc96f', '#f8d871', '#f87571'];
const colorRegion = {};

const getGroupTable = (groupData, groupName) => {
  
  const columns  = [
    ['', ...groupData.columns.map(c => getTableContent(datasetGroup[groupName][c].names['en'], '#ffffff'))],
    ...groupData.result.map((rg, index) => [
      getTableContent(rg.name, '#ffffff', false, colors[index]),
      ...groupData.columns.map(c => getTableContent(`${rg.data[c]}%`))
    ]
  )
  ]
  const cc = getTableContent('text');
  return columns;
}

const getGroupByClusterTable = (groupData, groupName) => {
  groupData.result = groupData.result.sort((a,b) => compareString(a,b, 'region'));
  let currentRegion = '';
  const columns  = [
    ['','', ...groupData.columns.map(c => getTableContent(datasetGroup[groupName][c].names['en'], '#ffffff'))],
    ...groupData.result.map((rg, index) => { 
      if(!colorRegion[rg.region]) colorRegion[rg.region] = colors[Object.keys(colorRegion).length]
      const data =  [
          getTableContent(currentRegion!== rg.region ? rg.region : '', '#ffffff', false, colorRegion[rg.region]),
          getTableContent(rg.name, '#ffffff', false, colorRegion[rg.region]),
          ...groupData.columns.map(c => getTableContent(`${rg.data[c]}%`)), 
      ];
      currentRegion = rg.region;
      return data;
    }),
     [
      '',
      getTableContent('Global', '#ffffff', false),
      ...groupData.columns.map(c => getTableContent(`${getGlobalSum(groupData.result, c)}%`)),
     ]
  ]
  return columns;
}

const getGlobalSum = (data, column) => {
  let sum = 0;
  data.forEach(element => {
    if(element && element.data && element.data[column]) sum += element.data[column];
  })
  return Number.parseFloat((sum / (data.length < 1 ? 1 : data.length)).toString()).toFixed(2);
}

const getSecondSection = (lCode, completionRateRegions) => {
  const result = [];
  Object.keys(datasetGroup).filter(d => d !== 'code' && d !=='content' && d!== 'wholeCode' && d !== 'name' && d !== 'names').forEach(subGroup => {

    const subGroupData = getGroupTableByRegion(completionRateRegions, subGroup);
    const subGroupDataByCountry = getGroupTableByCluster(completionRateRegions, subGroup);
    const data = [];

    data.push(getTitle(datasetGroup[subGroup].names[lCode]));
    data.push(new Paragraph(''));
    data.push(getTable(getGroupTable(subGroupData, subGroup), 5, true, undefined, undefined, undefined,false));
    data.push(new Paragraph(''));
    data.push(getTable(getGroupByClusterTable({...subGroupDataByCountry, columns: subGroupData.columns}, subGroup), 5, true,null, null, null, true))
    data.push(new Paragraph(''));

      const charts = Object.keys(datasetGroup[subGroup]).filter(o => datasetGroup[subGroup][o].stackedChart);
      charts.forEach(chart => {
        const chartRect = document.getElementById(`chart-${chart}`).getBoundingClientRect()
        data.push(new Paragraph({
          spacing: {
            before: 100,
            after: 200,
          },
          children: [new ImageRun({
            data: Uint8Array.from(atob((document.getElementById(`chart-${chart}`).toDataURL()).replace('data:image/png;base64,', '')), c => c.charCodeAt(0)),
            transformation: {
              width: chartRect.width * (600 /chartRect.width),
              height: chartRect.height * (600 / chartRect.width)
            },
          })]
        }))
        data.push(new Paragraph(''));
        if(subGroup === 'planningStrategyDevelopment'){
          const chartNegativeRect = document.getElementById(`negativeAnswerChart`).getBoundingClientRect();
          data.push(new Paragraph({
            spacing: {
              before: 100,
              after: 200,
            },
            children: [new ImageRun({
              data: Uint8Array.from(atob((document.getElementById(`negativeAnswerChart`).toDataURL()).replace('data:image/png;base64,', '')), c => c.charCodeAt(0)),
              transformation: {
                width: chartNegativeRect.width * (600 /chartNegativeRect.width),
                height: chartNegativeRect.height * (600 / chartNegativeRect.width)
              },
            })]
          }))
          data.push(new Paragraph(''));
        }
    })

    result.push({
      properties: {
        type: SectionType.NEXT_PAGE,
      },
      children: data})
  }) 
  return result;  
}

export default class CCPM_ReportContents {
  create(parentState) {
    const {languageIndex, languages, completionRateRegions } = parentState;
    const lcode = languages[languageIndex].code;
    const chartByRegionRect = document.getElementById('chartbyType').getBoundingClientRect();
    const chartbyTypeAndRegionRect = document.getElementById('chartbyTypeAndRegion').getBoundingClientRect()
    const chartByClusterRect = document.getElementById('chartbyCluster').getBoundingClientRect();
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
              ['',
              getTableContent(titleConstants.nationalLevel[lcode], '#ffffff', false),
              getTableContent(titleConstants.subNational[lcode], '#ffffff', false),
              getTableContent(titleConstants.coortinatorResponse[lcode], '#ffffff', false),
              getTableContent(titleConstants.partnerResponse[lcode], '#ffffff', false)],
              ...completionRateRegions.map(rg => [
                getTableContent(rg.name, '#ffffff'),
                getTableContent(getNationalLevel(rg.reports)),
                getTableContent(getSubNationalLevel(rg.reports) || ''),
                getTableContent(getCoordinatorOrPartnerResponses(rg.reports, 'coordinator')),
                getTableContent(getCoordinatorOrPartnerResponses(rg.reports, 'partner'))
              ])
            ], 5, true, undefined, undefined, undefined, false),
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
          ]
        },
        {
          properties: {
            type: SectionType.NEXT_PAGE,
          },
          children: [
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
        ...getSecondSection(lcode, completionRateRegions)
      ];
      resolve(new Document({
        sections: sections
      }))
    })
  }
};