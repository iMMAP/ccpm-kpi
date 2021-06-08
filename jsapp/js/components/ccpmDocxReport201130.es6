import { AlignmentType, BorderStyle, Document, TabStopPosition, TabStopType } from "docx";
import dataset, { ccpm_parseNumber, titleConstants, ccpm_getQuestionInRange, ccpm_getAverageInBoolQuestion } from '../ccpmDataset';
import { ccpm_getStatusLabel, ccpm_getStatusColor, ccpm_getLabel, ccpm_getName } from '../ccpmReport';
import { TextRun, Paragraph, ImageRun, SectionType, Table, TableRow, TableCell, WidthType, SymbolRun } from 'docx';
import { ccpm_getStatusLabelBoolean } from "../ccpmReport.es6";

const getTable2 = (data, length, border = false, marginBottom = 150, leftMargin = 40, top = 0, size = 100, comment = false, omitHorizintalBorder = false) => {
  if (!data) return;
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
    rows: [...data.map(t => new TableRow({
      children: t.map((tt, ind) => new TableCell({
        margins: { left: 100, right: 100 },
        children: [tt],
        columnSpan: 2,
        verticalAlign: 'center',
        width: length === 2 ? !comment ? ind === 1 ? {
          size: '30%',
          type: WidthType.PERCENTAGE,
        } : { size: '70%', type: WidthType.PERCENTAGE } : ind === 0 ? { size: '20%', type: WidthType.PERCENTAGE } : { size: '80%', type: WidthType.PERCENTAGE } :
          {
            size: `${100 / length}%`,
            type: WidthType.PERCENTAGE
          }
      }))
    }))]
  })
}

const getP_IS02Question = (parentState) => {
  const { P_IS02Result, pathP_IS02, pathP_IS03 } = parentState;
  const no = P_IS02Result.filter(res => res[pathP_IS02] === 'no');
  const yes = P_IS02Result.filter(res => res[pathP_IS02] === 'yes');
  const yesAverage = [];
  const noAverage = [];
  const keys = ccpm_getQuestionInRange('informingStrategicDecisions', 'analysisTopicCovered').map(s => `${pathP_IS03}${s}`)
  if (yes.length > 0) {
    keys.forEach(key => {
      if (key !== pathP_IS02) {
        let sum = 0;
        let count = 0;
        yes.forEach(v => {
          if (v[key] > 0) {
            sum += ccpm_parseNumber(v[key]);
            count++;
          }
        })
        yesAverage.push({ id: key, average: sum / (count > 0 ? count : 1), averageLabel: ccpm_getStatusLabel(sum / (count > 0 ? count : 1)) })
      }
    })
  }

  if (no.length > 0) {
    keys.forEach(key => {
      if (key !== pathP_IS02) {
        let sum = 0;
        let count = 0;
        no.forEach(v => {
          if (v[key] > 0) {
            sum += ccpm_parseNumber(v[key]);
            count++;
          }
        })
        noAverage.push({ id: key, average: sum / (count > 0 ? count : 1), averageLabel: ccpm_getStatusLabel(sum / (count > 0 ? count : 1)) })
      }
    })
  }

  return { yesAverage, noAverage };

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
    children: [
      new TextRun({
        text: text,
        size: 22,
        color,
        bold: false,
        style: {
          size: 22,
          color,
        }
      }),
    ]
  })
}

const getNoteTitle = (text) => {
  return new Paragraph({
    spacing: {
      before: 0,
      after: 50,
    },
    tabStops: [
      {
        type: TabStopType.LEFT,
        position: 1000,
      },
    ],
    children: [new TextRun({
      text,
      color: '#000000',
      size: 21,
      bold: true,
      underline: {
        color: '#097ca8',
      },
      style: {
        size: 21,
        color: '#000000',
        bold: true
      }
    })
    ]
  })
}

const getNoteSubTitle = (text) => {
  return new Paragraph({
    spacing: {
      before: 0,
      after: 50,
    },
    children: [new TextRun({
      text,
      color: '#000000',
      size: 19,
      bold: true,
      style: {
        size: 21,
        color: '#000000',
        bold: true
      }
    })
    ]
  })
}

const checkNotesExist = (subGroup, parentState) => {
  let exist = false;
  if(subGroup.notes){
;    subGroup.notes.some(v => {
    const data = parentState.reportData.find(q => q.name === v.code);
    
    if(data && data.data.responses.length > 0) {
      exist = true;
      return true;
    }
  });
  return exist;
}
  return false;
}

const renderComment = (questionCode, questionName, parentState) => {
  if(parentState) {
  const data = parentState.reportData.find(q => q.name === questionCode);
  if (!data) return '';
  let rows = [];
  if (data.data.responseLabels) {
    rows = data.data.responseLabels.map((response) => {
      return [new Paragraph(''),
      new Paragraph({
        spacing: {
          before: 100,
          after: 100,
        },
        alignment: AlignmentType.LEFT,
        border: {
          top: { size: 1, color: 'grey' },
          bottom: { size: 1, color: 'grey' },
          left: { size: 1, color: 'grey' },
          right: { size: 1, color: 'grey' }
        },
        children: [
          new TextRun({
            text: response,
            size: 20,
            color: '#808080',
            style: {
              size: 20,
              color: '#808080',
            }
          }),
        ]
      }),
      ];
    })
  } else {
    rows = data.data.responses.map((response) => {
      return [new Paragraph(''),
      new Paragraph({
        spacing: {
          before: 100,
          after: 100,
        },
        alignment: AlignmentType.LEFT,
        border: {
          top: { size: 1, color: 'grey' },
          bottom: { size: 1, color: 'grey' },
          left: { size: 1, color: 'grey' },
          right: { size: 1, color: 'grey' }
        },
        children: [
          new TextRun({
            text: response,
            size: 20,
            color: '#808080',
            style: {
              size: 20,
              color: '#808080',
            }
          }),
        ]
      }),
      ];
    })
  }
  return getTable2(rows, 2, false, 20, 100, undefined, undefined, true);
}
  return '';
}

const getOverallPerformance = (parentState, choosenLanguage, languageIndex) => {
  const dataToShow = [];
  Object.keys(dataset).forEach(group => {
    dataToShow.push(new Paragraph(''));
    dataToShow.push(getTitle(ccpm_getName(dataset[group], choosenLanguage)));
    dataToShow.push(new Paragraph(''));
    const tableData = Object.keys(dataset[group]).filter(sg => sg !== 'code' && sg !== 'names' && sg !== 'name' && sg !== 'comments').map(subGroup => {
      return [
        getTableContent(ccpm_getName(dataset[group][subGroup], choosenLanguage)),
        new Paragraph({
          spacing: {
            before: 100,
            after: 100,
          },
          children: [
            new TextRun({
              text: dataset[group][subGroup].starting ? ccpm_getStatusLabel(parentState.ccpmReport[subGroup].averageInGroup, choosenLanguage) : ccpm_getStatusLabelBoolean(parentState.ccpmReport[subGroup].averageInGroup, choosenLanguage),
              size: 20,
              color: ccpm_getStatusColor(dataset[group][subGroup].starting ? ccpm_getStatusLabel(parentState.ccpmReport[subGroup].averageInGroup) : ccpm_getStatusLabelBoolean(parentState.ccpmReport[subGroup].averageInGroup)),
              bold: true,

              style: {
                size: 20,
                color: ccpm_getStatusColor(dataset[group][subGroup].starting ? ccpm_getStatusLabel(parentState.ccpmReport[subGroup].averageInGroup) : ccpm_getStatusLabelBoolean(parentState.ccpmReport[subGroup].averageInGroup)),
              }
            }),
          ]
        })
      ]
    });
    const table = getTable2(tableData, 2, true, 20, undefined, undefined, undefined, undefined, true);
    if (table) dataToShow.push(table);
    dataToShow.push(new Paragraph(''));
  });

  return dataToShow;
}

const getScoreBreakDownGroup = (parentState, choosenLanguage, languageIndex) => {
  const dataToShow = [];
  const P_IS02Result = getP_IS02Question(parentState);
  dataToShow.push(getBigTitle(titleConstants.scoreBreakdown[choosenLanguage]));
  Object.keys(dataset).forEach(group => {
    dataToShow.push(new Paragraph({children: [new TextRun('')],}))
    dataToShow.push(getTitle(ccpm_getName(dataset[group], choosenLanguage)));
    dataToShow.push(new Paragraph({children: [new TextRun('')],}))
    Object.keys(dataset[group]).filter(sg => sg !== 'code' && sg !== 'names' && sg !== 'name' && sg !== 'comments').forEach(subGroup => {
      dataToShow.push(getSubTitle(ccpm_getName(dataset[group][subGroup], choosenLanguage)));
      dataToShow.push(new Paragraph({
        children: [new TextRun('')],
      }))
      const tableData = parentState.ccpmReport[subGroup].questions.map((question, index) => {
        if (subGroup === 'analysisTopicCovered') {
          const questionYes = P_IS02Result.yesAverage.find(f => f.id.includes(question.name)) || {}
          const questionNo = P_IS02Result.noAverage.find(f => f.id.includes(question.name)) || {};
          return [
            getTableContent(ccpm_getLabel(languageIndex, question.row.label)),
            new Paragraph({
              spacing: {
                before: 100,
                after: 100,
              },
              children: [
                new TextRun({
                  text: ccpm_getStatusLabel(questionYes.average, choosenLanguage),
                  size: 20,
                  color: ccpm_getStatusColor(questionYes.averageLabel),
                  bold: true,
                  style: {
                    size: 20,
                    color: ccpm_getStatusColor(questionYes.averageLabel),
                  }
                }),
              ]
            }),
            new Paragraph({
              spacing: {
                before: 100,
                after: 100,
              },
              children: [
                new TextRun({
                  text: ccpm_getStatusLabel(questionNo.average, choosenLanguage),
                  size: 20,
                  color: ccpm_getStatusColor(questionNo.averageLabel),
                  bold: true,
                  style: {
                    size: 20,
                    color: ccpm_getStatusColor(questionNo.averageLabel),
                  }
                }),
              ]
            })
          ]
        }
        return [
          getTableContent(ccpm_getLabel(languageIndex, question.row.label)),
          new Paragraph({
            spacing: {
              before: 100,
              after: 100,
            },
            children: [
              new TextRun({
                text: ccpm_getStatusLabel(question.average, choosenLanguage),
                size: 20,
                color: ccpm_getStatusColor(question.averageLabel),
                bold: true,
                style: {
                  size: 20,
                  color: ccpm_getStatusColor(question.averageLabel),
                }
              }),
            ]
          })
        ]
      })
      if (subGroup === 'analysisTopicCovered' && parentState.ccpmReport[subGroup].questions.length > 0) tableData.unshift([
        getSubTitle(titleConstants.topic[choosenLanguage]),
        getSubTitle(titleConstants.haveDoneSituationAnalysis[choosenLanguage]),
        getSubTitle(titleConstants.haveNotDoneSituationAnalysis[choosenLanguage])
      ]);
      const table = getTable2(tableData, subGroup === 'analysisTopicCovered' ? 3 : 2, true, undefined, undefined, undefined, undefined, false, true);
      if (table) dataToShow.push(table)
      if (dataset[group][subGroup].notes) {
        const showNotes = checkNotesExist(dataset[group][subGroup], parentState)
        dataset[group][subGroup].notes.forEach((question, index22) => {
          const commentTable = renderComment(question.code, ccpm_getLabel(languageIndex, (parentState.reportData.find(q => q.name === question.code)) ? (parentState.reportData.find(q => q.name === question.code)).row.label : ['']), parentState);
          if (commentTable) {
            if (index22 === 0 && showNotes ) { 
              dataToShow.push(new Paragraph({
                children: [new TextRun('')],
              }))
              const notTitle = [[new Paragraph(''), getNoteTitle(dataset[group][subGroup].noteName[choosenLanguage])]];
              dataToShow.push(getTable2(notTitle, 2, false, undefined, undefined, undefined, undefined, true));
            }
            dataToShow.push(new Paragraph({
              children: [new TextRun('')],
            }))
            const subNoteTitle = [[new Paragraph(''), getNoteSubTitle(ccpm_getLabel(languageIndex, (parentState.reportData.find(q => q.name === question.code)) ? (parentState.reportData.find(q => q.name === question.code)).row.label : [''], parentState))]]
            dataToShow.push(getTable2(subNoteTitle, 2, false, undefined, undefined, undefined, undefined, true));
            dataToShow.push(commentTable);
          }
        })
      }
      dataToShow.push(new Paragraph(''));
    });
  });
  return dataToShow;
}

const getImages = (imageData, data, chartNumber = '', currentLanguageIndex) => {
  let table = [];
  data.slice(0, 5).forEach((v, i) => {
    if (i % 2 === 0) {
      const meanV = v.data.mean ? v.data.mean.toFixed(2) : 0;
      if (data[i + 1]) {
        const meanI1 =  data[i + 1].data.mean ? data[i + 1].data.mean.toFixed(2) : 0;
        const p = Math.floor(calculatePercentage(v.questionsDisagregatedByPartner, v.data.mean));
        const p1 = Math.floor(calculatePercentage(data[i + 1].questionsDisagregatedByPartner, data[i + 1].data.mean));
        table.push([getSubTitle(`${ccpm_getLabel(currentLanguageIndex, v.row.label)} (${v.questionsDisagregatedByPartner} of ${(v.data.mean % 1 !== 0) ? meanV : v.data.mean} - ${p}%)`, p > 100 ? '#FD625E' : '#000000',  AlignmentType.CENTER),
        getSubTitle(`${ccpm_getLabel(currentLanguageIndex,data[i + 1].row.label)} (${data[i + 1].questionsDisagregatedByPartner} of ${(data[i + 1].data.mean % 1 !== 0) ? meanI1 : data[i + 1].data.mean} - ${p1}%)`, p1 > 100 ? '#FD625E' : '#000000',AlignmentType.CENTER)
        ]);
        table.push([new Paragraph({
          spacing: {
            before: i === 7 ? 400 :  100,
            after: 200,
          },
          alignment: AlignmentType.CENTER,
          pageBreakBefore: i === 5 ? true : false,
          children: [new ImageRun({
            data: Uint8Array.from(atob((document.getElementById(`chart${chartNumber}-${i}`).querySelector('canvas').toDataURL()).replace('data:image/png;base64,', '')), c => c.charCodeAt(0)),
            transformation: {
              width: 200,
              height: 100
            },
          })]
        }),
        new Paragraph({
          spacing: {
            before: i === 7 ? 400 : 100,
            after: 200,
          },
          alignment: AlignmentType.CENTER,
          pageBreakBefore: i === 5 ? true : false,
          children: [new ImageRun({
            data: Uint8Array.from(atob((document.getElementById(`chart${chartNumber}-${i + 1}`).querySelector('canvas').toDataURL()).replace('data:image/png;base64,', '')), c => c.charCodeAt(0)),
            transformation: {
              width: 200,
              height: 100
            },
          })]
        })
        ])
      } else {
        const p = Math.floor(calculatePercentage(v.questionsDisagregatedByPartner, v.data.mean));
        table.push([
          getSubTitle(`${ccpm_getLabel(currentLanguageIndex, v.row.label)} (${v.questionsDisagregatedByPartner} of ${(v.data.mean % 1 !== 0) ? meanV : v.data.mean}  - ${p}%)`, p > 100 ? 'red' : 'black', AlignmentType.CENTER)
        ]);
        table.push([new Paragraph({
          spacing: {
            before: i === 7 ? 400 : 100,
            after: 200,
          },
          alignment: AlignmentType.CENTER,
          pageBreakBefore: i === 5 ? true : false,
          children: [new ImageRun({
            data: Uint8Array.from(atob((document.getElementById(`chart${chartNumber}-${i}`).querySelector('canvas').toDataURL()).replace('data:image/png;base64,', '')), c => c.charCodeAt(0)),
            transformation: {
              width: 200,
              height : 100
            },
          })
          ]
        })
        ])

      }
    }
  })
  const result  = [];
  result.push(getTable2(table, 2, false, null,null,null,null,true, false));
  if(data.length > 6){
    result.push(new Paragraph({
    pageBreakBefore: true,
    children: [new TextRun('')]
  }));
  table = [];
    data.slice(6).forEach((v, i) => {
      const meanV = v.data.mean ? v.data.mean.toFixed(2) : 0;
      if (i % 2 === 0 && data[i + 7]) {
        const meanI1 =  data[i + 1].data.mean ? data[i + 1].data.mean.toFixed(2) : 0;
          const p = Math.floor(calculatePercentage(v.questionsDisagregatedByPartner, v.data.mean));
          const p1 = Math.floor(calculatePercentage(data[i + 6].questionsDisagregatedByPartner, data[i + 6].data.mean));
          table.push([getSubTitle(`${ccpm_getLabel(currentLanguageIndex, v.row.label)} (${v.questionsDisagregatedByPartner} of ${(v.data.mean % 1 !== 0) ? meanV : v.data.mean} - ${p}%)`, p > 100 ? '#FD625E' : '#000000', AlignmentType.CENTER),
          getSubTitle(`${ccpm_getLabel(currentLanguageIndex,data[i + 7].row.label)} (${data[i + 7].questionsDisagregatedByPartner} of ${(data[i + 7].data.mean % 1 !== 0) ? meanI1 : data[i + 7].data.mean} - ${p1}%)`, p1 > 100 ? '#FD625E' : '#000000', AlignmentType.CENTER)
          ]);
          table.push([new Paragraph({
            spacing: {
              before: i === 7 ? 400 :  100,
              after: 200,
            },
            alignment: AlignmentType.CENTER,
            pageBreakBefore: i === 5 ? true : false,
            children: [new ImageRun({
              data: Uint8Array.from(atob((document.getElementById(`chart${chartNumber}-${i + 6}`).querySelector('canvas').toDataURL()).replace('data:image/png;base64,', '')), c => c.charCodeAt(0)),
              transformation: {
                width: 200,
                height: 100
              },
            })]
          }),
          new Paragraph({
            spacing: {
              before: i === 7 ? 400 : 100,
              after: 200,
            },
            alignment: AlignmentType.CENTER,
            pageBreakBefore: i === 5 ? true : false,
            children: [new ImageRun({
              data: Uint8Array.from(atob((document.getElementById(`chart${chartNumber}-${i + 7}`).querySelector('canvas').toDataURL()).replace('data:image/png;base64,', '')), c => c.charCodeAt(0)),
              transformation: {
                width: 200,
                height: 100
              },
            })]
          })
          ])
        } else if(i === data.slice(6).length - 1) {
          const p = Math.floor(calculatePercentage(v.questionsDisagregatedByPartner, v.data.mean));
          table.push([
            getSubTitle(`${ccpm_getLabel(currentLanguageIndex, v.row.label)} (${v.questionsDisagregatedByPartner} of ${(v.data.mean % 1 !== 0) ? meanV : v.data.mean} - ${p}%)`, p > 100 ? 'red' : 'black', AlignmentType.CENTER)
          ]);
          table.push([new Paragraph({
            spacing: {
              before: i === 7 ? 400 : 100,
              after: 200,
            },
            alignment: AlignmentType.CENTER,
            pageBreakBefore: i === 5 ? true : false,
            children: [new ImageRun({
              data: Uint8Array.from(atob((document.getElementById(`chart${chartNumber}-${i+6}`).querySelector('canvas').toDataURL()).replace('data:image/png;base64,', '')), c => c.charCodeAt(0)),
              transformation: {
                width: 200,
                height: 100
              },
            })
            ]
          })
          ])

        }
    });
    result.push(getTable2(table, 2, false, null,null,null,null,true, false));
  }
  return result;
}

const calculatePercentage = (total, sum) => {
  if (isNaN(total)) total = 0;
  if (isNaN(sum) || sum === 0) return 0;
  return (total / sum) * 100;
}

const getQuestionByQuestionResult = (parentState, choosenLanguage) => {
  const data = [];
  data.push(getBigTitle(titleConstants.qustionByquestionBreakdown[choosenLanguage]))
  Object.keys(dataset).forEach(element => {
    if (element !== 'code' && element !== 'name') {
      data.push(new Paragraph({spacing: {before: 100, after: 100},children: [new TextRun('')]}))
      data.push(getTitle(ccpm_getName(dataset[element], choosenLanguage)));
      data.push(new Paragraph({spacing: {before: 100, after: 100},children: [new TextRun('')]}))
      let image = '';
      const canv = window.document.getElementById(`${element}canv`);
      if (canv) {
        image = canv.toDataURL();
        data.push(new Paragraph({
          spacing: {
            before: 100,
            after: 100,
          },
          children: [new ImageRun({
            data: Uint8Array.from(atob(image.replace('data:image/png;base64,', '')), c => c.charCodeAt(0)),
            transformation: {
              width: 550,
              height: 250
            },
          })]
        }))
      }
      data.push(new Paragraph({spacing: {before: 100, after: 100},children: [new TextRun('')]}))
      data.push(getTable2([[new Paragraph(''), getNoteTitle(titleConstants.commentSuggestedImprovment[choosenLanguage])]], 2, false, undefined, undefined, undefined, undefined, true));
      data.push(renderComment(dataset[element].comments[0], titleConstants.commentSuggestedImprovment[choosenLanguage], parentState));
      data.push(new Paragraph({spacing: {before: 100, after: 100},children: [new TextRun('')]}))
      data.push(getTable2([[new Paragraph(''), getNoteTitle(titleConstants.commentSuccessStories[choosenLanguage])]], 2, false, undefined, undefined, undefined, undefined, true));
      data.push(renderComment(dataset[element].comments[1], titleConstants.commentSuccessStories[choosenLanguage], parentState))
    }
  })
  return data;
}

export default class CCPM_ReportContents {
  create(parentState) {
    const { totalReponses: { numberOfPartner }, reportStyles, asset: { content: { translations } } } = parentState;
    let currentLanguageIndex = reportStyles.default.translationIndex;
    if(!translations[currentLanguageIndex]) currentLanguageIndex = translations.findIndex(lan => lan && lan.includes('en'));
    const choosenLanguage = translations ? ((translations[currentLanguageIndex]).match(/\(.*?\)/))[0].replace('(', '').replace(')', '') : 'en';

    const overallTotalResponses = parentState.totalReponses.sum;
    const effectiveTotalResponses = parentState.totalEffectiveResponse.sum;
    const overallTotalPercentage = Math.floor(Number.parseFloat(`${calculatePercentage(numberOfPartner, overallTotalResponses)}`));
    const effectiveTotalPercentage = Math.floor(Number.parseFloat(`${calculatePercentage(numberOfPartner, effectiveTotalResponses)}`));

    return new Promise((resolve) => {
      const sections = [
        {
          properties: {
            type: SectionType.NEXT_PAGE,
          },
          children: [
            getBigTitle(titleConstants.overallResponseRate[choosenLanguage]),
            new Paragraph(''),
            getTitle(titleConstants.totalResponse[choosenLanguage]),
            new Paragraph(''),
            new Paragraph({
              spacing: {
                before: 100,
                after: 200,
              },
              children: [new ImageRun({
                data: Uint8Array.from(atob((document.getElementById('totalResponseChart').querySelector('canvas').toDataURL()).replace('data:image/png;base64,', '')), c => c.charCodeAt(0)),
                transformation: {
                  width: 400,
                  height: 100
                },
              })]
            }),
            getTable2([
              [getSubTitle('Total'), getTableContent(`${overallTotalPercentage}%`, overallTotalPercentage > 100 ? '#FD625E' : '#4e4e4e')],
              [getSubTitle(titleConstants.numberPartnerResponding[choosenLanguage]), getTableContent(`${numberOfPartner}`)],
              [getSubTitle(titleConstants.totalNumberOfPartner[choosenLanguage]), getTableContent(`${(overallTotalResponses % 1 !== 0) ? overallTotalResponses.toFixed(2) : overallTotalResponses}`)],
            ], 2, true, undefined, undefined, undefined, 50),
            new Paragraph(''),
            new Paragraph(''),
            getTitle(titleConstants.responseByType[choosenLanguage]),
            new Paragraph(''),
            ...getImages({}, parentState.totalResponseDisagregatedByPartner, '', currentLanguageIndex),]
        },
        {
          properties: {
            type: SectionType.NEXT_PAGE,
          },
          children: [
            getBigTitle(titleConstants.effectiveResponseRate[choosenLanguage]),
            new Paragraph(''),
            getTitle(titleConstants.totalResponse[choosenLanguage]),
            new Paragraph(''),
            new Paragraph({
              spacing: {
                before: 100,
                after: 200,
              },
              children: [new ImageRun({
                data: Uint8Array.from(atob((document.getElementById('totalEffectiveResponseChart').querySelector('canvas').toDataURL()).replace('data:image/png;base64,', '')), c => c.charCodeAt(0)),
                transformation: {
                  width: 400,
                  height: 100
                },
              })]
            }),
            getTable2([
              [getSubTitle('Total'), getTableContent(`${effectiveTotalPercentage}%`, effectiveTotalPercentage > 100 ? '#FD625E' : '#4e4e4e')],
              [getSubTitle(titleConstants.numberPartnerResponding[choosenLanguage]), getTableContent(`${numberOfPartner}`)],
              [getSubTitle(titleConstants.totalNumberOfPartner[choosenLanguage]), getTableContent(`${(effectiveTotalResponses % 1 !== 0) ? effectiveTotalResponses.toFixed(2) : effectiveTotalResponses}`)],
            ], 2, true, undefined, undefined, undefined, 50),
            new Paragraph(''),
            new Paragraph(''),
            getTitle(titleConstants.responseByType[choosenLanguage]),
            new Paragraph(''),
            ...getImages({}, parentState.totalEffectiveResponseDisagregatedByPartner, '2',currentLanguageIndex),
          ]
        }, {
          properties: {
            type: SectionType.NEXT_PAGE,
          },
          children: [
            getBigTitle(titleConstants.overallPerformance[choosenLanguage]),
            ...getOverallPerformance(parentState, choosenLanguage, currentLanguageIndex),
          ]
        },
        {
          properties: {
            type: SectionType.NEXT_PAGE,
          },
          children: [
            ...getScoreBreakDownGroup(parentState, choosenLanguage, currentLanguageIndex),
          ]
        },
        {
          properties: {
            type: SectionType.NEXT_PAGE,
          },
          children: getQuestionByQuestionResult(parentState, choosenLanguage)
        },
        {
          properties: {
            type: SectionType.NEXT_PAGE,
          },
          children: [
            getBigTitle(titleConstants.finalComments[choosenLanguage]),
            new Paragraph(''),
            getNoteTitle(titleConstants.partner[choosenLanguage]),
            renderComment('P_OI01', titleConstants.partner[choosenLanguage], parentState),
            new Paragraph(''),
            getNoteTitle(titleConstants.coordinator[choosenLanguage]),
            renderComment('C_OI01', titleConstants.coordinator[choosenLanguage], parentState)
          ]
        }
      ];
      resolve(new Document({
        sections: sections
      }))
    })
  }
};
